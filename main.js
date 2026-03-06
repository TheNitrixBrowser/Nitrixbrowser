const { app, BrowserWindow, ipcMain, session, shell, Menu } = require('electron')
const path = require('path')
const fs   = require('fs')
const { autoUpdater } = require('electron-updater')

// ── Folder danych — MUSI być przed app.ready i przed wszystkim ────────
const dataDir = path.join(app.getPath('appData'), 'Nitrix')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
app.setPath('userData', dataDir)

// ── Flagi Chromium ────────────────────────────────────────────────────
app.commandLine.appendSwitch('enable-quic')
app.commandLine.appendSwitch('quic-version', 'h3')
app.commandLine.appendSwitch('enable-features',
  'NetworkServiceInProcess,ParallelDownloading,PrefetchDNSWithURLRequests,AsyncDns,TcpFastOpenConnectRetry,V8VmFuture,SharedArrayBuffer'
)
app.commandLine.appendSwitch('disable-features',
  'OutOfBlinkCors,TranslateUI,MediaRouter,DialMediaRouteProvider,AutofillServerCommunication,OptimizationHints,Translate,HeavyAdIntervention,LazyImageLoading'
)
app.commandLine.appendSwitch('disk-cache-size',  String(512 * 1024 * 1024))
app.commandLine.appendSwitch('media-cache-size', String(128 * 1024 * 1024))
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=1024 --turbofan')
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-zero-copy')
app.commandLine.appendSwitch('ignore-gpu-blocklist')
app.commandLine.appendSwitch('enable-accelerated-video-decode')
app.commandLine.appendSwitch('enable-accelerated-2d-canvas')
app.commandLine.appendSwitch('max-connections-per-proxy', '32')
app.commandLine.appendSwitch('host-resolver-rules', '')
app.commandLine.appendSwitch('disable-background-networking', 'false')
app.commandLine.appendSwitch('renderer-process-limit', '10')

// ── Pliki danych ──────────────────────────────────────────────────────
const settingsFile  = path.join(dataDir, 'settings.json')
const bookmarksFile = path.join(dataDir, 'bookmarks.json')
const historyFile   = path.join(dataDir, 'history.json')

function loadSettings() {
  try {
    if (fs.existsSync(settingsFile))
      return JSON.parse(fs.readFileSync(settingsFile, 'utf8'))
  } catch(e) {}
  return { theme: 'light' }
}
function saveSettings(data) {
  try { fs.writeFileSync(settingsFile, JSON.stringify({ ...loadSettings(), ...data }, null, 2)) } catch(e) {}
}

function loadBookmarks() {
  try {
    if (fs.existsSync(bookmarksFile))
      return JSON.parse(fs.readFileSync(bookmarksFile, 'utf8'))
  } catch(e) {}
  return []
}
function saveBookmarks(data) {
  try { fs.writeFileSync(bookmarksFile, JSON.stringify(data, null, 2)) } catch(e) {}
}

function loadHistory() {
  try {
    if (fs.existsSync(historyFile))
      return JSON.parse(fs.readFileSync(historyFile, 'utf8'))
  } catch(e) {}
  return []
}
function saveHistory(data) {
  try { fs.writeFileSync(historyFile, JSON.stringify(data, null, 2)) } catch(e) {}
}

let _historyCache = null
let _historySaveTimer = null

function getHistoryCache() {
  if (_historyCache === null) _historyCache = loadHistory()
  return _historyCache
}
function scheduleSaveHistory() {
  if (_historySaveTimer) clearTimeout(_historySaveTimer)
  _historySaveTimer = setTimeout(() => {
    if (_historyCache !== null) saveHistory(_historyCache)
  }, 1000)
}

function addHistoryEntry(entry) {
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

ipcMain.on('window-minimize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.minimize()
})
ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
})
ipcMain.on('window-close', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) win.destroy()
})

ipcMain.handle('settings-load',  () => loadSettings())
ipcMain.handle('settings-save',  (e, data) => { saveSettings(data); return true })
ipcMain.handle('bookmarks-load', () => loadBookmarks())
ipcMain.handle('bookmarks-save', (e, data) => { saveBookmarks(data); return true })

ipcMain.handle('history-load',   () => getHistoryCache())
ipcMain.handle('history-add',    (e, entry) => { addHistoryEntry(entry); return true })
ipcMain.handle('history-delete', (e, timestamp) => {
  _historyCache = getHistoryCache().filter(h => h.timestamp !== timestamp)
  scheduleSaveHistory()
  return true
})
ipcMain.handle('history-clear',  () => { _historyCache = []; scheduleSaveHistory(); return true })
ipcMain.handle('open-file', (e, filePath) => {
  if (filePath) shell.openPath(filePath)
  return true
})

// ── Pokaż plik w eksploratorze ────────────────────────────────────
ipcMain.handle('show-in-folder', (e, filePath) => {
  if (filePath) shell.showItemInFolder(filePath)
  return true
})

// ── Sprawdź plik — zwraca { exists, mtimeMs } ─────────────────────
ipcMain.handle('file-exists', (e, filePath) => {
  if (!filePath) return { exists: false, mtimeMs: 0 }
  try {
    const stat = fs.statSync(filePath)
    return { exists: true, mtimeMs: stat.mtimeMs }
  } catch { return { exists: false, mtimeMs: 0 } }
})

// ── RAM konkretnej karty (po webContentsId) ───────────────────────
ipcMain.handle('get-ram-usage', async (e, webContentsId) => {
  try {
    const all = await app.getAppMetrics()
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

function setupDownloadHandling(win, wvSession) {
  wvSession.on('will-download', (event, item) => {
    const dlId = ++downloadIdCounter
    let lastBytes = 0
    let lastTime  = Date.now()
    let speedSamples = []

    // Powiadom renderer że zaczęło się pobieranie
    win.webContents.send('download-started', {
      id:         dlId,
      filename:   item.getFilename(),
      totalBytes: item.getTotalBytes(),
    })

    item.on('updated', () => {
      const now      = Date.now()
      const received = item.getReceivedBytes()
      const total    = item.getTotalBytes()
      const dt = (now - lastTime) / 1000
      const db = received - lastBytes

      if (dt >= 0.15) {
        speedSamples.push(db / dt)
        if (speedSamples.length > 6) speedSamples.shift()
        lastBytes = received
        lastTime  = now
      }

      const speed = speedSamples.length
        ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length
        : 0

      win.webContents.send('download-progress', {
        id:            dlId,
        filename:      item.getFilename(),
        receivedBytes: received,
        totalBytes:    total,
        speed,
      })
    })

    item.once('done', (e, state) => {
      win.webContents.send('download-done', {
        id:         dlId,
        filename:   item.getFilename(),
        state,           // 'completed' | 'cancelled' | 'interrupted'
        savePath:   item.getSavePath(),
        totalBytes: item.getTotalBytes(),
      })
    })
  })
}

// ── Tworzenie okna ────────────────────────────────────────────────────
// ── Cache certyfikatów — globalny, współdzielony ─────────────────
const crypto = require('crypto')
const certCache = new Map()

ipcMain.handle('get-cert-info', (e, hostname) => {
  return certCache.get(hostname) || null
})

function createWindow() {
  const settings = loadSettings()

  const win = new BrowserWindow({
    width: 1280, height: 800,
    minWidth: 900, minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: settings.theme === 'dark' ? '#202124' : '#f1f3f4',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webviewTag: true,
      backgroundThrottling: false,
      v8CacheOptions: 'bypassHeatCheck',
    },
  })

  win.loadFile('index.html')
  win.maximize()

  // Blokuj nowe okna z głównego renderer procesu
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  app.whenReady().then(() => {
    const wvSession = session.fromPartition('persist:main')

    // ── Przechwytuj certyfikaty — zapisuj do cache ──────────────────
    wvSession.setCertificateVerifyProc((request, callback) => {
      try {
        const pem = request.certificate.data
        // SHA-256 całego certyfikatu
        const derBase64 = pem.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\s/g, '')
        const der = Buffer.from(derBase64, 'base64')
        const sha256 = crypto.createHash('sha256').update(der).digest('hex')

        // SHA-256 klucza publicznego (SubjectPublicKeyInfo)
        let pkSha256 = null
        try {
          const x509 = new crypto.X509Certificate(pem)
          const spki = x509.publicKey.export({ type: 'spki', format: 'der' })
          pkSha256 = crypto.createHash('sha256').update(spki).digest('hex')
        } catch(e) {}

        certCache.set(request.hostname, {
          cert:     request.certificate,
          valid:    request.errorCode === 0,
          error:    request.error || null,
          sha256,
          pkSha256,
        })
      } catch(e) {
        certCache.set(request.hostname, {
          cert:  request.certificate,
          valid: request.errorCode === 0,
          error: request.error || null,
          sha256: null,
          pkSha256: null,
        })
      }
      callback(-3) // -3 = użyj domyślnej weryfikacji
    })

    // ← NOWE: podłącz obsługę pobierania
    setupDownloadHandling(win, wvSession)

    const topDomains = [
      'https://www.google.pl',
      'https://www.google.com',
      'https://www.youtube.com',
      'https://accounts.google.com',
    ]
    topDomains.forEach(url => {
      try { wvSession.preconnect({ url, numSockets: 2 }) } catch(e) {}
    })
  })
}

app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ── Przechwytuj wszystkie nowe okna/popupy — otwieraj jako nowa karta ──
app.on('web-contents-created', (e, wc) => {
  wc.setWindowOpenHandler(({ url }) => {
    if (!url || url === 'about:blank') return { action: 'deny' }
    const win = BrowserWindow.getAllWindows()[0]
    if (win) win.webContents.send('open-in-new-tab', url)
    return { action: 'deny' }
  })
})

// ══════════════════════════════════════════════════════════════════════
//  AUTO-UPDATE
// ══════════════════════════════════════════════════════════════════════
function setupAutoUpdater() {
  // Nie sprawdzaj aktualizacji w trybie dev
  if (!app.isPackaged) return

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

  // Renderer prosi o rozpoczęcie pobierania
  ipcMain.on('update-download-now', () => {
    autoUpdater.downloadUpdate()
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
  setTimeout(() => autoUpdater.checkForUpdates(), 3000)

  // Sprawdzaj co godzinę
  setInterval(() => autoUpdater.checkForUpdates(), 60 * 60 * 1000)
}