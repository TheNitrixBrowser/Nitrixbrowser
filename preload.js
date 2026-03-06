const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimize:       () => ipcRenderer.send('window-minimize'),
  maximize:       () => ipcRenderer.send('window-maximize'),
  close:          () => ipcRenderer.send('window-close'),
  loadSettings:   () => ipcRenderer.invoke('settings-load'),
  saveSettings:   (data) => ipcRenderer.invoke('settings-save', data),
  loadBookmarks:  () => ipcRenderer.invoke('bookmarks-load'),
  saveBookmarks:  (data) => ipcRenderer.invoke('bookmarks-save', data),
  loadHistory:    () => ipcRenderer.invoke('history-load'),
  addHistory:     (entry) => ipcRenderer.invoke('history-add', entry),
  deleteHistory:  (timestamp) => ipcRenderer.invoke('history-delete', timestamp),
  clearHistory:   () => ipcRenderer.invoke('history-clear'),
  onDownloadStarted:  (cb) => ipcRenderer.on('download-started',  (_e, data) => cb(data)),
  onDownloadProgress: (cb) => ipcRenderer.on('download-progress', (_e, data) => cb(data)),
  onDownloadDone:     (cb) => ipcRenderer.on('download-done',     (_e, data) => cb(data)),

  // ── Plik ──
  openFile:     (filePath) => ipcRenderer.invoke('open-file', filePath),
  showInFolder: (filePath) => ipcRenderer.invoke('show-in-folder', filePath),
  fileExists:   (filePath) => ipcRenderer.invoke('file-exists', filePath),

  // ── Auto-update ──
  onUpdateStatus: (cb) => ipcRenderer.on('update-status', (_e, data) => cb(data)),
  installUpdate:  () => ipcRenderer.send('update-install-now'),
  downloadUpdate: () => ipcRenderer.send('update-download-now'),
  dismissUpdate:  () => ipcRenderer.send('update-dismiss'),

  // ── Certyfikat ──
  getCertInfo: (hostname) => ipcRenderer.invoke('get-cert-info', hostname),

  // ── RAM ──
  getRamUsage: (webContentsId) => ipcRenderer.invoke('get-ram-usage', webContentsId),

  // ── Menu kontekstowe ──
  showContextMenu:     () => ipcRenderer.send('show-context-menu'),
  onContextMenuAction: (cb) => ipcRenderer.on('context-menu-action', (_e, action) => cb(action)),

  // ── Nowa karta z linku ──
  onOpenInNewTab: (cb) => ipcRenderer.on('open-in-new-tab', (_e, url) => cb(url)),
})