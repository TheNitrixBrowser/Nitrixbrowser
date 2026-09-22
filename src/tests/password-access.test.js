'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { createPasswordAccess } = require('../browser-core')["password-access"]

function fixture() {
  const root = path.join(__dirname, '..')
  const handlers = new Map()
  let pinned = true, time = 1000, reads = 0, changes = 0
  const secrets = [{ site: 'example.test', user: 'test', plainPass: 'synthetic-secret' }]
  const frame = { url: pathToFileURL(path.join(root, 'index.html')).href }
  const sender = { mainFrame: frame, isDestroyed: () => false }
  const window = { webContents: sender }
  const event = { sender, senderFrame: frame }
  const context = vm.createContext({ __dirname: root, path, pathToFileURL,
    fs: { existsSync: () => pinned }, pinHashFile: 'pin.hash', pinFile: 'pin.enc',
    BrowserWindow: { fromWebContents: wc => wc === sender ? window : null },
    require: () => ({ 'password-access': { createPasswordAccess: options => createPasswordAccess({ ...options, now: () => time }) } }),
    ipcMain: { handle: (channel, fn) => handlers.set(channel, fn) },
    loadPasswordsRaw: () => { reads++; return secrets },
    savePasswordsRaw: () => { changes++; return true },
    savePinRaw: () => { changes++; pinned = true; return true },
    clearPinRaw: () => { changes++; pinned = false; return true },
    verifyPinRaw: pin => pin === '123456', safeAvailable: () => true
  })
  const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8')
  const start = main.indexOf('function trustedPasswordSender(')
  vm.runInContext(main.slice(start, main.indexOf('// ── Koniec Menedżera', start)), context)
  return { event, secrets, call: (name, value, e = event) => handlers.get(name)(e, value),
    advance: ms => { time += ms }, reads: () => reads, changes: () => changes,
    unpin: () => { pinned = false } }
}

test('original PIN bypass is rejected for reads, writes, deletion and PIN replacement', () => {
  const f = fixture()
  assert.equal(f.call('passwords-load'), null)
  for (const [name, value] of [['passwords-save', f.secrets], ['passwords-clear'], ['pin-clear'], ['pin-save', '987654']]) {
    assert.equal(f.call(name, value), false)
  }
  assert.equal(f.reads(), 0)
  assert.equal(f.changes(), 0)
  const metadata = f.call('passwords-list')
  assert.equal(metadata[0].site, 'example.test')
  assert.equal('plainPass' in metadata[0], false)
})

test('verified PIN grants temporary access and explicit locking revokes it', () => {
  const f = fixture()
  assert.equal(f.call('pin-verify', '123456'), true)
  assert.equal(f.call('passwords-load')[0].plainPass, 'synthetic-secret')
  f.advance(60001)
  assert.equal(f.call('passwords-load'), null)
  assert.equal(f.call('pin-verify', '123456'), true)
  f.call('passwords-lock')
  assert.equal(f.call('passwords-load'), null)
})

test('subframes, foreign windows and navigated documents cannot use the password API', () => {
  const f = fixture()
  assert.equal(f.call('pin-verify', '123456'), true)
  const iframe = { ...f.event, senderFrame: { url: f.event.senderFrame.url } }
  assert.equal(f.call('passwords-load', undefined, iframe), null)
  assert.equal(f.call('pin-clear', undefined, iframe), false)
  f.event.senderFrame.url = 'https://untrusted.example'
  assert.equal(f.call('passwords-load'), null)
  assert.equal(f.call('pin-verify', '123456'), false)
  f.unpin()
  assert.equal(f.call('passwords-load'), null)
})

test('wrong PINs are throttled globally, including attempts from a new frame', () => {
  const f = fixture()
  for (let i = 0; i < 5; i++) {
    assert.equal(f.call('pin-verify', '0000'), false)
    if (i < 4) f.advance(1001)
  }
  assert.equal(f.call('pin-verify', '123456'), false)
  f.advance(30001)
  assert.equal(f.call('pin-verify', '123456'), true)
})

test('PIN changes revoke previous authorization', () => {
  const f = fixture()
  assert.equal(f.call('pin-verify', '123456'), true)
  assert.equal(f.call('pin-save', '654321'), true)
  assert.equal(f.call('passwords-load'), null)
})

test('without a PIN only the trusted main interface retains access', () => {
  const f = fixture()
  f.unpin()
  assert.equal(f.call('passwords-load')[0].plainPass, 'synthetic-secret')
  const rogue = { sender: { isDestroyed: () => false }, senderFrame: f.event.senderFrame }
  assert.equal(f.call('passwords-load', undefined, rogue), null)
})
