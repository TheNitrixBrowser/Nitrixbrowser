const { contextBridge, ipcRenderer } = require('electron')

// process jest globalnym obiektem Node.js — nie pochodzi z modułu 'electron'
const isPrivateWindow = Array.isArray(process.argv) && process.argv.includes('--nitrix-private')

// ── Helpery walidacji ─────────────────────────────────────────────────
const isString  = (v) => typeof v === 'string'
const isNumber  = (v) => typeof v === 'number' && Number.isFinite(v)
const isObject  = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isArray   = (v) => Array.isArray(v)

// Bezpieczna ścieżka — tylko string, bez null bytes
const isSafePath = (v) => isString(v) && v.length > 0 && !v.includes('\0')

// Hostname — tylko litery, cyfry, myślniki, kropki
const isSafeHostname = (v) => isString(v) && /^[a-zA-Z0-9.\-]{1,253}$/.test(v)

function isAllowedLocalHtmlUrl(v) {
  if (!isString(v)) return false
  try {
    const parsed = new URL(v)
    if (parsed.protocol !== 'file:') return false
    return /\.(html?|shtml|xhtml|xht|mhtml|mht)$/i.test(decodeURIComponent(parsed.pathname || ''))
  } catch {
    return false
  }
}

function isAllowedTabUrl(v) {
  return isString(v) && (
    /^(https?:\/\/|data:image\/(png|jpeg|jpg|gif|webp|svg\+xml|bmp|avif);base64,)/i.test(v) ||
    isAllowedLocalHtmlUrl(v)
  )
}

function getInitialLaunchUrl() {
  if (!Array.isArray(process.argv)) return null
  const arg = process.argv.find(v => isString(v) && v.startsWith('--nitrix-initial-url='))
  if (!arg) return null
  try {
    const encoded = arg.slice('--nitrix-initial-url='.length)
    const url = Buffer.from(encoded, 'base64url').toString('utf8')
    return isAllowedTabUrl(url) ? url : null
  } catch {
    return null
  }
}

// Walidacja kształtu wpisu historii
function isValidHistoryEntry(e) {
  if (!isObject(e)) return false
  if (!isString(e.url) || e.url.length > 2048) return false
  if (!isString(e.title) || e.title.length > 512) return false
  if (!isNumber(e.timestamp)) return false
  return true
}

// Walidacja kształtu zakładki
function isValidBookmark(b) {
  if (!isObject(b)) return false
  if (!isString(b.name) || b.name.length > 512) return false
  if (!isString(b.url)  || b.url.length > 2048) return false
  return true
}

// Walidacja obiektu ustawień — tylko znane klucze, znane typy
const ALLOWED_THEMES    = ['dark', 'light', 'private', 'transparent']
const ALLOWED_ENGINES   = ['google', 'duckduckgo', 'bing', 'brave', 'ecosia', 'yahoo', 'custom']
const ALLOWED_BKBAR     = ['always', 'newtab', 'never']
const ALLOWED_PRIVSUGG  = ['all', 'history', 'bookmarks', 'none']
const ALLOWED_HOMEPAGE  = ['google', 'duckduckgo', 'bing', 'custom']
const ALLOWED_STARTUP = ['homepage', 'last', 'custom', 'bookmarks']

function isValidSettings(s) {
  if (!isObject(s)) return false
  if ('theme'                  in s && !ALLOWED_THEMES.includes(s.theme))                   return false
  if ('searchEngine'           in s && !ALLOWED_ENGINES.includes(s.searchEngine))            return false
  if ('bkBarMode'              in s && !ALLOWED_BKBAR.includes(s.bkBarMode))                 return false
  if ('privateSuggestionsMode' in s && !ALLOWED_PRIVSUGG.includes(s.privateSuggestionsMode)) return false
  if ('homepage'               in s && !ALLOWED_HOMEPAGE.includes(s.homepage))               return false
  if ('startupBehavior'        in s && !ALLOWED_STARTUP.includes(s.startupBehavior))         return false
  if ('expandBar'              in s && typeof s.expandBar           !== 'boolean') return false
  if ('historySuggestions'     in s && typeof s.historySuggestions  !== 'boolean') return false
  if ('bookmarkSuggestions'    in s && typeof s.bookmarkSuggestions !== 'boolean') return false
  if ('homepageUrl'            in s && (!isString(s.homepageUrl)         || s.homepageUrl.length > 2048))       return false
  if ('customHomepageUrl'      in s && (!isString(s.customHomepageUrl)   || s.customHomepageUrl.length > 2048)) return false
  if ('startupCustomUrl'       in s && (!isString(s.startupCustomUrl)    || s.startupCustomUrl.length > 2048))  return false
  if ('lastOpenedUrl'          in s && (!isString(s.lastOpenedUrl)       || s.lastOpenedUrl.length > 2048))     return false
  return true
}

contextBridge.exposeInMainWorld('electronAPI', {
  features: {
    init: () => ipcRenderer.invoke('features-init'),
    snapshot: (snapshot, count) => ipcRenderer.send('features-snapshot', snapshot, count),
    consumeRecovery: keys => ipcRenderer.invoke('features-recovery-consume', keys),
    saveOptions: options => ipcRenderer.invoke('features-options', options),
    exportBookmarks: () => ipcRenderer.invoke('features-export-bookmarks'),
    siteGet: id => ipcRenderer.invoke('features-site-get', id),
    siteSet: (id, origin, permission, value) => ipcRenderer.invoke('features-site-set', id, origin, permission, value),
    siteClear: (id, origin) => ipcRenderer.invoke('features-site-clear', id, origin),
    canSleep: (id, manual = false) => ipcRenderer.invoke('features-can-sleep', id, manual === true),
    answerPermission: (token, allow, remember) => ipcRenderer.invoke('features-permission-answer', token, allow, remember),
    onPermission: cb => {
      ipcRenderer.removeAllListeners('features-permission-prompt')
      ipcRenderer.on('features-permission-prompt', (_e, value) => cb(value))
    },
    onPermissionCancel: cb => {
      ipcRenderer.removeAllListeners('features-permission-cancel')
      ipcRenderer.on('features-permission-cancel', (_e, token) => cb(token))
    },
    answerClose: (token, close, remember) => ipcRenderer.invoke('features-close-answer', token, close, remember),
    onClosePrompt: cb => {
      ipcRenderer.removeAllListeners('features-close-prompt')
      ipcRenderer.on('features-close-prompt', (_e, value) => cb(value))
    },
    onOptions: cb => {
      ipcRenderer.removeAllListeners('features-options-changed')
      ipcRenderer.on('features-options-changed', (_e, value) => cb(value))
    }
  },
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close:    () => ipcRenderer.send('window-close'),
  getInitialLaunchUrl: () => getInitialLaunchUrl(),

  // ── Ustawienia ──
  loadSettings: () => ipcRenderer.invoke('settings-load'),
  backdropColors: id => Number.isInteger(id) ? ipcRenderer.invoke('backdrop-colors', id) : Promise.resolve(null),
  captureTabBackground: id => Number.isInteger(id) ? ipcRenderer.invoke('capture-tab-background', id) : Promise.resolve(null),
  backdropTextMask: (id, regions) => Number.isInteger(id) && Array.isArray(regions) && regions.length <= 32
    ? ipcRenderer.invoke('backdrop-text-mask', id, regions) : Promise.resolve(false),
  backdropRasterMask: (id,regions) => Number.isInteger(id) && Array.isArray(regions) && regions.length<=32
    ? ipcRenderer.invoke('backdrop-raster-mask',id,regions) : Promise.resolve(null),
  onBackdropInvalidated: cb => {
    const listener=(_event,id)=>cb(id)
    ipcRenderer.on('backdrop-invalidated',listener)
    return ()=>ipcRenderer.removeListener('backdrop-invalidated',listener)
  },
  setWindowTheme: theme => ALLOWED_THEMES.includes(theme)
    ? ipcRenderer.invoke('window-theme', theme) : Promise.resolve(null),
  setAeroRegions: layout => layout && Array.isArray(layout.regions) && layout.regions.length <= 3
    && Number.isFinite(layout.strength) && layout.strength >= 0 && layout.strength <= 100
    ? ipcRenderer.invoke('window-aero-regions', layout) : Promise.resolve(false),
  saveSettings: (data) => {
    if (!isValidSettings(data)) return Promise.resolve(false)
    return ipcRenderer.invoke('settings-save', data)
  },

  // ── Domyślna przeglądarka ──
  isDefaultBrowser:  () => ipcRenderer.invoke('default-browser-is'),
  setDefaultBrowser: () => ipcRenderer.invoke('default-browser-set'),

  // ── Zakładki ──
  loadBookmarks: () => ipcRenderer.invoke('bookmarks-load'),
  saveBookmarks: (data) => {
    if (!isArray(data) || !data.every(isValidBookmark)) return Promise.resolve(false)
    return ipcRenderer.invoke('bookmarks-save', data)
  },

  // ── Historia ──
  loadHistory:   () => ipcRenderer.invoke('history-load'),
  addHistory:    (entry) => {
    if (!isValidHistoryEntry(entry)) return Promise.resolve(false)
    return ipcRenderer.invoke('history-add', entry)
  },
  deleteHistory: (timestamp) => {
    if (!isNumber(timestamp)) return Promise.resolve(false)
    return ipcRenderer.invoke('history-delete', timestamp)
  },
  clearHistory: () => ipcRenderer.invoke('history-clear'),

  // ── Pobieranie — tylko odbiór zdarzeń z main procesu ──
  // Używamy removeAllListeners przed on() żeby nie akumulować listenerów
  // przy wielokrotnym wywołaniu (np. po hot-reload w dev)
  onDownloadStarted:  (cb) => {
    ipcRenderer.removeAllListeners('download-started')
    ipcRenderer.on('download-started',  (_e, data) => cb(data))
  },
  onDownloadProgress: (cb) => {
    ipcRenderer.removeAllListeners('download-progress')
    ipcRenderer.on('download-progress', (_e, data) => cb(data))
  },
  onDownloadDone:     (cb) => {
    ipcRenderer.removeAllListeners('download-done')
    ipcRenderer.on('download-done',     (_e, data) => cb(data))
  },
  onDownloadState:    (cb) => {
    ipcRenderer.removeAllListeners('download-state')
    ipcRenderer.on('download-state',    (_e, data) => cb(data))
  },
  onNetworkStatus: (cb) => {
    ipcRenderer.removeAllListeners('network-status')
    ipcRenderer.on('network-status', (_e, data) => cb(data))
  },
  isOnline: () => ipcRenderer.sendSync('is-online-sync'),
  downloadPause:  (id) => {
    if (!isNumber(id)) return
    ipcRenderer.send('download-pause', id)
  },
  downloadResume: (id) => {
    if (!isNumber(id)) return
    ipcRenderer.send('download-resume', id)
  },
  downloadCancel: (id) => {
    if (!isNumber(id)) return
    ipcRenderer.send('download-cancel', id)
  },

  // ── Plik — tylko pliki z folderu pobrań, z resolwowaniem ścieżki ──
  openFile:     (filePath) => {
    if (!isSafePath(filePath)) return Promise.resolve(false)
    return ipcRenderer.invoke('open-file', filePath)
  },
  showInFolder: (filePath) => {
    if (!isSafePath(filePath)) return Promise.resolve(false)
    return ipcRenderer.invoke('show-in-folder', filePath)
  },
  fileExists:   (filePath) => {
    if (!isSafePath(filePath)) return Promise.resolve({ exists: false, mtimeMs: 0 })
    return ipcRenderer.invoke('file-exists', filePath)
  },

  // ── Auto-update ──
  onUpdateStatus: (cb) => {
    ipcRenderer.removeAllListeners('update-status')
    ipcRenderer.on('update-status', (_e, data) => cb(data))
  },
  installUpdate:  () => ipcRenderer.send('update-install-now'),
  downloadUpdate: () => ipcRenderer.send('update-download-now'),
  dismissUpdate:  () => ipcRenderer.send('update-dismiss'),

  // ── Certyfikat ──
  getCertInfo: (hostname) => {
    if (!isSafeHostname(hostname)) return Promise.resolve(null)
    return ipcRenderer.invoke('get-cert-info', hostname)
  },

  // ── RAM ──
  getRamUsage: (webContentsId) => {
    if (!isNumber(webContentsId)) return Promise.resolve({ mb: null })
    return ipcRenderer.invoke('get-ram-usage', webContentsId)
  },

  // ── Menu kontekstowe ──
  showContextMenu:     () => ipcRenderer.send('show-context-menu'),
  onContextMenuAction: (cb) => {
    ipcRenderer.removeAllListeners('context-menu-action')
    ipcRenderer.on('context-menu-action', (_e, action) => cb(action))
  },

  // ── Nowa karta z linku ──
  onOpenInNewTab: (cb) => {
    ipcRenderer.removeAllListeners('open-in-new-tab')
    ipcRenderer.on('open-in-new-tab', (_e, url) => {
      if (isAllowedTabUrl(url)) cb(url)
    })
  },

  reloadPage: (webContentsId, ignoreCache = false) => {
    if (!isNumber(webContentsId) || typeof ignoreCache !== 'boolean') return Promise.resolve(false)
    return ipcRenderer.invoke('browser-reload-page', webContentsId, ignoreCache)
  },
  stopPage: id => isNumber(id) ? ipcRenderer.invoke('browser-stop-page',id) : Promise.resolve(null),
  quitNitrixShortcut: () => ipcRenderer.send('quit-nitrix-shortcut'),
  findInPage: (webContentsId, text, forward, findNext) => {
    if (!isNumber(webContentsId) || !isString(text) || text.length > 4096
      || typeof forward !== 'boolean' || typeof findNext !== 'boolean') return Promise.resolve(null)
    return ipcRenderer.invoke('browser-find-in-page', webContentsId, text, forward, findNext)
  },
  stopFindInPage: (webContentsId) => {
    if (!isNumber(webContentsId)) return Promise.resolve(false)
    return ipcRenderer.invoke('browser-stop-find-in-page', webContentsId)
  },
  onBrowserShortcut: (cb) => {
    ipcRenderer.removeAllListeners('browser-shortcut')
    ipcRenderer.on('browser-shortcut', (_e, data) => cb(data))
  },
  onPageFindResult: (cb) => {
    ipcRenderer.removeAllListeners('page-find-result')
    ipcRenderer.on('page-find-result', (_e, data) => cb(data))
  },

  // ── DevTools strony w webview ──
  openWebviewDevTools: (webContentsId, action) => {
    if (!isNumber(webContentsId)) return
    ipcRenderer.send('open-webview-devtools', webContentsId, ['console','source'].includes(action)?action:undefined)
  },

  // ── Menedżer haseł ──
  passwordsLoad:          ()       => ipcRenderer.invoke('passwords-load'),
  passwordsList:          ()       => ipcRenderer.invoke('passwords-list'),
  passwordsLock:          ()       => ipcRenderer.invoke('passwords-lock'),
  autofillSkipGet:        ()       => ipcRenderer.invoke('passwords-autofill-skip-get'),
  autofillSkipSet:        enabled  => typeof enabled === 'boolean'
    ? ipcRenderer.invoke('passwords-autofill-skip-set', enabled) : Promise.resolve(false),
  autofillPassword:       (id, site, user) => isNumber(id) && isString(site) && isString(user)
    ? ipcRenderer.invoke('passwords-autofill', { id, site, user }) : Promise.resolve(false),
  passwordsSave:          (arr)    => {
    if (!Array.isArray(arr)) return Promise.resolve(false)
    return ipcRenderer.invoke('passwords-save', arr)
  },
  passwordsClear:         ()       => ipcRenderer.invoke('passwords-clear'),
  pinLoad:                ()       => ipcRenderer.invoke('pin-load'),
  pinSave:                (pin)    => {
    if (typeof pin !== 'string' || !/^\d{4,12}$/.test(pin)) return Promise.resolve(false)
    return ipcRenderer.invoke('pin-save', pin)
  },
  pinClear:               ()       => ipcRenderer.invoke('pin-clear'),
  pinHas:                 ()       => ipcRenderer.invoke('pin-has'),
  pinVerify:              (pin)    => {
    if (typeof pin !== 'string' || !/^\d{4,12}$/.test(pin)) return Promise.resolve(false)
    return ipcRenderer.invoke('pin-verify', pin)
  },
  safeStorageAvailable:   ()       => ipcRenderer.invoke('safe-storage-available'),

  // ── Adblock — sterowanie per-karta + odbiór statystyk ──
  adblockSetTab: (webContentsId, enabled) => {
    if (!isNumber(webContentsId)) return
    ipcRenderer.send('adblock-set-tab', { webContentsId, enabled: !!enabled })
  },
  onAdblockBlocked: (cb) => {
    ipcRenderer.removeAllListeners('adblock-blocked')
    ipcRenderer.on('adblock-blocked', (_e, data) => cb(data))
  },
  onNavigateTabBlock: (cb) => {
    ipcRenderer.removeAllListeners('navigate-tab-block')
    ipcRenderer.on('navigate-tab-block', (_e, data) => cb(data))
  },

  // ── Ustawienia Adblock ──
  adblockSettingsLoad:  () => ipcRenderer.invoke('adblock-settings-load'),
  adblockSettingsSave:  (data) => {
    if (!isObject(data)) return Promise.resolve(false)
    return ipcRenderer.invoke('adblock-settings-save', data)
  },
  adblockRefreshLists:  () => ipcRenderer.invoke('adblock-refresh-lists'),
  adblockListsInfo:     () => ipcRenderer.invoke('adblock-lists-info'),
  onAdblockGlobalState: (cb) => {
    ipcRenderer.removeAllListeners('adblock-global-state')
    ipcRenderer.on('adblock-global-state', (_e, data) => cb(data))
  },

  // ── Własne filtry użytkownika (Moje Filtry) ──
  customFiltersLoad:    ()     => ipcRenderer.invoke('custom-filters-load'),
  customFiltersSave:    (text) => {
    if (typeof text !== 'string' || text.length > 200000) return Promise.resolve(false)
    return ipcRenderer.invoke('custom-filters-save', text)
  },
  customFiltersCosmetic: () => ipcRenderer.invoke('custom-filters-cosmetic'),

  // ── Własne zablokowane elementy (element picker) ──
  customBlockedLoad: ()     => ipcRenderer.invoke('custom-blocked-load'),
  customBlockedSave: (data) => {
    if (!isObject(data)) return Promise.resolve(false)
    return ipcRenderer.invoke('custom-blocked-save', data)
  },

  // ── Tryb prywatny ──
  isPrivate:         isPrivateWindow,
  openPrivateWindow: () => ipcRenderer.send('open-private-window'),
  openNormalWindow: () => ipcRenderer.send('open-normal-window'),

  // ── Niszczyciel Nitrix — usuń wszystkie dane przeglądarki ──
  nitrixDestroy: (options) => {
    if (!isObject(options)) return Promise.resolve(false)
    return ipcRenderer.invoke('nitrix-destroy', {
      clearHistory:   !!options.clearHistory,
      clearBookmarks: !!options.clearBookmarks,
      clearCookies:   !!options.clearCookies,
      clearCache:     !!options.clearCache,
      clearStorage:   !!options.clearStorage,
    })
  },

  // ── Zapisz stronę / obraz ──
  savePage: (webContentsId, title, url, context, pageUrl) => {
    if (!isNumber(webContentsId)) return Promise.resolve(false)
    if (!isString(title))   title   = 'strona'
    if (!isString(url))     url     = ''
    if (!isString(context)) context = 'page'
    if (!['page', 'image'].includes(context)) context = 'page'
    if (!isString(pageUrl)) pageUrl = ''
    return ipcRenderer.invoke('save-page', { webContentsId, title, url, context, pageUrl })
  },

  // ── Hibernacja kart ──
  tabSetActive: (activeWcId) => {
    if (!isNumber(activeWcId)) return
    ipcRenderer.send('tab-set-active', { activeWcId })
  },
  tabHibernate: (wcId) => {
    if (!isNumber(wcId)) return
    ipcRenderer.send('tab-hibernate', { wcId })
  },
  tabWake: (wcId) => {
    if (!isNumber(wcId)) return
    ipcRenderer.send('tab-wake', { wcId })
  },
  tabMediaUpdate: (wcId, playing) => {
    if (!isNumber(wcId)) return
    ipcRenderer.send('tab-media-update', { wcId, playing: !!playing })
  },

  // ── Import z innych przeglądarek ──
  browserImportDetect: () => ipcRenderer.invoke('browser-import-detect'),
  browserImportRun: (opts) => {
    if (!isObject(opts)) return Promise.resolve({ ok: false })
    if (!isString(opts.browserId)) return Promise.resolve({ ok: false })
    return ipcRenderer.invoke('browser-import-run', {
      browserId:       String(opts.browserId),
      importBookmarks: !!opts.importBookmarks,
      importHistory:   !!opts.importHistory,
    })
  },
})
