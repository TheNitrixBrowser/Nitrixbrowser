'use strict'
const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const http = require('node:http')
const assert = require('node:assert/strict')
const { hardenWebview } = require('../browser-core')["webview-security"]
const { configureWhatsApp } = require('../browser-core')["whatsapp-compat"]
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'nitrix-security-smoke-'))
const partition = process.argv.includes('--private') ? 'persist:nitrix_private' : 'persist:main'
app.setPath('userData', profile)
app.enableSandbox()
let win, server, guest, probe
const watchdog = setTimeout(() => finish(new Error('Test timeout')), 55000)
function finish(error) {
  clearTimeout(watchdog)
  if (error) console.error(error)
  if (win && !win.isDestroyed()) win.destroy()
  if (server) server.close()
  app.exit(error ? 1 : 0)
}
ipcMain.on('security-probe', (event, data) => {
  if (event.sender.getType() === 'webview') probe = data
})
app.whenReady().then(async () => {
  server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.end(req.url === '/host' ? `<html><body><webview id="tab" partition="${partition}" src="/page" webpreferences="sandbox=no,nodeIntegration=yes,contextIsolation=no" style="width:800px;height:600px"></webview></body></html>` : '<html><title>Local security probe</title><body>Local test</body></html>')
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  win = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, webviewTag: true } })
  win.webContents.on('will-attach-webview', (event, prefs, params) => {
    hardenWebview(event, prefs, params, partition)
    // Wyłącznie testowy preload raportuje faktyczny stan procesu.
    prefs.preload = path.join(__dirname, 'electron-security-preload.cjs')
  })
  const attached = new Promise(resolve => win.webContents.once('did-attach-webview', (_event, contents) => {
    guest = contents
    configureWhatsApp(guest)
    guest.once('did-finish-load', resolve)
  }))
  await win.loadURL(base + '/host')
  await attached
  const prefs = guest.getLastWebPreferences()
  const page = await guest.executeJavaScript('({ node: typeof require, bridge: typeof electronAPI, ua: navigator.userAgent })')
  assert.equal(prefs.sandbox, true)
  assert.equal(prefs.nodeIntegration, false)
  assert.equal(prefs.contextIsolation, true)
  assert.equal(probe?.sandboxed, true)
  assert.equal(page.node, 'undefined')
  assert.equal(page.bridge, 'undefined')
  console.log('SANDBOX PASS', JSON.stringify({ partition, probe, node: page.node, bridge: page.bridge, chrome: process.versions.chrome }))
  if (process.argv.includes('--whatsapp')) {
    await guest.loadURL('https://web.whatsapp.com/')
    const state = await guest.executeJavaScript('({ title: document.title, ua: navigator.userAgent, text: document.body.innerText.slice(0,2500) })')
    console.log('WHATSAPP', JSON.stringify(state))
    await guest.loadURL(base + '/page')
    console.log('RESTORED_UA', await guest.executeJavaScript('navigator.userAgent'))
  }
  finish()
}).catch(finish)
