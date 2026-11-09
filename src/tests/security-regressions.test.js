'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const read = name => fs.readFileSync(path.join(root, name), 'utf8')
const main = read('main.js')
const renderer = read('renderer.js')
const core = read('browser-core.js')
const html = read('index.html')

test('popups from page content are http(s)-only and go to the owner window', () => {
  const start = main.indexOf('  wc.setWindowOpenHandler(({ url }) => {')
  assert.notEqual(start, -1)
  const block = main.slice(start, main.indexOf("  wc.on('did-finish-load'", start))
  assert.ok(block.includes(String.raw`if (!url || !/^https?:\/\//i.test(url))`))
  assert.ok(block.includes('wc.hostWebContents'))
  assert.equal(block.includes('_normalizeLaunchFileTarget'), false)
  assert.equal(block.includes('getFocusedWindow'), false)
})

test('local file launch paths reject UNC and file://host before touching the filesystem', () => {
  assert.ok(main.includes('function _isLocalOnlyFilePath'))
  assert.ok(main.includes('if (!_isLocalOnlyFilePath(filePath)) return null'))
  assert.ok(main.includes('return _isLocalOnlyFilePath(filePath) ? filePath : null'))
})

test('passwords and PIN hashes use private atomic writes and weak safeStorage is rejected', () => {
  assert.ok(main.includes('getSelectedStorageBackend'))
  assert.ok(main.includes("return _writePrivateFile(passwordsFile, encrypted)"))
  assert.ok(main.includes("if (!_writePrivateFile(pinHashFile, JSON.stringify({ v: 2, salt, hash }))) return false"))
})

test('get-cert-info is sender-checked and cannot be rebound to a private address', () => {
  assert.ok(main.includes("ipcMain.handle('get-cert-info', async (event, hostname, port = 443)"))
  assert.ok(main.includes('if (!trustedBrowserInterfaceSender(event)) return null'))
  assert.ok(main.includes("require('node:dns').promises.lookup"))
  assert.ok(main.includes('_isLocalOrPrivateHost(entry.address)'))
})

test('certificate fields are escaped before entering the interface', () => {
  assert.match(renderer, /function val\(v\) \{[\s\S]*?escHtml\(/)
  assert.ok(renderer.includes("const sha256   = info.sha256   ? escHtml(String(info.sha256))   : BRAK"))
  assert.equal(renderer.includes('${info.sha256 || BRAK}'), false)
  assert.equal(renderer.includes('${info.pkSha256 || BRAK}'), false)
})

test('context-menu navigation validates file and non-http links', () => {
  assert.ok(renderer.includes('function safeContextUrl(raw, currentUrl)'))
  assert.ok(renderer.includes('t.wv.loadURL(safe)'))
  assert.equal(renderer.includes('t.wv.loadURL(url)'), false)
})

test('CSP no longer allows arbitrary HTTPS image beacons', () => {
  assert.ok(html.includes("img-src 'self' data: https://www.google.com"))
  assert.ok(html.includes("base-uri 'none'"))
  assert.equal(html.includes("img-src 'self' data: https:;"), false)
})

test('pointer lock and clipboard writes are not auto-granted', () => {
  assert.ok(core.includes("if (permission === 'pointerLock' || permission === 'clipboard-sanitized-write') { callback(false); return }"))
})
