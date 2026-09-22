const { ipcRenderer } = require('electron')
ipcRenderer.send('security-probe', { sandboxed: process.sandboxed, isolated: process.contextIsolated })
