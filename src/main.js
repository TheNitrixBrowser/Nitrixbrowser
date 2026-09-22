// Wine nie zawsze tworzy poprawne uchwyty stdout/stderr dla aplikacji GUI.
// Node 24 próbuje ich użyć już podczas ładowania modułów, co kończy start błędem EBADF.
// Te zmiany są aktywne wyłącznie wewnątrz Wine i nie dotyczą prawdziwego Windowsa.
const RUNNING_UNDER_WINE = process.platform === 'win32' && Boolean(
  process.env.WINELOADER || process.env.WINECONFIGDIR || process.env.WINEDATADIR
)
if (RUNNING_UNDER_WINE) {
  process.env.FORCE_COLOR = '0'
  for (const method of ['log', 'info', 'warn', 'error', 'debug']) {
    console[method] = () => {}
  }
}

const { app, BrowserWindow, ipcMain, session, shell, Menu, dialog, protocol, net } = require('electron')
// Wymuś sandbox dla wszystkich rendererów, także kart tworzonych później.
app.enableSandbox()
const path   = require('path')
const fs     = require('fs')
const crypto = require('crypto')
const tls    = require('tls')
const { execFileSync, execFile } = require('child_process')
const { promisify } = require('util')
const { pathToFileURL, fileURLToPath } = require('url')
const { autoUpdater } = require('electron-updater')
const execFileAsync = promisify(execFile)
const nativeAero = require('./browser-core')["native-aero"]
// Only this application uses XWayland on KDE; the user's desktop session is unchanged.
const nativeAeroBackend = nativeAero.configureBackend(app)
nativeAero.restartForBackend(app, nativeAeroBackend)

// ── Globalna obsługa nieobsłużonych błędów main procesu ──────────────
// Bez tego nieobsłużony wyjątek w main cicho zabija cały proces Electrona
// (okno znika bez żadnego komunikatu).
let fatalErrorHandled = false
process.on('uncaughtException', (err) => {
  if (fatalErrorHandled) { app.exit(1); return }
  fatalErrorHandled = true
  try {
    console.error('[Nitrix] uncaughtException:', err)
    dialog.showErrorBox('Nitrix', 'Wystąpił nieoczekiwany błąd. Uruchom przeglądarkę ponownie. / An unexpected error occurred. Please restart the browser.')
  } finally {
    // Po nieobsłużonym wyjątku nie zapisuj potencjalnie uszkodzonego stanu.
    app.exit(1)
  }
})
process.on('unhandledRejection', (reason) => {
  console.error('[Nitrix] unhandledRejection:', reason)
})

// ── Folder danych — MUSI być przed app.ready i przed wszystkim ────────
const dataDir = path.join(app.getPath('appData'), 'Nitrix')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
app.setPath('userData', dataDir)
const settingsFile = path.join(dataDir, 'settings.json')
const { createStore, isRecord, isHistoryEntry, isBookmarks, isHistory,
  readLimitedFile, isBooleanRecord, isBlockedRules, isSettings } = require('./browser-core')["persistence"]
const store = createStore(dataDir)

if (process.platform === 'win32') app.setAppUserModelId('com.nitrix.browser')

const DEFAULT_BROWSER_PROTOCOLS = ['http', 'https']
const DEFAULT_BROWSER_PROG_ID = 'NitrixURL'
const DEFAULT_BROWSER_HTML_PROG_ID = 'NitrixHTML'
const DEFAULT_BROWSER_CLIENT_KEY = 'Nitrix'
const DEFAULT_BROWSER_CAPABILITIES = `Software\\Clients\\StartMenuInternet\\${DEFAULT_BROWSER_CLIENT_KEY}\\Capabilities`
const LINUX_DESKTOP_FILE_NAME = 'com.nitrix.browser.desktop'
const LINUX_BROWSER_MIME_TYPES = [
  'x-scheme-handler/http',
  'x-scheme-handler/https',
  'text/html',
  'application/xhtml+xml',
]
const OPENABLE_LOCAL_FILE_EXTENSIONS = new Set(['.html', '.htm', '.shtml', '.xhtml', '.xht', '.mhtml', '.mht'])
const DEFAULT_BROWSER_PROG_IDS = new Set([
  DEFAULT_BROWSER_PROG_ID.toLowerCase(),
  DEFAULT_BROWSER_HTML_PROG_ID.toLowerCase(),
  'applications\\nitrix.exe',
  'nitrix.exe',
])

function _getProtocolClientArgs() {
  if (process.platform === 'win32' && app.isPackaged && path.basename(process.execPath).toLowerCase() === 'nitrix-core.exe') {
    const launcher = path.join(path.dirname(process.execPath), 'Nitrix.exe')
    if (fs.existsSync(launcher)) return { exe: launcher, args: [] }
  }
  if (process.defaultApp && process.argv.length >= 2) {
    return { exe: process.execPath, args: [path.resolve(process.argv[1])] }
  }
  return { exe: process.execPath, args: [] }
}

function _getLinuxDataHome() {
  const configured = process.env.XDG_DATA_HOME
  if (configured && path.isAbsolute(configured)) return configured
  return path.join(app.getPath('home'), '.local', 'share')
}

function _quoteLinuxDesktopExecArg(value) {
  const escaped = String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/%/g, '%%')
  return `"${escaped}"`
}

function _getLinuxLauncherExecutable(executableOverride = null) {
  if (process.platform !== 'linux' || !app.isPackaged) return null
  const executable = executableOverride || process.env.APPIMAGE || process.execPath
  if (!executable || /[\r\n\0]/.test(executable)) return null
  return path.resolve(executable)
}

function _registerLinuxDesktopEntry(executableOverride = null) {
  if (process.platform !== 'linux') return false

  const executable = _getLinuxLauncherExecutable(executableOverride)
  if (!executable || !fs.existsSync(executable)) return false

  try {
    const dataHome = _getLinuxDataHome()
    const applicationsDir = path.join(dataHome, 'applications')
    const iconsDir = path.join(dataHome, 'icons', 'hicolor', '256x256', 'apps')
    const desktopPath = path.join(applicationsDir, LINUX_DESKTOP_FILE_NAME)
    const desktopTmpPath = `${desktopPath}.${process.pid}.tmp`
    const bundledIcon = path.join(__dirname, 'build', 'icon.png')
    const installedIcon = path.join(iconsDir, 'nitrix.png')

    fs.mkdirSync(applicationsDir, { recursive: true })
    fs.mkdirSync(iconsDir, { recursive: true })
    if (fs.existsSync(bundledIcon)) fs.copyFileSync(bundledIcon, installedIcon)

    const desktopEntry = [
      '[Desktop Entry]',
      'Version=1.0',
      'Type=Application',
      'Name=Nitrix',
      'Comment=Nitrix Browser',
      `Exec=${_quoteLinuxDesktopExecArg(executable)} %U`,
      'Icon=nitrix',
      'Terminal=false',
      'Categories=Network;WebBrowser;',
      `MimeType=${LINUX_BROWSER_MIME_TYPES.join(';')};`,
      'StartupNotify=true',
      'StartupWMClass=Nitrix',
      'Keywords=browser;internet;web;',
      '',
    ].join('\n')

    fs.writeFileSync(desktopTmpPath, desktopEntry, { encoding: 'utf8', mode: 0o644 })
    fs.renameSync(desktopTmpPath, desktopPath)

    execFile('update-desktop-database', [applicationsDir], { timeout: 8000 }, () => {})
    return true
  } catch(e) {
    console.error('[DefaultBrowser] Linux desktop entry registration failed:', e)
    return false
  }
}

async function _runLinuxDesktopCommand(command, args) {
  try {
    const { stdout = '' } = await execFileAsync(command, args, {
      encoding: 'utf8',
      timeout: 8000,
    })
    return { ok: true, stdout: stdout.trim() }
  } catch(e) {
    console.error('[DefaultBrowser] Linux command failed:', command, args, e.message)
    return { ok: false, stdout: '' }
  }
}

async function _isLinuxDefaultBrowser() {
  if (process.platform !== 'linux') return false

  for (const mimeType of DEFAULT_BROWSER_PROTOCOLS.map(scheme => `x-scheme-handler/${scheme}`)) {
    const result = await _runLinuxDesktopCommand('xdg-mime', ['query', 'default', mimeType])
    if (!result.ok || result.stdout.toLowerCase() !== LINUX_DESKTOP_FILE_NAME) return false
  }
  return true
}

async function _setLinuxDefaultBrowser() {
  if (process.platform !== 'linux') return false
  if (!_registerLinuxDesktopEntry()) return false

  // xdg-settings integruje przeglądarkę z pulpitem, a xdg-mime zapewnia
  // poprawne skojarzenia również w środowiskach, które go nie implementują.
  await _runLinuxDesktopCommand('xdg-settings', ['set', 'default-web-browser', LINUX_DESKTOP_FILE_NAME])
  for (const mimeType of LINUX_BROWSER_MIME_TYPES) {
    const result = await _runLinuxDesktopCommand('xdg-mime', ['default', LINUX_DESKTOP_FILE_NAME, mimeType])
    if (!result.ok) return false
  }

  return _isLinuxDefaultBrowser()
}

function _regAddValue(key, name, type, value) {
  if (process.platform !== 'win32') return false
  try {
    const args = ['add', key]
    if (name === null) args.push('/ve')
    else args.push('/v', name)
    args.push('/t', type, '/d', String(value), '/f')
    execFileSync('reg.exe', args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'ignore'],
    })
    return true
  } catch(e) {
    console.error('[DefaultBrowser] registry write failed:', key, name, e)
    return false
  }
}

function _escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function _readWindowsRegistryValue(key, name) {
  if (process.platform !== 'win32') return null
  try {
    const args = ['query', key]
    if (name === null) args.push('/ve')
    else args.push('/v', name)

    const output = execFileSync('reg.exe', args, {
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    })

    const pattern = name === null
      ? /^\s*\(Default\)\s+REG_\w+\s+(.+?)\s*$/mi
      : new RegExp(`^\\s*${_escapeRegExp(name)}\\s+REG_\\w+\\s+(.+?)\\s*$`, 'mi')
    const match = output.match(pattern)
    return match ? match[1].trim() : null
  } catch(e) {
    return null
  }
}

function _quoteWindowsCommandArg(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`
}

function _registerWindowsDefaultBrowser() {
  if (process.platform !== 'win32') return false

  const { exe, args } = _getProtocolClientArgs()
  if (!exe || !fs.existsSync(exe)) return false

  const appName = 'Nitrix'
  const appDescription = 'Nitrix Browser'
  const devIcon = path.join(__dirname, 'icon.ico')
  const appIcon = app.isPackaged ? `${exe},0` : (fs.existsSync(devIcon) ? devIcon : `${exe},0`)
  const openCommand = [_quoteWindowsCommandArg(exe), ...args.map(_quoteWindowsCommandArg)].join(' ')
  const openUrlCommand = `${openCommand} "%1"`
  const clientRoot = `HKCU\\Software\\Clients\\StartMenuInternet\\${DEFAULT_BROWSER_CLIENT_KEY}`
  const capabilitiesRoot = `${clientRoot}\\Capabilities`
  const urlAssociationsRoot = `${capabilitiesRoot}\\URLAssociations`
  const fileAssociationsRoot = `${capabilitiesRoot}\\FileAssociations`
  const startMenuRoot = `${capabilitiesRoot}\\Startmenu`
  const installInfoRoot = `${clientRoot}\\InstallInfo`
  const classesRoot = 'HKCU\\Software\\Classes'
  const urlProgIdRoot = `${classesRoot}\\${DEFAULT_BROWSER_PROG_ID}`
  const htmlProgIdRoot = `${classesRoot}\\${DEFAULT_BROWSER_HTML_PROG_ID}`
  const appExeRoot = `${classesRoot}\\Applications\\Nitrix.exe`

  const writes = [
    ['HKCU\\Software\\RegisteredApplications', appName, 'REG_SZ', DEFAULT_BROWSER_CAPABILITIES],
    [clientRoot, null, 'REG_SZ', appName],
    [`${clientRoot}\\DefaultIcon`, null, 'REG_SZ', appIcon],
    [`${clientRoot}\\shell\\open\\command`, null, 'REG_SZ', openCommand],
    [capabilitiesRoot, 'ApplicationName', 'REG_SZ', appName],
    [capabilitiesRoot, 'ApplicationDescription', 'REG_SZ', appDescription],
    [capabilitiesRoot, 'ApplicationIcon', 'REG_SZ', appIcon],
    [startMenuRoot, 'StartMenuInternet', 'REG_SZ', DEFAULT_BROWSER_CLIENT_KEY],
    [urlAssociationsRoot, 'http', 'REG_SZ', 'http'],
    [urlAssociationsRoot, 'https', 'REG_SZ', 'https'],
    [fileAssociationsRoot, '.htm', 'REG_SZ', DEFAULT_BROWSER_HTML_PROG_ID],
    [fileAssociationsRoot, '.html', 'REG_SZ', DEFAULT_BROWSER_HTML_PROG_ID],
    [fileAssociationsRoot, '.shtml', 'REG_SZ', DEFAULT_BROWSER_HTML_PROG_ID],
    [fileAssociationsRoot, '.xht', 'REG_SZ', DEFAULT_BROWSER_HTML_PROG_ID],
    [fileAssociationsRoot, '.xhtml', 'REG_SZ', DEFAULT_BROWSER_HTML_PROG_ID],
    [fileAssociationsRoot, '.webp', 'REG_SZ', DEFAULT_BROWSER_HTML_PROG_ID],
    [installInfoRoot, 'ReinstallCommand', 'REG_SZ', `${openCommand} --make-default-browser`],
    [installInfoRoot, 'HideIconsCommand', 'REG_SZ', openCommand],
    [installInfoRoot, 'ShowIconsCommand', 'REG_SZ', openCommand],
    [installInfoRoot, 'IconsVisible', 'REG_DWORD', '1'],
    [urlProgIdRoot, null, 'REG_SZ', 'Nitrix URL'],
    [urlProgIdRoot, 'URL Protocol', 'REG_SZ', ''],
    [`${urlProgIdRoot}\\DefaultIcon`, null, 'REG_SZ', appIcon],
    [`${urlProgIdRoot}\\shell\\open\\command`, null, 'REG_SZ', openUrlCommand],
    [`${classesRoot}\\http`, null, 'REG_SZ', 'URL:http'],
    [`${classesRoot}\\http`, 'URL Protocol', 'REG_SZ', ''],
    [`${classesRoot}\\http\\DefaultIcon`, null, 'REG_SZ', appIcon],
    [`${classesRoot}\\http\\shell\\open\\command`, null, 'REG_SZ', openUrlCommand],
    [`${classesRoot}\\https`, null, 'REG_SZ', 'URL:https'],
    [`${classesRoot}\\https`, 'URL Protocol', 'REG_SZ', ''],
    [`${classesRoot}\\https\\DefaultIcon`, null, 'REG_SZ', appIcon],
    [`${classesRoot}\\https\\shell\\open\\command`, null, 'REG_SZ', openUrlCommand],
    [htmlProgIdRoot, null, 'REG_SZ', 'Nitrix HTML Document'],
    [`${htmlProgIdRoot}\\DefaultIcon`, null, 'REG_SZ', appIcon],
    [`${htmlProgIdRoot}\\shell\\open\\command`, null, 'REG_SZ', openUrlCommand],
    [appExeRoot, 'ApplicationName', 'REG_SZ', appName],
    [appExeRoot, 'ApplicationDescription', 'REG_SZ', appDescription],
    [appExeRoot, 'ApplicationIcon', 'REG_SZ', appIcon],
    [`${appExeRoot}\\shell\\open\\command`, null, 'REG_SZ', openUrlCommand],
    [`${appExeRoot}\\SupportedTypes`, '.htm', 'REG_SZ', ''],
    [`${appExeRoot}\\SupportedTypes`, '.html', 'REG_SZ', ''],
    [`${appExeRoot}\\SupportedTypes`, '.shtml', 'REG_SZ', ''],
    [`${appExeRoot}\\SupportedTypes`, '.xht', 'REG_SZ', ''],
    [`${appExeRoot}\\SupportedTypes`, '.xhtml', 'REG_SZ', ''],
    [`${appExeRoot}\\SupportedTypes`, '.webp', 'REG_SZ', ''],
  ]

  let ok = true
  for (const entry of writes) {
    if (!_regAddValue(...entry)) ok = false
  }
  _notifyWindowsAssociationChanged()
  return ok
}

function _notifyWindowsAssociationChanged() {
  if (process.platform !== 'win32') return
  const script = `
$code = @'
using System;
using System.Runtime.InteropServices;
public static class NitrixShellNotify {
  [DllImport("shell32.dll")]
  public static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
'@
try {
  Add-Type $code -ErrorAction SilentlyContinue
  [NitrixShellNotify]::SHChangeNotify(0x08000000, 0x00001003, [IntPtr]::Zero, [IntPtr]::Zero)
  Start-Sleep -Milliseconds 1000
} catch {}
`
  try {
    execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], {
      windowsHide: true,
      timeout: 5000,
      stdio: ['ignore', 'ignore', 'ignore'],
    })
  } catch(e) {}
}

function _registerDefaultBrowserProtocols() {
  if (process.platform === 'win32') {
    return _registerWindowsDefaultBrowser()
  }

  if (process.platform === 'linux') {
    return _registerLinuxDesktopEntry()
  }

  return false
}

function _electronSeesDefaultProtocol(scheme) {
  try {
    const { exe, args } = _getProtocolClientArgs()
    return args.length
      ? app.isDefaultProtocolClient(scheme, exe, args)
      : app.isDefaultProtocolClient(scheme)
  } catch(e) {
    return false
  }
}

function _queryWindowsCurrentDefaultProgId(scheme) {
  if (!scheme || process.platform !== 'win32') return null
  const safeScheme = DEFAULT_BROWSER_PROTOCOLS.includes(scheme) ? scheme : null
  if (!safeScheme) return null

  const script = `
$code = @'
using System;
using System.Runtime.InteropServices;
public enum NitrixAssociationType { AT_FILEEXTENSION = 0, AT_URLPROTOCOL = 1, AT_STARTMENUCLIENT = 2, AT_MIMETYPE = 3 }
public enum NitrixAssociationLevel { AL_MACHINE = 0, AL_EFFECTIVE = 1, AL_USER = 2 }
[ComImport, Guid("4e530b0a-e611-4c77-a3ac-9031d022281b"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface INitrixApplicationAssociationRegistration {
  [PreserveSig]
  int QueryCurrentDefault([MarshalAs(UnmanagedType.LPWStr)] string pszQuery, NitrixAssociationType atQueryType, NitrixAssociationLevel alQueryLevel, out IntPtr ppszAssociation);
}
[ComImport, Guid("591209c7-767b-42b2-9fba-44ee4615f2c7")]
public class NitrixApplicationAssociationRegistration {}
public static class NitrixCurrentDefaultQuery {
  public static string Query(string scheme) {
    var reg = (INitrixApplicationAssociationRegistration)new NitrixApplicationAssociationRegistration();
    IntPtr ptr;
    int hr = reg.QueryCurrentDefault(scheme, NitrixAssociationType.AT_URLPROTOCOL, NitrixAssociationLevel.AL_EFFECTIVE, out ptr);
    if (hr != 0 || ptr == IntPtr.Zero) return "";
    try { return Marshal.PtrToStringUni(ptr); }
    finally { Marshal.FreeCoTaskMem(ptr); }
  }
}
'@
try { Add-Type $code -ErrorAction SilentlyContinue } catch {}
try { [NitrixCurrentDefaultQuery]::Query('${safeScheme}') } catch {}
`
  try {
    const value = execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return value || null
  } catch(e) {
    return null
  }
}

async function _queryWindowsCurrentDefaultProgIdAsync(scheme) {
  if (!scheme || process.platform !== 'win32') return null
  const safeScheme = DEFAULT_BROWSER_PROTOCOLS.includes(scheme) ? scheme : null
  if (!safeScheme) return null

  const script = `
$code = @'
using System;
using System.Runtime.InteropServices;
public enum NitrixAssociationType { AT_FILEEXTENSION = 0, AT_URLPROTOCOL = 1, AT_STARTMENUCLIENT = 2, AT_MIMETYPE = 3 }
public enum NitrixAssociationLevel { AL_MACHINE = 0, AL_EFFECTIVE = 1, AL_USER = 2 }
[ComImport, Guid("4e530b0a-e611-4c77-a3ac-9031d022281b"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface INitrixApplicationAssociationRegistration {
  [PreserveSig]
  int QueryCurrentDefault([MarshalAs(UnmanagedType.LPWStr)] string pszQuery, NitrixAssociationType atQueryType, NitrixAssociationLevel alQueryLevel, out IntPtr ppszAssociation);
}
[ComImport, Guid("591209c7-767b-42b2-9fba-44ee4615f2c7")]
public class NitrixApplicationAssociationRegistration {}
public static class NitrixCurrentDefaultQuery {
  public static string Query(string scheme) {
    var reg = (INitrixApplicationAssociationRegistration)new NitrixApplicationAssociationRegistration();
    IntPtr ptr;
    int hr = reg.QueryCurrentDefault(scheme, NitrixAssociationType.AT_URLPROTOCOL, NitrixAssociationLevel.AL_EFFECTIVE, out ptr);
    if (hr != 0 || ptr == IntPtr.Zero) return "";
    try { return Marshal.PtrToStringUni(ptr); }
    finally { Marshal.FreeCoTaskMem(ptr); }
  }
}
'@
try { Add-Type $code -ErrorAction SilentlyContinue } catch {}
try { [NitrixCurrentDefaultQuery]::Query('${safeScheme}') } catch {}
`
  try {
    const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 5000,
    })
    return stdout.trim() || null
  } catch(e) {
    return null
  }
}

function _readWindowsUrlUserChoice(scheme) {
  const key = `HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\${scheme}\\UserChoice`
  return _readWindowsRegistryValue(key, 'ProgId')
}

function _readWindowsProgIdCommand(progId) {
  if (!progId || process.platform !== 'win32') return null
  const keys = [
    `HKCU\\Software\\Classes\\${progId}\\shell\\open\\command`,
    `HKLM\\Software\\Classes\\${progId}\\shell\\open\\command`,
    `HKCR\\${progId}\\shell\\open\\command`,
  ]
  for (const key of keys) {
    const value = _readWindowsRegistryValue(key, null)
    if (value) return value
  }
  return null
}

function _readWindowsProtocolCommand(scheme) {
  if (!scheme || process.platform !== 'win32') return null
  const keys = [
    `HKCU\\Software\\Classes\\${scheme}\\shell\\open\\command`,
    `HKLM\\Software\\Classes\\${scheme}\\shell\\open\\command`,
    `HKCR\\${scheme}\\shell\\open\\command`,
  ]
  for (const key of keys) {
    const value = _readWindowsRegistryValue(key, null)
    if (value) return value
  }
  return null
}

function _queryWindowsAssociatedExecutable(scheme) {
  if (!scheme || process.platform !== 'win32') return null
  const safeScheme = DEFAULT_BROWSER_PROTOCOLS.includes(scheme) ? scheme : null
  if (!safeScheme) return null

  const script = `
$code = @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class NitrixAssocNative {
  [DllImport("Shlwapi.dll", CharSet=CharSet.Unicode, SetLastError=false)]
  public static extern uint AssocQueryString(uint flags, uint str, string pszAssoc, string pszExtra, StringBuilder pszOut, ref uint pcchOut);
}
'@
try { Add-Type $code -ErrorAction SilentlyContinue } catch {}
$len = 0
[void][NitrixAssocNative]::AssocQueryString(0x20, 2, '${safeScheme}', 'open', $null, [ref]$len)
if ($len -gt 0) {
  $sb = New-Object System.Text.StringBuilder ([int]$len)
  $hr = [NitrixAssocNative]::AssocQueryString(0x20, 2, '${safeScheme}', 'open', $sb, [ref]$len)
  if ($hr -eq 0) { $sb.ToString() }
}
`
  try {
    return execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null
  } catch(e) {
    return null
  }
}

function _commandLooksLikeNitrix(command) {
  if (!command) return false
  const normalized = String(command).replace(/\//g, '\\').toLowerCase()
  const currentExe = String(process.execPath || '').replace(/\//g, '\\').toLowerCase()
  const currentMain = path.resolve(__filename).replace(/\//g, '\\').toLowerCase()

  return normalized.includes('nitrix.exe') ||
    (currentExe.endsWith('\\nitrix.exe') && normalized.includes(currentExe)) ||
    (normalized.includes('electron.exe') && normalized.includes(currentMain)) ||
    (normalized.includes('electron.exe') && normalized.includes('main.js') && normalized.includes('nitrix'))
}

function _progIdLooksLikeNitrix(progId, scheme = null) {
  if (!progId) return false
  const normalized = String(progId).toLowerCase()
  if (_commandLooksLikeNitrix(progId)) return true
  if (scheme && (normalized === scheme || normalized === `url:${scheme}`)) {
    return _commandLooksLikeNitrix(_readWindowsProgIdCommand(scheme)) ||
      _commandLooksLikeNitrix(_readWindowsProtocolCommand(scheme)) ||
      _electronSeesDefaultProtocol(scheme)
  }
  return DEFAULT_BROWSER_PROG_IDS.has(normalized) ||
    normalized.startsWith('nitrix') ||
    _commandLooksLikeNitrix(_readWindowsProgIdCommand(progId))
}

function _progIdLooksLikeNitrixFast(progId, scheme = null) {
  if (!progId) return false
  const normalized = String(progId).toLowerCase()
  if (_commandLooksLikeNitrix(progId)) return true
  if (scheme && (normalized === scheme || normalized === `url:${scheme}`)) {
    return _electronSeesDefaultProtocol(scheme)
  }
  return DEFAULT_BROWSER_PROG_IDS.has(normalized) || normalized.startsWith('nitrix')
}

function _isWindowsSchemeHandledByNitrix(scheme) {
  const currentDefaultProgId = _queryWindowsCurrentDefaultProgId(scheme)
  if (currentDefaultProgId && currentDefaultProgId.toLowerCase() !== 'undecided') {
    return _progIdLooksLikeNitrix(currentDefaultProgId, scheme)
  }

  const userChoiceProgId = _readWindowsUrlUserChoice(scheme)
  if (userChoiceProgId) return _progIdLooksLikeNitrix(userChoiceProgId, scheme)

  const associatedExe = _queryWindowsAssociatedExecutable(scheme)
  if (_commandLooksLikeNitrix(associatedExe)) return true

  return _commandLooksLikeNitrix(_readWindowsProtocolCommand(scheme))
}

async function _isWindowsSchemeHandledByNitrixAsync(scheme) {
  const currentDefaultProgId = await _queryWindowsCurrentDefaultProgIdAsync(scheme)
  if (currentDefaultProgId && currentDefaultProgId.toLowerCase() !== 'undecided') {
    return _progIdLooksLikeNitrixFast(currentDefaultProgId, scheme)
  }

  // Fast non-blocking fallback: enough for packaged Nitrix and avoids registry/PowerShell polling stutters.
  return _electronSeesDefaultProtocol(scheme)
}

async function _openWindowsDefaultBrowserSettings() {
  if (process.platform !== 'win32') return false

  const directUser = `ms-settings:defaultapps?registeredAppUser=${encodeURIComponent(DEFAULT_BROWSER_CLIENT_KEY)}`
  const directMachine = `ms-settings:defaultapps?registeredAppMachine=${encodeURIComponent(DEFAULT_BROWSER_CLIENT_KEY)}`
  for (const url of [directUser, directMachine, 'ms-settings:defaultapps']) {
    try {
      await execFileAsync('explorer.exe', [url], { windowsHide: true, timeout: 5000 })
      return true
    } catch(e) {}
  }
  return false
}

function _isDefaultBrowser() {
  if (process.platform === 'win32') {
    return DEFAULT_BROWSER_PROTOCOLS.every(scheme => _isWindowsSchemeHandledByNitrix(scheme))
  }

  const { exe, args } = _getProtocolClientArgs()
  return DEFAULT_BROWSER_PROTOCOLS.every(scheme => {
    try {
      return args.length
        ? app.isDefaultProtocolClient(scheme, exe, args)
        : app.isDefaultProtocolClient(scheme)
    } catch(e) {
      console.error('[DefaultBrowser] status failed:', scheme, e)
      return false
    }
  })
}

async function _isDefaultBrowserAsync() {
  if (process.platform === 'win32') {
    for (const scheme of DEFAULT_BROWSER_PROTOCOLS) {
      if (!(await _isWindowsSchemeHandledByNitrixAsync(scheme))) return false
    }
    return true
  }
  if (process.platform === 'linux') return _isLinuxDefaultBrowser()
  return _isDefaultBrowser()
}

function _normalizeLaunchFileTarget(arg) {
  if (typeof arg !== 'string') return null

  const raw = arg.trim().replace(/^"|"$/g, '')
  if (!raw || raw.startsWith('--')) return null

  let filePath = null
  if (/^file:\/\//i.test(raw)) {
    try {
      filePath = fileURLToPath(raw)
    } catch {
      return null
    }
  } else {
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(raw)) return null
    filePath = path.resolve(raw)
  }

  const ext = path.extname(filePath).toLowerCase()
  if (!OPENABLE_LOCAL_FILE_EXTENSIONS.has(ext)) return null

  try {
    if (!fs.existsSync(filePath)) return null
    if (!fs.statSync(filePath).isFile()) return null
    return pathToFileURL(filePath).toString()
  } catch {
    return null
  }
}

function _getLocalFilePathFromUrl(url) {
  if (typeof url !== 'string' || !/^file:\/\//i.test(url)) return null
  try {
    return fileURLToPath(url)
  } catch {
    return null
  }
}

function _isOpenableLocalHtmlUrl(url) {
  const filePath = _getLocalFilePathFromUrl(url)
  if (!filePath) return false

  const ext = path.extname(filePath).toLowerCase()
  if (!OPENABLE_LOCAL_FILE_EXTENSIONS.has(ext)) return false

  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

function _isAllowedLocalFileRequest(details) {
  const url = details?.url || ''
  const filePath = _getLocalFilePathFromUrl(url)
  if (!filePath) return false

  const rt = details.resourceType
  if (rt === 'mainFrame' || rt === 'main_frame') {
    return _isOpenableLocalHtmlUrl(url)
  }

  // Local HTML pages may need their local CSS/JS/images/fonts. Remote pages still
  // cannot pull arbitrary file:// resources because their referrer/initiator is not file://.
  const referrer = details.referrer || details.initiator || ''
  return /^file:\/\//i.test(referrer)
}

function _extractLaunchUrl(argv = []) {
  for (const arg of argv) {
    if (typeof arg !== 'string') continue
    const raw = arg.trim().replace(/^"|"$/g, '')
    if (/^https?:\/\//i.test(raw)) return raw

    const fileUrl = _normalizeLaunchFileTarget(raw)
    if (fileUrl) return fileUrl
  }

  return null
}

function _openUrlFromShell(url) {
  if (!url) return false
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) win.restore()
    win.focus()
    win.webContents.send('open-in-new-tab', url)
    return true
  }
  createWindow(false, url)
  return true
}

// SQLite import can use sql.js when the native module is unavailable.
let _sqlJsPromise = null
function _loadSqlJs() {
  if (!_sqlJsPromise) {
    const initSqlJs = require('sql.js')
    const wasmDir = path.dirname(require.resolve('sql.js'))
    _sqlJsPromise = initSqlJs({
      locateFile: (file) => path.join(wasmDir, file),
    }).catch(error => {
      _sqlJsPromise = null
      throw error
    })
  }
  return _sqlJsPromise
}

async function _readSqliteRows(dbPath, query) {
  const SQL = await _loadSqlJs()
  const tmpDir = fs.mkdtempSync(path.join(dataDir, 'import-sqlite-'))
  const tmpPath = path.join(tmpDir, 'snapshot.db')
  let db
  try {
    if (fs.statSync(dbPath).size > 256 * 1024 * 1024) {
      throw Object.assign(new Error('SQLite import exceeds 256 MiB'), { code: 'DATA_TOO_LARGE' })
    }
    fs.copyFileSync(dbPath, tmpPath)
    const raw = readLimitedFile(tmpPath, 256 * 1024 * 1024)
    db = new SQL.Database(raw)
    const result = db.exec(query)
    if (!result.length) return []
    const { columns, values } = result[0]
    return values.map(row => {
      const obj = {}
      for (let i = 0; i < columns.length; i++) obj[columns[i]] = row[i]
      return obj
    })
  } finally {
    try { if (db) db.close() }
    catch (error) { store.report('sqlite-close', 'snapshot.db', error) }
    finally {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }) }
      catch (error) { store.report('sqlite-cleanup', 'snapshot.db', error) }
    }
  }
}

// ── Pojedyncza instancja — zapobiega konfliktom cache ─────────────────
// Gdy użytkownik kliknie ikonę po raz drugi, zamiast nowego procesu
// (który blokuje cache) otworzy się nowe okno w tej samej instancji.
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  // Jesteśmy drugą instancją — kończymy się, pierwsza otworzy nowe okno
  app.quit()
}

app.commandLine.appendSwitch('site-per-process')

// ── Flagi Chromium ────────────────────────────────────────────────────
app.commandLine.appendSwitch('enable-quic')
app.commandLine.appendSwitch('quic-version', 'h3')
app.commandLine.appendSwitch('disk-cache-size',  String(256 * 1024 * 1024))
app.commandLine.appendSwitch('media-cache-size', String(128 * 1024 * 1024))
app.commandLine.appendSwitch('num-raster-threads', '4')
app.commandLine.appendSwitch('enable-gpu-async-readback', 'true')
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-zero-copy')
app.commandLine.appendSwitch('enable-accelerated-video-decode')
app.commandLine.appendSwitch('enable-accelerated-2d-canvas')
app.commandLine.appendSwitch('max-connections-per-proxy', '32')
// Zmniejszono z 6 → 4; każdy renderer to ~30–80 MB; 4 wystarczy dla typowego użycia
app.commandLine.appendSwitch('renderer-process-limit', '8')

// ── Pliki danych ──────────────────────────────────────────────────────
const bookmarksFile       = path.join(dataDir, 'bookmarks.json')
const historyFile         = path.join(dataDir, 'history.json')
const adblockSettingsFile = path.join(dataDir, 'adblock-settings.json')
const customBlockedFile   = path.join(dataDir, 'custom-blocked.json')
const customFiltersFile   = path.join(dataDir, 'custom-filters.txt')
const adbVarsFile         = path.join(dataDir, 'nitrix-adb-vars.js')
const easyListFile        = path.join(dataDir, 'easylist.txt')
const easyPrivacyFile     = path.join(dataDir, 'easyprivacy.txt')
const easyListCookieFile  = path.join(dataDir, 'easylist_cookie.txt')

function loadSettings() {
  const settings = store.read(settingsFile, isSettings, () => ({ theme: 'light' }))
  // Accept older files, but discard the removed webpage Aero areas.
  if (Array.isArray(settings.aeroAreas)) settings.aeroAreas = settings.aeroAreas.filter(area =>
    ['tabs', 'bookmarks', 'navigation', 'ui', 'cards'].includes(area))
  delete settings.aeroTopBlur
  return settings
}
function saveSettings(data) {
  try {
    if (!isSettings(data)) return false
    const current = loadSettings()
    // Object.create(null) zapobiega prototype pollution
    const safe = Object.assign(Object.create(null), current)
    const ALLOWED_KEYS = ['theme','expandBar','bkBarMode','searchEngine','homepage',
      'homepageUrl','customHomepageUrl','historySuggestions','bookmarkSuggestions',
      'privateSuggestionsMode','lang','qrShowInBar','qrDisableYtTime',
      'startupBehavior','startupCustomUrl','startupBookmarks','lastOpenedUrl','blockLocalIp']
    ALLOWED_KEYS.push('aeroBlur', 'aeroScope', 'aeroAreas', 'aeroTopOpacity', 'backdropContrast', 'skipQuitShortcutPrompt')
    for (const key of ALLOWED_KEYS) {
      if (key in data) safe[key] = data[key]
    }
    if (Array.isArray(safe.aeroAreas)) safe.aeroAreas = safe.aeroAreas.filter(area =>
      ['tabs', 'bookmarks', 'navigation', 'ui', 'cards'].includes(area))
    return store.write(settingsFile, safe, isSettings)
  } catch(e) { store.report('settings-save', settingsFile, e); return false }
}

function _applyLocalIpProtection(webContent, enabled) {
  try {
    if (!webContent || webContent.isDestroyed()) return false
    webContent.setWebRTCIPHandlingPolicy(enabled ? 'default_public_interface_only' : 'default')
    return true
  } catch(e) {
    console.error('[Privacy] WebRTC IP policy failed:', e)
    return false
  }
}

let _bookmarksCache = null
function loadBookmarks() {
  if (_bookmarksCache !== null) return _bookmarksCache
  _bookmarksCache = store.read(bookmarksFile, isBookmarks, () => [])
  return _bookmarksCache
}
let _bookmarksSaveTimer = null
let _bookmarksDirty = false
function saveBookmarks(data) {
  if (!isBookmarks(data)) return false
  _bookmarksCache = data
  _bookmarksDirty = true
  if (_bookmarksSaveTimer) clearTimeout(_bookmarksSaveTimer)
  _bookmarksSaveTimer = setTimeout(flushBookmarks, 500)
  return true
}
function flushBookmarks() {
  clearTimeout(_bookmarksSaveTimer)
  _bookmarksSaveTimer = null
  if (_bookmarksDirty && store.write(bookmarksFile, _bookmarksCache, isBookmarks)) _bookmarksDirty = false
}

function loadHistory() {
  return store.read(historyFile, isHistory, () => []).slice(0, 5000)
}
function saveHistory(data) {
  return store.write(historyFile, data, isHistory)
}

// ══════════════════════════════════════════════════════════════════════
//  USTAWIENIA ADBLOCK
// ══════════════════════════════════════════════════════════════════════
const ADBLOCK_SETTINGS_DEFAULTS = {
  enabled:            true,   // główny włącznik adblock
  nitrixBuiltIn:      true,   // wbudowane listy Nitrix (reklamy + YT + polskie)
  easyList:           true,   // EasyList (reklamy)
  easyPrivacy:        false,  // EasyPrivacy (trackery)
  easyListCookie:     true,   // EasyList Cookie (banery cookie/GDPR)
  blockCookieBanners: false,  // stara metoda CSS — zastąpiona przez EasyList Cookie
  aggressiveMode:     false,  // tryb agresywny (więcej blokad, może łamać strony)
}

function loadAdblockSettings() {
  return Object.assign({}, ADBLOCK_SETTINGS_DEFAULTS,
    store.read(adblockSettingsFile, isBooleanRecord, () => ({})))
}
function saveAdblockSettings(data) {
  try {
    if (!isBooleanRecord(data)) return false
    const current  = loadAdblockSettings()
    const ALLOWED  = ['enabled','nitrixBuiltIn','easyList','easyPrivacy','easyListCookie','blockCookieBanners','aggressiveMode']
    const turningOn    = 'enabled' in data && !!data.enabled
    const turningOff   = 'enabled' in data && !data.enabled
    const currentlyOff = !current.enabled
    if (currentlyOff && !turningOn) return
    const safe = Object.assign({}, current)
    if (turningOff) {
      safe.enabled = false
    } else {
      for (const k of ALLOWED) { if (k in data) safe[k] = !!data[k] }
    }
    if (!store.write(adblockSettingsFile, safe, isBooleanRecord)) return false
    _invalidateAdbCache()
  } catch(e) {}
}

// ══════════════════════════════════════════════════════════════════════
//  WŁASNE FILTRY UŻYTKOWNIKA (Moje Filtry)
// ══════════════════════════════════════════════════════════════════════
const customFilterDomains  = new Set()   // reguły sieciowe ||domain.com^
const customCosmeticRules  = []          // reguły kosmetyczne ##.selector

function _parseCustomFilters(text) {
  customFilterDomains.clear()
  customCosmeticRules.length = 0
  if (!text || typeof text !== 'string') return
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('!') || line.startsWith('#')) continue
    // Sieciowe: ||domain.com^
    const domainMatch = line.match(/^\|\|([a-z0-9.\-]+)\^/)
    if (domainMatch && domainMatch[1].includes('.')) {
      customFilterDomains.add(domainMatch[1])
      continue
    }
    // Kosmetyczne: ##selector lub domain.com##selector
    const cosmeticMatch = line.match(/^(?:[^#]*)?##(.+)$/)
    if (cosmeticMatch) {
      customCosmeticRules.push(cosmeticMatch[1].trim())
    }
  }
}

function loadCustomFilters() {
  try {
    if (fs.existsSync(customFiltersFile))
      return fs.readFileSync(customFiltersFile, 'utf8')
  } catch(e) {}
  return ''
}

function saveCustomFilters(text) {
  try { fs.writeFileSync(customFiltersFile, text || '', 'utf8') } catch(e) {}
}

// Wczytaj przy starcie
_parseCustomFilters(loadCustomFilters())

// ── Asynchroniczne ładowanie list adblockera po starcie aplikacji ──
setTimeout(() => {
  loadEasyList().catch(err => console.error('[Adblock] Error loading lists:', err))
}, 2000) // Opóźnienie 2s żeby aplikacja mogła się uruchomić

ipcMain.handle('custom-filters-load', () => loadCustomFilters())
ipcMain.handle('custom-filters-save', (e, text) => {
  if (typeof text !== 'string' || text.length > 200000) return false
  saveCustomFilters(text)
  _parseCustomFilters(text)
  return true
})
ipcMain.handle('custom-filters-cosmetic', () => [...customCosmeticRules])

// ── EasyList / EasyPrivacy — pobieranie i parsowanie ──────────────────
const EASYLIST_URL        = 'https://easylist.to/easylist/easylist.txt'
const EASYPRIVACY_URL     = 'https://easylist.to/easylist/easyprivacy.txt'
const EASYLIST_COOKIE_URL      = 'https://easylist.to/easylist/easylist_cookie.txt'
const EASYLIST_COOKIE_URL_ALT  = 'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt'
const EASYLIST_TTL        = 7 * 24 * 60 * 60 * 1000  // 7 dni

// Zestaw domen z EasyList/EasyPrivacy — uzupełnia AD_BLOCK_DOMAINS w runtime
const easyListDomains      = new Set()
const easyPrivacyDomains   = new Set()
const easyListCookieDomains = new Set()
// Reguły kosmetyczne z EasyList Cookie — tablica chunków CSS do wstrzykiwania
let easyListCookieCSSChunks = []

function _parseFilterList(text, targetSet) {
  // Parsujemy synchronicznie — setTimeout(fn,0) powodowało że funkcja zwracała 0
  // zanim jakikolwiek chunk zdążył się wykonać (race condition).
  // Main process nie jest UI threadem, więc ~100ms parsowania nie blokuje interfejsu.
  let added = 0
  for (const line of text.split('\n')) {
    const m = line.match(/^\|\|([a-z0-9.\-]+)\^/)
    if (m && m[1].includes('.') && m[1].length < 100) {
      targetSet.add(m[1])
      added++
    }
  }
  return added
}

// Parser reguł kosmetycznych ##selector z EasyList Cookie
// Zwraca tablicę CSS stringów (podzielonych na chunki żeby uniknąć limitu insertCSS)
function _parseCosmeticRules(text) {
  const selectors = []
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('!') || t.startsWith('[')) continue
    // Pomiń reguły per-domena (mają coś przed ##)
    const idx = t.indexOf('##')
    if (idx !== 0) continue
    const sel = t.slice(2).trim()
    if (!sel || sel.length > 500) continue
    // Pomiń reguły nie będące CSS (proceduralne, scriptlet itp.)
    if (sel.startsWith(':style(') || sel.startsWith('#$') || sel.startsWith('+js(')) continue
    if (sel.includes(':style(') || sel.includes(':has-text(') || sel.includes(':xpath(')) continue
    selectors.push(sel)
  }
  if (selectors.length === 0) return []
  // Dziel na chunki po ~50 KB żeby insertCSS nie zawiodło
  const CHUNK = 500
  const chunks = []
  for (let i = 0; i < selectors.length; i += CHUNK) {
    const batch = selectors.slice(i, i + CHUNK)
    chunks.push(batch.map(s => `${s}{display:none!important;visibility:hidden!important}`).join('\n'))
  }
  return chunks
}

function _isFileStale(filePath) {
  try { return Date.now() - fs.statSync(filePath).mtimeMs > EASYLIST_TTL } catch { return true }
}

async function _downloadFilterList(url, filePath) {
  return new Promise((resolve) => {
    try {
      const req = net.request({ url, redirect: 'follow' })
      let data = ''
      let statusCode = 0
      const timeout = setTimeout(() => {
        req.abort()
        resolve(null)
      }, 30000) // 30s timeout żeby nie blokować

      req.on('response', res => {
        statusCode = res.statusCode
        res.on('data', chunk => { data += chunk })
        res.on('end', () => {
          clearTimeout(timeout)
          // Odrzuć odpowiedzi inne niż 200 lub puste
          if (statusCode !== 200 || !data.trim()) { resolve(null); return }
          // Walidacja: lista filtrów zawsze zaczyna się od '!' (komentarz)
          const firstLine = data.trim().split('\n')[0] || ''
          if (!firstLine.startsWith('!') && !firstLine.startsWith('[')) { resolve(null); return }
          try { fs.writeFileSync(filePath, data, 'utf8') } catch(e) {}
          resolve(data)
        })
      })
      req.on('error', () => { clearTimeout(timeout); resolve(null) })
      req.on('abort', () => { clearTimeout(timeout); resolve(null) })
      req.end()
    } catch(e) { resolve(null) }
  })
}

async function loadEasyList() {
  const cfg = loadAdblockSettings()
  if (!cfg.easyList && !cfg.easyPrivacy && !cfg.easyListCookie) return

  // EasyList
  if (cfg.easyList) {
    let text = null
    if (!_isFileStale(easyListFile)) {
      try { text = fs.readFileSync(easyListFile, 'utf8') } catch(e) {}
    }
    if (!text) text = await _downloadFilterList(EASYLIST_URL, easyListFile)
    if (text) {
      easyListDomains.clear()
      const n = _parseFilterList(text, easyListDomains)
      console.log(`[Adblock] EasyList: +${n} domen`)
    }
  } else {
    easyListDomains.clear()
  }

  // EasyPrivacy
  if (cfg.easyPrivacy) {
    let text = null
    if (!_isFileStale(easyPrivacyFile)) {
      try { text = fs.readFileSync(easyPrivacyFile, 'utf8') } catch(e) {}
    }
    if (!text) text = await _downloadFilterList(EASYPRIVACY_URL, easyPrivacyFile)
    if (text) {
      easyPrivacyDomains.clear()
      const n = _parseFilterList(text, easyPrivacyDomains)
      console.log(`[Adblock] EasyPrivacy: +${n} domen`)
    }
  } else {
    easyPrivacyDomains.clear()
  }

  // EasyList Cookie
  if (cfg.easyListCookie) {
    let text = null
    if (!_isFileStale(easyListCookieFile)) {
      try { text = fs.readFileSync(easyListCookieFile, 'utf8') } catch(e) {}
    }
    if (!text) text = await _downloadFilterList(EASYLIST_COOKIE_URL, easyListCookieFile)
    if (!text) text = await _downloadFilterList(EASYLIST_COOKIE_URL_ALT, easyListCookieFile)
    if (text) {
      easyListCookieDomains.clear()
      _parseFilterList(text, easyListCookieDomains)
      easyListCookieCSSChunks = _parseCosmeticRules(text)
      const totalBytes = easyListCookieCSSChunks.reduce((a, c) => a + c.length, 0)
      console.log(`[Adblock] EasyList Cookie: ${easyListCookieDomains.size} domen, ${easyListCookieCSSChunks.length} chunków CSS, ${totalBytes} bajtów`)
    }
  } else {
    easyListCookieDomains.clear()
    easyListCookieCSSChunks = []
  }
}

// IPC — ustawienia adblock
ipcMain.handle('adblock-settings-load', () => loadAdblockSettings())
ipcMain.handle('adblock-settings-save', async (e, data) => {
  if (!data || typeof data !== 'object') return false
  const prev = loadAdblockSettings()
  saveAdblockSettings(data)
  // Jeśli zmieniły się flagi list — przeładuj je
  const next = loadAdblockSettings()
  if (prev.easyList !== next.easyList || prev.easyPrivacy !== next.easyPrivacy || prev.easyListCookie !== next.easyListCookie) {
    await loadEasyList()
  }
  writeAdbVars()
  const senderId = e.sender.id
  const { webContents } = require('electron')
  webContents.getAllWebContents().forEach(wc => {
    if (wc.id === senderId) return
    try {
      wc.send('adblock-global-state', { enabled: next.enabled, aggressiveMode: next.aggressiveMode })
      wc.executeJavaScript(
        `document.documentElement.dataset.nitrixAggressive = '${next.enabled && next.aggressiveMode ? '1' : '0'}';` +
        `document.documentElement.dataset.nitrixAdblockOff = '${next.enabled ? '0' : '1'}';`
      ).catch(() => {})
    } catch(e) {}
  })
  return true
})
// Wymuś odświeżenie list (np. przycisk "Aktualizuj teraz")
ipcMain.handle('adblock-refresh-lists', async () => {
  // Usuń pliki cache żeby wymusić re-download
  try { if (fs.existsSync(easyListFile))       fs.unlinkSync(easyListFile)       } catch(e) {}
  try { if (fs.existsSync(easyPrivacyFile))    fs.unlinkSync(easyPrivacyFile)    } catch(e) {}
  try { if (fs.existsSync(easyListCookieFile)) fs.unlinkSync(easyListCookieFile) } catch(e) {}
  await loadEasyList()
  return true
})
// Zwróć info o listach (data pobrania, liczba domen)
ipcMain.handle('adblock-lists-info', () => {
  const info = { easyList: null, easyPrivacy: null, easyListCookie: null }
  try {
    if (fs.existsSync(easyListFile)) {
      const s = fs.statSync(easyListFile)
      info.easyList = { mtimeMs: s.mtimeMs, domains: easyListDomains.size }
    }
  } catch(e) {}
  try {
    if (fs.existsSync(easyPrivacyFile)) {
      const s = fs.statSync(easyPrivacyFile)
      info.easyPrivacy = { mtimeMs: s.mtimeMs, domains: easyPrivacyDomains.size }
    }
  } catch(e) {}
  try {
    if (fs.existsSync(easyListCookieFile)) {
      const s = fs.statSync(easyListCookieFile)
      info.easyListCookie = { mtimeMs: s.mtimeMs, domains: easyListCookieDomains.size }
    }
  } catch(e) {}
  return info
})

// ── Własne zablokowane elementy (element picker) ──────────────────────
function _loadCustomBlocked() {
  return store.read(customBlockedFile, isBlockedRules, () => ({}))
}
function _saveCustomBlocked(data) {
  _loadCustomBlocked()
  return store.write(customBlockedFile, data, isBlockedRules)
}
ipcMain.handle('custom-blocked-load', () => _loadCustomBlocked())
ipcMain.handle('custom-blocked-save', (e, data) => _saveCustomBlocked(data))

let _historyCache = null
let _historySaveTimer = null

function getHistoryCache() {
  if (_historyCache === null) _historyCache = loadHistory()
  return _historyCache
}
function scheduleSaveHistory() {
  if (_historySaveTimer) clearTimeout(_historySaveTimer)
  _historySaveTimer = setTimeout(() => {
    _historySaveTimer = null
    if (_historyCache !== null) {
      if (saveHistory(_historyCache)) _historyCache = null
    }
  }, 2000)
}

function addHistoryEntry(entry) {
  if (!isHistoryEntry(entry)) return false
  try {
    const history = getHistoryCache()
    const now = Date.now()
    const idx = history.findIndex(h => h.url === entry.url && now - h.timestamp < 5000)
    if (idx !== -1) {
      if (entry.title && entry.title !== entry.url) history[idx].title = entry.title
      scheduleSaveHistory()
      return
    }
    history.unshift(entry)
    if (history.length > 5000) history.splice(5000)
    scheduleSaveHistory()
  } catch(e) {}
}

// ── Handlery IPC ──────────────────────────────────────────────────────
// ── Menu kontekstowe ──────────────────────────────────────────────────
ipcMain.on('show-context-menu', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const menu = Menu.buildFromTemplate([
    {
      label: '↺  Odśwież',
      click: () => { event.sender.send('context-menu-action', 'refresh') }
    }
  ])
  menu.popup({ window: win })
})

ipcMain.on('open-webview-devtools', (e, webContentsId, action) => {
  const { webContents } = require('electron')
  const wc = webContents.fromId(webContentsId)
  if (!trustedBrowserInterfaceSender(e) || !wc || wc.isDestroyed() || wc.hostWebContents !== e.sender) return
  if(action==='source') {
    const url=wc.getURL()
    if(!/^https?:\/\//i.test(url))return
    const sourceWindow=new BrowserWindow({width:1000,height:750,title:'Nitrix — '+url,
      webPreferences:{session:wc.session,sandbox:true,contextIsolation:true,nodeIntegration:false}})
    sourceWindow.setMenu(null)
    sourceWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}))
    sourceWindow.loadURL('view-source:'+url).catch(()=>{if(!sourceWindow.isDestroyed())sourceWindow.close()})
    return
  }
  if(action==='console') {
    const show=()=>wc.devToolsWebContents?.executeJavaScript('DevToolsAPI.showPanel("console")').catch(()=>{})
    if(wc.isDevToolsOpened())show()
    else { wc.once('devtools-opened',show);wc.openDevTools({mode:'detach'}) }
    return
  }
  if (wc.isDevToolsOpened()) {
    wc.closeDevTools()
  } else {
    wc.openDevTools({ mode: 'detach' })
  }
})

ipcMain.on('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.minimize()
})
ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
})
ipcMain.on('window-close', event => {
  if (!trustedBrowserInterfaceSender(event)) return
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.close()  // close() zamiast destroy() — daje czas na cleanup sesji/cache
})

ipcMain.handle('default-browser-is', () => _isDefaultBrowserAsync())

ipcMain.handle('default-browser-set', async () => {
  const registered = _registerDefaultBrowserProtocols()
  if (process.platform === 'win32') {
    await _openWindowsDefaultBrowserSettings()
  } else if (process.platform === 'linux') {
    const isDefault = registered ? await _setLinuxDefaultBrowser() : false
    return { registered, isDefault, platform: 'linux' }
  }
  return { registered, isDefault: await _isDefaultBrowserAsync(), platform: process.platform }
})

ipcMain.handle('settings-load',  () => loadSettings())
ipcMain.handle('window-theme', (event, theme) => {
  if (!trustedBrowserInterfaceSender(event) || !['dark', 'light', 'private', 'transparent'].includes(theme)) return null
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win || win.isDestroyed()) return null
  const glass = theme === 'transparent'
  win.nitrixNativeTheme = theme
  if (!glass) win.nitrixAero?.update([])
  win.setBackgroundColor(glass && win.nitrixTransparentSurface ? '#12203322'
    : theme === 'light' ? '#f1f3f4' : theme === 'private' ? '#1a1035' : '#202124')
  return { requiresRestart: glass && !win.nitrixTransparentSurface }
})
function updateNativeAero(win) {
  if (!win || win.isDestroyed() || !win.nitrixAeroLayout) return
  const layout = win.nitrixAeroLayout
  if (win.nitrixNativeTheme !== 'transparent') {
    win.nitrixAero?.update([])
    return
  }
  const zoom = win.webContents.getZoomFactor()
  const scale = require('electron').screen.getDisplayMatching(win.getBounds()).scaleFactor
  const size = win.getContentSize().map(value => value / zoom)
  const regions = nativeAero.physicalRegions(layout.regions, size, scale * zoom)
  if (regions) win.nitrixAero?.update(regions)
}
const backdropSamples = new WeakMap()
const { setTextMask } = require('./browser-core')["backdrop-content"]
const backdropRaster = require('./browser-core')["backdrop-content"]
const backdropMaskedGuests = new WeakMap()
const backdropRasterObserved = new WeakSet()
const validBackdropRegions = regions => Array.isArray(regions) && regions.length<=32 && regions.every(r=>r
  && ['x','y','width','height'].every(k=>Number.isFinite(r[k]) && r[k]>=0 && r[k]<=1)
  && r.x+r.width<=1.000001 && r.y+r.height<=1.000001)
ipcMain.handle('backdrop-raster-mask',async(event,id,regions)=>{
  if(!trustedBrowserInterfaceSender(event)||!Number.isInteger(id)||!validBackdropRegions(regions))return null
  const guest=require('electron').webContents.fromId(id)
  if(!guest||guest.isDestroyed()||guest.hostWebContents!==event.sender||backdropMaskedGuests.get(event.sender)!==guest)return null
  const url=guest.getURL()
  const result=await backdropRaster.repair(guest,regions)
  return !guest.isDestroyed() && guest.getURL()===url && backdropMaskedGuests.get(event.sender)===guest ? result : null
})
ipcMain.handle('backdrop-text-mask', async (event, id, regions) => {
  if (!trustedBrowserInterfaceSender(event) || !Number.isInteger(id) || !validBackdropRegions(regions)) return false
  const guest=require('electron').webContents.fromId(id)
  if (!guest || guest.isDestroyed() || guest.hostWebContents!==event.sender) return false
  if(!backdropRasterObserved.has(guest)) {
    backdropRasterObserved.add(guest)
    const invalidate=()=>{
      backdropRaster.invalidate(guest)
      const host=guest.hostWebContents
      if(host&&!host.isDestroyed())host.send('backdrop-invalidated',guest.id)
    }
    guest.on('input-event',(_e,input)=>{if(['mouseWheel','mouseDown','keyDown'].includes(input.type))invalidate()})
    guest.on('did-start-navigation',invalidate)
    guest.on('did-navigate-in-page',invalidate)
  }
  const previous=backdropMaskedGuests.get(event.sender)
  if(previous && previous!==guest && !previous.isDestroyed()) await setTextMask(previous,[])
  backdropMaskedGuests.set(event.sender,regions.length ? guest : null)
  await setTextMask(guest,regions)
  return true
})
ipcMain.handle('backdrop-colors', async (event, id) => {
  if (!trustedBrowserInterfaceSender(event) || !Number.isInteger(id)) return null
  const guest = require('electron').webContents.fromId(id)
  if (!guest || guest.isDestroyed() || guest.hostWebContents !== event.sender) return null
  const previous = backdropSamples.get(guest)
  if (previous && Date.now() - previous.time < 250) return previous.promise
  const sample = (async () => {
  try {
    const image = await guest.capturePage()
    if (image.isEmpty() || guest.isDestroyed()) return null
    const bitmap = image.resize({ width: 32, height: 32 }).toBitmap()
    return Array.from({ length: 1024 }, (_, i) => [bitmap[i*4+2], bitmap[i*4+1], bitmap[i*4]])
  } catch { return null }
  })()
  backdropSamples.set(guest,{time:Date.now(),promise:sample})
  return sample
})
ipcMain.handle('capture-tab-background', async (event, id) => {
  if (!trustedBrowserInterfaceSender(event) || !Number.isInteger(id)) return null
  const guest = require('electron').webContents.fromId(id)
  if (!guest || guest.isDestroyed() || guest.hostWebContents !== event.sender) return null
  try {
    const image = await guest.capturePage()
    return image.isEmpty() || guest.isDestroyed() ? null : image.toDataURL()
  } catch { return null }
})
ipcMain.handle('window-aero-regions', (event, layout) => {
  if (!trustedBrowserInterfaceSender(event) || !layout || !Number.isFinite(layout.strength)
      || layout.strength < 0 || layout.strength > 100
      || !nativeAero.physicalRegions(layout.regions, [65535,65535], 1)) return false
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win || win.isDestroyed() || !win.nitrixAero?.available) return false
  win.nitrixAeroLayout = layout
  updateNativeAero(win)
  return true
})
ipcMain.handle('settings-save',  (e, data) => {
  if (!saveSettings(data)) return false
  if (data && typeof data.blockLocalIp === 'boolean') {
    const { webContents } = require('electron')
    webContents.getAllWebContents().forEach(wc => {
      _applyLocalIpProtection(wc, data.blockLocalIp)
    })
  }
  if (data && typeof data.lang === 'string') {
    const langVarsPath = path.join(app.getPath('userData'), 'nitrix-lang-vars.js')
    try { fs.writeFileSync(langVarsPath, `window.__nitrix_lang=${JSON.stringify(data.lang)};`) } catch(e) {}
    // Natychmiast zaktualizuj window.__nitrix_lang we wszystkich aktywnych webcontentach
    // (tak samo jak adblock-settings-save robi executeJavaScript po zmianie ustawień)
    const { webContents } = require('electron')
    const langJs = `window.__nitrix_lang=${JSON.stringify(data.lang)};`
    webContents.getAllWebContents().forEach(wc => {
      try { wc.executeJavaScript(langJs).catch(() => {}) } catch(e) {}
    })
  }
  return true
})
ipcMain.handle('bookmarks-load', () => loadBookmarks())
ipcMain.handle('bookmarks-save', (e, data) => saveBookmarks(data))

ipcMain.handle('history-load',   () => getHistoryCache())
ipcMain.handle('history-add',    (e, entry) => { addHistoryEntry(entry); return true })
ipcMain.handle('history-delete', (e, timestamp) => {
  _historyCache = getHistoryCache().filter(h => h.timestamp !== timestamp)
  scheduleSaveHistory()
  return true
})
ipcMain.handle('history-clear',  () => { _historyCache = []; scheduleSaveHistory(); return true })

// ══════════════════════════════════════════════════════════════════════
//  IMPORT Z INNYCH PRZEGLĄDAREK
// ══════════════════════════════════════════════════════════════════════

function _isLinuxBrowserInstalled(browser, home) {
  if (process.platform !== 'linux') return true

  const pathDirs = String(process.env.PATH || '')
    .split(path.delimiter)
    .filter(Boolean)
  const hasExecutable = (browser.executables || []).some(name => {
    return pathDirs.some(dir => {
      try {
        fs.accessSync(path.join(dir, name), fs.constants.X_OK)
        return true
      } catch(e) {
        return false
      }
    })
  })
  if (hasExecutable) return true

  const configuredDataDirs = String(process.env.XDG_DATA_DIRS || '/usr/local/share:/usr/share')
    .split(':')
    .filter(Boolean)
  const dataRoots = [
    process.env.XDG_DATA_HOME || path.join(home, '.local', 'share'),
    ...configuredDataDirs,
    path.join(home, '.local', 'share', 'flatpak', 'exports', 'share'),
    '/var/lib/flatpak/exports/share',
    '/var/lib/snapd/desktop',
  ]

  return (browser.desktopIds || []).some(desktopId => {
    return dataRoots.some(root => fs.existsSync(path.join(root, 'applications', desktopId)))
  })
}

function _getBrowserPaths() {
  const appData = app.getPath('appData')
  const home    = app.getPath('home')
  const isWin   = process.platform === 'win32'
  const isMac   = process.platform === 'darwin'

  let chromiumBase, firefoxBases
  if (isWin) {
    // Chrome/Edge/Brave używają AppData\Local, nie Roaming
    const localAppData = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local')
    chromiumBase = localAppData
    firefoxBases = [path.join(appData, 'Mozilla', 'Firefox', 'Profiles')]
  } else if (isMac) {
    chromiumBase = path.join(home, 'Library', 'Application Support')
    firefoxBases = [path.join(home, 'Library', 'Application Support', 'Firefox', 'Profiles')]
  } else {
    chromiumBase = path.join(home, '.config')
    firefoxBases = [
      path.join(home, '.config', 'mozilla', 'firefox'),
      path.join(home, '.mozilla', 'firefox'),
      path.join(home, '.var', 'app', 'org.mozilla.firefox', '.mozilla', 'firefox'),
      path.join(home, 'snap', 'firefox', 'common', '.mozilla', 'firefox'),
    ]
  }

  const CHROMIUM_BROWSERS = isWin ? [
    { id: 'chrome',   name: 'Google Chrome',  rel: path.join('Google', 'Chrome', 'User Data', 'Default') },
    { id: 'edge',     name: 'Microsoft Edge', rel: path.join('Microsoft', 'Edge', 'User Data', 'Default') },
    { id: 'brave',    name: 'Brave',          rel: path.join('BraveSoftware', 'Brave-Browser', 'User Data', 'Default') },
    // Opera i Opera GX używają %APPDATA% (Roaming), nie %LOCALAPPDATA%
    { id: 'opera',    name: 'Opera',          rel: path.join('Opera Software', 'Opera Stable',    'Default'), base: appData },
    { id: 'operagx',  name: 'Opera GX',       rel: path.join('Opera Software', 'Opera GX Stable', 'Default'), base: appData },
    { id: 'vivaldi',  name: 'Vivaldi',        rel: path.join('Vivaldi', 'User Data', 'Default') },
  ] : isMac ? [
    { id: 'chrome',   name: 'Google Chrome',  rel: 'Google/Chrome/Default' },
    { id: 'edge',     name: 'Microsoft Edge', rel: 'Microsoft Edge/Default' },
    { id: 'brave',    name: 'Brave',          rel: 'BraveSoftware/Brave-Browser/Default' },
    { id: 'opera',    name: 'Opera',          rel: 'com.operasoftware.Opera' },
    { id: 'operagx',  name: 'Opera GX',       rel: 'com.operasoftware.OperaGX' },
    { id: 'vivaldi',  name: 'Vivaldi',        rel: 'Vivaldi/Default' },
  ] : [
    { id: 'chrome', name: 'Google Chrome', executables: ['google-chrome', 'google-chrome-stable'], desktopIds: ['google-chrome.desktop', 'google-chrome-stable.desktop', 'com.google.Chrome.desktop'], rels: [
      'google-chrome/Default',
      '../.var/app/com.google.Chrome/config/google-chrome/Default',
    ] },
    { id: 'edge', name: 'Microsoft Edge', executables: ['microsoft-edge', 'microsoft-edge-stable', 'microsoft-edge-beta', 'microsoft-edge-dev'], desktopIds: ['microsoft-edge.desktop', 'microsoft-edge-stable.desktop', 'microsoft-edge-beta.desktop', 'microsoft-edge-dev.desktop', 'com.microsoft.Edge.desktop'], rels: [
      'microsoft-edge/Default',
      'microsoft-edge-beta/Default',
      'microsoft-edge-dev/Default',
    ] },
    { id: 'brave', name: 'Brave', executables: ['brave', 'brave-browser', 'brave-browser-stable'], desktopIds: ['brave.desktop', 'brave-browser.desktop', 'brave-browser-stable.desktop', 'com.brave.Browser.desktop'], rels: [
      'BraveSoftware/Brave-Browser/Default',
      '../.var/app/com.brave.Browser/config/BraveSoftware/Brave-Browser/Default',
    ] },
    { id: 'brave-origin', name: 'Brave Origin', executables: ['brave-origin'], desktopIds: ['brave-origin.desktop'], rels: [
      'BraveSoftware/Brave-Origin/Default',
    ] },
    { id: 'opera', name: 'Opera', executables: ['opera'], desktopIds: ['opera.desktop', 'com.opera.Opera.desktop'], rels: [
      'opera/Default',
      '../.var/app/com.opera.Opera/config/opera/Default',
    ] },
    { id: 'operagx', name: 'Opera GX', executables: ['opera-gx'], desktopIds: ['opera-gx.desktop'], rel: 'opera-gx/Default' },
    { id: 'vivaldi', name: 'Vivaldi', executables: ['vivaldi', 'vivaldi-stable'], desktopIds: ['vivaldi.desktop', 'vivaldi-stable.desktop', 'com.vivaldi.Vivaldi.desktop'], rels: [
      'vivaldi/Default',
      '../.var/app/com.vivaldi.Vivaldi/config/vivaldi/Default',
    ] },
  ]

  const detected = []

  for (const b of CHROMIUM_BROWSERS) {
    try {
      if (!_isLinuxBrowserInstalled(b, home)) continue

      const rels = b.rels || [b.rel]
      const profileDirs = rels.map(rel => path.resolve(b.base || chromiumBase, rel))

      // Poza profilem Default obsłuż Profile 1, Profile 2 itd.
      for (const defaultDir of [...profileDirs]) {
        const userDataDir = path.dirname(defaultDir)
        if (!fs.existsSync(userDataDir)) continue
        for (const name of fs.readdirSync(userDataDir)) {
          if (/^Profile \d+$/i.test(name)) profileDirs.push(path.join(userDataDir, name))
        }
      }

      const uniqueDirs = [...new Set(profileDirs)]
      for (const dir of uniqueDirs) {
        const bkPath = path.join(dir, 'Bookmarks')
        const hiPath = path.join(dir, 'History')
        const hasBk  = fs.existsSync(bkPath)
        const hasHi  = fs.existsSync(hiPath)
        if (!hasBk && !hasHi) continue

        detected.push({
          id: b.id, name: b.name, type: 'chromium',
          bookmarksPath: hasBk ? bkPath : null,
          historyPath:   hasHi ? hiPath : null,
        })
        break
      }
    } catch(e) {}
  }

  // Firefox — places.sqlite
  const firefoxInstalled = _isLinuxBrowserInstalled({
    executables: ['firefox'],
    desktopIds: ['firefox.desktop', 'org.mozilla.firefox.desktop', 'firefox_firefox.desktop'],
  }, home)
  for (const firefoxBase of firefoxInstalled ? firefoxBases : []) {
    try {
      if (!fs.existsSync(firefoxBase)) continue
      const profileDirs = []
      const iniCandidates = [
        path.join(firefoxBase, 'profiles.ini'),
        path.join(path.dirname(firefoxBase), 'profiles.ini'),
      ]

      for (const iniPath of iniCandidates) {
        if (!fs.existsSync(iniPath)) continue
        const iniDir = path.dirname(iniPath)
        const sections = fs.readFileSync(iniPath, 'utf8').split(/^\s*\[/m).slice(1)
        const profiles = sections.map(section => {
          const profilePath = section.match(/^Path=(.+)$/mi)?.[1]?.trim()
          const isRelative = section.match(/^IsRelative=(\d+)$/mi)?.[1] !== '0'
          const isDefault = section.match(/^Default=(\d+)$/mi)?.[1] === '1'
          if (!profilePath) return null
          return {
            dir: isRelative ? path.resolve(iniDir, profilePath) : path.resolve(profilePath),
            isDefault,
          }
        }).filter(Boolean).sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
        profileDirs.push(...profiles.map(profile => profile.dir))
      }

      const dirs = fs.readdirSync(firefoxBase, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(firefoxBase, entry.name))
        .sort((a, b) => Number(/\.default(-release|-esr)?$/i.test(b)) - Number(/\.default(-release|-esr)?$/i.test(a)))
      profileDirs.push(...dirs)

      const profileDir = [...new Set(profileDirs)].find(dir => fs.existsSync(path.join(dir, 'places.sqlite')))
      if (!profileDir) continue

      const placesPath = path.join(profileDir, 'places.sqlite')
      detected.push({ id: 'firefox', name: 'Mozilla Firefox', type: 'firefox', bookmarksPath: placesPath, historyPath: placesPath })
      break
    } catch(e) {}
  }

  return detected
}

function _parseChromiumBookmarks(bkPath) {
  try {
    const raw = JSON.parse(readLimitedFile(bkPath).toString('utf8'))
    if (!isRecord(raw) || !isRecord(raw.roots)) return []
    const result = []
    const pending = [raw.roots.synced, raw.roots.other, raw.roots.bookmark_bar]
    let visited = 0
    while (pending.length) {
      if (++visited > 100000) throw new Error('Too many bookmark nodes')
      const node = pending.pop()
      if (!isRecord(node)) continue
      if (node.type === 'url' && typeof node.url === 'string' && typeof node.name === 'string') {
        if (/^https?:\/\//i.test(node.url)) {
          result.push({ name: String(node.name).slice(0, 512), url: String(node.url).slice(0, 2048) })
        }
      }
      if (Array.isArray(node.children)) {
        if (pending.length + node.children.length > 100000) throw new Error('Too many bookmark nodes')
        for (let i = node.children.length - 1; i >= 0; i--) pending.push(node.children[i])
      }
    }
    return result
  } catch(e) { return [] }
}

async function _parseFirefoxBookmarks(dbPath) {
  try {
    const rows = await _readSqliteRows(dbPath,
      `SELECT p.url,
              COALESCE(NULLIF(b.title, ''), p.title, p.url) AS name
       FROM moz_bookmarks b
       INNER JOIN moz_places p ON b.fk = p.id
       WHERE b.type = 1
         AND p.url LIKE 'http%'
         AND p.url IS NOT NULL
       GROUP BY p.url`
    )
    return rows
      .filter(r => r.url && r.name)
      .map(r => ({
        name: String(r.name).slice(0, 512),
        url:  String(r.url).slice(0, 2048),
      }))
  } catch(e) {
    console.error('[Import] Firefox bookmarks error:', e)
    return []
  }
}

async function _readSQLiteHistory(dbPath, isFirefox) {
  try {
    let rows = []
    if (isFirefox) {
      rows = await _readSqliteRows(dbPath,
        `SELECT p.url, p.title, MAX(h.visit_date) AS last_visit
         FROM moz_historyvisits h JOIN moz_places p ON h.place_id = p.id
         WHERE p.url LIKE 'http%' AND p.title IS NOT NULL AND p.title != ''
         GROUP BY p.url ORDER BY last_visit DESC LIMIT 3000`
      )
      rows = rows.map(r => ({
        url:       String(r.url   || '').slice(0, 2048),
        title:     String(r.title || '').slice(0, 512),
        // Firefox: mikrosekundy od epoki
        timestamp: Math.round((r.last_visit || 0) / 1000),
      }))
    } else {
      rows = await _readSqliteRows(dbPath,
        `SELECT u.url, u.title, MAX(v.visit_time) AS last_visit
         FROM visits v JOIN urls u ON v.url = u.id
         WHERE u.url LIKE 'http%' AND u.title IS NOT NULL AND u.title != ''
         GROUP BY u.url ORDER BY last_visit DESC LIMIT 3000`
      )
      rows = rows.map(r => ({
        url:       String(r.url   || '').slice(0, 2048),
        title:     String(r.title || '').slice(0, 512),
        // Chrome: mikrosekundy od 1601-01-01 → przeliczyć na ms od epoki
        timestamp: Math.round(((r.last_visit || 0) - 11644473600000000) / 1000),
      }))
    }
    return rows.filter(r => r.url && r.title && r.timestamp > 0)
  } catch(e) {
    console.error('[Import] History error:', e)
    return null
  }
}

ipcMain.handle('browser-import-detect', () => {
  try { return _getBrowserPaths() } catch(e) { return [] }
})

ipcMain.handle('browser-import-run', async (e, opts) => {
  try {
    if (!opts || typeof opts !== 'object') return { ok: false, error: 'bad_args' }
    const { browserId, importBookmarks, importHistory } = opts
    if (typeof browserId !== 'string') return { ok: false, error: 'bad_args' }

    const browsers = _getBrowserPaths()
    const browser  = browsers.find(b => b.id === browserId)
    if (!browser) return { ok: false, error: 'browser_not_found' }

    let importedBookmarks  = 0
    let importedHistory    = 0
    let historyUnavailable = false

    // ── Zakładki ──
    if (importBookmarks && browser.bookmarksPath && browser.type === 'chromium') {
      const incoming     = _parseChromiumBookmarks(browser.bookmarksPath)
      const current      = loadBookmarks()
      const existingUrls = new Set(current.map(b => b.url))
      const newOnes      = incoming.filter(b => !existingUrls.has(b.url))
      if (newOnes.length > 0) {
        const merged = [...current, ...newOnes]
        // Aktualizuj cache natychmiast
        _bookmarksCache = merged
        // Anuluj ewentualny debounce i zapisz synchronicznie —
        // import musi przeżyć zamknięcie okna tuż po kliknięciu "Importuj"
        if (_bookmarksSaveTimer) { clearTimeout(_bookmarksSaveTimer); _bookmarksSaveTimer = null }
        try { fs.writeFileSync(bookmarksFile, JSON.stringify(merged, null, 2)) } catch(e) {}
        importedBookmarks = newOnes.length
      }
    }

    if (importBookmarks && browser.bookmarksPath && browser.type === 'firefox') {
      const incoming = await _parseFirefoxBookmarks(browser.bookmarksPath)
      const current      = loadBookmarks()
      const existingUrls = new Set(current.map(b => b.url))
      const newOnes      = incoming.filter(b => !existingUrls.has(b.url))
      if (newOnes.length > 0) {
        const merged = [...current, ...newOnes]
        _bookmarksCache = merged
        if (_bookmarksSaveTimer) { clearTimeout(_bookmarksSaveTimer); _bookmarksSaveTimer = null }
        try { fs.writeFileSync(bookmarksFile, JSON.stringify(merged, null, 2)) } catch(e) {}
        importedBookmarks = newOnes.length
      }
    }

    // ── Historia ──
    if (importHistory && browser.historyPath) {
      const histRows = await _readSQLiteHistory(browser.historyPath, browser.type === 'firefox')
      if (histRows === null) {
        historyUnavailable = true
      } else if (histRows.length > 0) {
        const cache = getHistoryCache()
        const existingSet = new Set(cache.map(h => h.url))
        let added = 0
        for (const row of histRows) {
          if (!existingSet.has(row.url)) { cache.push(row); existingSet.add(row.url); added++ }
        }
        cache.sort((a, b) => b.timestamp - a.timestamp)
        if (cache.length > 5000) cache.splice(5000)
        _historyCache = cache
        // Anuluj ewentualny debounce i zapisz synchronicznie —
        // import musi przeżyć zamknięcie okna tuż po kliknięciu "Importuj"
        if (_historySaveTimer) { clearTimeout(_historySaveTimer); _historySaveTimer = null }
        try { saveHistory(cache) } catch(e) {}
        // WAŻNE: NIE nullujemy _historyCache po imporcie.
        // scheduleSaveHistory() ustawia _historyCache = null po zapisie, przez co
        // loadHistory() wczytuje tylko 1000 wpisów z dysku. Kolejny import porównywał
        // się tylko z tymi 1000 i "gubił" starsze wpisy (traktował je jako nowe).
        // Trzymając cache w pamięci gwarantujemy pełną deduplication przy kolejnym imporcie.
        importedHistory = added
      }
    }

    return { ok: true, importedBookmarks, importedHistory, historyUnavailable }
  } catch(e) {
    console.error('[Import] błąd:', e)
    return { ok: false, error: String(e.message) }
  }
})

// ── Koniec importu z innych przeglądarek ─────────────────────────────

// ── Niszczyciel Nitrix — permanentne czyszczenie danych ───────────────
ipcMain.handle('nitrix-destroy', async (e, opts) => {
  if (!opts || typeof opts !== 'object') return false

  // 1. Historia — wyczyść cache i plik
  if (opts.clearHistory) {
    _historyCache = []
    try { fs.writeFileSync(historyFile, '[]') } catch(err) { console.error('[Niszczyciel] historia:', err) }
  }

  // 2. Zakładki — wyczyść plik
  if (opts.clearBookmarks) {
    try { fs.writeFileSync(bookmarksFile, '[]') } catch(err) { console.error('[Niszczyciel] zakładki:', err) }
  }

  // 3. Dane sesji: cookies, localStorage, IndexedDB, itp.
  const mainSession = session.fromPartition('persist:main')

  if (opts.clearStorage && !browserFeatures.clearPermissions()) return false

  if (opts.clearCookies || opts.clearStorage) {
    const storages = []
    if (opts.clearCookies) storages.push('cookies', 'serviceworkers', 'shadercache')
    if (opts.clearStorage) storages.push('localstorage', 'indexdb', 'websql',
                                         'cachestorage', 'appcache', 'filesystem')
    try {
      await mainSession.clearStorageData({ storages })
    } catch(err) { console.error('[Niszczyciel] storage:', err) }
  }

  // 4. Cache HTTP (obrazy, skrypty, zasoby)
  if (opts.clearCache) {
    try { await mainSession.clearCache() } catch(err) { console.error('[Niszczyciel] cache:', err) }
  }

  return true
})
// ── Koniec Niszczyciela ───────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
//  MENEDŻER HASEŁ — safeStorage + fallback JSON
// ══════════════════════════════════════════════════════════════════════
const passwordsFile = path.join(dataDir, 'passwords.enc')
const pinFile       = path.join(dataDir, 'pin.enc')    // stary plik (backward compat + migracja)
const pinHashFile   = path.join(dataDir, 'pin.hash')   // nowy bezpieczny plik z hashem

function safeAvailable() {
  try { return require('electron').safeStorage.isEncryptionAvailable() } catch { return false }
}

function encryptStr(plain) {
  try {
    if (safeAvailable()) {
      return require('electron').safeStorage.encryptString(plain).toString('base64')
    }
  } catch(e) {}
  // fallback — base64 (nie jest szyfrowanie, ale lepsze niż plaintext)
  return Buffer.from(plain, 'utf8').toString('base64')
}

function decryptStr(stored) {
  try {
    if (safeAvailable()) {
      return require('electron').safeStorage.decryptString(Buffer.from(stored, 'base64'))
    }
  } catch(e) {}
  // fallback
  return Buffer.from(stored, 'base64').toString('utf8')
}

function loadPasswordsRaw() {
  try {
    if (!fs.existsSync(passwordsFile)) return []
    const enc = fs.readFileSync(passwordsFile, 'utf8').trim()
    if (!enc) return []
    const json = decryptStr(enc)
    const arr  = JSON.parse(json)
    return Array.isArray(arr) ? arr : []
  } catch(e) { return [] }
}

function savePasswordsRaw(arr) {
  try {
    const json = JSON.stringify(Array.isArray(arr) ? arr : [])
    fs.writeFileSync(passwordsFile, encryptStr(json), 'utf8')
    return true
  } catch(e) { return false }
}

// ── PIN — PBKDF2+SHA-512 z losową solą ───────────────────────────────
// PIN nigdy nie jest przechowywany w postaci jawnej ani odwracalnie
// zaszyfrowanej. Plik pin.hash zawiera tylko: { v, salt, hash }.
// Weryfikacja odbywa się wyłącznie w procesie main — renderer NIE
// otrzymuje surowego PINu.
// ─────────────────────────────────────────────────────────────────────

const PIN_PBKDF2_ITER    = 210_000   // OWASP 2024: min 200k dla SHA-512
const PIN_PBKDF2_KEYLEN  = 64        // 512 bitów
const PIN_PBKDF2_DIGEST  = 'sha512'

function _hashPin(pin, saltHex) {
  return crypto.pbkdf2Sync(
    pin,
    Buffer.from(saltHex, 'hex'),
    PIN_PBKDF2_ITER,
    PIN_PBKDF2_KEYLEN,
    PIN_PBKDF2_DIGEST
  ).toString('hex')
}

function savePinRaw(pin) {
  try {
    const salt = crypto.randomBytes(32).toString('hex')
    const hash = _hashPin(pin, salt)
    fs.writeFileSync(pinHashFile, JSON.stringify({ v: 2, salt, hash }), 'utf8')
    // Usuń stary niezabezpieczony plik jeśli istnieje
    if (fs.existsSync(pinFile)) try { fs.unlinkSync(pinFile) } catch {}
    return true
  } catch(e) { console.error('[PIN] savePinRaw error:', e); return false }
}

function loadPinRaw() {
  // ── Nowy format (pin.hash) ─────────────────────────────────────────
  try {
    if (fs.existsSync(pinHashFile)) {
      const data = JSON.parse(fs.readFileSync(pinHashFile, 'utf8'))
      if (data && data.v === 2 && data.salt && data.hash) {
        // Zwróć sentinel — renderer wie że PIN istnieje, ale go nie zna
        return '__pin_set__'
      }
    }
  } catch {}
  // ── Migracja ze starego pin.enc (safeStorage / base64) ────────────
  try {
    if (fs.existsSync(pinFile)) {
      const enc = fs.readFileSync(pinFile, 'utf8').trim()
      if (enc) {
        let plain = null
        // Próbuj safeStorage
        try {
          if (safeAvailable()) {
            plain = require('electron').safeStorage.decryptString(Buffer.from(enc, 'base64'))
          }
        } catch {}
        // Próbuj base64 fallback
        if (!plain || !/^\d{4,12}$/.test(plain)) {
          try { plain = Buffer.from(enc, 'base64').toString('utf8') } catch {}
        }
        if (plain && /^\d{4,12}$/.test(plain)) {
          console.log('[PIN] Migracja pin.enc → pin.hash')
          savePinRaw(plain)           // zapisz jako bezpieczny hash
          return '__pin_set__'
        }
        // Stary plik jest nieczytelny — usuń go, użytkownik musi ustawić PIN ponownie
        console.warn('[PIN] Stary pin.enc nieczytelny — usuwam. Użytkownik musi ustawić PIN ponownie.')
        try { fs.unlinkSync(pinFile) } catch {}
      }
    }
  } catch {}
  return null
}

function verifyPinRaw(candidate) {
  try {
    if (!candidate || !/^\d{4,12}$/.test(candidate)) return false
    if (!fs.existsSync(pinHashFile)) return false
    const data = JSON.parse(fs.readFileSync(pinHashFile, 'utf8'))
    if (!data || data.v !== 2 || !data.salt || !data.hash) return false
    const candidateHash = _hashPin(candidate, data.salt)
    // timingSafeEqual — zapobiega atakom czasowym
    return crypto.timingSafeEqual(
      Buffer.from(candidateHash, 'hex'),
      Buffer.from(data.hash,     'hex')
    )
  } catch(e) { return false }
}

function clearPinRaw() {
  try {
    if (fs.existsSync(pinFile)) fs.unlinkSync(pinFile)
    if (fs.existsSync(pinHashFile)) fs.unlinkSync(pinHashFile)
    return true
  } catch { return false }
}

function trustedPasswordSender(event) {
  const sender = event.sender
  if (!sender || sender.isDestroyed()) return false
  const win = BrowserWindow.fromWebContents(sender)
  return !!win && win.webContents === sender && event.senderFrame === sender.mainFrame
    && event.senderFrame.url === pathToFileURL(path.join(__dirname, 'index.html')).href
}
function trustedBrowserInterfaceSender(event) {
  const sender = event.sender
  if (!sender || sender.isDestroyed()) return false
  const win = BrowserWindow.fromWebContents(sender)
  return !!win && win.webContents === sender && event.senderFrame === sender.mainFrame
    && event.senderFrame.url === pathToFileURL(path.join(__dirname, 'index.html')).href
}
function getOwnedWebview(event, webContentsId) {
  if (!trustedBrowserInterfaceSender(event) || !Number.isInteger(webContentsId)) return null
  const target = require('electron').webContents.fromId(webContentsId)
  return target && !target.isDestroyed() && target.getType() === 'webview'
    && target.hostWebContents === event.sender ? target : null
}
const lastCommittedUrls = new WeakMap()
const restoreTargets = new WeakMap()
const restoringNavigation = new WeakSet()
ipcMain.handle('browser-stop-page', async (event, webContentsId) => {
  const target=getOwnedWebview(event,webContentsId)
  if(!target)return null
  const restore=restoreTargets.get(target)
  if(!restore)return null
  restoreTargets.delete(target)
  restoringNavigation.add(target)
  target.stop()
  try {
    await target.loadURL(restore.url)
    return { restored: true, url: restore.url }
  } catch {
    restoringNavigation.delete(target)
    return null
  }
})
ipcMain.handle('browser-reload-page', async (event, webContentsId, ignoreCache) => {
  const target = getOwnedWebview(event, webContentsId)
  if (!target || typeof ignoreCache !== 'boolean') return false
  restoreTargets.set(target,{url:lastCommittedUrls.get(target)||target.getURL()})
  if (ignoreCache) target.reloadIgnoringCache()
  else target.reload()
  return true
})
ipcMain.handle('browser-find-in-page', (event, webContentsId, text, forward, findNext) => {
  const target = getOwnedWebview(event, webContentsId)
  if (!target || typeof text !== 'string' || text.length === 0 || text.length > 4096
    || typeof forward !== 'boolean' || typeof findNext !== 'boolean') return null
  return target.findInPage(text, { forward, findNext, matchCase: false })
})
ipcMain.handle('browser-stop-find-in-page', (event, webContentsId) => {
  const target = getOwnedWebview(event, webContentsId)
  if (!target) return false
  target.stopFindInPage('clearSelection')
  return true
})

// Uszkodzony plik PIN-u nie może być traktowany jako brak ochrony.
const hasStoredPin = () => fs.existsSync(pinHashFile) || fs.existsSync(pinFile)
const passwordAccess = require('./browser-core')["password-access"].createPasswordAccess({
  trusted: trustedPasswordSender, hasPin: hasStoredPin, verifyPin: verifyPinRaw
})
ipcMain.handle('passwords-load', e => passwordAccess.allowed(e) ? loadPasswordsRaw() : null)
ipcMain.handle('passwords-list', e => trustedPasswordSender(e)
  ? loadPasswordsRaw().map(({ site, user }) => ({ site, user })) : [])
ipcMain.handle('passwords-save', (e, arr) => {
  if (!passwordAccess.allowed(e) || !Array.isArray(arr) || arr.length > 10000
    || !arr.every(item => item && ['site', 'user', 'plainPass'].every(key =>
      typeof item[key] === 'string' && item[key].length <= 32768))) return false
  return savePasswordsRaw(arr)
})
ipcMain.handle('passwords-clear', e => passwordAccess.allowed(e) && savePasswordsRaw([]))
ipcMain.handle('passwords-lock', e => { passwordAccess.lock(e); return true })
ipcMain.handle('pin-load', e => trustedPasswordSender(e) && hasStoredPin() ? '__pin_set__' : null)
ipcMain.handle('pin-has', e => trustedPasswordSender(e) && hasStoredPin())
ipcMain.handle('pin-save', (e, pin) => {
  if (!passwordAccess.allowed(e) || typeof pin !== 'string' || !/^\d{4,12}$/.test(pin)) return false
  const saved = savePinRaw(pin)
  passwordAccess.revoke()
  return saved
})
ipcMain.handle('pin-clear', e => {
  if (!passwordAccess.allowed(e)) return false
  const cleared = clearPinRaw()
  passwordAccess.revoke()
  return cleared
})
ipcMain.handle('pin-verify', (e, pin) => passwordAccess.verify(e, pin))
ipcMain.handle('safe-storage-available', () => safeAvailable())

// ── Koniec Menedżera Haseł ───────────────────────────────────────────
const autofillPreferenceFile = path.join(dataDir, 'autofill-security.json')
const validAutofillPreference = value => isRecord(value) && typeof value.enabled === 'boolean'
  && typeof value.pin === 'string' && value.pin.length <= 64
require('./browser-core')["password-autofill"].registerAutofill({
  ipcMain, trusted: trustedPasswordSender, access: passwordAccess, hasPin: hasStoredPin,
  fingerprint: () => {
    try {
      const file = fs.existsSync(pinHashFile) ? pinHashFile : pinFile
      return crypto.createHash('sha256').update(readLimitedFile(file, 65536)).digest('hex')
    } catch { return null }
  },
  readPreference: () => store.read(autofillPreferenceFile, validAutofillPreference, () => ({ enabled: false, pin: '' })),
  writePreference: value => store.write(autofillPreferenceFile, value, validAutofillPreference),
  loadPasswords: loadPasswordsRaw,
  getContents: id => require('electron').webContents.fromId(id)
})

ipcMain.handle('open-file', (e, filePath) => {
  if (!filePath) return false
  const resolved  = path.resolve(filePath)
  const downloads = path.resolve(app.getPath('downloads'))
  if (!resolved.startsWith(downloads + path.sep) && resolved !== downloads) return false
  shell.openPath(resolved)
  return true
})

// ── Pokaż plik w eksploratorze ────────────────────────────────────
ipcMain.handle('show-in-folder', (e, filePath) => {
  if (!filePath) return false
  const resolved  = path.resolve(filePath)
  const downloads = path.resolve(app.getPath('downloads'))
  if (!resolved.startsWith(downloads + path.sep) && resolved !== downloads) return false
  shell.showItemInFolder(resolved)
  return true
})

// ── Sprawdź plik — tylko folder pobrań ───────────────────────────
ipcMain.handle('file-exists', (e, filePath) => {
  if (!filePath) return { exists: false, mtimeMs: 0 }
  const resolved  = path.resolve(filePath)
  const downloads = path.resolve(app.getPath('downloads'))
  if (!resolved.startsWith(downloads + path.sep) && resolved !== downloads)
    return { exists: false, mtimeMs: 0 }
  try {
    const stat = fs.statSync(resolved)
    return { exists: true, mtimeMs: stat.mtimeMs }
  } catch { return { exists: false, mtimeMs: 0 } }
})

// ── Zapisz stronę / obraz ────────────────────────────────────────
ipcMain.handle('save-page', async (e, { webContentsId, title, url, context, pageUrl }) => {
  const { webContents, net } = require('electron')
  const wc = webContents.fromId(webContentsId)
  if (!wc) return false

  const win = BrowserWindow.fromWebContents(e.sender) || BrowserWindow.getFocusedWindow()
  const send = (ch, data) => { if (win && !win.isDestroyed()) win.webContents.send(ch, data) }
  const dlId = ++downloadIdCounter

  // ── Zapisz obraz ──────────────────────────────────────────────
  if (context === 'image' && url) {
    const isDataUrl = url.startsWith('data:')
    const isBlobUrl = url.startsWith('blob:')
    const isHttpUrl = /^https?:\/\//i.test(url)

    if (!isDataUrl && !isBlobUrl && !isHttpUrl) return false

    // ── Inteligentna nazwa pliku (jak Chrome) ──────────────────
    let imgName = ''
    let imgExt  = 'jpg'

    if (isHttpUrl) {
      try {
        const u = new URL(url)
        const base = path.basename(u.pathname)

        if (/\.(jpe?g|png|gif|webp|svg|bmp|avif|tiff?)$/i.test(base)) {
          // Ścieżka ma rozszerzenie obrazka — użyj jej
          imgName = base
          imgExt  = path.extname(base).replace('.', '').toLowerCase()
        } else if (base && base !== '/' && base.length > 1 && !base.includes('.')) {
          // Ścieżka ma nazwę bez rozszerzenia — użyj jej + dodaj rozszerzenie
          imgName = base + '.jpg'
        } else {
          // Brak użytecznej nazwy w ścieżce — użyj domeny OBRAZKA (nie strony)
          const imgDomain = u.hostname.replace(/^www\./, '')
          imgName = imgDomain + '.jpg'
        }
      } catch {}
    }

    if (isDataUrl) {
      const mimeMatch = url.match(/^data:image\/([a-z0-9+]+);/)
      if (mimeMatch) {
        imgExt  = mimeMatch[1] === 'jpeg' ? 'jpg' : mimeMatch[1]
        imgName = 'obraz.' + imgExt
      }
    }

    // Fallback dla blob: — użyj domeny strony
    if (!imgName) {
      try {
        const domain = new URL(pageUrl || url).hostname.replace(/^www\./, '')
        imgName = (domain || 'obraz') + '.' + imgExt
      } catch {
        imgName = 'obraz.' + imgExt
      }
    }

    imgName = imgName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').slice(0, 100)

    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title:       'Zapisz obraz jako',
      defaultPath: path.join(app.getPath('downloads'), imgName),
      filters: [
        { name: 'Obraz',           extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] },
        { name: 'Wszystkie pliki', extensions: ['*'] },
      ],
    })
    if (canceled || !filePath) return false

    const filename = path.basename(filePath)
    send('download-started', { id: dlId, filename, totalBytes: 0 })

    try {
      // ── data: URL — dekoduj base64 bezpośrednio ──
      if (isDataUrl) {
        const base64Match = url.match(/^data:[^;]+;base64,(.+)$/)
        if (!base64Match) throw new Error('Nieprawidłowy data URL')
        const buf = Buffer.from(base64Match[1], 'base64')
        fs.writeFileSync(filePath, buf)
        send('download-done', { id: dlId, filename, state: 'completed', savePath: filePath, totalBytes: buf.length })
        shell.showItemInFolder(filePath)
        return true
      }

      // ── blob: lub http/https — użyj executeJavaScript w webview ──
      // Dla blob: pobieramy przez renderer (blob: nie jest dostępny z main procesu)
      if (isBlobUrl) {
        const base64 = await wc.executeJavaScript(`
          new Promise((resolve, reject) => {
            fetch(${JSON.stringify(url)})
              .then(r => r.blob())
              .then(blob => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result.split(',')[1])
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
              .catch(reject)
          })
        `)
        const buf = Buffer.from(base64, 'base64')
        fs.writeFileSync(filePath, buf)
        send('download-done', { id: dlId, filename, state: 'completed', savePath: filePath, totalBytes: buf.length })
        shell.showItemInFolder(filePath)
        return true
      }

      // ── http/https — pobierz przez net.request ──
      return await new Promise((resolve) => {
        const req = net.request({ url, useSessionCookies: true })
        const chunks = []
        let received = 0
        req.on('response', (resp) => {
          const total = parseInt(resp.headers['content-length'] || '0', 10) || 0
          resp.on('data', (chunk) => {
            chunks.push(chunk)
            received += chunk.length
            send('download-progress', { id: dlId, filename, receivedBytes: received, totalBytes: total, speed: 0 })
          })
          resp.on('end', () => {
            try {
              fs.writeFileSync(filePath, Buffer.concat(chunks))
              send('download-done', { id: dlId, filename, state: 'completed', savePath: filePath, totalBytes: received })
              shell.showItemInFolder(filePath)
              resolve(true)
            } catch {
              send('download-done', { id: dlId, filename, state: 'interrupted', savePath: filePath, totalBytes: 0 })
              resolve(false)
            }
          })
        })
        req.on('error', () => {
          send('download-done', { id: dlId, filename, state: 'interrupted', savePath: filePath, totalBytes: 0 })
          resolve(false)
        })
        req.end()
      })
    } catch (err) {
      console.error('[save-page image]', err.message)
      send('download-done', { id: dlId, filename, state: 'interrupted', savePath: filePath, totalBytes: 0 })
      return false
    }
  }

  // ── Zapisz stronę ─────────────────────────────────────────────
  const safeName = (title || 'strona')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 100) || 'strona'

  let defaultExt = 'html'
  try {
    if (new URL(url).pathname.toLowerCase().endsWith('.pdf')) defaultExt = 'pdf'
  } catch {}

  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title:       'Zapisz jako',
    defaultPath: path.join(app.getPath('downloads'), safeName + '.' + defaultExt),
    filters: [
      { name: 'Strona internetowa',       extensions: ['html', 'htm'] },
      { name: 'Strona (pojedynczy plik)', extensions: ['mhtml', 'mht'] },
      { name: 'Dokument PDF',             extensions: ['pdf'] },
      { name: 'Zrzut ekranu (JPEG)',      extensions: ['jpg', 'jpeg'] },
      { name: 'Wszystkie pliki',          extensions: ['*'] },
    ],
  })
  if (canceled || !filePath) return false

  const filename = path.basename(filePath)
  const ext = path.extname(filePath).toLowerCase().replace('.', '')

  send('download-started', { id: dlId, filename, totalBytes: 0 })

  try {
    if (ext === 'pdf') {
      const data = await wc.printToPDF({ printBackground: true, pageSize: 'A4' })
      fs.writeFileSync(filePath, data)
    } else if (ext === 'mhtml' || ext === 'mht') {
      await wc.savePage(filePath, 'MHTML')
    } else if (ext === 'jpg' || ext === 'jpeg') {
      const image = await wc.capturePage()
      fs.writeFileSync(filePath, image.toJPEG(92))
    } else {
      await wc.savePage(filePath, 'HTMLComplete')
    }
    const totalBytes = (() => { try { return fs.statSync(filePath).size } catch { return 0 } })()
    send('download-done', { id: dlId, filename, state: 'completed', savePath: filePath, totalBytes })
    shell.showItemInFolder(filePath)
    return true
  } catch (err) {
    console.error('[save-page]', err.message)
    send('download-done', { id: dlId, filename, state: 'interrupted', savePath: filePath, totalBytes: 0 })
    return false
  }
})
// Cache metryk — app.getAppMetrics() jest kosztowne; odświeżaj max raz na 10 sekund
let _metricsCache = null
let _metricsCacheTime = 0
async function getCachedMetrics() {
  const now = Date.now()
  if (_metricsCache && now - _metricsCacheTime < 10000) return _metricsCache
  _metricsCache = await app.getAppMetrics()
  _metricsCacheTime = now
  return _metricsCache
}

ipcMain.handle('get-ram-usage', async (e, webContentsId) => {
  try {
    const all = await getCachedMetrics()
    if (webContentsId != null) {
      const { webContents } = require('electron')
      const wc = webContents.fromId(webContentsId)
      if (wc) {
        const pid = wc.getOSProcessId()
        const proc = all.find(p => p.pid === pid)
        if (proc) {
          const mb = Math.round((proc.memory?.workingSetSize || 0) / 1024)
          return { mb }
        }
      }
    }
    // fallback — suma wszystkich
    const totalKB = all.reduce((sum, p) => sum + (p.memory?.workingSetSize || 0), 0)
    return { mb: Math.round(totalKB / 1024) }
  } catch { return { mb: null } }
})

// ══════════════════════════════════════════════════════════════════════
//  OBSŁUGA POBIERANIA PLIKÓW — NOWE
// ══════════════════════════════════════════════════════════════════════
let downloadIdCounter = 0
const activeDownloads = new Map()  // dlId → DownloadItem

// ── Sterowanie pobieraniem z renderer procesu ──────────────────────
ipcMain.on('download-pause', (e, id) => {
  const item = activeDownloads.get(id)
  if (item && !item.isPaused()) item.pause()
})

ipcMain.on('download-resume', (e, id) => {
  const item = activeDownloads.get(id)
  if (item && item.canResume()) item.resume()
})

ipcMain.on('download-cancel', (e, id) => {
  const item = activeDownloads.get(id)
  if (item) { item.cancel(); activeDownloads.delete(id) }
})

ipcMain.on('is-online-sync', (e) => {
  e.returnValue = net.isOnline()
})

// ── Proaktywne wykrywanie utraty/powrotu sieci ─────────────────────
const networkPollers = new WeakMap()
function _startNetworkPolling(win) {
  if (win.isDestroyed() || networkPollers.has(win)) return
  let lastOnlineState = net.isOnline()
  const timer = setInterval(() => {
    if (win.isDestroyed()) { stop(); return }
    const isOnline = net.isOnline()
    if (isOnline !== lastOnlineState) {
      lastOnlineState = isOnline
      if (!win.webContents.isDestroyed()) win.webContents.send('network-status', { online: isOnline })
    }
  }, 1500)
  function stop() { clearInterval(timer); networkPollers.delete(win) }
  networkPollers.set(win, timer)
  win.once('closed', stop)
}

function setupDownloadHandling(win, wvSession) {
  const send = (channel, data) => {
    if (!win.isDestroyed()) win.webContents.send(channel, data)
  }

  const onDownload = (event, item, source) => {
    if (!source || (source !== win.webContents && source.hostWebContents !== win.webContents)) return
    // Jeśli okno już nie istnieje — anuluj pobieranie natychmiast
    if (win.isDestroyed()) { item.cancel(); return }

    const dlId = ++downloadIdCounter
    let lastBytes = 0
    let lastTime  = Date.now() - 200
    let speedSamples = []
    let lastSentState = 'progressing'
    let _netErrTimer  = null   // debounce dla fałszywych interrupted (np. dialog systemowy)

    activeDownloads.set(dlId, item)

    // Powiadom renderer że zaczęło się pobieranie
    send('download-started', {
      id:         dlId,
      filename:   item.getFilename(),
      totalBytes: item.getTotalBytes(),
      url:        item.getURL(),
    })

    item.on('updated', (e, updState) => {
      if (win.isDestroyed()) return
      const now      = Date.now()
      const received = item.getReceivedBytes()
      const total    = item.getTotalBytes()
      const dt = (now - lastTime) / 1000
      const db = received - lastBytes

      // Wykrywanie zmiany stanu — pauza / utrata sieci / wznowienie
      let newState = 'progressing'
      if (updState === 'interrupted') {
        newState = 'network-error'
      } else if (item.isPaused()) {
        newState = 'paused'
      }

      if (newState === 'network-error') {
        // Debounce — czekaj 2s zanim uznamy że to prawdziwa utrata sieci.
        // Dialog systemowy (Save As) powoduje chwilowy interrupted który sam mija.
        if (!_netErrTimer) {
          _netErrTimer = setTimeout(() => {
            _netErrTimer = null
            if (lastSentState !== 'network-error') {
              lastSentState = 'network-error'
              send('download-state', { id: dlId, state: 'network-error' })
            }
          }, 2000)
        }
        return   // nie wysyłaj postępu, nie zmieniaj lastSentState od razu
      } else {
        // Pobieranie wróciło — anuluj pending alarm jeśli był
        if (_netErrTimer) {
          clearTimeout(_netErrTimer)
          _netErrTimer = null
        }
        if (newState !== lastSentState) {
          lastSentState = newState
          send('download-state', { id: dlId, state: newState })
        }
      }

      // Nie wysyłaj postępu gdy sieć zerwana lub pauza — żeby nie nadpisywać komunikatu
      if (newState !== 'progressing') return

      // Zwiększono próg 0.1s → 0.3s — IPC co 300ms zamiast 100ms; pasek postępu działa tak samo
      if (dt >= 0.3) {
        if (db > 0) speedSamples.push(db / dt)
        if (speedSamples.length > 8) speedSamples.shift()
        lastBytes = received
        lastTime  = now

        const speed = speedSamples.length
          ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length
          : 0

        send('download-progress', {
          id:            dlId,
          filename:      item.getFilename(),
          receivedBytes: received,
          totalBytes:    total,
          speed,
        })
      }
    })

    item.once('done', (e, state) => {
      if (_netErrTimer) { clearTimeout(_netErrTimer); _netErrTimer = null }
      activeDownloads.delete(dlId)
      const canResume = item.canResume()
      if (state === 'interrupted') activeDownloads.set(dlId, item)

      // Wykryj brak miejsca na dysku — próba zapisu 1 bajtu w katalogu docelowym
      let interruptReason = 'network'
      if (state === 'interrupted') {
        try {
          const savePath = item.getSavePath() || app.getPath('downloads')
          const dir      = require('path').dirname(savePath) || app.getPath('downloads')
          const testPath = require('path').join(dir, '.nitrix_disktest_' + Date.now())
          try {
            require('fs').writeFileSync(testPath, Buffer.alloc(1))
            require('fs').unlinkSync(testPath)
            interruptReason = 'network'
          } catch(diskErr) {
            if (diskErr.code === 'ENOSPC' || diskErr.code === 'ENOBUFS') {
              interruptReason = 'no-space'
            }
          }
        } catch(e) {}
      }

      send('download-done', {
        id:             dlId,
        filename:       item.getFilename(),
        state,
        savePath:       item.getSavePath(),
        totalBytes:     item.getTotalBytes(),
        canResume,
        interruptReason,
      })
    })
  }
  wvSession.on('will-download', onDownload)
  win.once('closed', () => wvSession.removeListener('will-download', onDownload))
}

// ── Tworzenie okna ────────────────────────────────────────────────────
// ── Adblock — lista domen reklamowych / śledzących ────────────────
// Zamiast cancel: true zwracamy fałszywą pustą odpowiedź odpowiedniego typu.
// Dzięki temu fetch() do serwerów reklamowych nie rzuca błędem sieciowym
// — strona nie odróżnia "serwer zwrócił pustą odpowiedź" od "adblock zablokował".
const AD_BLOCK_DOMAINS = new Set([
  // Google Ads
  'googleadservices.com','googlesyndication.com','doubleclick.net',
  'adservice.google.com','googleads.g.doubleclick.net','pagead2.googlesyndication.com',
  'tpc.googlesyndication.com','stats.g.doubleclick.net','adwords.google.com',
  // Meta / Facebook
  'connect.facebook.net','an.facebook.com','pixel.facebook.com',
  // Amazon Ads
  'amazon-adsystem.com','aax.amazon-adsystem.com','aax-us-east.amazon-adsystem.com',
  // Microsoft Ads / Bing tracking
  'bat.bing.com','c.bing.com','clarity.ms',
  // Popularne sieci reklamowe
  'adnxs.com','adsrvr.org','advertising.com','adroll.com','adform.net',
  'casalemedia.com','contextweb.com','criteo.com','criteo.net',
  'emxdgt.com','everesttech.net','flashtalking.com','freewheel.tv',
  'gumgum.com','kargo.com','lijit.com','lkqd.net','media.net',
  'moatads.com','nexac.com','openx.net','outbrain.com','pubmatic.com',
  'revcontent.com','rubiconproject.com','smartadserver.com','smaato.com','smaato.net',
  'spotx.tv','spotxchange.com','taboola.com','teads.tv','undertone.com',
  'valueclick.com','valueclick.net','yieldmo.com','zedo.com',
  'bidswitch.net','buysellads.com','buysellads.net','carbonads.com','carbonads.net',
  'demdex.net','doubleverify.com','iasds01.com','propellerads.com',
  // Polskie sieci reklamowe / tracking
  'adocean.pl','hit.gemius.pl','imgsyn.gemius.pl','gemius.pl',
  'netsprint.eu','netsprint.pl','adsrv.wp.pl','wpads.pl',
  'tradedoubler.com','valueclick.pl','adfarm.mediaplex.com','mediaplex.com',
  // Onet ad/tracking (NIE ocdn.eu — to CDN dla zdjęć i wideo!)
  'csr.onet.pl','r.onet.pl','stat.onet.pl','creatives.onet.pl','adretargeting.onet.pl',
  // Ringier Axel Springer Polska
  'oas.ringieraxelspringer.pl','adserver.ringieraxelspringer.pl',
  'ringieraxelspringer.tech','simetra.tracking.ringieraxelspringer.tech',
  // Inne polskie trackery
  'redlink.pl','bidr.io','pulsemtc.pl',
  'dreamlab.pl',
  // Targeting / DMP / CMP
  'cxense.com','opecloud.com','salesmanago.com',
  'indexww.com','connectad.io','creativecdn.com',
  'pushpushgo.com',
  // Google funding/consent
  'fundingchoicesmessages.google.com',
  // Tylko subdomena śledzenia ocdn.eu (nie cały CDN)
  'events.ocdn.eu',
  // Analytics / śledzenie
  'google-analytics.com','googletagmanager.com','googletagservices.com',
  'analytics.google.com','hotjar.com','mouseflow.com','fullstory.com',
  'segment.com','mixpanel.com','quantserve.com','scorecardresearch.com',
  'mc.yandex.ru','mc.yandex.com',
  // Wideo reklamy — IMA SDK + VAST serwery
  'imasdk.googleapis.com',
  'securepubads.g.doubleclick.net',
  'partner.googleadservices.com',
  'ad.doubleclick.net',
  'tpc.googlesyndication.com',
  'googleads.g.doubleclick.net',
  'springserve.com','springserve.net',
  'vidazoo.com',
  'video.unrulymedia.com',
  'ads.stickyadstv.com',
  'onetads.pl','onetadserver.pl',
  'adserver.onet.pl',
  'liverail.com',
  'tremormedia.com','tremorvideo.com',
  'scanscout.com',
  'innovid.com',
  'freewheel.tv','v.fwmrm.net',
  'aniview.com',
  'lkqd.net',
])

// ── Mapa stanu adblockera per webContents webviewu ────────────────────
// Klucz: webContentsId webviewu, wartość: Boolean (true = włączony, domyślnie true)
const adblockEnabledMap = new Map()

ipcMain.on('adblock-set-tab', (e, { webContentsId, enabled }) => {
  if (typeof webContentsId === 'number' && typeof enabled === 'boolean') {
    adblockEnabledMap.set(webContentsId, enabled)
  }
})

// Puste fałszywe odpowiedzi per typ zasobu — strona widzi "pusta odpowiedź" zamiast błędu sieciowego
const EMPTY_GIF    = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
const EMPTY_JS     = 'data:application/javascript;base64,Cg=='   // "\n"
const EMPTY_JSON   = 'data:application/json;base64,e30='         // "{}"
const EMPTY_MP4    = 'data:video/mp4;base64,AAAAFGZ0eXBNUzZUAAACAGlzb21pc28y'
const EMPTY_HTML   = 'data:text/html;base64,PCFET0NUWVBFIGh0bWw+PGh0bWw+PC9odG1sPg=='
// Pusty VAST 4.1 — video player dostaje "brak reklam" zamiast błędu sieciowego
const EMPTY_VAST   = 'data:application/xml;base64,' + Buffer.from('<?xml version="1.0" encoding="UTF-8"?><VAST version="4.1"></VAST>').toString('base64')

function adFakeResponse(resourceType) {
  switch (resourceType) {
    case 'script':           return EMPTY_JS
    case 'image':            return EMPTY_GIF
    case 'media':            return EMPTY_MP4
    case 'xml':
    case 'xmlhttprequest':   return EMPTY_VAST
    case 'xhr':
    case 'fetch':            return EMPTY_JSON
    case 'sub_frame':
    case 'mainFrame':        return EMPTY_HTML
    default:                 return EMPTY_JS
  }
}

const SAFE_DOMAINS = new Set([
  'cdn.office.net','microsoft.com','microsoftonline.com','live.com',
  'office.com','sharepoint.com',
  'bing.com','bing.net','bingapis.com','bingst.net',
  'msn.com','msedge.net','az-edge.net',
  'ocdn.eu','static.onet.pl','img.onet.pl','onet.pl','onet.com.pl',
  'o2.pl','fakt.pl','medonet.pl','businessinsider.com.pl',
  'interia.pl','interia.eu','cdn.interia.pl','s.interia.pl',
  'g.interia.pl','e.interia.pl','i.interia.pl','f.interia.pl',
  'ssl.interia.pl','konto.interia.pl','poczta.interia.pl',
  'rejestracja.interia.pl','sso.interia.pl','img.interia.pl',
  'cdn1.interia.pl','cdn2.interia.pl','cdn3.interia.pl',
  'static.interia.pl','media.interia.pl','platnosci.interia.pl',
  'wp.pl','wpimg.pl','wimg.pl','wpcdn.pl','wp-media.pl',
  'cdnwp.pl','s.wpimg.pl','i.wpimg.pl','i.wp.pl','cdn.wp.pl',
  'static.wp.pl','s3.wp.pl','cda.pl',
  'tvn24.pl','tvn.pl','player.pl','polsatnews.pl','polsat.pl',
  'se.pl','newsweek.pl','forbes.pl',
  'gazeta.pl','wyborcza.pl','agora.pl',
  'ytimg.com',
  'vimeo.com','vimeocdn.com',
  'cloudflare.com','cloudflare.net','cdnjs.cloudflare.com',
  'jsdelivr.net','unpkg.com','fastly.net',
  'akamaized.net','akamai.net','edgekey.net',
  'gstatic.com','googleapis.com',
  'twimg.com','twitter.com','x.com',
])

// Trackery będące subdomenami bezpiecznych domen — mają priorytet nad SAFE_DOMAINS
const SAFE_EXCEPTIONS = new Set([
  'bat.bing.com','c.bing.com','clarity.ms',
])

function isSafeDomain(url) {
  try {
    let h = new URL(url).hostname.toLowerCase()
    if (SAFE_EXCEPTIONS.has(h)) return false
    while (h.includes('.')) {
      if (SAFE_DOMAINS.has(h)) return true
      h = h.slice(h.indexOf('.') + 1)
    }
  } catch(e) {}
  return false
}

// Domeny do blokowania w trybie agresywnym (mogą dawać false-positives)
const AD_BLOCK_AGGRESSIVE = new Set([
  'facebook.com','facebook.net','fbcdn.net','fbsbx.com',
  'instagram.com','cdninstagram.com',
  'tiktok.com','tiktokcdn.com','muscdn.com',
  'snapchat.com','snap-ci.com',
  'linkedin.com','licdn.com',
  'pinterest.com','pinimg.com',
  'reddit.com','redd.it','redditstatic.com',
  'twitter.com','x.com','twimg.com',
])

// Selektory CSS do ukrywania baner cookie (blokCookieBanners)
const COOKIE_BANNER_CSS = `
  #onetrust-banner-sdk,#onetrust-consent-sdk,.onetrust-pc-dark-filter,
  #cookieConsentContainer,.cc-window,.cc-banner,.cookie-banner,
  .cookie-notice,.cookie-popup,.cookie-consent,.cookie-bar,
  [id*="cookie-banner"],[id*="cookieBanner"],[id*="cookie_banner"],
  [class*="cookie-banner"],[class*="cookieBanner"],[class*="cookie_banner"],
  #cookie-law-info-bar,.cli-modal-backdrop,.cookielawinfo-bar,
  .gdpr-banner,.gdpr-popup,.gdpr-consent,
  [id*="gdpr"],[class*="gdpr-banner"],[class*="gdpr-popup"],
  #Cookiebot,#CybotCookiebotDialog,.CybotCookiebotDialogBodyLevelButton,
  .didomi-popup-container,.didomi-backdrop,
  #didomi-host,.sp_choice_type_ACCEPT_ALL,
  #usercentrics-root,.uc-embedding-container,
  .qc-cmp2-container,.qc-cmp-ui,
  #axeptio_overlay,.axeptio_widget,
  .fc-consent-root,.fc-ab-root,
  [class*="consent-banner"],[class*="consentBanner"],
  [id*="consent-modal"],[class*="consent-modal"],
  .truste_overlay,.truste_popframe,
  #cmpwrapper,.cmp-popup,.cmp-container
  { display:none !important; visibility:hidden !important; pointer-events:none !important; }
  body.didomi-popup-open,body.has-cookie-banner,body[style*="overflow: hidden"]:not([class*="modal"])
  { overflow: auto !important; }
`

let _adbSettingsCache = null
function getAdblockSettingsCached() {
  if (!_adbSettingsCache) _adbSettingsCache = loadAdblockSettings()
  return _adbSettingsCache
}
function _invalidateAdbCache() { _adbSettingsCache = null }

function writeAdbVars() {
  try {
    const cfg = loadAdblockSettings()
    // Zbierz selektory EasyList Cookie — max 2000 żeby nie przekroczyć limitu pliku
    const cookieSelectors = cfg.enabled && cfg.easyListCookie
      ? (() => {
          const sels = []
          for (const chunk of easyListCookieCSSChunks) {
            for (const line of chunk.split('\n')) {
              const m = line.match(/^(.+?)\{display:none/)
              if (m) sels.push(m[1].trim())
              if (sels.length >= 2000) break
            }
            if (sels.length >= 2000) break
          }
          return sels
        })()
      : []
    fs.writeFileSync(adbVarsFile,
      `window.__nitrix_adb=${JSON.stringify({
        enabled:             cfg.enabled,
        nitrixBuiltIn:       cfg.nitrixBuiltIn,
        blockCookieBanners:  cfg.blockCookieBanners,
        aggressiveMode:      cfg.aggressiveMode,
        customCosmeticRules: [...customCosmeticRules],
        cookieCosmeticRules: cookieSelectors,
      })};`
    )
  } catch(e) {}
}

function isAdDomain(url) {
  try {
    if (isSafeDomain(url)) return false
    const cfg = getAdblockSettingsCached()
    if (!cfg.enabled) return false
    let hostname = new URL(url).hostname.toLowerCase()
    while (hostname.includes('.')) {
      if (cfg.nitrixBuiltIn  && AD_BLOCK_DOMAINS.has(hostname))      return true
      if (cfg.easyList       && easyListDomains.has(hostname))        return true
      if (cfg.easyPrivacy    && easyPrivacyDomains.has(hostname))     return true
      if (cfg.easyListCookie && easyListCookieDomains.has(hostname))  return true
      if (cfg.aggressiveMode && AD_BLOCK_AGGRESSIVE.has(hostname))  return true
      if (customFilterDomains.has(hostname))                           return true
      hostname = hostname.slice(hostname.indexOf('.') + 1)
    }
    return false
  } catch { return false }
}

// ── Cache certyfikatów — globalny, współdzielony ─────────────────
const CERT_CACHE_MAX = 150
const certCache = new Map()

function certCacheSet(hostname, value) {
  if (certCache.size >= CERT_CACHE_MAX) {
    // Usuń najstarszy wpis (Map zachowuje kolejność wstawiania)
    certCache.delete(certCache.keys().next().value)
  }
  certCache.set(hostname, value)
}

function _certificatePrincipal(principal = {}) {
  const toArray = (value) => value == null ? [] : (Array.isArray(value) ? value : [value])
  return {
    commonName: principal.CN || '',
    organizations: toArray(principal.O),
    organizationUnits: toArray(principal.OU),
    locality: principal.L || '',
    stateOrProvince: principal.ST || '',
    country: principal.C || '',
  }
}

function _readVerifiedCertificate(hostname) {
  return new Promise((resolve) => {
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    const socket = tls.connect({
      host: hostname,
      port: 443,
      servername: hostname,
      rejectUnauthorized: true,
      ALPNProtocols: ['h2', 'http/1.1'],
    })

    socket.setTimeout(8000)
    socket.once('secureConnect', () => {
      try {
        const peer = socket.getPeerCertificate(true)
        if (!socket.authorized || !peer?.raw) {
          finish(null)
          return
        }

        const pem = `-----BEGIN CERTIFICATE-----\n${peer.raw.toString('base64').match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----\n`
        const x509 = new crypto.X509Certificate(peer.raw)
        const spki = x509.publicKey.export({ type: 'spki', format: 'der' })
        finish({
          cert: {
            data: pem,
            subjectName: peer.subject?.CN || '',
            issuerName: peer.issuer?.CN || '',
            serialNumber: peer.serialNumber || '',
            validStart: Math.floor(new Date(peer.valid_from).getTime() / 1000),
            validExpiry: Math.floor(new Date(peer.valid_to).getTime() / 1000),
            fingerprint: peer.fingerprint256 || '',
            subject: _certificatePrincipal(peer.subject),
            issuer: _certificatePrincipal(peer.issuer),
          },
          valid: true,
          error: null,
          sha256: crypto.createHash('sha256').update(peer.raw).digest('hex'),
          pkSha256: crypto.createHash('sha256').update(spki).digest('hex'),
        })
      } catch(e) {
        finish(null)
      } finally {
        socket.end()
      }
    })
    socket.once('timeout', () => { socket.destroy(); finish(null) })
    socket.once('error', () => finish(null))
    socket.once('close', () => finish(null))
  })
}

ipcMain.handle('get-cert-info', async (_event, hostname) => {
  if (typeof hostname !== 'string' || !/^(?=.{1,253}$)(?!-)[a-z0-9.-]+(?<!-)$/i.test(hostname)) return null
  if (certCache.has(hostname)) return certCache.get(hostname)
  const info = await _readVerifiedCertificate(hostname)
  if (info) certCacheSet(hostname, info)
  return info
})

function createWindow(isPrivate = false, initialUrl = null) {
  const settings = loadSettings()
  const additionalArguments = []
  if (isPrivate) additionalArguments.push('--nitrix-private')
  if (initialUrl) additionalArguments.push(`--nitrix-initial-url=${Buffer.from(initialUrl, 'utf8').toString('base64url')}`)

  // Tryb prywatny — unikalna sesja in-memory, bez żadnej persystencji
  const sessionPartition = isPrivate
    ? `private:${Date.now()}`   // bez 'persist:' → tylko RAM, kasowana przy zamknięciu
    : 'persist:main'

  const transparentSurface = settings.theme === 'transparent' || isPrivate || nativeAeroBackend
  const win = new BrowserWindow({
    width: 1280, height: 800,
    minWidth: 900, minHeight: 600,
    icon: process.platform === 'linux'
      ? path.join(__dirname, 'build', 'icon.png')
      : path.join(__dirname, 'icon.ico'),
    frame: false,
    transparent: transparentSurface,
    show: false,
    titleBarStyle: 'hidden',
    backgroundColor: isPrivate ? '#1a1035' : settings.theme === 'transparent' ? '#12203322' : (settings.theme === 'dark' ? '#202124' : '#f1f3f4'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      disableBlinkFeatures: 'Auxclick',
      webviewTag: true,
      backgroundThrottling: true,
      // 'code' zamiast 'bypassHeatCheck' — mniej agresywne cache'owanie bajtkodu V8, mniejszy heap
      v8CacheOptions: 'code',
      additionalArguments,
    },
  })

  win.nitrixTransparentSurface = transparentSurface
  win.nitrixNativeTheme = isPrivate ? 'private' : (settings.theme || 'light')
  win.nitrixAero = nativeAero.attach(win, app, nativeAeroBackend)
  win.on('move', () => updateNativeAero(win))
  win.on('resize', () => updateNativeAero(win))
  const interfaceUrl = pathToFileURL(path.join(__dirname, 'index.html')).href
  const protectInterfaceNavigation = (event, url) => {
    if (url !== interfaceUrl) event.preventDefault()
  }
  win.webContents.on('will-navigate', protectInterfaceNavigation)
  win.webContents.on('will-redirect', protectInterfaceNavigation)
  win.webContents.on('will-attach-webview', (event, preferences, params) => {
    if (win.webContents.getURL() !== interfaceUrl) { event.preventDefault(); return }
    require('./browser-core')["webview-security"].hardenWebview(event, preferences, params,
      isPrivate ? 'persist:nitrix_private' : 'persist:main')
  })

  browserFeatures.attachWindow(win, isPrivate)
  let interfaceClosing = false
  win.on('close', event => {
    if (event?.defaultPrevented) return
    interfaceClosing = true
    clearTimeout(restartTimer)
    clearTimeout(_unresponsiveTimer)
  })
  const loadInterface = () => {
    if (interfaceClosing || win.isDestroyed()) return Promise.resolve()
    return win.loadFile(path.join(__dirname, 'index.html')).catch(error => {
    if (interfaceClosing || win.isDestroyed()) return
    store.report('interface-load', 'index.html', error)
    if (!win.isDestroyed()) {
      dialog.showErrorBox('Nitrix', 'Nie udało się wczytać interfejsu. Uruchom Nitrix ponownie. / Could not load the interface. Please restart Nitrix.')
      win.destroy()
    }
    })
  }
  loadInterface()
  let restartTimer = null
  let restartTimes = []

  // ── Obsługa crashy renderera — automatyczny restart ───────────────────
  // render-process-gone: renderer ubity przez OOM, GPU crash, niespodziewany exit itp.
  win.webContents.on('render-process-gone', (e, details) => {
    console.error('[Nitrix] Renderer crashed:', details.reason, details.exitCode)
    // Nie restartuj przy świadomym zamknięciu
    if (interfaceClosing || details.reason === 'clean-exit' || win.isDestroyed()) return
    clearTimeout(_unresponsiveTimer)
    _unresponsiveTimer = null
    clearTimeout(restartTimer)
    restartTimes = restartTimes.filter(time => Date.now() - time < 60000)
    if (restartTimes.length >= 2) {
      dialog.showErrorBox('Nitrix', 'Interfejs przestał działać kilka razy. Uruchom Nitrix ponownie. / The interface has crashed repeatedly. Please restart Nitrix.')
      win.destroy()
      return
    }
    restartTimes.push(Date.now())
    restartTimer = setTimeout(() => {
      restartTimer = null
      if (!interfaceClosing && !win.isDestroyed()) {
        console.log('[Nitrix] Restarting renderer...')
        loadInterface()
      }
    }, 500)
  })

  // unresponsive: renderer zamarł (nieskończona pętla, blokada JS) — czekaj 10s, potem restart
  let _unresponsiveTimer = null
  win.on('unresponsive', () => {
    if (interfaceClosing || win.isDestroyed() || _unresponsiveTimer) return
    console.warn('[Nitrix] Renderer unresponsive')
    _unresponsiveTimer = setTimeout(() => {
      _unresponsiveTimer = null
      if (!interfaceClosing && !win.isDestroyed()) {
        console.error('[Nitrix] Renderer still unresponsive after 10s — reloading')
        win.webContents.forcefullyCrashRenderer()
      }
    }, 10000)
  })
  win.on('responsive', () => {
    if (_unresponsiveTimer) { clearTimeout(_unresponsiveTimer); _unresponsiveTimer = null }
    console.log('[Nitrix] Renderer responsive again')
  })
  win.once('closed', () => {
    interfaceClosing = true
    clearTimeout(restartTimer)
    clearTimeout(_unresponsiveTimer)
    restartTimes = []
  })

  // Pokaż okno dopiero gdy renderer jest gotowy — eliminuje "Message 2 rejected by blink.mojom.Widget"
  win.once('ready-to-show', () => {
    if (interfaceClosing || win.isDestroyed()) return
    win.maximize()
    win.show()
  })

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  const wvSession = session.fromPartition(sessionPartition)
  // Zarejestruj nitrix-block:// na sesji webview
  try { if (!wvSession.protocol.isProtocolHandled('nitrix-block')) wvSession.protocol.handle('nitrix-block', (req) => { let d=''; try{d=new URL(req.url).searchParams.get('d')||''}catch{} return new Response(buildBlockedHtml(d), {headers:{'content-type':'text/html;charset=utf-8'}}) }) } catch(e) {}

  // Blokuj nawigację do niebezpiecznych schematów oraz reklamy na poziomie sesji
  function blockUnsafeNavigation(sess) {
    sess.webRequest.onBeforeRequest(
      { urls: ['<all_urls>'] },
      (details, callback) => {
        const url = details.url || ''
        if (/^(javascript|vbscript):/i.test(url)) { callback({ cancel: true }); return }
        if (/^file:/i.test(url) && !_isAllowedLocalFileRequest(details)) { callback({ cancel: true }); return }
        // Sprawdź stan adblockera dla konkretnego webContents (karty)
        const wcId = details.webContentsId
        const adblockOn = wcId != null
          ? (adblockEnabledMap.has(wcId) ? adblockEnabledMap.get(wcId) : true)
          : true

        if (adblockOn && isAdDomain(url)) {
          // Powiadom renderer o zablokowanym żądaniu (statystyki + lista)
          if (!win.isDestroyed()) {
            win.webContents.send('adblock-blocked', { wcId, url, type: details.resourceType })
          }
          const rt = details.resourceType
          if (rt === 'mainFrame' || rt === 'main_frame') {
            // Jeśli zablokowane przez Moje Filtry — pokaż ładny komunikat
            let blockedHostname = ''
            try { blockedHostname = new URL(url).hostname } catch {}
            const isCustomBlocked = blockedHostname && (customFilterDomains.has(blockedHostname) ||
              [...customFilterDomains].some(d => blockedHostname.endsWith('.' + d)))
            if (isCustomBlocked) {
              callback({ cancel: true })
              // Wysyłamy IPC do renderera — renderer nawiguje webview przez wv.loadURL
              setImmediate(() => {
                try {
                  if (!win.isDestroyed()) {
                    win.webContents.send('navigate-tab-block', { wcId: details.webContentsId, domain: blockedHostname })
                  }
                } catch(e) {}
              })
            } else {
              callback({ cancel: true })
            }
          } else {
            callback({ redirectURL: adFakeResponse(rt) })
          }
          return
        }

        // ── Blokady sieciowe dla YouTube na poziomie session.webRequest ──
        // Działają niezależnie od JS w rendererze — niedostępne dla Service Workerów
        if (adblockOn) {
          // WAŻNE: getAdblockSettingsCached() zamiast loadAdblockSettings() —
          // to callback wywoływany na KAŻDYM żądaniu sieciowym. Synchroniczny
          // odczyt z dysku przy każdym fetchu blokował main process i powodował
          // ERR_CONNECTION_LOST / crashe przeglądarki.
          const _cfg = getAdblockSettingsCached()
          if (_cfg.enabled && _cfg.nitrixBuiltIn) {
            // Strumienie wideo reklam YT: googlevideo.com?oad=1 (SSAI ad segments)
            if (url.includes('googlevideo.com') && /[?&]oad=/.test(url)) {
              callback({ redirectURL: EMPTY_MP4 }); return
            }
            // videoplayback z jednoznacznymi parametrami reklamowymi
            if (url.includes('googlevideo.com') && url.includes('videoplayback') &&
                (/[?&]adformat=/.test(url) || /[?&]ad_type=/.test(url))) {
              callback({ redirectURL: EMPTY_MP4 }); return
            }
            // Google IMA SDK — biblioteka JS odpowiedzialna za reklamy wideo
            if (url.includes('imasdk.googleapis.com')) {
              callback({ redirectURL: EMPTY_JS }); return
            }
            // Endpointy planowania i statystyk reklam YT
            if (url.includes('youtube.com/api/stats/ads') ||
                url.includes('youtube.com/pagead/') ||
                url.includes('youtube.com/get_midroll_info')) {
              callback({ redirectURL: EMPTY_JSON }); return
            }
            // Doubleclick — wszystkie żądania (już w AD_BLOCK_DOMAINS, ale redirect zamiast cancel)
            if (url.includes('doubleclick.net')) {
              callback({ redirectURL: EMPTY_JSON }); return
            }
            // googlesyndication — analogicznie
            if (url.includes('googlesyndication.com') && url.includes('pagead')) {
              callback({ redirectURL: EMPTY_JS }); return
            }
          }
        }
        callback({ cancel: false })
      }
    )
  }

  // Wymuszaj nagłówki izolacji między originami na odpowiedziach HTTP
  function applyIsolationHeaders(sess) {
    sess.webRequest.onHeadersReceived((details, callback) => {
      const raw = details.responseHeaders

      // Sprawdź content-type BEZ kopiowania — unikamy drogiego spreadu dla każdego zasobu
      const ct = (raw['content-type'] || raw['Content-Type'] || [''])[0] || ''
      const isDocument = ct.includes('text/html') || ct.includes('application/xhtml')

      // Dla nie-dokumentów (obrazki, fonty, JS, CSS z CDN) — zwróć oryginał bez kopii
      if (!isDocument) { callback({ responseHeaders: raw }); return }

      // Nagłówek już istnieje — nic nie zmieniaj
      if (raw['cross-origin-opener-policy']) { callback({ responseHeaders: raw }); return }

      // Tylko dla dokumentów HTML bez nagłówka — dopiero teraz rób kopię
      const headers = { ...raw }
      headers['cross-origin-opener-policy'] = ['same-origin']
      callback({ responseHeaders: headers })
    })
  }

  blockUnsafeNavigation(wvSession)
  applyIsolationHeaders(wvSession)

  // ── Wyłącz Service Workery YouTube ───────────────────────────────────
  // YouTube rejestruje SW który przechwytuje fetch poza zasięgiem window.fetch.
  // Electron udostępnia ses.serviceWorkers — możemy natychmiast wyrejestrować każdy
  // SW z youtube.com zanim zdąży przechwycić ruch reklamowy.
  function unregisterYTServiceWorkers(sess) {
    try {
      sess.serviceWorkers.getAllRunning().forEach(sw => {
        try {
          if (sw.scope && (sw.scope.includes('youtube.com') || sw.scope.includes('youtube-nocookie.com'))) {
            sess.serviceWorkers.unregisterServiceWorker(sw.scope).catch(() => {})
          }
        } catch(e) {}
      })
    } catch(e) {}
  }

  // Wyrejestruj przy starcie sesji i przy każdej nowej rejestracji SW
  unregisterYTServiceWorkers(wvSession)
  try {
    wvSession.serviceWorkers.on('registration-completed', () => {
      unregisterYTServiceWorkers(wvSession)
    })
  } catch(e) {}
  const adblockContentScript = path.join(__dirname, 'adblock-content.js')
  // Zapisz inline skrypt z aktualnym językiem do pliku tymczasowego
  const langVarsPath = path.join(app.getPath('userData'), 'nitrix-lang-vars.js')
  try {
    const lang = loadSettings().lang || 'pl'
    fs.writeFileSync(langVarsPath, `window.__nitrix_lang=${JSON.stringify(lang)};`)
  } catch(e) {}
  writeAdbVars()
  const toSet = []
  if (fs.existsSync(langVarsPath))         toSet.push(langVarsPath)
  if (fs.existsSync(adbVarsFile))          toSet.push(adbVarsFile)
  if (fs.existsSync(adblockContentScript)) toSet.push(adblockContentScript)
  if (toSet.length) {
    // Electron 35+ — użyj nowego API; fallback do starego dla starszych wersji
    if (typeof wvSession.registerPreloadScript === 'function') {
      // Usuń poprzednie rejestracje Nitrixa żeby nie duplikować przy restarcie okna
      try {
        const existing = wvSession.getPreloadScripts?.() || []
        existing.forEach(s => {
          if (toSet.includes(s.filePath)) {
            try { wvSession.unregisterPreloadScript(s) } catch(e) {}
          }
        })
      } catch(e) {}
      toSet.forEach(filePath => {
        try { wvSession.registerPreloadScript({ type: 'frame', filePath }) } catch(e) {}
      })
    } else {
      // fallback dla starszych wersji Electrona
      try {
        const existing = wvSession.getPreloads().filter(p => !toSet.includes(p))
        wvSession.setPreloads([...existing, ...toSet])
      } catch(e) {}
    }
  }

  // Tryb prywatny — wyłącz cache i cookies całkowicie
  if (isPrivate) {
    wvSession.clearStorageData()
    wvSession.setPermissionRequestHandler((webContents, permission, callback) => {
      // Zezwól na podstawowe uprawnienia, blokuj śledzące
      const allowed = ['media', 'geolocation', 'notifications', 'fullscreen', 'pointerLock']
      callback(allowed.includes(permission))
    })
  }

  if (!isPrivate) {
    const topDomains = [
      'https://www.google.pl', 'https://www.google.com',
      'https://www.youtube.com', 'https://accounts.google.com',
    ]
    topDomains.forEach(url => {
      try { wvSession.preconnect({ url, numSockets: 1 }) } catch(e) {}
    })
  }

  setupDownloadHandling(win, wvSession)
  _startNetworkPolling(win)

  // W trybie prywatnym webview używa sesji 'persist:nitrix_private'
  // (persist zamiast in-memory — inaczej wbudowany PDF viewer Chromium nie działa).
  // Prywatność zapewnia clearStorageData() przy każdym otwarciu i zamknięciu okna.
  if (isPrivate) {
    const wvPrivateSession = session.fromPartition('persist:nitrix_private')

    // Wyczyść dane z poprzedniej sesji prywatnej
    if (browserFeatures.privateWindowCount() === 1) {
      wvPrivateSession.clearStorageData()
      wvPrivateSession.clearCache()
      wvPrivateSession.clearAuthCache()
    }

    blockUnsafeNavigation(wvPrivateSession)
    applyIsolationHeaders(wvPrivateSession)

    // Each window removes only its own download handler.
    setupDownloadHandling(win, wvPrivateSession)

    // Sprzątanie przy zamknięciu — usuń wszelkie pozostałości
    win.on('closed', () => {
      if (browserFeatures.privateWindowCount() > 0) return
      wvPrivateSession.clearStorageData()
      wvPrivateSession.clearCache()
      wvPrivateSession.clearAuthCache()
    })
  }
}

// ── IPC: otwórz okno prywatne ─────────────────────────────────────────
ipcMain.on('open-private-window', event => {
  if(trustedBrowserInterfaceSender(event))createWindow(true)
})
ipcMain.on('open-normal-window', event => {
  if(trustedBrowserInterfaceSender(event))createWindow(false)
})
ipcMain.on('quit-nitrix-shortcut', event => {
  if(!trustedBrowserInterfaceSender(event))return
  browserFeatures.approveQuit()
  app.quit()
})

// ── Druga instancja próbuje się uruchomić → otwórz link albo nowe okno ─────────
app.on('second-instance', (_event, argv) => {
  const url = _extractLaunchUrl(argv)
  if (url) _openUrlFromShell(url)
  else createWindow()
})

// ── Strona blokady adblock — używana przez oba handlery nitrix-block:// ──
function buildBlockedHtml(domain) {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ta strona jest zablokowana</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
body{background:#f8f9fa;color:#202124;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:40px 24px}
.wrap{max-width:560px;width:100%}
.top{display:flex;align-items:flex-start;gap:24px;margin-bottom:32px}
.dino-wrap{flex-shrink:0;margin-top:4px}
.dino-wrap svg{display:block}
.heading h1{font-size:24px;font-weight:400;color:#202124;margin-bottom:10px;line-height:1.3}
.heading p{font-size:15px;color:#5f6368;line-height:1.6}
.domain-tag{display:inline-block;background:#e8eaf6;color:#3f51b5;border-radius:4px;padding:1px 8px;font-size:13px;font-weight:500;margin:6px 0 2px}
hr{border:none;border-top:1px solid #dadce0;margin:24px 0}
.details{font-size:13px;color:#5f6368;line-height:1.7}
.details strong{color:#202124;font-weight:500}
code{font-family:monospace;background:#f1f3f4;border-radius:4px;padding:1px 6px;font-size:12px;color:#1a73e8}
.err-code{font-size:12px;color:#9aa0a6;margin-top:20px}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div class="dino-wrap">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAACAMElEQVR42u29eYBlWVEm/kWcc9+ae9be1V29L9UL3TQge1UrAoIiymSJAi6IIKiAgoOKTnbOKOIgKIjMNOAwLApTNaOjorJJdynQKLSydbH33l177pnvvXvvifj9cc65976sZrYfSnfWDch+S758mfXeizgRX3zxBVBbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVlttD1uj+iXYjO+pArMgHDnk398TW4ff5/3f4idvAbDtpAIA9s4o5qDhKbV+WesAUNtD7r2bJcxcSYWD798vmCP59v8qJcwcYuwNv+fIScXBGQHVgaEOALX9K1lwwhNbCdtOKg4dcA/6KIDPH3/XGK6d3rGItR2wo7a5dWxHlue7slQSNInJWoOGhVFVSUiM4cwk6LHqqUFv7XjS7qTbp1on3d35iakdWfrpNzxxRf1zn2kH1eD2WwjYLz5jqINCHQBq+/a8N7NKuOUWfrCT/cW4PvmLx/3irhUzcol0Wldps3WxgC6jbmOHWrsTDTuujZYVZohNoMaEZyX/rlN465nD/QKIAMgBBuAGOWBWyMiAgLuN1dOc8JEG4f4G51/YMmG+8vVfuOKBMwLDQfW/6PYbFXNzUr+NdQCo7f/F6Q/fkFffpHN2v2Nq8aLte/NG8ji1jcdJq32FNMy56Ix00W4D1sKxAnkGSA6kDoAKLNRa0naDtN0yNDJikSQGpmXQajGShgEzwRiCkJIjwsA56g2UswwYKKHnDFLnkDqDTBXaT4FsbQWgb1hDXzCQT0w2+VPvf/UlX/tuorwICLPKwC2MG/e7ulyoA0Bt39JmGfv2Dzm9AjT16EN7+5Nbvlds8tQ8SR6l7c5WbXVBDQbYQTQHRBz6olCBSZQmRhLaPp3Q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/WIjdV9Pvzw4/vbbsL7xUzX772CvPAKtT/o6ANT27TYFzRzw2cG2K6Gxm7DRrgeSk1djZOfe8XE77nZnq1lCXdPqdpNu02BUiVvWKpGSSiq5G+i69nUl76frlvK8yc2lk8fW7+8qBh/7GJa+ZdUy62GDK49A65q+DgC1fYcyhJkjoBN7/Xu6/0bIHH17HXFWwbjRwwZHjkD3emeP6zprqwNAbQ/J9zcEh+o3YqDYaNuOlM68dy907kYMjyPWVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttf0r2P8H6E1cz3VawjkAAAAASUVORK5CYII=">
<link rel="apple-touch-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAACAMElEQVR42u29eYBlWVEm/kWcc9+ae9be1V29L9UL3TQge1UrAoIiymSJAi6IIKiAgoOKTnbOKOIgKIjMNOAwLApTNaOjorJJdynQKLSydbH33l177pnvvXvvifj9cc65976sZrYfSnfWDch+S758mfXeizgRX3zxBVBbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVlttD1uj+iXYjO+pArMgHDnk398TW4ff5/3f4idvAbDtpAIA9s4o5qDhKbV+WesAUNtD7r2bJcxcSYWD798vmCP59v8qJcwcYuwNv+fIScXBGQHVgaEOALX9K1lwwhNbCdtOKg4dcA/6KIDPH3/XGK6d3rGItR2wo7a5dWxHlue7slQSNInJWoOGhVFVSUiM4cwk6LHqqUFv7XjS7qTbp1on3d35iakdWfrpNzxxRf1zn2kH1eD2WwjYLz5jqINCHQBq+/a8N7NKuOUWfrCT/cW4PvmLx/3irhUzcol0Wldps3WxgC6jbmOHWrsTDTuujZYVZohNoMaEZyX/rlN465nD/QKIAMgBBuAGOWBWyMiAgLuN1dOc8JEG4f4G51/YMmG+8vVfuOKBMwLDQfW/6PYbFXNzUr+NdQCo7f/F6Q/fkFffpHN2v2Nq8aLte/NG8ji1jcdJq32FNMy56Ix00W4D1sKxAnkGSA6kDoAKLNRa0naDtN0yNDJikSQGpmXQajGShgEzwRiCkJIjwsA56g2UswwYKKHnDFLnkDqDTBXaT4FsbQWgb1hDXzCQT0w2+VPvf/UlX/tuorwICLPKwC2MG/e7ulyoA0Bt39JmGfv2Dzm9AjT16EN7+5Nbvlds8tQ8SR6l7c5WbXVBDQbYQTQHRBz6olCBSZQmRhLaPp3Q1uk2prc1MTmZUGekgWaL1TQtKGECATn7dz9XQAgQ+K94ootABYBTqBNR5wT9XGUwyGlp1dHySm6We4SVPmFtLUO6spI5p9+AwafZ0se2dvCpky+94C7ZmBkcgNRlQh0Aaos1fQVMmwHMB7/rg4+SkfaznLXfL63OXh2bsGoNiHMQiYiooJ8TUkeUEO2cTnDR7g7t2dPB9p1tjEy2kDQNnCE4BfoOcALkAogGhy+cXuGiw/u/aCgIaFEmhDSfATb+EgRVQJ2I9AeC9fXcLq8DC+uE+aUBVufnV7Oc/p776X+f7LgPzYdywce7my1wi9QlQh0AzlLHB+MQufgGdK5/39VpZ+ePSKv1Q9Lu7sXIOJRzABmYkQuBkAsjFUoscP6uFi6/ZEQvunCUpra2YdsGAwHS3H859c4N8k4NIigphAgKfykVxx86/SkEBw3fp3AZb0MhSnBQiPp/ADGBGMoMZQNJM0cra86cXmWcPp1i5fj8wiDHhzXH+3DrrR+lQwdSLQBE6L9M56K2OgA81NL8mRspOv7UxbNjgy3f9QODduenpN3eJyNTFlYAZEpEjggsCkLfEaDYs6uJ6/aO49LLxjC9tYWcGf0M6KeAE4UwwExQLh1ZCYhRpnB4Gj7x3YZAEH/uQQMAVS5jwIgZhSoEPsCAADakxkCYob2+2MU+Y+F0H0unF7+8cjp9n9y98H688do7fUxUxqFDhAMP3tmorQ4AD3PHv5Ji225y77vPWx/b+TNZZ+QFOjKxR1tNAH1ANScGU8IkTgnrDt0O4erLRvXaR0zQ7j2jUMtYGwBpplAEIN9Q4bRVx9/o6ErBWSvfKxyfHiQL0OHndFopDTbiBZXbCNedKET938kGyoYdwXHGhheWgKX75lcXl7P/3jt2/Cb8yiM+HQIB4dAhrgNBHQA2XarfuOy9l+nUtp9z3fEX6Mj0hJoc4NwBBAIZSgiSKTDIsW0ywaOuHcfV10xgZKqNQQasDwCFgth7vjCgiC294NQ0nMZrta6vBATEk7/yvTNO/MrPVJ0ceBDAMGQC1cc7BUAaAkcIBgoYUrENEkNk18E4df+yLpwe/OXS/YtvxSsv/Sjq0qAOAA97m1FTOv47L9PJ838pb4+9QMem2uAUgMsBMBlmSljFKbCe0fbpBI97zKReeeUUcaeh632hNFcYBshwcFgFiBWkpEQQgoKUJNT64s9Rf7vq0FQF9x4k5ce3dnwl3xVQ8vB9NVNQhUr4HPmfUf+7KphBvPTIoUJVISpKCTsmNZlNaHE+w9KptY+sHlv5rfxF5/1dyAgMgJpxWAeAh82pz94PSEcufvPW3tSlr5GRyZfo6NYRoAdAHAgMZpBl/6leyzE1bvCEx0zhymsngSTR3rqQA8CGAA6nPNOQQytTcPwAx7NCiaAxAAAAVxx4QwZwBiZAZ6b4GA4MGml+Z5QA5FMABVXu0yIIKLQIBCgwhPAdUYDEWcuUNxu8Mt/HykL6305+9dRv4Rcu+mKRERyguiyoA8BD+HXcd7PB4RtyBSi57q9eIiOTvyFjW3fB9AFoDqiBMUQMwDK059AywKOvHdfrv2sr2U4T6+sOIgJjGcoECqczsW/JBQf3yH4g8DkiBYEK9N5XBkUG8K0wgQdx8GEcYQPY5wLmMAQCxrRf1f9NsTdI3um1khUU19Xfio9B6FiIDx+ODJG0m7xyatBbnh/8weItd78er79mAaqMG29E3TqsA8BD8NRnARR278HHyNiWN+rEjidqooDmGUgt2AAEooShuQL9XPdeNkqPf9I2jE+3sb4myFVhTIWmG07+oo3H0WE96EfhfkcVkK9a9/OZJcCDOvyGzODBAD48CCgYMYNquYAhHMBn7dUyAEUw0KGggBgQNGYJ4pLEmLzVwNLp9TsXji7/2toP7PxAURZQnQ3UAeChYPtutp69t69lrvu3szKy9dU6NmaBQQ5VhmEGQWGIyJDqek5jbYsn79+OCy6b0F5fKM9VrSUiQyDfr1cQUREAAFUmAvmT3RF7LJ9ZvQN7LCBchwRgsOLwBSZQBf1QLQGqTowH6QIAEIUqg6r3Axg65VHNHqoBgKq3NwYDwKMCoIgk+N8nSqSOWi2bCmPtVO9/HD1y7FV40YV319hAHQC+06e+Z/EdOuCSi995nZs6750ycd4jYfoKVQGT8chdAO8UwHqKKy4fx2OeuBONlkGvJzCGwIk/zolDik0IgcDfF5B+VQa8I5N3K/ZO76jMFIZOdK6UANEJeSPT70znL8BDlJf6IJkBKkBfNSAUp3n1dC+erwwVnmUolefQ4mcBzyvwmYcIE5RGOmZ1vn9y8Z7Tv7zyg7vf7bGBg6ZuGdYB4F/ZDhrAf+jslQdf5iZ2v0HHJjvQXg7AgA15qiyDLEEzhyYBT3jSdr3gsinq9R1UFJywP+h9dVCk+OGk9/S64j6P9iuDPMhHFJ1eYlsQUHAABbEhIFAA8Agq5E/a4iTf0B0YOp2JzsgEMFTfU+nQ8eNEOgQmIhCDqgFAijCqPoqgDAJaCSDFfxUQdTk1EptSE6sPLL731M3/8ErMPX0eN6vFDZTXn8s6APzrpfx7XjFBU9/7hxjf9WPaMoDmDswGxIEnT2DLkPUc01MJnvw9uzEy0URv3cEkBA41PnGg0YYUPvb0/elO2BAAwqUGTIBKZwlUX+X4uNARKDoGlVr+Wzh8FQOogoDVxw6n/AGg3AD0YcPjqgFj6Fr83SpFMCh+D2mJJ2gIGqpQcQrLDiMjduX4yteWv3LnT/Re8IhPB1ygykWqrQ4A/zLOn1x409X59MUf0Ilde0HrOdSj+yBSMBGIlCyTrmU477wuHvfdu6EKpJlTa5mocHwOpJ5h0E8ISkT+9PdOrmAmKQk/AfUnKJHPCqonfTjhh8qBAkz81gHgDFxAQzehGhiq11ULTYFI/1WtBgAdek5EZ6aNoUDK7gAVz6VQJVUtGqsKgWp8BsnR6tiV5UE/vX/hFUs/uOftvkiC1rhAHQC+/a/RvlmDw3N549L3PDubPPe/6sS2cUgvAyEBh+KdSMFMZAi6luLSK6Zw3WO3YzAQQFXJEhFRPPGVDKh0fFJwSM3J313pAiiYAojnWT/CSlSUAOFxHFyJH6QECFlA9SSXDc6vGxw93paNj8EGpw7XCZVWYPgfnYEFDNf5xD7LodDqRPi3+/ag+BYhadE6rP6+LHciZHhALazfee9bFp6+5xUAvAZBzSCsA8C3DezDIQYOOL70T16pW87/PR3pAJI5EJtY6wdHVmIm7WW4+rotuPwRW9Fby8EMJUPkHxb6dwwlDp92jhkAwtQeleO2Af1XIoqpvkBVTTh6GRAiz9ArSoNQ5wNldhD/NfwgNT9tKAG0LAFQyRxiRoCK4wdysmclhoSgCDIixePI+MDn25yeFiS5g+Q50sEAeZohyzLkgwzicuS5gziBigRQ0mcCzARjGcYaqGWQNWo7LZc3R+zK7d/8i+bnvv7jC79zYKkGB+sA8G1F+s0Vf/wmt3XvL6IhDuoIzBxObsS6n5ihvQzXPGo7Lr5iCutrua8MQnvPp/2BpRPS+yG0v9r3D89dOGwFI3BUlg0afs6f8JW6f0MHoHB0HiYA4cGyAJxZFhTtyKJVN5zqFzW/+lOfDINN0A6Awg1SDNZ76K+uY32lh/5aH4NB5h3fuQIIBAAYjRmV/x0haFDIYIgqEGSMg4ScJqaszq98tv3AXc9Yfe2Bk3UmUAeAb4/zX37wbbLzspeqyTJIbot6v+jVM8gQdD3FNY/aifMvnUJvLQVbjiCfEvkMIKb1RDH1LU98LTCE4SAgHE9iKhl9BCixgpUKgtBQyzA01Sjc9j9HVZAPsTMQyoYqiQeR2lvVDizAuxLp9xieAgwYwzCJLwCyQYb1pRWsLq5hfdk7fZpmPq0n8k5d0pyVuPg0EpGGAKdgQllh+ddLYYikEnoEgXKskml7NOGFpc+3v37/967+9oGTHhGpMYE6APw/Or+94r1vdzuu+RnlfgZVC2YaqvnJE3h0PcMV127DBZdNo9/LYW082Sl8eCsOHy4pIPlUcfgzLovTPQYIeAocF84dv1fJFirIe5gf2KgRMAT6bQTqCmQ/lBSVgECxCxFcii3BWIBU0F9dx8qpZSydXsPaSg9ZmoUTHYCNWVKJIBTNQoofQtUYAKLDGwKM8XHRhI5JiYVooBBTwSAUkRyjo1aPnvqHnV++7Yb7Hnduiplavvx/ZbZ+CR7c+eny9/+R2773hUr9DKol2Bd7dQTv/P0MF1yxBedePIXVlRTWGjgJaX1cq+FZLRTmdvyF8R9LVQ/yqQTHlngi+zE7JVIVUJzEU1KohLqfSzIOpGgJFrMB/sBViFDp6Fo55Teg+/GbceYAVVRfAaiALcM2fLo/WF3H6ROLunhymVaX11VFCInxDt+2SpXuvsf1tDxyKHQEgjMDSlzCKTAMGIZaw2QYsKwwJHnOzDnAcfDIqRa0ZBAbt7aa6c4d33XKXfUmHHjaS3HwoEEYZUDdJqwzgP812u8Hesyl773J7bz6xTD9FNCGl87moXYdGYb2c+w6fwKXXrNd80FOvuZnf+LHk79yGXv8FE53CqczhkuBAvnHEAZAZaofMQHecDv0//1lmSUM1fy8oYYnDPXugWqMi4w8gk0AY4GsP8DysSXMH1/CylIPKqJImJDEamF49AdDuEFl0VD4ez166MuAgKPCEmBDHDGWYQnS6rTYZP2PD4iuzK3dLlmmoiCBes3DIFHmFBClHKZpWydOPmPlZU/5mwgKhiSmDgIVM/VLECz0+c2l7/1d2X7VL8AMMqgkKOB773A+lTXQLNOJ6Q4uv3YXpb2cKAJ3FVR9qFUWWmQCKibpPGuPYu9dFb7dJyDSeBsoNPz8zyqENHD8icq2HakgTAWigvQrqRREWyrdM57PuiELiP7hu3AwTUJigfXFFRz96jHc+5UHdP7YEga5IyQEarLHNyCB1KOhWxD6CUXSFH5T/B6BUKb7FE99a4gaBmgYoGlJm5apZY2bGO1wW9L3NROzvdFq7oLLlal42Ye+QKqaWMoFj7/u+37wnUfv+Hz+ZzdeO37FBf/Qn50FHz5cB4G6BHgQ5+c9b/9Z2Xrpq9QOMoizYBNOrwoqTQx1gmbT0kVX7dR+Pw+f75DfCwokngL/Fgj5e3B2EoKa0tdCuk3FRF3k1XKY/lMUgaIcufX0PyHvyep/EdTza6lCzSXv7Dp8ypdlz1AiqBLq7waBSbFycgmn7jqNpYU1n5UkTNRtIFJ3IlOvkjlQkESIwz1avABa/gUR7CtTfqKEgYSBBgOJJW0apsQyEkM0kjBsK7k1I7o2bzevR9pXJ4pMgUyAVAlO/W0SGMoHeT49eeHXjq3/DObm3rz3e55x2dJnn0Djj/rkp1VnmageK65LAACR22/2vPXpsm3v32i366A5g0OOzhGC5pjOK3JHlz5yN0ZGmxCnHgwzXHYFCypvCf4RRwZfoAtXM4Zi3Lek/ypzMcATHudZfkH4M757YoaHgYhIfTCILMGKOjCGpb7LdJwC5ZaQNLzg0MqpJZy88yRWF3veK5scCHpSpO/+JA/PTBJ5AhrRiqGMosgM/AkdcFCwr/Vhmfypb/xlyxJahrVlGa2GocmmzRtWtueZvMaNjf/ysdOLLlW1mQj6oshEkYqGIKDIBZInLZKFpbue+o2/vepNz/tjt20w9r7U5a/ddu0XvqY+nJ31QYDPctCPgQOuuft1F8vkRe/TzojApb5IR+XkR6zlGZrmdM6FW9EZbSEdOE/OEYKIBnVcr8PvCrVcfz1XkAunlBPACSFXIFd/6crHabyv+lxOQaJe69/fR3BKxfO74nd5Uo6Dkmj5N4mGEkL9MI6/7fk64hRsCEkTWDu1jDv+4U7c+U/3YnU1AzqJX0Qi4p2/gt5XTvsym6ANA8akIahpfKxSgDSJoIYAS0BiFA0GWgboWEbXMkatobGGkS2jXe0yf+XQ46+a71rcOkqgsYRpNGF0rUHHcggc5OEIJlgmtm4gZnz0gs+f+6inXHrpNwb9rPXP48x/8bWvPb1ZhKQ6AJzViD/txkw7m7jsoI5vn4YMFByW5cUeuIb2OhE0zTG2pYvpXaMY9DJ/AouqqkBU4UQLh1UFRBTOQV1YuxcuNTiqDxoxcFQe45/HP5eGx7nyZ9Q7tlaew6fu/jm0QMYl6Hhp/L4LnQXxUlya+wPQNgmDlTXc/dk7ccc/343V1R6obX2BqE79qV8UJmFYp5AE0eGBYlQAQK2M+8cA4cNGOPnJGA/4NRjatIR2cP6RBmO0aTDVYN09PkJj7N4PAJ1m9+ZOunLfjpEWj1uSkYTRsYyWZTR9uQATvpihtt3UhdbUDAB84dQT/iuaExedOzj1R0QQ3LLP1AHgrK37bzE4dMDdf8kPvlUmzrsOspaDyYRav/Jhj2wahUkYOy/Yonnmu0rBBSiewl7IgkpHjie3QP2JDXVKFE9xCSe4iO9ThVOcKqd5ccr7LwqZQPVEL7+v8VTXkJXA/y3xvgI/EEAdwA0G4HDsyw/gjs/cjeXFPtBOgIS1PO0LoQ4qgLzCkeP3FeDQqIwIPxfNSA9Lkp/ToYBqMHmUP6b9LcPUNoyOJYwkjLHEYCIh2TrS4fZg7dRkK3nH7Kzy2x910dJYo/m2XVOTNG6NG0t8wPBZABdZgGGACUySkSTmSc9/1au6T33qGx7or7pDrT3d56394+WvpBsO53rzPlsHgLOx7j98Q55c8vafxNSFLwQNsgogGkCrsudPTECeY/qcKZAxSDOFqKp3Pp8iFCe8+nVbDho29AAOIOdPccpV1amqU2heZAwK54KWvnhmm5MiCKiLQcI/txYpv7/PZxQhS/DliM8ExEsPlJmBKMT5XphtEFaPLeLOT38Tp+9bgDYNqEFhQ7B4BaKY6uuQDnAFqazIhOoGSVEN/5CqSmAB/BEZ8r39EAS0lZB2EkI3YXQTxmjDuIl2Q7aOtrlp0p//7UdeehL7b+FZVR7Jl97cXF/43O7psWSUkY0kjLZlNC0VGQB7LIbEpapNu+vzlz7xQlWQS5c+jZWmNEaa/3H5M5c+gW44nOvBs7cbdhYGAGXgR1xz9+sudp0df6AJO4iYSEcrCn6Uarya52iNtTG2ZUTTNCdUW3lKYQkGDdXbRbofU/vye+SEyEVMAGEBpwI5qFLPB0cOJ75DUSaQCJXbeJSo0PSv1vwABEpFNhBOfttgSJ7i/i/ei/u++ABSAaiVBEZShaiDigh4CfoN9fBjTb9BJaAMFrENQqqVlh+YNQJ/2mCgaYhaBmgzaSth100on+y0zbbJcetWF1/776++/L8dPKhm7ga/PHXuUY9abxP/SNdl9+/cOpV0Ga7FcE2GNpjUMsF4prbXMe10koXRzsVE0NXl3udkJSWTjCedxL17/qMXjmPGjzHUAeCs6HocIkA5HTn/XdLdNgLph4Zb4PeX5Jlq3YrJXVOaO6G4JkvEE/xirZ575Bm5qOauKAGoUrvHx6qIatycEzMDV9T1QC6KXMWDg0LFaT8E6ImqCwdtxAE8FqAqQhrrfohCRUACJA3CyvEF3PnZu7A8vwbqJgDDp/vsnbQU/q4W9IVaZ6H2HwqRqqNrIRVKG4DB0BEIg5Ce4suKxIBaiUE7MWgnljqdJm0ZGzXbp6fsCMud2dLCj/yHR17xuoMHD5oDQRZ8jkhmVfnX9l70NZevPb6R9v5q21jXbJkYM6NNS0liyHCkDofirWGwJI2LAODLx5e/Ilm6oI7UTHQvGp2S3w/dAK4DwOZP/Rk44Oz5N/2Sju95ItDPQWRKRDuC/5XLPEd3cgRJuwGXCST01Ic27Q59BfLORnQeAbUHyIFI/KmvEdkvEH5/XYtTPJzqw50FDZmBFthAgQFE9k+47UTDYJLg2JcfwANfOQHHDGqa0NILDqyRyBCbw1XdXwnSIA8mIFasF6UKYTmg/1pM8kWOPxNgSGEJahmwJGIJYgmpET1h3OBvtbf88nTx3kf+9qMuPzhz8KA5sGG0NwaBuauuuuc3L7/w+02e/WAnzz44wnS8SdJvkIiBn5rmAOamnIwRgF/7xO4Fde4e7liStSSzE6M/2b91xzOI4M7GUuAsAkBmGZiRsa3/4aLV0V1zsOqgYkAGlYmUSq7gKftkGN2t48gzV5DMXEgXScoRVYrNA0EliGjBI4J6zT7VIP7B5D2dVSFEwmGyJQBo6qduKOCPRCaU2RLKkip/h7UYzS9ENSj09ZuMdKWHE984hkE/A7W94xe8fBrOjwoeIW3kNFazg1DXsw63BasVVJDziPLlgcIQ+P0kidXFhNwXRfQLvSxf6NjGP66srn3uw0954gPxz5n50pcah666Kn2wd3OOSGYOHjSYmcGbiP4CwF/89Ke+NHUKeDxn7gltxjMEfE1fvXpyO8FYDuC2t9+W4UVX3Ac7ci0HoSHbsP/p5Cemr8ITTq+dbXThsygAXEkAyerEe39PRrZ04Ho5TCTro1L6V4gymaC9bRzGGog4MDMk8HWL+XQNRB+JCzxKP4jKGqGREEj+gf6uXtYrxohQJZdJd6UICeNDiGo7VdK+hta7FwePY72+9540CMtHF3Dq7tNQC1DLeFCicPxqXb+B0QetkIU2YgAPVvNjOPUnDGVTEVNVJhIidjBTA8NP0oSewAxZYzPfHmktf+/f/tOX2g371zsW7vrA26+6an1WlefozLn+cL8DgB/77D/fsJibmW9I/pgVsuf1GzSxDjL9XNRpTgICEydFrOvhKAxByDAGxpnp1nkTR+XXifAaVcThoboE2DQ249l+jQv+4Dk6vvsHgEEODsFvaOa9Yk6VEtbu5Ahc7jC0186LVGpocRd9+fJrKFUPvX2Ex0F14+Njwq3x+QotzNBmjHyBMPsuJR9AQ+dBK71/hNP25NeP4uSdJ1QbfrZWRTac1mciJKUjY7idP7QYLC4fG1ohsqH+9+WAkioY6gVLEAaaiDIiyhXGKRJHppkbu9NZe1k+Ovkc7U780erOy//pJ//h9pmY7j+I88vMxz52zk9/8esHtTnycZ6ceqm0R64X8NYMSPLcca5CWQiaObASP/K6uLwCVa9YQmqwbh2PNl6x8qltV59tpcBZEACUcOh23b79VV3X2foftZEo1HE5OYLhMbhI/xWh5miXYLjoaPk6nSKPpqjpyx59rOcjGUfLClk1ugxV6/4qSh/QflL17uWq/f2NX8XvDeQeJajzpYi6HMe+ch9WTq0GhB8Yru8rJ/bQ9aFL33+gMOBQ3QpYvU2V27QhE2CN2X+hhqZhs5FA4VQ1E0XqBP000/V+X1dWVtzK8nK+pnoZjYwffOGtX3xdke5XnP+5t956zci28z7lOiMzy/3MLS0t5au9nvSyVDNR5CjeHyiAwSBfLz7yqyuCLAVbq0RMIgTutJudhN5Qg4Cbzg4xMCenO5e/Ujq7L4TrOxAN/7s3fvhVQQxtjXdVcomoe8HKE1GK95XgnKqrsPY8Gu+nZV2RCfgMoDixRUIWIMUJrpFJGIPO0MkfswRUGH3hMbmAjUHW7+Pol+/zTMVWAlUdpusSHuQy4n3Fkwok0IVIcpBmgOThKwtf/rY6V1KZQjCo4AUaAkTcXKRUEAOLJaZOFbkqZQpKRbgvYpd6mTu1tJzbrVt/9UW3fflnDx044PbdrHbuxhsx89HPjnN78s96zfZ5D5yaz5ZFTd+pHTjlVEGZKJyIiniWBjJBV3E0xnnuiUEvB4wNYktkZM05Hms8rX/LlmfQgbMnC9jkGIAH/jpbZ3f0O5OvVpMLoKHnT8OEnyoOIA52rEucWIg4EHNYXlm2CtTLTRXbrDQMuAkNyeYVip1hHLhA77Qqqh+VQiLvWMNcfxDnCAN/KEcGK4s4/N+CpGEwWFnD6buOQYiUEiaNT0pVqO+MpV5+ypgBMLPX9opSRgqYoLStwcFNHC6KWYD4WKAOEBcmliWe+1zqIGgxUOV1DvzIkgt/nE8YFCwgZgVUDDmV4wuLbjxJ/uNLPvXVv7zpwzcexdyc5J/5oddidPLCkydOpKuqjYx8RtUXYKDww0AKcjHvyXOkmny9qO6c22b7faA5QlGqiEFQSmC68pt6Mz6C/ZCKzmkdAB7OwN9g5KbXSHfnhKf7Glv4Jz1IARxo643RLpxzhRQACtU8DA26FVvttMAEI2BHBfAVWuyFo0dNPY8YFiQUP6mncSWP7xZEbCBMEUaVH40rwhSwTYv1hWUs3nsSmrD6LkG1rqk4vf9jfO7OZJBYhkmYNQP6q6B0dQkuf4A0O8qk92nev9eoy8AqkBywDAGxNm2bLS4W0Ult2D3aSLZpqzmKboeVAM0HgMt9/5DARGGvEZejzRJhzUB0yhXKGnqkHpthHWS5HR0bHaSLL8fc3GueddttuwZqX7K4sChrTpI1UfScwliDDBo4FP65nH9vDPf76cTqyv1Hw2tgs/42pA4gE9SXGEpkqE+5nbDXud7UCyzNv0tvhsUNyOsA8DA+/Vs7Xrsn60y+GJTG0z8QfjaUAPGkEgW3E+VmAhEltlSB3MtsGRSo8Sg3cwgXeUUBPwRBHapIbHm0X4vNvxVVvIpqVVwXJNFpQlewbBwACpimxfrpJSzefwpoWAwLgaPSm1MFkYNhg0aTiQxjfRm0tvRNSge3mvXFzzbWF/5Z15e/8oz3vez0oQoSnv1vXum9M7ON43vP3bJqm5dqe+Qx0rKPk2bjUWg3d2u3y8gzaJ4J+VDnh5SZSlpRiKYUO3AB14DfdsQLK6vaFPc8Al6z2rNP5amxseWFRddTcF+AdafQ0KVJAz/Dz1CoStIkk67e+cx/vvOutwM4ePD9DVn40XPNwEG8vHNVTYTgEqWmfa3ejPffeAvSzd4WtJv99M+673il6+zoQPrV07/iGKjoX/uM2LQ7JGHKJ6reqhZerOQXUakygSQo86p6ze6QPXuHEyIJkt9CCtbh3ycoUPko8VV8U0LaHFf8xu+7eKaL2mZC66cWsfzAaaBpUdQD8dSPGl1MDrZhkbSsWTkFWlj+HGWDD9rB+l9t+8InP3f34bm+AxAb7oc82sa48hDh9q3fmiJ75UnFzIweIUoBPBC+bgGArbMHR9ZH8Jisu/xsdNvfj5GRC9BsAb0ewpgEq1crCEP5Xu0orwwYkghUmKXfF4x2z3nyJ7507Rq5Jxol7Qm07xQDJ5opKMtdkCEv8BpShYOxZLPs79/59pdkAOO7T792K7Geh4GgyKUKwRUylErOU82L+un0T8zNnb7pxv2wwObNAjZpAJhl4IC0p39516A1+UJwqmGldOV4BlVp/0X6bxim0/JEfvKza1wNF/GQCoLT1ZKcouKPlg3w8NOIM4a6oeVIFb5dUSZUN3BUK3eNjxNww9L6qQWsnFgEmo1QGxSFTTmd02ga4oRp+dQJ6p3478nawh/3/tPTbyVAMwB3A8BBNbj9FsKRk4qDMwIi/N9p6geQ4tAhxu1bCVee1JMHDqwC+DiAj++cvelXFrfv/D7tdn5c2q1nYHTc6mAdouqIvRi6kB+gUp/uFEq/HkAlMWQYIs/KLPb2Byn1nPBAFWmcngQjy6Uos2KnhFKhRuo+PAh/aVNPX2Hb2oGoY/LioiAu3jsoGJnRJGm8+p6Du9+D/ff1N3MWsDkDwL79jMNzeTp28c9Ka+sYXD8Hsa2oVlLF8bXQ+xIBd1qAtVBxfgpQAkGPg7cKSv3+AkTXQqZHtbJDR8gXtTELQKVlzt5PJQIIQoHRV7k/wlBc2ZMrINO06M8vY+X4ItBKKn4YlugZCGzTEluYhZN32vWVt5sTd79r7QM/djzK42L2ZosjJxWHZgSBZ78h5vxfWMFhcpW/hWJAODp3wzqA/wHgf3T/8NA1lPZfoSPtF9DYWIL19dBfiSosvoUXyyQvRAJGbwBDeFoquMD1B8hFaEg4JWYSErYHiqhaa3h5cXF6ff7vFtWLJRkrj0FDAUkEbLnoBHMRYFkH6swkX7x9sPJjRPgjvXnzZgGbMQAQDu93U1PPG1tsj74I7NQvyUJ5Qlb7/1SlqgHcaSN+jrhy7BY8mLhqQguYP+AAvi8QiMGVDBxVQt/QaV4u16xcapmchEYDIuMPCjKJQW9xBavH5xWNpJJyKEDqYKwh22ZaPnk3ry7+7tg3PvOe+Q+9YhnFSQ/FHAnmbviX/UD7V8kVGcLBQ4yZGV0j+gKAnx7/L3/zh7mT38Do6LOVCegPcgFZrQilRv4RA5z3ekgYj8uZNE1TpATKQ8s0j2KphewgQUEOSceadPnDd77sOSdeYl6cAO/IjMkf68soprB6bYj3VLwxYmES+0q9Ge/G/s3LDNyEAWDWAJSvjLz5B7S5dSckc17oo1r5azy1KitxxNfvjYaX8PF7+IpknFULHEBj36+Q+/WrMCmOvov6bUFVZew4Hh+UhbWo86tYRHi+kDUU2EMk2TUM0tV1rB4/DSS2DCciAgOgOW7s4sl5Xjn6e+27b/vDpb962cJ8PO3n9ruhk/5fNyYrDgQnmp1lXHklLR34vn8C8EOjH/jYD+ho9z/SxMTlsroqoc3BxULCKCysioGvxygvJibjKJJUdhsEGISVqD9Aa3HlXRmAt7/4pnx+4WPjhh/4LuSAGMtUQDLD8wxEwrIuYkbNVflg7CkJLX9IFYZo8wWCzUgEEgBwzYmfVpOUb6xSibgV/N/K1J8oyFrAhmEZDAteSaV1JUSFtPawMFbJPIvqPJUB2soqq8opV11boyi4/hq4AsWEnzXIe32sHjsNWBs61AJAczQ6zM6yPXrfe0a+/qVHpm/7rt9c+quXLWD2Zgso+dP+IbIdZ25OcOCAw6wyVHnluU/5y8aXbn9MeuLUH+RJwq7V4BzqcnhMNdPya6DAQIA0qP/mGnEDqswo+j1haptsFpe+8fgv33GLHJwxRKQNnHyiaek25HDMptx9rKi2ewsOE4wBJfYlGE7k6gDw0DVlYE66k79+pSajTwKlCpAJ+65KhZsNFUN8f6nR8BTAWE8D5UprlGuqNW7Q2XC/BG+NrL4gsqHF6qpij124r/gqKb9xHqB4jIhfyTVIdfWBU1AbWlYiCmZHyag1C4vfaN191zPytzziJxb/9N/c/ZB0/DMCAQmIBAcPmtOvedFK/4ef9HI+cfLZlKXHaLRjRDX3QJ4nJTp16lSQqSIT7/gSzn7/VXmvSJSYKXGDt33oD14xeMvIDqsg2K7+MBL4H05aQ58FLRcj+CQMyrIGpSZ/39JfjV5aMDPqAPBQthsZANKxHS9Aa9JCnKsM+9BQmC9z7nL3XbNBsYtWLs8od8/F7DLy2bU4fcqetue5UxEQJADkouUyDgnrNbWs7YdkNcPEoIcXiKHOYfXYSShzWJMrDkmTWK0xR+9558g//u1j1t/zpL/BjBrMzvJD2vE32oEDDqqEm2+2qz/6vX9u7r/vcW5p5R9kfMzm0DwHkIGQgcif+uqdX0slgjJIA1AV2IR54fTJC04uvBuq9Irve0t65+w1E5zkz0QGiJJBdwzQ/MzDPb4RHh50PJI0O215AQDgljoAPNQDgAOuT1xj9IfVI3hFLVmo2ujGbC4Ab8xQa+M4XXnCi5YDcd4xFZ67r3EldgCgtNDBLbICFOIcUCmwA5SZgC/hwxGkQ1lAKby7evw0RIO6hUiO1qgxK8sn7b3fPJC/7bqfWfrEyxYwowaHyGHuYbjwgkhxww05Zm+2Sz/1Q3etffSTN8jJU++V0RErRLkU+opa7FuUSiZW1PEU3pykRY1B/z8fedWB+Te/5eUNEOmWyW88PRl32yVVR2xJmglIRInLnUnV/D+8EYyBgo39ET2IBm6oMYCHsB00AKk9b+bR2hy9GJJK4d1UweRJN6zEDW+2NSBj/AcLG1ZlY3ifrVRr/TKOUJHmV7bjlY+rMN+UhsW0Nd6n5fYfUbA16C8sqssyBZMC5Kg5bs3xE5+2933zcel/fdIhHFTjJx7p4f/hnLshhyrj91/d6/3A439cjp98mxsdK4KAwKNwxZQllavOQqAXJAnbUycXdh498Vao0vz8FxxAaNjsp2EAqCiZlnKnBUjqK4ZSyLQSUAAmIhlAuG0uyUZGHkeAbrYhoU0UAG4PfPrxZyEZJw/lV/pq+mCjr3EkWEDW+IWdldq8eioX220xdEJgqJaHhHo+3BaUjwkLrcNIX+X5JaiBaCn2IaJkDNKVVaRr60HjGsK2bZMH7njnBW992/7Bf3vGNzF7s/XI/iZaf00kECEcPGj6z37Sz+l9979VRketxiAwtPvQ3w6SZkX63+iv/c4dv/zjJ2YO3Zj8+7nD+anfmtxrOtgnPVZ2ziDpeOakDMLxUGZmG0oBgqigaUAN8xwAwNbNJR66idqANzpgjjXpPF29VleltRb7eZVOwFALEKo2Ceu6NaqBlW1Cqmhd6ZkoAooslEiL3kKYD6qiywEviCSCcqIv/LLYomRDkg7QX1wCmARsiR0Ze/q+V6c3Xf/Gb4A8VXeONidFlchHRlWTEv1C8meHG7pzx4uxvJwrYKvzjMVshoqg2TDm1Km7Lz5+6q1fUKWX3bJfDgEY6fZ/3nQokQFyiFodmQBZVbicPFWhOuQxHONZwRgQiMzTvvZmNOkGDOoM4CFnswyQNqZnL1XT2QtN1Y94FfP9VDmuh1VuEMbeTaCCSay9K2i/VjVui/up6BN48zN+BarvS/Eo7zOM/Jf/L04freSeKujPLwIEh6TJZpBL6647fjL9z9e+0SP8Qv93VN2HaRAABKom+6F9L+FTp95NE2NWVfOStVMptliFiKi5uvgbX/jlH1978dvfbvfvP+yO/da27ablfhQZKYgNHFTHplU1JeS5ksjQ54LiGGXMylQZAxHT0EvOP7f1SADYTGUAb6Z/hzS7N6A5mkDFbTh6K9eIhqWvQxlgbajLq3vvhs/5st6sSmMSlIhKvdyYTNJGxbxh9Tylyl+h5dgwM/rzixDJHRpdY3r9xebCfc9Y/8CT3o1ZtQ8rhP/bFwT44s985MV04tStOtq1quq0qt+gmqPdscnJk3+39lM/9D4cPGhuuvQlSgTttlZebidpQpw6iquaJ6ZBbk09V1tIVaolYgHQxBdZFIK2IW7Zp262MmCTBIAr/XvVGn2iclLmhhvmbiLcFrw2ZgcAM2lot8W7VCud/ojYD/u+DweFXE+B7hcrs+NpH075Ajks2AFFIkJQBxAbpKuryPs9h2bXmLW10407v/LU9f/yxI9456ccZ5sFntSRubnU3vW1H+bllQe43WSvtRSAGUvEy0vZ+NLCKwjQ2a23E/bDHZ/duqM5Ki+TVJRBTOpUqQlMjAH5OkVchiDlmy46tNA4OAkFmSYfADYRNXgzBAACDjjg+kRM8zFADpAyhri/qjgjHdDKm1xRBAIVpEEtavYhpu7GtRcVHexym3DxGwPftFiQVUIANJScMEGyHOnykqDZNWZldaHxwDe/r/dnz/jMWev8VWDwoJr1n/+pY3Z+9afICWCt1xeAOjTbpjl/+g2nXnzgczio5saTc0oEHZ1Y+41kHBPIyY8fO0fUmVYaSQhpDxQ11dRPWMaPClXfeR/LPQ7AfM3qezs7wzZ1qgPAQ6P+JwBoTH/fheD2HmjmZ0rLpnxVQaNcVlml31B4KSpLbLWSCqBKNy0l7Qqy4Eb2npSze9jIDYBodVduiSkQIV1cUNgGTL/XS47e+czewe/9jOfxn8XOH+0AOdx8sx386Pd8JDlx4nfQ6VglydCy1p469qV9n/nbf68HD5rZ2/cTDkBOv37yysa4vkj6ECgMCKBMoFu2EbgPZCkAAUnZmalgRoHRWWZ1yNVxx4zYjj4aAHBoc2TPvFn+DdqevE6Tbqj//w8zh2Kqh4vx3FJ7r6gYyzpdMdxdQCF/GWF9Ggoglf8Osfyo0lpUAMYgX11TERUjyo3V48/rH/reW8uavzafeu93OKjmgts/NcsnT34e3RFren03udx76Yf+4A8GAHDjlYeVAB1p999gumjAlY0ZzQFs2wbKlwFxgDjawMNGsVIJtHGIQ2AYCvvYzYQDbBoegJC5EpwMp/uRqgeUtDovsIcz+AFSwPFDQzmVmLABEKze1Lgou9JP1o3QYQkzVTgEFNaP5YP1nKlhmsfvfVHvnY//M7z4pqQ++R8MDziEIzfemDW599M2d2xPHnvjqZ941idwUI3iAOgAXP91o9/fmNTvkzV1EC8EQy5X2C5oekLRW/SE4rgnXcMW1mJQoywFQq6vosoQQmLxyIADSB0AHkIAoJrWlUFjk4dq/FK6oyLWq2UOUM0INo4KVFgAWpnZG3LtjQMlGzQAikpSS8mZEmcAwIx8ZSUn6iRm/vib1t/3pD/CrFq8/SVZ7fEPYlu3Eog0W8YVyTfv/PJ1J+650af+NypmoPf84u626eS/B5CqVN7RPCdMbAc6BAzWiIptqhVClz/tY+/BTyb7oQ4/n5wRoHyFvhHtMBxEdQB4SACAL07AyRU+mmslRdfho7qC1vsTP7g4c+nBFYx/qNdcFezc8Nih871MJLQU5vJ7BIoZAATgiRky6OcODWuXHvib7F2PfFWo+V3t6Q9iN99sccMNefd9//MGNe69CQY/8elXvaoHADdijokgW7ef/A92Ky6WvjguuCAEDABs2w2VFYLL/ekvDqgEAopYgFTIH7F7IyDkAhjdMdjSOBf+l9YB4Dtr3iFHR5MxJbPTa9dXif6Vhq4Oyffpg6zBrhzjxfWq/H48xCsS3sAwPFBB+8PhUQQIKmNTqQIskg/EmpVTd7Xv+vrzoUqYu0WAs2c55f+t8ydvfde1/VbrY4106bXLL3zuZzB7s1UcAM0hP/3qkSc0xvBLGCCHwpSki1xBFti5BejNQ0VBziFkAVosbFRo0QYs9sDHuK4EB2ea1ABwqU8+6wDwHbYbCQD6rcnd4Ga32E+ngd4ZZ3aHqZ6FIHeZRxT4PjY8loayBlSG+cs2YlUaVIvRYt2YLWg5BxAEad0gU7u60B9Znv83yx85MI8DfotR7e3f4uR/w9uucued83emv3xL/wU/+jrM3mxncYMAwNFXbe+O7nLv4DaRy5SpKPAISHNgbJtixILWVv14poSlik4ITlDuWUe5f626/FjICxB4icarNgsQ+DAPAFf6hdbObAU3bFh4T+XbJjQ0/0vVYX9sOGiVHvzt3FDkF3KiiuFlW2UJQDrMGCyjA0rymqhDCmOX5//t0p886TbM3mxx6ECd+m+0We/8k69/05WDiy/8qB0M1vbe/c/PldlZBm6RGwGmA3Bj40tvSqZxhaTIWZW1SMEImoJk93mArECznPxmVSlGtYtljzrk9FoseiwlnghCALPPAE4+/DO1h/kwkJ8ApPbYRSDrV9Yxo9ivRSHvrjbeqYDqdGhGtzKkg3KiZ9iNiSqnfIDyCkJhaDeRqoJpuISgUrzT6wLmCmN58a6/7b338X+AfTfX7b4Hdf5Zi7kb8unfe9tli7vP+RtItn3im197/Ode+9sncfBgRP3ztV9r/1Bnu75YepqTwqLy9pHLAGqAdm8FVh8I7E3nPwYuFPkxQxO/i6DY3Bq14Jxq2DRKEICVLvYfv4d/ANgUbUBN13cqmUoaXz3AK+DdMCmQzthvX031z7h/aPDcQ/sUWcLVfR/lrEHIF0q0wf+AKFvixVOr3fXTLwZA2L+/Tvsf7OSfm8u7b/j9qxZ2bP2wjo6c273/vpee+JVXfRqzN1u9/YBiBvLAyyb2NKbkHWAIXJBYrQi4oO+g2/YAXQDrqxgWc9SwYhlBV3xIZijsSg0xwpcGhAwgonPu/Am0aO7h3wnYHDwA2+oOj9xIefJrRbaToptunOuXoRq/Av9XOwI0jPgFyVot5D6IHmTgsLLK11coTIKcjD157+zSn3zvHdh3s9n0k33/t3bTTQnmbsiT337LI/rbtn1EJyb2mG987Q9WX/7Sm3DzzVbnbnAA+EYCTe3q/bEd52nXh1LBAA270wEgA3TPeUDvdBj+dFBxCKubK/W+FqVA2P3uuQHhNvkdqIRMAdGJ8yfQ2hSu8zDHAHzy3mjsqdToQLmzl85Iv+lBSvzqAAhVacOVsqCKH1IlgwibxhUbt41W4k1QJSZSB9Oy/MCdt/XfP/sWzBw0OLS/rvvPBPyy9utf/9hs6+SfydapHc177/qr9Odf+nI5eNBg/w0OszA0h3z91a3fb27RJ7g+cgZs+f6HNzPNoCOToB1j0KWjvkITVzh0UfdXggCdIevst5tDg3qYA6DcxMXtDtBbrEuAh4Ll+VixZrLItwVDyL6GGYCq1ncx71nhglcH/zeWDg+mJ1hOAlVFB4dHjuIEIDN4bRnNpZO/BBwONT/VLb/4YgbAb/R3fu9Z6fYdH8mnR3fwXfd8tnn/fc+X2VnGzIzofu/8Sy/vPr+9U18hKeXk1Ma3mqJEMAAaCHDB+YAsgAYpSHIvFOX86U8bEkGK20VCBkBh5ZCKUpAhBnJVJupmprETAA4deHj70MM8AMx4VxeyGOLpFKgencHhrRB8UMztSoXGpxhWA9yYNWwkBG30eRqSEqOSMORgu4YWj//p6sHv+Tt/+teof0RQcfAgY+6GPPn3b3rx2sT4n7qRzmjj2PG7r7rvxLOX5uYWAUBvJKLDyI//1MQjutvym2DhNA91v1BUBiMS+JOemsC5W0BLJ/3vcS4sWYm1f6z5w8kvBemnnBkTBbkCKyRfaCj6S2tdAJiZqUuAh0IUMxJPcVRQ/aFd3RUJMNK4fddn7S6wwuJ6Wd3g52FabwgbjCtCi62eOJMtWC4dVSSWeGW+T6dWfxVQwt6a7ONj+EEDIkeAa7zh938znZ54rbYbMKcXT0wcfeBZn3/d3P2YmTF6o+dH3HPr2NTk7v5BM0odl5Ej2kD9hpd7oFUHnLcH6GTQpb6v1HSI4bchGyzLAXUBQ3AKdeozAweiQpoYaEM3i+9sggOEyJyZTeuGkTs9M3svHDfQQR8MH6jEjg2/o1zgSxsygwrNyM8LkGPbYbNy+k/S//nkr2HmENfAH3yb79ABN/X0542ZN7z5A+n2La/VBqtdWlnoHr3/mSfm5r6AgweNHjokOAAmmqUt16UHk2m6NB+QI1UTxzGLNUwSZvsdA5edCyzP+3aNk0j+8U4ekf/4FU/+wvkR2oIAXJEZeG4AEdBsjNYg4EMlACArKb+iZVgjxhmMnLh0b4jgI4DLgUYDQ0DSBuWwYWywMh9QjQl0xtyAgsmYhWO91umjr0vr0z/U+7MGc3P55Mt+/cqlC7b+ids+cQ2Q57w0WBu7/4FnzL9u7rOYnbU4cCDHLCzNIe//wm+/vbnDfE8+QM6qvuyLu9urL3kvA3btUkww0bFVnxGIQ3WPG8nwGHAMCqTDVGCfDRRAcdgIoyDlNgDccnvdBvzOm8//MST9Xc7m4owoUEV54+08O/Mx8coZcwPf4jrpGRQCAI5Mh3h18U+X/+czvnnWn/4zMwYEpbm5PHnt7/zo8iU7PilbRq5Bljm70kt3nTr2gwuvm/v03tnZBubmcg3Ov/Zz3Rubu+zPuAHl5GDj20LVFF4CRysj6OXnES2f8qe48ztH/UKBQPSpkH/K0947fMEJcOS7BTFDcP7HIQCIEwDYX5cAD4F/hFO3ga+Pci6gwuoYChKl5C8oBIBC/K/y2DPqxYqM78btHlXeQJw4ZDD1lpTXlt6CoeHhszXlP+R27vj+jv3133lrvmvyT1zXjilUzFq6vuuBUz9wdHb28DNvmu3ceOWVTmf3NmgO+dLPdF7Y2SmzDpprpiYAdoWoc7lvjYD1DNi6BZhOgOWexsWvcAoVrwKG6NSuivpXSgGnQ2VBURI4CvvIFehvDvz2YV4CHPIOZWkw5OA+HaQKCBdAvKFLKtA+ojIAVLYADJ/ytBEZoOEkYGhDQMwIhGzH0Pz9/9g79JTP+N97FiL/s7P+oJmbyzs/8arrj5+36x1y7vR1cOspjG3Y1WzpktPHf/Cbr5v7u1cffP349buPp5d+8h0tmvvy2smfmX5Wd2r9nTmR0xSGC/1lFJOWJIH4TwRKAVy1B1hZgooSQRQiVAh+VLCC6jrn8pRHJSBUmIExMBTxXfx+gCsf3uXcppgFYM0eCHvlK8u4uXJJlcAQ7lMByKAQ5MtzjwMYM1zXq2pYGRS5gVT5FXHIKAyJYJiIAlZyApv13uUAxf5bLID8LHN+i7m5nAAkr/jNl/e2j/6OTnVbyNYGaDSadLp34tLTx59z++u3fea3HvVr51wwsbg+dvt97Wt/+ePzyz8+/uT29PqfoAPVAYg4yLhxCL7xLScAhoBeCpyzDZhqAEdPg5g0TPopieeIaCT7RIZfLB08yUfVKalQQREuMAAXBKRD+Na+9OoM4KECAmb946QaVHuoPJdjf54KjTcN7Hzv9FGTi+DbgC4HrN1Q46OSKcRIwlTpAQxNGlUowwprLFZPLZsT9/05AODwLXIWOT7jxhsVRPnYj/zCRat7drwp27HlWWpzcLqeSbPZTBZ6J59mT7/gL18/deT3P7R0/hUj+dqW+06M7HvRwfuOf3rqCd3J3p+jbbp5CmFWpgeBXao7lpAz9Oo9oIVF/w1P+KFw8itUicQvYKCI7IPi6a4qoJjma9EBqHQEXAkO5hn5AHCoxgC+8/+IRO6FVkC8gt8fi8XiemTpUCgZhtJJpGHrkwwBipV8UytbPivrP0tCUYUsAEfcRLK+dnj9w885ilk9W2b9CftmLebmhIjUvvjGX1i9ZM9n5dwtz1LqO0buhJNkdKF/z6vPWXn5W39k/NT7PpFdeuEU7HS2Mnrrc39++fQv7nn81Fjvg2jZiawHIQV7+b6K4pLfvR5iPoOWM9D5OxVjgK6s+8TNCcEpNK/W/arqKoSfsvYnVMhBNPSxgZcQ9I8lZICm1K8zgO+4HQlzevnXIClgEkIhCVAc0MOnfUnm14IiHMd20wFVmT5DWoJVTKHK8yWiYZyg0oXIHUy/509/3BJrkk2M8Ad24+G5vPPsl1/f373td/Nzp/ej4YB03dkEnKdEe3Tt+B/sd2+96NyR3u0nsvP2jLsFnFo2xx79uAdmfvNnHz2an/gAj5mJNIUzBoaizsKQbDNAUWcxd1CTANfsIjq5qEpEkfWnscWHMMtfTP9ppRzwuSGVQSI4P4GcQh2IHJQcVBWsA6hhswwAD/eW7sM8A9irANCUpXsoW+l7GaihAX8qdP+qhUGh9hNPc/FDQ1kK5LkWmEHU7x4aMa6M/GFo90AFkVYFs6HV05lbOHrYP2ATj/zOzBioEg4dcONX/9ikeeG/+53eZbtvlT3T+0GDnPKBGuM4X87o8dxfPvSD/PFLzm11F1bchVvbMjK63ps011+i17/rv15/ztEjHzBdM52mcAw1JbmnAO2IRAmipejSSg5ccy6gKbCeUpz197z/QOV1CvLpPBWnfIH0KyEP6Ewe7s892q85gZxfH4m4h9npWqMnpwAAN9Yg4HfQblRgDru3fuLeryxecj9AFxWeW5DxN1KBAfDQ7icqZHqcA/KUkHQqhKCNgAMqY3/Vw5+Gqb/cYGSnvzz4yKE7Ad2cyzxLdN8REeyP/dpPLm/rzuq2yfPBKeDWHRtYtQo3n+lPXcb5bz61fc+qUmd9Vc4ZbxJjuae9y87tbf/gLY/e9aV//A07RdODFI4ZpjihWSt9mHKZCwOq/ZwwOQq6cAK4bx6wPvOiyPYLO2AoToaXvP8yaFd6/RHwIxfbh2F7mAvXSUkzHSyc6K8NZYN1APiOlJsKHDRHjhxI7c7e50RxEcgvkwwMESpVOQWIG8O0UIukIQAPSuj3FJ0ulRoBNNznp6JNGCTHKjsGw1owEAvYMOXpp4FDDvtusTi8idD/0vGFADQOvOJp2eTUr2dbx5+IDgCs5xAxJlHjJNdkQTH3WOt+9smNlYWeNFlo52hLDfVSo5fsTMc/eOsjt3zkz3+ex2isl5JYAzO0kjk2c6pLH0UIhkB9gT75HGBpxWsuiBbEH9JKEIiZBFBB96lkB7oAEYkqnO8eItb8zs8CFOMiGY5//sS+NeBwjQF85y20AtH/BLn8OWFEo+K5WtX60qF6vcoLiNcHPS8SyVTGBaoGgYoewIPMGnmZcQJlGdgN/n5TNf1nZxlHjhDm5hwA2B9+5RNktPtv0y2jz9KJFqCpg4BgYG1DkPeBHZrjj34Yuu+yhjuxLDYxPKKGgCx32D3dt3//1eu6hw4+nbaik4JD2u/3MAw1dbQUZ4cqYEixmgEXTgMTCfT+VZBln7pLnOEHFci9htaeUggS1SyAQE4VAlIhIqkAhS6UBI6A3AMR0sfxGw4fznUWTHMPb1xnM7QBBQCS/n0fze10rmaLgYg/MZTLNN+f/EELsDI0oAIQE1QIzECeA2kfaLVKh9eKJmBVARgVsRFAiwcQGeovZpQuftaX/7fIw/qwmJkx2LtXMee7GJ2n/+x1g+1Tv+ImOgd0suuX7rmewsKwUSBR5POZPmGbwx8+m/TcLVZOrDpqJdIA2S7lGee7twh//GsjrZvecTlPaJKqEaNqijXp4V2qxgHya539nZkCxkKv2QYcX/avfC5KIlABUbVbUz3pJSxpkAqfozLwE8eCKWYEPqAQ+UVCihTQVL4GYFPIgm+CADAngNKrF+jLv9me+wKw/TogFSjF2d5KvV5ZB1aV6ykkvsJ9/XWg3Ql5IlUh/qH6Y7gbUK3/E6ZscHz67tvuOQoAcx6reLjVV5g5yDh0wOHQIX/iP/1nH+smR3+hN949oFtHLZAq0BMQGAZsEoFzCswLXv6IFK99qsBxA0tryk3riGCU8rzBW6bgbv7yiH3zf+7SFgfHVgwJq6/V1Y/vxVe+MlgR30ImxVpG+uTzvOT3eg4k5Hv+5eBOof8S8YBi5j9mAVpN+0EaQD4VjwFE5SAEEJBDEed68nWffNYB4KECBpo5IG/mC+8QN/hParkyB0BhKjAUksUcP0KzNzb4KDq8ordOGM0UzB4LEPLZQYQVBKFE0KrmQAwsCjLAoP/No7fNrWNWH2bDP7OMfWAcnstx6IAjAI2n/dzTsqmxX3BjzWfqdBegDNB+DoYBiSFWsHVwK6rnN3P87rMzfO/VjIU1Czillg0FuOSELdsT96e3WX73ewymWcVaGAgXL2WpsaAaT/xim5NP6ngtIzp3TLGzC713iWAZyJ1Gai9JofBT6LNS7PVXJSBLMJC0MhpMpRQY4EhD25CQev6ICH8ZAHCklgV/qGQBDlAa0/3vO93f8lodPe8cqHOhBhhG8TQyARE/aCFVDIxAIkByoL8KjEx4cg+decwPyYHFMMIBmFQCJPsKAOCWh0X/nzAz44G9Q3MOhyFb982MLI7s/mE33nlpOtF6rI61AEoV6McT38IAxjo4AdxCrs+7PKPfeFqqW8YJJ1YaaLLAMECipIZgpycxeM8nSd5/kJJzmkrEIehWOzLFW1Wh+5YtGMoFag3w6J2Eo2s+Ecs1KAIVJ79Wef6oUHnLAR8KhLAC9Veoks8UKAiDAiQBVs5UkarJB5qur8FnAHvrAPBQMQUOmZMnD6/arde/TrNtb1ObBFHQIA4aP0ak1S5AhewnKOnCRFhbBbrjFEqDUiC0IP/ErcNB8ZPLioIAGIcHHvIA4Ows45Z42vs0v/nEn7rQTUw9//R4+ydlfOQCtNnX+NrzIY5hYFTZiMIKuWWnu5sOs8/s4VnXOV1NDRbWmBLOlcn41mrLgswYrb/xryF/dzMlu7tgBXmhfVKlYaUWVdW4cyEmVQGMVVrJCd+9GzTIgX6maog8jVfLWX2Bj+ZOY5JGxbCPUpz9p5IERKROaXiysAgcCgcgUyVR0hwPrJ1O7/XnTh0AHkJ2QIBZzs+be6e5/9df7EYuu9aj0tbAlKqPvhWoD87eC8L+YAKy1GMBnU65Qjy2EasUdKp0AGLHQBwM5aceorGSsO9Gg/2QAOrJDGbMn+7f9hQZaf1EOt7+AZ0YHUFDAM5zQBlGGcZjpsQKToTcQIFVwfMv79GvPGUVExOsp1YtGlbJsoJICXkGjDeVFhjrb/wA3Ne/RM3to56jH4Z4lIotiwXRj2OJJlpKeRGAlRS4bAKY7EDvXwEsE2VBAj4O8FRGt4u6Pzp1ufE3iH2SZxPGll+VFxBLgFz9YpC+Cgjs0vzIBYfR3wwdgE0WAII73oaMx+/7aTXjn5Tu1sQLwDOXtXpFHjzmhIVyUGgUx7d1fQnodisg1Bn1/vDvD7vAkaeQzN0BANh28iFwSoS6fj8EcyQ4jByHgcbjX3iZTEz9m//ess/Vsc5VGGkBnAE0yCFgsFoYAKwKFjKJwIlTt0B07dQA//aZy/qkvTmtDhjza0Qt4zdzkOfhg6dHkX1xGYu//+cwayco2TYGzXMo+4pLSQvqRPW090lWSLDEQyq07kATTaKrpqH3r/ouTy7liC6qDk/F9Qj2+TXfRLEVWIz9aoX2GzKC0EXwswdCQCqEgSgaBNfHZ3xph01B7d5MASB0BA6abOnAPyXJL/0cGqN/JI1O7mlexAEIrLD6K4NA5Qpf7+jMQL+PsiOgqLT8sFFxFJEi5GdJQVZ7Dx2nnxMchuAw0L7uhbvyidGnu9HWTNZKbtCxkSYaClAuoJ5Pc4xfrwXrT31jhZwRuDVgS5LSzz95DQe+ax22AZxYMWiwwhrxg5biQKQwk2Oa/sU3aOndH6FkLANPdn05wKEY45CbF6FbC3oFRfge6j0xODk9fgdwclA6vStPdFLvuEXmUDn5Q5wnqmjDkNMN9G0AjqCqVOwM8F0BlXUHdcRYV7hVudUH9s0h67bJAgAAHHDArM1Ozf2Xlvnl6RQX/Udpthw0d1A2HvTjksTHIZBrvAwjvQXPfMEzA6v9/zBUXAj+U5CLLoKAlgpj/9pA3om9hMNzOVA6fetJLz03bXW/R5PkWf0G9mFkdEpbDHAOYJBDlGHUV/gMgAVghbECIQe3DjRU9blXL+OFT1jCji0OS+sWJmdqWsCAwKpQcZB2Qy23sfK2f6T1j90Ku60B5aaqc1RMnnCZPSlBvciHX68YXr5wBIeyYyUHP3k7qK+qyxmRZWgaZwRCKqYoW4BxKFOKkx8qSpFaTJVTvlj+4VQ1AoclAKiaC8m6qrEw2bosrZ1q3wasAoc2x2DXpgsAO7//ps7RD75kHZi1/eNzb7A7XrMK3f1WaU0yNMshasAVDEBFQRyYIlzuElAFDHtmYG8N6I4E5WCiajldoQYPa4Ibln9xh5+dJdwCxrYjikOHin49ADQe/XOXaqP1JDfefPYgMU/W0c4YGsa38EhyICOQMoxaMNQHAAVYwVahRuAGnlf/zIvW8ROPX8Te81KspoZOrzAaVmFidzOo7trJDvCA0qm3fgjZ3d9Ec3cXSBWq4nEVUlVCdPMAx2iVsVmgAVAFGVJaSYmungAm2tB7eoQmAzmUpJjnL8G7oq9fvV0O/wQA0FO4ItdfSUmVNNJ/iwwhNIpXHeBUyJBxqX7+nNtWT2+W+n+TBYBZBuZkcM/Xrt521cvvOvGluRPAi5P82O/8p+b2l34ldxf8Z2nvvFQTBSA5FD4bKDb5Urnhc4iDToql04ROt2CiBsJfyVGjSpcAAEhg7bdb+kcJMwf8Cb/tSsWhAw5zc/EMw9a9LxtZGG1dq63m09Xw07J2cg1Gug1tAKAcQJ5DUipbeBpOYr/uFixgKxASlb4SMsEN5/f0BU9YwtUXDtB3oGMrRltW0TB+JoaJSfNcwQw7OYr1T56ghf/6KZCsItk2ijx1MAwwkQqUfEePwL7/Fg/nytB27LiEWLyWEZ3TUbpwnHDvOsiyIte4/EMDy49iVqZRF1C0ohdIwzJgbogBqKrqM4FcQeI7O+qXB5OmCl0TCLEiAwZ9/DUAxS0wQB0AHmr1vwLAGgYnbD/7eQC/gX07FYdn7eD43M2TF848Zrn/iFmRqZeiOdVScoBqDhEvLs1B9stjAqVWABkgTYGVJcLElELyiipABcGiqDPoiUA5M39bnB0ADt/oq9FDKE743Y+daR/XPZdo0twHY/adbtjHaKtxrnYa4V3NAM5dgL8ZgAWTd3qjgPH5MQXHd0YhAwDO0f4963jOo5f02ot7yGBwapXIGmjDuLgQ0Sc+uVPTTZC4BCff+XlaufkIWpOMJGlDc1FlorBPJ7ZNqZDwQqWhQpU1DQEYpIEDjSYw124hvXfgqzJXxKyQrvunVyWi0FhQUSKlOLZb2RJHQ9owgR3oWYGqIKGAISjIhSbASg7N/Ua3tCeSDvSjAID9kE0wB1R5DzaNzRjgkGte+JL3ukb79vwrv/967Ju1/s2aywGgu/s1Vzs7/srUjj1HW1PjatifkEzOf/KIYJhAxrP/ii8Cdu0J42DqNeg4fnLJD6d4TEGIrOFTd3y3O/iUm7/1CrCQTcwc8oHixO3lyf4gb1L32l/YmrfHrpCk8Six9rFizaPV8h5tdQiWAE4BzXzH24+5MRgElkp6H+p7oyDjQFa8ovpAwcj0iRf08JzHLuKKCweUCrSfGmqxP/EtQS0BlvwWFga0O9mlwdfX9ei7bkN29AR1trZhc4WFwgKwBE2gZKhyHxSGFJYUxgs4gAkwEHC4ziKwouB928HLotoLPItqah85/ijm+jU0IIZIQTqUBaBcBy6BJlLZBuRLhaAw33fI5wcAsSQMXl7Pv37ffYOrrjqCdDN5zCYEAQHqtN6mnR2f4mt+bV0Oz70FRMCTZy0OX6lr9x34IoCfbp3/sn+fr+36MeH2AU1GrkZrwqgxIb0XoFgYGBxVhHD6BLBjN8HlpWeWX2UNQAaNRneqN6uMI7cbzBwETmyloi2493Yt6MGVU71w9ut/aUvOWy7J28l11LSXO6ZHrjP2apJMaqPp3zXN/JdXMyVIcHjA1/QECmBbvASxgKxArYNmCu0pxtsDffwVa/Q91y3TxecO4JRwao1hCNSy4jFSLWokVScw3QQN06T5/3knjv31Edimo2RbF5ILhiv6QPGJgqoB7CvmMIrByrjNkxSihEzBj98CrAFYFR9sHSqbeotWHw0Re7Qs4UKPvwAKVYiq3ACN2UMMKgH0k/A8bjWHOigxHAGsA/zNVUeQ6j5Y2kSj3ZtPp16VQPsNPeaGz2l3x5V04ps36e1/9grgGwOfDRxRYCZ0C4C9MzONO49c9QiXN59KpvWElDtXwbR2aaNtkCReJdiw/xIHjE8C01s8zG+IvLOFSxCBKafGmE3m73hV+t4nvulbgpXXz3aWuDum0xPnuwHtcpxfo4avVmP3wOJCGJ7URjuEaAdIBmgmUHFATlDhcNRRhLHB4VPPgdDO/outAMZBNOrZO5w/neqTr16l77pqGVOTDqkQ8pTQYEXT+hM/YZANpzWLwjLQnewgu6uHew8eQf+bx9CeaiEhghFBgwCr/qRvhNM9gcISQgbg77PhfibAhpPfJ1QKu54hefQ0uNFUmc8INijyoLoCbBjJ18qc/1CqHxeHCKAufNSL+X8dXhDjAgYgCjdwlM+nMWIpi9LyYvq4Lf+Q/8PBGZgDG4J2HQAeSrZv1uLwXG6v+cVfzbdc9FtwGfHpU/9o5o/+bPbAf/lnAMD1NyXoPUBo77LT52w39pLzJTuvb/T2eyb6p1d26rK5JMtoLxxfDLbnq5hpTVrjYNuGaBPTW42OTXgee9HaKlQDHZqjxq7e+0dNGby5v7i8k5PGpK4PLtQWTxLjQsndNFlcILlMoGnGwdbz20n8qS4ZQp/LQcJcqjouV6C72OyO3FeKTWvv/E7JOCIjECiQiyLLMTE2oGvOG+hjrl6h88/vo9lwGAwImqs2E6WmUSSkSBhIGLDsHZdV0O4maJLBAx+5Dw989OtoGYfOaAOcCRKEnwP5lB8aAgCQqKplUKICEwMEKawqmFWtKhgKyyBaz9C8egI81oaeTEEJF7Rc1SAM5FN3qsz8e7nA6nKQKptPEeb84+NDaVCl/mq5CBSqyE8PILkqFNIwMKvL+Ze//onBI64HcsLmWuu2GTfVMABp7vnB87Nd1x6RzqSFQ0Krq32srrxR17/0RtzzVwuYOWhw4kR7fISTTNvNJEHLUautIyPGtqjpGkmXqDHmFDshtFWQ7FChraq8R0SnhJvblNBWcCOms2ULC4AMhPKcYRKKk+xhb5X/dLrUn+xu4D+64uJeKu/skZ6GCivFO78vflWCSH0hbqdkcgI7VRJC6hSZUsPmevG5fVy3dwWXXtLD2FgOJ0pZRrAQNK2gaQQJe8f0jq9IiMAqaCSM0ZEmVr+5gq/+2Vexfs9pjE810SaCdaIJAQ1SShRIoJoAFE94C4TLKgYgaknJYwQKowpmwKylSC4ehd3ehRxPQYkBxZFdLbVaC6f3p78WCz58t7GgDxQlQ9D+DIKe5E/5QB+I3QEHqBMfvVcz5Cs5yBBENW8T7MJ89utT/5D+1mZL/zcrBiCYOWgGhw7cZacu+kvpbjkADAY61m2hM/parNrnceuS35UvfOg9+Op/WWk9/8PddOGOTh8tNJA6TReM5G0rJm0R+h3lJFHTgFpKle1qznqKrMlVHIEwCcKoP/iUhtqBbIyasHBAoxMHLSpVAjn2x5ohqBjfjTQbWIlUljXgUrao2o0MrDp1SjrwiUDSyXHOzgGuvHgNF1zQx/TWDAYOeQYsrDAaRtG0DgkrmLRUT439OFEIKUYnGsCK6JFD36AHPn0Pmi1CZ1sbyAWiUrL6UBCkqbKZCUNz/ILI9iMfC71iBxEI6xnsBV01W0dIj6agBhcOrJXVjJHtFx1f1Qt1eomw0M6rlAcB4adQElDYAEQFX6C6G1AJmgny1dy/Gk6VAbM+cOm6BPX/w5tP1dlsRhAQR8DAEW10dh9znfEXImkyJAPIObQ6U9oZfQZp8hwef0wzWzx+/+7nvPqY7GylvePzLc65waxWmSxbNmqMAcgoqM2qTYCaBDQUaBERK9D0GoTMw5lAAVdH1iCD1IDAQwLj1W0X5c+WmmVxcImEiISIozKF+K03fRAGDg3jdOeuHl3ziGU84YlLuPa6VWzdlRJbQdoHiVOyLJRYocQIbKDvcqi9mQCGgES13bHotBO699Mn8Nn3306n7zyFzngDScIgp6E0IBgGGQCGQAxV45umYIQmidf3IiaFIVXDgAn6S+GSTD9H49wuknPGSE6kgKWC5ENxtLdg7RFRWOhTUH1jdiBVpJ8oLvPQIOlFLpYCVIqCuhiTFarQbGEAzYp3wbWYzGpfPrr904O36CyYNmEA2JRdAOCQw+ws9+fmPsnj59yiW8f2w2XOZ6BOYCE6OXGpjsjvDgZrr/3mu37lI5zlB7vnXvr5se96wgOrq0ujWFjUPB+04HIJWjGZGM4UMoDSAIoBmLJIPwm8NFM9DsMRWaoRazj6REsGYeQiKVX2UHGgIgv5Q5V81p8zkFtACSbpYXSiR9Nb+9h+zhomd6Q0NpqjaQSag1bWDBImtBNHDStgDrz60GfnIKofpmwhIkjajJGWwcI3FulTH7kH8/cuYXLcaneyRXBO1Y9I+BO8MhJBkRpQaYogjlzxcMHpaQHh/l6O5NwO7I5RuGOpkvETwlqp+ylqgpTxlIodf9U9LK5sJgwtDQ2ZhJTU30Aa0mLun4jgljOSvgSw12cmIoJBJm8Nh8qmXOy6SQMAohBHbtPTb8zy6f3KzTgaRlA1kMzDz932pLa7P+LS/o+snLrr7rW//Obfk2l9iscn7kl27Onp9PQJdqqaaheSd1mcE4iAE++Zyp5NI84EjyrnCKiqSxVOcyUCS6lJwOIHiESGU/+cFS4hzX1VY6xDe2yg3fF1TGxfo6mtPeqOZ0garjgB19YtMiNoWoemFRgWEHvVCyYlKtYXlotURQSmwTox0qTVoz3cfMsdOPrlExhtEsa2NWGdUEj3ywI7BA2qbulAmadDoaRKRFqsa/R5TBBXIYB6GVrndZFsGYE7kfl2Y4H2VyS7CnFnlDU7MMT3j4Cgr/GpCAAVGTCvBKlFZqHq4RQiAK7vkK2kfipUFCLQTkK8tOy++JV/TD+sANMmQv7PjgBw+HCO2Vl+3Nzchz7Rffnn3MT5j0DW95q1ZVsbkNxXlE0DbY7ucaA9cO75tHy6ny2dupfIfoXbIyd4esc6j24zmowy2YZCGcpRIlgJTKVuQCk9Tt5T1Ce9kDA1wOX6MdGgOa+A5iAegI3Ajq1Qo7uG9sgauhPraI1maHczShKFgSgc02BgNMuYEvZgHlsHY5Q4yJ9Uam3/R5JSdEgngmaTMNptIJ1fx6c+dg/u+OIJJCQ0Pt1CUz1qBq5QHSjIbFGlftHQzy8XpxZ63tWdSp7zH3w5zdG+YBR2vI38ZArypy4V8IGqFwVWKqf6oiRDVa4LqCL+VKzxKkoIj5lWlooACpLKpl8R1XRhEFVJipjGTnndud+7Ach1H+xmrP83dwAAgCNH6DCQt5eO/la/O3VITVL2f6nY7EMgr0PvoSVREEHbtgXwJap6ibgV4Pgi6MTXMzRaKbXGRRujBqZjqdVl2BarbRDYeqYgGd+DL1BqUUicXY2jZhmRSUFmAE4G4EYPpt1Dq91D0s7R6PRhrMCyBw1ABumA4FJFYhxZI97ZWcEsntJLAobAULheFNPloHueOTRahImRRAeLPbr17+7FHV86SewyTIwlaJEBq3jSIBerlVAweKM+f9i3Ged5tUjxy70JUcyH4ZF+EoBTpyMXjJDptpDPZ2DrT3spVjmg2ONBoj5ubFTq0cjWpqElHxq3/AgN6f5VVkX6GQT/OCUwZUspSQ71ARwghWtZ4tP9/Bv32OwDswDjMDbtSvfNHQAOeSygNzf3P2hk+lPYtufxcJkDkSkhZlSVZ7myJ8Afy0SepULMCiSQXqLrq8Ca8594Zo8RsgGMJXCiPhBYfwQ2DWFLW5GkhCQHklSRCCERIHHh4YrEEIwJeCELXNYEOUVOqtYKaSIgVlCg9IYTXskvNfM1PcHX+ih0sb0yjypUhJIGY7RjkC71cOutx+jrXzwJuAyTow20bVDUgSqz/5ny5I8c20LxkACt1vuFgEcplu6zDoYvPbzunmj34lEytoF8ITh/XunFR+KOElDp7ccZ/4Llp5XlnaWybznJV1zXEkAM030qZSKWrQ6Qr+e+7g9vuQCwKpT23Bse/0/obcbW39kTAEIWAEB4bWFOB2MfFup6vnd1b1iBaFXq2CLzlVi/e2Yrx1zYlsM/UAoEHEBTKhhpBCAF0OwAxnpo3IBgDIgMGAnYaeAQBRTeCIjYD+uwgFmIjYe9K05dYApMzp/0JH6cAaLEShxW2kCdtlqEbsvS2vw6vvjJY7jzq6egWYqJUYu2TWCCJxn25UIABn1wQTm0E7X5K9dDVq+xpoL6NV4hToUnco4YquOXjJERRr6SqfEnfzh1y12MEgZ5SKpgng4RgiqnfaHxF+7TqO+vUbdB4fUCfaswXAdkkCNdTZWYKe52VoW0E/D8mvv6V09n79FNfvoXCd2mzwJmZoz7yn/7CK+e+BBaaiCSn0EZKx0fJZY8tBiUKvmnJ5NrAeaVmmFElTLAAM4A6+oHdqrKwjGvDjp7FNL4KlJfbBqr/l0BzSfydDgiLRF9CvV+gLzbHYuxEYvVk+t0+G++iT97/xF8+Usn0WwbTE42w8EnRfZA7NuBxAAVk3zh7+Hg8SH70OjhVG1fQv3PhqyBQZI52AZj/JIJIDPI10VhGOpbcl7+U8vJi+Llrab6XvZPVVU9paKcB0DYAFym/6UCUHh7SQVx049X+E0F6eLA5yeBSahhaYx1SoOB+w833I0+ZsqdUHUG8HC2vX6LMK+d+CWaGtmvY+MJlkPdN9TcGQLxgtKvlF5LRfMuFse+P0cVmIwoaFQHhVAiYCUDthgPTtkQG1jVsJIxqsZ4hD0Ggmoaz6RhSq6s8ymc+qHWV45UYCewLdJuu0FW+rj/m/O488hROnl0BYl1Oto11EoIRj1Sxgb+JSAJiQ15ihwpxXYdVV8W35PzoJ6PkRR3I1WXeASsQCXNaWQ8wfj2EUjPkTiFsV6Wj4ZFVCoLWiqAn5b0Jx8ByDMBUSj3+OGd6jZnlOu/AsSjpET+bfQkgv5i3xODogChZwi7roU9vu4+c9Ozsj/WZ20e0Y//lRHOFpuZMTh0yJlHP+8N7oLzX420n2MlschCDDQ6vIUm4gOV4rcSCMriGMEdqCIxVkDmDBgvRolLOkDHf48swEZhDGCtwhpVZpCxAuMJOsqsZNnBGkXCooYjgcfBGkHCgoRyJCxoJkC7DbStaLq0RsfuOKX333ECays9ajUI3S6jyRmMiufsk8ByuA5PAW5CNQkU3gYUDVVKoGhCkABoqv++vx9oqH9cgoICjESVGqQwomhkDlM72jrSbZGsuVjmqBElBoEDOu/1SBB1/DQ2KihIe9Gw3n8h5BFiVKkMVN0FUCZ2Wq7+8tFhsNCDSx2IObh/6D4QuYYI37eef/cltw1u0RmYzdr6OzsDQJDQmn7rB7qL1z3+i2771vMwGCj6lrGW+A8QhTQ/jq96je/hlB0oBcEZ5YIQpkp/jMtAYNh3HnY0gPNaXqcjURjrA4AxChsxRFaYwNLzHQCFYUHCDtY4JCywLJqwo6YVtFuMZqLQdIDFY/M4fsdJLJ1cgOQ5Ol2DVpNg1amBUMIOCSksSXHZiLP5UDShSIKzJ+F2A/4xicbvA4mEABEel2glCBDIZA4tC2zb0UHTWpW+I0OACbNKNkAqHJoTcXsPV9t7caap2ufXUsIrwDJUsP8iWzA4PQWKsEZRkEAAGiz1IYPcEzgjquO7Avl4Ant0JfvArs8MfvRscf6zpwSI+f2RI3z69FdXGicu/XkZm/xLbSQOnYzRyoGUCOtW/bwXU4ERxNx2Q7EQPz6hZNDh7KC6aET9SN18RtjV8LzZoJIT6/1y4N4PrRMJcTjOqkR2Y0lbTYOGIUXaw/y987Rw/2ldPLFIaT9F0mB0OhYNNmDk/udZqKD6RrygwDIroGKxiifA76rYWBzREExfYT34XR5wuWJsLMH0tjY4g2YDIWvCPFOQBFQKjYkYO8OcgJQ8yaDy42v84uWRyqLWyIwsAwZVSgfyFY5SIflIhMHyAK6fEzFrrPcR4kNiwIt9t7qU4lcVoM2w8acOAP8LQDA9dOiDduy5f5xfcO7zkCEHyKItQGtAyAD0GRgYwIVGOEvp3MP9sYAVDDXEwmcrSt+qb9RlCsynoF0NwPlJFPWMg+CIcVOOEIf5VmMUzQbQSCwMMmivT/PHFrB8bAFrC8vI+gPYRKnZZIy0E5iIckWH96CeMnm+AAEhEJTAYrxvqNdf+HzUGtBynQIXvD8PBxDgnCAhpelz2hjrJsgHAqMKY/1QjsaBJfKkamEUWiVabAEN8EN4ySrIakVpRcM8kYZugVbRfp/NaxEQfFZAhMFSX/N+7tWEBZGZ5Z+W4UYI9v6Bu/GKz6d36QwMzZ0dp//ZVgKUnY/ZWYy+468n1x+x93Nuy5ZzMMgURGE6L+SgIkBGQN8AA6uFaGiJfNOQIlDRDCcCk1e1jN7G7H8mYeJrRjy1gAXWKKyBGqNkE8AmhEaiSKz6EzwdqFtfR7q4Qr3FJQxW1qCSgq2i0SRYAzA7GHUw5GDYE4EsKawvF2Dh/PgtCywECQlMqP0NKayKJqTUiEIdGtJ7lZDmS1HvF1+KYrzXpA6jIxY7trfRNAbaz2EVfsw3SA+yqgalcTJB14+d5+LHkd8o1x06mn6ARytU3lgGOI3LPv32MLdxIYiWjwcwWOprtpaDLMc1bxHeIVG48YTMyZX8Uzv/sfcknQHhUEEyrjOATWqCI0fMygOfOd2cHH+Rdpsfkm7HIc29K0ul5m86oJkBjgi5ArkBMvZHWJDdKzdaEMKcX4lqV5eHMAPrAB1NNbm4DZKMjCVYdmTgwC6H66Xo9dd1Za1H+doqsn6fVDJlFljrYDsEyxaEiP47GHLELEV6b8nLdRuusgFLHkGRL5MvNQpFIdWyJEDZWqzM46qqkgQl3zzzfIMtO1s6NdUizQSpc0gsqYqShhTda3gQEVRVoMIBqGNfOXB5zBe7FpRCUlVZ4hQEP2NCEhYJa+GpGn+RVwRWAtBfGiBby0DG+NZhmdyQKkliCCt911tZdT8DQLDXj2WdTc5wNmYA3vbtszh8ODdP+MHflEvOf63mksG5pAD6pCIZFZV2YjGqgejqQSiFF+shiAHU+NOfjH95TdhtBabQ89fkojaYBoQ0BfKBX5flUqjLAfgWnwcKAWMcmBwYDoxcmYSYRJkdGVKEIABDTg0pmUAFtuwCwOeDgYUEQU4pBTpIYVSGugBWlRKFNjxI6K/77gA1CcpOiDLB1JjFju1t7VgDSYUsFFYB6zy+YETDlz/VQ0ag5EAsQZRYVCmO64Z4xOH0LrROpBjnRaEtXtT5RXZA5Mr3jJQwWOhp1nNh0rLyOY8rXQn5BGtyx3z2yos/l775bAL+6gCwoTWYPPWHPpSdd87T0B/k8GI1w6vAtNqgrkynDG2erOyfpsrPs6vsHQxjAJzATkz4Apm98GZBxGEB+SCgBEdMuXd+rgQCcgXfv7z099kwD2DZDztaKgKBGgqOSgoTA0IIBk0qS4AkpvykSCTKfakiE3QTol072jo9lhByBeeiFoD1g4ewPuWHESiLwvrt32SkkClUFgULiETBzgcI9vP6iCVAGQBUScg7uAsrvSQs+AjODwWQB1xRQf35vrpBTmDWMIxJqGAcAuSTBva+lfzP9vxj/4c3O923LgG+NSgoUKXmrsueL83kU27nlkvQS51fGoLKGnHxZ4dWZ1ArbBVsAAEjMFXOwQbAkAALaJ6CKIXttgHJirSbAuknMv0CCUiJ4EU1QmrugT0UU39c3O9PX08aUnAhta1aPl9B6IuDxxTVgCIFOIxM+3+VAVzux4l37Gxh55YmEmLKBg5WAeLggIyylRpTei7acoXsAVExIen/EtJCR8i3QIqhQqWCXDHEoSzQ/vA6e0Qw/Om9+b66gQOzCatbQm1TJHQqHUP2xJrccU+v/9MK0Gan+9YB4H/VGjxwwKwe/dqpyQd2PGelRX+fj4+PYpBJ+PgGLmpg/A0J0odL1aGh81Katkov1ooCJQiJwi2f0sbIDoKRIJIRAgBJCCeeEcjhk24KEQ+ASYmhyh5MJEZ0fA0zAQH5R2WYp0Dbi7afUmUNUtiq4fOX8K9Lc4ETwZbJBOfubOlo20L6jnJ1SGyY2nW+uVcO8mlZRZe0Xr97g2ObMfwJJozskharGSkqeVHc4qhnRoAqNVoVzARJna7N9/w6JsMkcfKayvUjChVrCP2BS4/1sh990hexcLam/tEMznY7ckSxb5/t3/p3x1qj2z+fj7Sfh3aicDkVxCBUJlQozKCSX6cVYGyKlDYir+pDqFB7ya+uCQ5OxAAkJVKH5vgISB2MCexAVuU45ksKw+pBPi/uAcMexTckZMJjmIvrali81FbMCFjBrORLBQRw0J/oRdZAcVmH32+iInBOMD5qceGeLs7Z2YZhIpcpKrJfRFoGmrDUg0wgRnJIA7hs93vCtJYva8iVomxBsRU8JEBeVCSy/bTkaMWjHGHXWL6eae90P+QMVLIyIjjr8wplA2mr2mMr+Yuv+lz+Qd0HS3999jp/HQCi3X23YN8+m33ylq8lI1P30Xjn2doyDs6R561KOY1HEVEXT9yJzs0BNY/DOvFnyp8l7/wCIqdklKS/hqRp0BjtgJGpMSBmeIc3IQNgTwtm9tN6HIOKETCDTPxeCC5cBgWU94efrRKCQolAjBBQFLlTiBOMjBhcdEFb95zbpVaD4HI/LWMMyGrUD/TOZ8K4Q+H4gYkXxoajKBpVCyQ/U4CCQoRSu6QyDqwhYIBoOJmqEDKBdKlPvaU0Mi+p2nmJv8MPgmg2ppTcO5+9+dLPZb99Ntf9dQnwYHb4cI7rr0+yT9/yR+3m94z1L9r1Jm1yhiy3FFh75fI48eWzbgQCq4R1LR5LQdyzXF4fauwGo3fqOJrdJkzDAuIKgg7HmlxLxw0OFcoA8g4cFmwEdp8StGT+FS09BGVBrRCPvEgHQ+EygRPF9KjB+TvaunWyQVYVWe7JSnFlARWsRwpyX+GfTRvScw5sHoVGvk30cuUg2FHAABSbf0oU+JUEKgH7YkwoihYrMUFyh/VTfcp7TtkwlfVH8fCyEiFkk0yNexfzD1zy+eyVQeHH1R/6OgMYtqNHBfv22fzwzZ9qbNsuGG0+RS05Elec9GE6JWYBYApOHvruvsZ2PmX3PXpP7aWYCfg2HrE/rUEO+doqulNjYCaieOKTHwxi4wFADgNBzP7+mA1EDkBI7X3qXykVmFV9CRK+559XCUpZJhBVTIwbXHZBCxef10a3Y+CckqqSYVAS9FAMvGanKQFJ9YvU1AOSKFiGldlIP/hTmZUKSXpJnfAZABXTz4V2aQAoOQJ+rgQls9WM1k70yGUKZi5msWOpUciV+CfKJgwl9y1nn/yoS2f+8sVwN74besNZ1u+vA8D/eTmg2LfPur/9+C2tHdtaMtF5Miw5UkfgQuhSY1ofyDQV1V1XoPBl6h/wgGoJwf40ZkOQPFM36FF3etxTgaNzG9+3Dw4dygB4nCA8r+HKaLF3cA2BgXzNr8TwA0eGAFVBmgkxAzumLS4/v4MLz2lhpG2QO48NevluGpL5tsGBjR91QmA2ECuBQeSBRyKjxaE+lLGQT4GoCAJD2ECJmXJkH6NQ8fVZEPvWX+9EH7351MsV+D3AvqogwvC8BkGAfMIiOb6c3/bPR9OnP//LWMFh0Bw2/5hvHQD+/waBmRmT//lffbS9cwvQbXw3GirkHLFR4jCn6kn7QowqJuAKJ/fiGq7IForgwSUoCHLKlijvr0Ndhu7kGCAOxhYgXsgItNQHCNlIyQAUMlwJFIH6GxiBSiSU5YLUKTpNwnm7GrjywibO3dFEs8FwznufZe/oTH5VlyEtliAH7ICKDb7e6VGAgL6uL1WEKoGgXALqtUIqt4vagSqUvnh4qwRSkSGkKxmWj65T3hdiO6Q1Xnp+tWYgZOMWyfFld9snTqdPP3AH5nUWfMPh2vnrAPB/1h0A9u2z2UcP39yanljQsfYz0GQlcUrsIekg0kFVp2bSIcCQAzgYugE+I+BKzz/8nEkMsvU1MFS7E2MEzcFMxckfgTtbAQXDCV8B+SIL0GcOIoIsF1hW2j5pcMWeBq7Y08T2yQSGOSw5jo7vt6Iz+Z2nBuFED7ORPhPwWQGTl0+gILEcBIKIvJjZGUuTOSBxTD4knNENqHxxRenHGgIy6OqxHtZODUBgYqJhXaWKGmnl3mw8QXJiIf+nz9+VPn3mbpzS2bND4KMOAP8S3YGPf+LW5pbRe7nDz9JuwiS5Y3bsT/w4cuuGOwUccQCtlgNh0kVBLFqWFIDX/mcMVlZgDGhkahQqudfpYw3aAP6EpzDo43EAF7b8eNENUcEgVygcxrqMi3Yyrjq/gfN3Weq22BPoJASPKFMY5AtiO9AHgVjr+3zdBwIlU5KPitOeiUopcg1yCME9ixM/pAMFtad4vBYjAEH7j9j4INRfSLF07zqlPUcm4UJ2tJpAULFBrZhRTMcMGseW3K1fvDN95rOO4tTBGZir3lY7fx0A/n8FgVtvGx3tfkZa5hkYa3ZIJCdSJq7M2FfbgdHxvZyXF+oMx1xA7QPyFfX/wkmeGOotLcGw6OjUGEEyf+oaX/ebEAys8SUAoMicIMsVBNGxjtIl2wmPON9g77kW28YNMTPlQQ7dGIJlCqk9BaeHWtKQ0pPfeh6vhw9JUDILhCOCX/kV24Hq16MEh6/U/YEj4H009PV9AAldhaLmV/X8hQTI1h0W7+5h9VSqTExkKrosJdfwDHIgCNmk0cbJRffxTxzLfuDAPVjYbOu8v91G9Uvwf2hheGjysZddnV44eZDPGblcBy5XFeNBqFLShlCRtQ0bLCi07MrtGVG9ItS8lYkVIkAHA53asYW2nLddXZYSIwOpQyZ+/t5JBqO5jjYzbB9xtGtcsHNMMNr2wGCaA060eF4ObbdI2okpugkswnhpg9an0eD46q9bERiNPH9SK0JhxNc/1sXxX6/2w1HpJ9xPYRUXx+879UuNM1USUIOhri9YfqBPa8dTtQoyTOAcxc+RAkaGCUF+VEOFCDIusEfn5f1/cyL9qVd8A4M67a8DwL9IEBjdNTptnnLZe7Ct/QyXs8A5kFGOLcChNTYF/bayxxoIutYY1hgtd+cBrMgHOcamx7HjvF3azzKwpDTecZhupdgxkuqusZwmOzlaiV+skzulQZTA8ml7+J1Q9s13TysOv9MPMwfHD0GC1QcDoyjm+n0AUO/86od5kjD8w0FCwYjPAmIAIIGy+NvVuX92Xl+FcgE7qDWAporVBwa0dP9ANRNYy8TOBw3jPJsw4K1qKuu9CCA4ddbANFLFySV5/RWfyH6VAPw7gGu0vw4A336bgUFIKbc+98o53dL+d9ptIB9oDsCC487qOKeqKJQooqaVgsKSeoT9QRS0bQggZVJKWNBoAFb72DLZ1mc8agx7ph1UU7Ss//TnQpSKP+lVvQMX63gqAQVDp351048W6wxtnCdQLdJ+E070GABIFVZ92m6dqtEQBEIAIC/4oQwNDuxlflgI7JRYAOQKo6SJUSBXrB4d4PQ9A7h1R0nCnkPk4KcIRYsT34of4jeCqoJ73mHY9WVdmz+VveyRt8l7dBaMucqQQ211APgXed1mQZiDbH/2Bd8v2zp/aLe2zpNcc3Xq13hQFNlw4TwupwdjCRtaeGADNFjQsIJmomgmgsQqEiNIDNTlDm1mfP/149i5LcHpVS/MYU0oJyiuyorDONXFHVrIFhbIfOVvoJjygwrnr2YBLCEgVOf84cd8OXyfhQoFIM5D5uGgrN7pSQHKFRaExEBlILR0dKDz9w7IrThYSzBhOSip7yjE5zdBLdiGrmnQCxDD0DGCmV/S24+ekJ940j9lt928D/aGmt5bB4B/7ZJg++O625rXbP+91g7zY7aVg1yeE5GlAKRFgJoDOhYn9JhRsvoqVF8gzOoFcUxDhDxzyFLgyZd38KSruhiI6lrqh4X80pvqbuwIjJUrvYqgoNW1BigDQMQHQklg4v0O4XaRCZSpflHj+wBAEQsIJQD8dWoYQsLQwZqj+Xv7OH3/AK4naFhCQuRn/oPGX+iqhoyDNMmVIs4Q9ATyhiHLA8XJ+fxdH70/f8VrvoqV2vnrAPAdLwnOff75P57soje2t/AWyp0jT59l4oJHX7TBCnos+f0kMWXnYkZf/P1DjktYWROcM2nx/Y/u6HnbmljoC5wTGsLDq8uKomyWDu33q6T/0fHDRJ8q/PxTOPklLCYRqAmOb5TAIiEARCDQlxIm9xK/FkDD+qxidSHH8Tv7ungsI85Uk4TImqAU5EFC5aCfYALbOgaYJO4PcFBLcGMMu7Kop0+dll98wiey9wJAjfTXAeA7/zrOgHEIbvvTtp8/clHrd1s7+Dm2xSDJc1IYZlAhHVhZ/cVFK5BKoQ6i0DUIczWFA/ue/frAD/A87pI2nnR1W1stSys9gVO/dQsRbwhyBlrJCmL6r1oCgBQcnxBEPBGEPJXIqhRAnwfjxKf8wUGN04DwezJR0/gtaGnP4fTxTE/e08Pq6ZyMAM0GwwZBvniqs5TioQilB0ncHwAYByVV1yKyzb7i5KL74D33Zq/4N1/EHeqDr9T1fh0AHnLZwAU/vWOmvSX5rfZ2ewmJQp3kfnrW89ap4ANUlgoFNltcy800XK8DoZ0WyK9L64KJFusTL2/juoub1G4x1jJFlsUORJjE0zIrKMdtpSTuRJQ9ZgIxG/AAYAn2+Q6AB/OcLwmaBDQMwTJ00BNaOpnh5AMpFo6lmvUUTQaaCXlCkWrIKEIAwVAAUCqmqaOkGMQAPM5Ky6fc8fVT+PUnHs7eCQB1yv/tsZoI9O20I1DMgrEftPh7q7djYfldzW3dNVJ9ZHOEu166SnP2GuNUpcxyhXNf9O03sOaKxZ0hJeg2iZwqHbkvpSN3D1RSpR2jRqdHLBIbhpFFg+iGKgMw5Mk5JlB+4xRfvG7C96Juf0Fr8FgENQyhlTA6DdLEENJUcOxEhq9+dZ1uv72He+/qYW3FwRqiRpNgjJ/YiQGMqRjWI1T3EJQy6wSFMEG7Fqa/qlg8lf/Rl+7Of/TZn5bDOgvGYdBP3V2n/HUG8DDJBs7/4Yk9I3uar0km+IWtqaSJFFDVnL3fEVUcv8AIuLq9h4ZWdCOk0QiOasgTf9b7Dp2E9ZLtCS4/r4Hztyc00iEwEzInyB3gXMgIooYppODgM/n63lDQ/WfyOwAYgBPNMlBvLcfyYo5Tx3PMn851fSmHGyg1GNpJiJomPIeosiqZmOpHdF+9FLjfEQgNewMoCCo5JqDDanhNsbogH1s6KnPP+mT+CQA42+W76gDwMHx9983CHJ7zqeoFz524ZnR345cao+a57Snb1BxQkYARxInWymkPjw1wIRLiCQMbT08NKbs13sF7fYVzqt0G0c4Jg3OnGtg+yTo9ami0w7AMtcYz7QpOgPgFG5KrSq40GDhdW3e0suywvOKwsJBjZcUh7zkgVzQAbVmilgESKmt268FDtb6lSEaAIJZO8fsE//jQZVBWFQbQtmRoXdBbdLf15zH3jA+lfxlBvpm61q8DwMPWFDRzCHzogD+9Ln/+5FWd3Y2fT8b5R9tjZgyOILk6v6kqbOymUluPi4Ghon3n5+CpFOCkYmERCjUgJ8AghccEoEgMaduAmhbaMESJH7rx/H1ROKfIU4XLBZKqitPowGgx0LJAK2gHJvB9fhO6Awl8LW9D/W4Af/pHWrEHF9U4EHu0XwgqDcB2WCEDxfqifCadl997019mhw4Duc6CDx0B1Qh/HQA2h82CZ64ExUBwxQsn9nSnzIsaY/Ynm2N2t7EMlwugmhPATOA4U8+VXX5Usolo41bC+P04NMMIE3nwJzwCa1AlzNuHTkCs//26cPJrv8jfjgQgjie8d3Q1ANmQ2ieqMGEvgAHUihITwYpXH/IUYoJRFUPQBqltAVhbENFV99FsFf9p5n+mfxHRzrq1VweAsyYQ7NmHialHTv1Qa8y+wHb4ya1RY0gJkqsS1EGJvQjIkLhmZYiIKkFgmPILVMQ0EVcbUjkkhNDyi5JcUiEGaRwKKoaD1IqSQRkIDFSNEllRWIVa9d83UuwHVFaIJVVLsB0DIBX0F9396TL9j8Ep9+4Xfjj7p/iPOvhvYA4cKjXUa6sDwKYOBPsAjhgBAFz/c5NXJx3+EdMxP9waMVc0RsJ6glyhQK4ePGMKvIJydUYgEGkpsVvhBnmtTfUKwFE9x7f9tGj9UXR8qlCA45JP9XRhPwugmjg/HhwHhorBIYFaqBiFGgI1SE2bCdRXrC27VRnox9Ml99/mv5L9za9+EQsBw6BDB8D1iV8HgLP2fZg5CD40Uyy6AgD7mJ+dfrKZwPc3uvwU2zZXNkaYmcgj+E4FqoJK8yAAh4XGXiG+iZJPELOAagAoMgGEvjwiFwCwIso+1S8DQVEKqFolNVBJfICgJqlpMNBURZ4K0lWZR08/lS/pXywcHXzkN27G3fEffXAG5va90Ll6ZLcOALV966wAAF//c5NXtkZ1n7H8FNPgx7a6ZnvSZpANK7EdoKIuCuSo19UnLljGXrsvOn4kAXFIEUw1IKhv5ZHfE6ghQ1Cf7qsaAA0BGYJJoGgZoJUBbqDor+WrlOPLnOLW9fX8ZnNvcutrP752vEhGArBXo/p1AKjtf5cVzIBP7AVtCAa4+pnjk53z80c02o3HaoMe12jRlUmHd9kmtxsN9kNHgQZMfpGmlwP2CjzKYWqwUO0NU4AFdqAe3CPANMM+QRvRf+epuug7yED7MtDjSPUIreCz2brclp7Qf37Lx/r3DMW0WTBuAWM/pD7t6wBQ2//L+zQL2gfwfjyoEzUf97KJHWzlUtumq9jwRdbgsqRpzhWnW4mp3WxTO24hNkxhp0DZNqRci7Fdz+1XSKrQgSwZpYxE7qVUjzeAr8pA75V1/WIjdV9Pvzw4/vbbsL7xUzX772CvPAKtT/o6ANT27TYFzRzw2cG2K6Gxm7DRrgeSk1djZOfe8XE77nZnq1lCXdPqdpNu02BUiVvWKpGSSiq5G+i69nUl76frlvK8yc2lk8fW7+8qBh/7GJa+ZdUy62GDK49A65q+DgC1fYcyhJkjoBN7/Xu6/0bIHH17HXFWwbjRwwZHjkD3emeP6zprqwNAbQ/J9zcEh+o3YqDYaNuOlM68dy907kYMjyPWVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttdVWW2211VZbbbXVVltttf0r2P8H6E1cz3VawjkAAAAASUVORK5CYII=" width="64" height="64" style="display:block;border-radius:8px">
     </div>
    <div class="heading">
      <h1>Ta strona jest zablokowana</h1>
      <p>Nitrix Adblock uniemożliwił dostęp do tej strony na podstawie Twoich własnych filtrów.</p>
      <div class="domain-tag">${domain || 'nieznana domena'}</div>
    </div>
  </div>
  <hr>
  <div class="details">
    <p><strong>Jak odblokować tę stronę?</strong></p>
    <p>Otwórz ustawienia Adblock → <strong>Moje Filtry</strong> i usuń regułę:<br>
    <code>||${domain}^</code></p>
  </div>
  <div class="err-code">NITRIX_ADBLOCK_BLOCKED</div>
</div>
</body>
</html>`
}

// Musi być wywołane PRZED app.ready — rejestruje nitrix-block jako bezpieczny schemat
protocol.registerSchemesAsPrivileged([
  { scheme: 'nitrix-block', privileges: { standard: true, secure: true, supportFetchAPI: false } }
])

const browserFeatures = require('./browser-core')["browser-features"].installFeatures({
  app, ipcMain, dialog, session, store, dataDir, trusted: trustedBrowserInterfaceSender,
  getOwnedWebview, loadBookmarks, loadSettings
})

app.whenReady().then(() => {
  if (gotTheLock) {
    // Ustaw priorytet poniżej normalnego — OS będzie oddawał zasoby innym procesom
    // gdy Nitrix nie jest aktywny (skoki CPU przy ładowaniu stron w tle drastycznie maleją)
    try {
      const os = require('os')
      process.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL)
    } catch(e) {}
    // Rejestracja custom protokołu nitrix-block:// — strona bloku adblock
    protocol.handle('nitrix-block', (request) => {
      let domain = ''
      try { domain = new URL(request.url).searchParams.get('d') || '' } catch {}
      const html = buildBlockedHtml(domain)
      return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
    })

    _registerDefaultBrowserProtocols()
    createWindow(false, _extractLaunchUrl(process.argv))
    setTimeout(() => loadEasyList(), 1500)
    setTimeout(() => setupAutoUpdater(), 5000)
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('before-quit', () => {
  flushBookmarks()
  clearTimeout(_historySaveTimer)
  _historySaveTimer = null
  if (_historyCache !== null && saveHistory(_historyCache)) _historyCache = null
})
app.on('will-quit', () => { void backdropRaster.release(true) })

// ── Wstrzykuj CSS baner cookie do webview ─────────────────────────────
app.on('web-contents-created', (e, wc) => {
  if(wc.getType()==='window')wc.on('before-input-event',(event,input)=>{
    if(!trustedBrowserInterfaceSender({sender:wc,senderFrame:wc.mainFrame}))return
    const action=require('./browser-core')['browser-shortcuts'].getBrowserShortcut(input)
    if(!action || action==='escape')return
    event.preventDefault()
    wc.send('browser-shortcut',{action})
  })
  if (wc.getType() === 'webview') {
    wc.on('did-stop-loading', () => {
      const restore=restoreTargets.get(wc)
      if(restore)setTimeout(()=>{if(restoreTargets.get(wc)===restore)restoreTargets.delete(wc)},1500)
      if (restoringNavigation.has(wc)) restoringNavigation.delete(wc)
    })
    wc.on('before-mouse-event',(event,input)=>{
      if(input.type!=='mouseDown' || !['back','forward'].includes(input.button))return
      event.preventDefault()
      const host=wc.hostWebContents
      if(host && !host.isDestroyed())host.send('browser-shortcut',{action:input.button==='back'?'forward':'back',webContentsId:wc.id})
    })
    browserFeatures.attachGuest(wc)
    require('./browser-core')["whatsapp-compat"].configureWhatsApp(wc)
    wc.on('before-input-event', (event, input) => {
      const shortcut = require('./browser-core')["browser-shortcuts"].getBrowserShortcut(input)
      if (!shortcut) return
      {
        const host = wc.hostWebContents
        if (host && !host.isDestroyed()) host.send('browser-shortcut', { action: shortcut, webContentsId: wc.id })
      }
      event.preventDefault()
    })
    wc.on('found-in-page', (_event, result) => {
      const host = wc.hostWebContents
      if (!host || host.isDestroyed()) return
      host.send('page-find-result', {
        webContentsId: wc.id,
        requestId: result.requestId,
        activeMatchOrdinal: result.activeMatchOrdinal,
        matches: result.matches,
        finalUpdate: result.finalUpdate === true,
      })
    })
  }
  wc.on('did-start-navigation', (_event, url, inPlace, isMainFrame) => {
    if (isMainFrame && BrowserWindow.fromWebContents(wc)) passwordAccess.revoke()
    if (!isMainFrame || inPlace || wc.getType() !== 'webview' || restoringNavigation.has(wc)) return
    restoreTargets.set(wc,{url:lastCommittedUrls.get(wc)||wc.getURL()||url})
  })
  wc.on('did-navigate', (_event, url, inPlace, isMainFrame) => {
    if (isMainFrame && !inPlace) lastCommittedUrls.set(wc,url)
  })
  const contentId = wc.id
  wc.once('destroyed', () => adblockEnabledMap.delete(contentId))
  _applyLocalIpProtection(wc, loadSettings().blockLocalIp !== false)

  wc.setWindowOpenHandler(({ url }) => {
    if (!url || url === 'about:blank') return { action: 'deny' }
    const targetUrl = /^https?:\/\//i.test(url) ? url : _normalizeLaunchFileTarget(url)
    if (!targetUrl) return { action: 'deny' }
    // Wyślij do okna które jest właścicielem tego webContents
    const win = BrowserWindow.fromWebContents(wc)
      ?? BrowserWindow.getFocusedWindow()
      ?? BrowserWindow.getAllWindows()[0]
    if (win && !win.isDestroyed()) win.webContents.send('open-in-new-tab', targetUrl)
    return { action: 'deny' }
  })
  wc.on('did-finish-load', () => {
    try {
      const cfg = loadAdblockSettings()
      const lang = loadSettings().lang || 'pl'
      // Wstrzyknij język + flagi adblock — lang musi być aktualizowany tu, bo preload
      // nitrix-lang-vars.js może być skeszowany przez Electrona przy rejestracji skryptu
      wc.executeJavaScript(
        `window.__nitrix_lang=${JSON.stringify(lang)};` +
        `document.documentElement.dataset.nitrixAggressive = '${cfg.enabled && cfg.aggressiveMode ? '1' : '0'}';` +
        `document.documentElement.dataset.nitrixAdblockOff = '${cfg.enabled ? '0' : '1'}';`
      ).catch(() => {})
      if (cfg.enabled && cfg.easyListCookie && easyListCookieCSSChunks.length > 0) {
        // Selektory są przekazywane przez writeAdbVars → __nitrix_adb.cookieCosmeticRules
        // adblock-content.js sam stosuje CSS i rejestruje przez _nitrixTrack do dataset.nitrixBlocked
        // Odczytaj po 1.5s (content script potrzebuje chwili na MutationObserver + DOMContentLoaded)
        const wcId = wc.id
        const win = BrowserWindow.fromWebContents(wc) ?? BrowserWindow.getAllWindows()[0]
        setTimeout(() => {
          if (!win || win.isDestroyed()) return
          wc.executeJavaScript(`
            (function(){
              try {
                var list = JSON.parse(document.documentElement.dataset.nitrixBlocked || '[]')
                return list.filter(function(e){ return e.type === 'cookie-cosmetic' })
              } catch(e) { return [] }
            })()
          `).then(items => {
            if (!items || !items.length) return
            if (win.isDestroyed()) return
            for (const item of items) {
              win.webContents.send('adblock-blocked', { wcId, url: item.url, type: 'cookie-cosmetic' })
            }
          }).catch(() => {})
        }, 1500)
      }
    } catch(e) {}
  })
})

// ══════════════════════════════════════════════════════════════════════
//  AUTO-UPDATE
// ══════════════════════════════════════════════════════════════════════
function setupAutoUpdater() {
  // Nie sprawdzaj aktualizacji w trybie dev
  if (!app.isPackaged) return
  // Na Linuksie aktualizator zastępuje uruchomiony plik AppImage.
  // Inne formaty paczek wymagają aktualizacji przez menedżer pakietów.
  if (process.platform === 'linux' && !process.env.APPIMAGE) return

  autoUpdater.autoDownload = false         // NIE pobieraj automatycznie — czekaj na żądanie użytkownika
  autoUpdater.autoInstallOnAppQuit = true  // zainstaluj przy zamknięciu

  let updateDismissed = false              // true = użytkownik kliknął "Może później" — nie pokazuj w tej sesji

  const getWin = () => BrowserWindow.getAllWindows()[0]

  autoUpdater.on('checking-for-update', () => {
    getWin()?.webContents.send('update-status', { status: 'checking' })
  })

  autoUpdater.on('update-available', info => {
    if (updateDismissed) return            // użytkownik już odrzucił — nie pokazuj ponownie
    getWin()?.webContents.send('update-status', {
      status: 'available',
      version: info.version,
    })
  })

  autoUpdater.on('update-not-available', () => {
    getWin()?.webContents.send('update-status', { status: 'not-available' })
  })

  autoUpdater.on('download-progress', progress => {
    getWin()?.webContents.send('update-status', {
      status: 'downloading',
      percent: Math.round(progress.percent),
      speed:   progress.bytesPerSecond,
    })
  })

  autoUpdater.on('update-downloaded', info => {
    getWin()?.webContents.send('update-status', {
      status: 'downloaded',
      version: info.version,
    })
  })

  autoUpdater.on('error', err => {
    getWin()?.webContents.send('update-status', {
      status: 'error',
      message: err.message,
    })
  })

  autoUpdater.on('appimage-filename-updated', newPath => {
    _registerLinuxDesktopEntry(newPath)
  })

  // Renderer prosi o rozpoczęcie pobierania
  ipcMain.on('update-download-now', () => {
    autoUpdater.downloadUpdate().catch(err => {
      getWin()?.webContents.send('update-status', {
        status: 'error',
        message: err.message,
      })
    })
  })

  // Renderer prosi o restart i instalację
  ipcMain.on('update-install-now', () => {
    autoUpdater.quitAndInstall(false, true)
  })

  // Renderer odrzucił aktualizację — nie pokazuj w tej sesji
  ipcMain.on('update-dismiss', () => {
    updateDismissed = true
  })

  // Sprawdź aktualizacje po 3 sekundach od startu
  setTimeout(() => autoUpdater.checkForUpdates().catch(err => {
    console.error('[Updater] update check failed:', err.message)
  }), 3000)

  // Sprawdzaj co godzinę
  setInterval(() => autoUpdater.checkForUpdates().catch(err => {
    console.error('[Updater] update check failed:', err.message)
  }), 60 * 60 * 1000)
}
