'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const vm = require('node:vm')
const { registerAutofill, fillInPage } = require('../browser-core')["password-autofill"]
const { createPasswordAccess } = require('../browser-core')["password-access"]

function fixture() {
  const handlers = new Map()
  const event = { sender: {}, senderFrame: {} }
  let preference = { enabled: false, pin: '' }, pin = 'synthetic-pin', fills = 0
  const access = createPasswordAccess({ trusted: e => e === event, hasPin: () => true, verifyPin: p => p === '1234' })
  const target = { isDestroyed: () => false, getType: () => 'webview', hostWebContents: event.sender,
    getURL: () => 'https://example.test/login', executeJavaScript: async () => { fills++; return true } }
  registerAutofill({ ipcMain: { handle: (name, fn) => handlers.set(name, fn) }, trusted: e => e === event,
    access, hasPin: () => true, fingerprint: () => pin, readPreference: () => preference,
    writePreference: value => { preference = value; return true }, getContents: () => target,
    loadPasswords: () => [{ site: 'example.test', user: 'test', plainPass: 'SYNTHETIC-ONLY' }] })
  return { event, access, target, fills: () => fills, changePin: () => { pin = 'new-pin' },
    call: (name, value, e = event) => handlers.get(name)(e, value),
    request: { id: 1, site: 'example.test', user: 'test' } }
}

test('enabling skip requires PIN and does not leave the password manager unlocked', async () => {
  const f = fixture()
  assert.equal(f.call('passwords-autofill-skip-set', true), false)
  assert.equal(await f.call('passwords-autofill', f.request), false)
  assert.equal(f.access.verify(f.event, '1234'), true)
  assert.equal(f.call('passwords-autofill-skip-set', true), true)
  assert.equal(f.access.allowed(f.event), false)
  assert.equal(await f.call('passwords-autofill', f.request), true)
  assert.equal(f.access.allowed(f.event), false)
})

test('autofill rejects other origins, ports, windows and IPC senders', async () => {
  const f = fixture()
  f.access.verify(f.event, '1234')
  f.call('passwords-autofill-skip-set', true)
  for (const url of ['https://other.test', 'http://example.test', 'https://example.test:8443']) {
    f.target.getURL = () => url
    assert.equal(await f.call('passwords-autofill', f.request), false)
  }
  f.target.getURL = () => 'https://example.test'
  assert.equal(await f.call('passwords-autofill', f.request, {}), false)
  f.target.hostWebContents = {}
  assert.equal(await f.call('passwords-autofill', f.request), false)
  assert.equal(f.fills(), 0)
})

test('changing PIN or disabling the option revokes skip', async () => {
  const f = fixture()
  f.access.verify(f.event, '1234')
  f.call('passwords-autofill-skip-set', true)
  assert.equal(f.call('passwords-autofill-skip-get'), true)
  f.changePin()
  assert.equal(f.call('passwords-autofill-skip-get'), false)
  assert.equal(await f.call('passwords-autofill', f.request), false)
  f.access.verify(f.event, '1234')
  f.call('passwords-autofill-skip-set', true)
  f.call('passwords-autofill-skip-set', false)
  assert.equal(await f.call('passwords-autofill', f.request), false)
})

test('navigation before script execution does not fill another origin', () => {
  const context = vm.createContext({ location: { origin: 'https://other.test' } })
  const result = vm.runInContext(`(${fillInPage.toString()})('https://example.test', 'test', 'SYNTHETIC')`, context)
  assert.equal(result, false)
})

test('fills matching-origin child frame and skips unrelated frames', async () => {
  const f = fixture()
  f.access.verify(f.event, '1234')
  const called = []
  f.target.mainFrame = { framesInSubtree: [
    { url: 'https://example.test', executeJavaScript: async () => { called.push('main'); return false } },
    { url: 'https://other.test', executeJavaScript: async () => { throw Error('Credentials sent to wrong origin') } },
    { url: 'https://example.test/form', executeJavaScript: async () => { called.push('form'); return true } }
  ] }
  assert.equal(await f.call('passwords-autofill', f.request), true)
  assert.deepEqual(called, ['main', 'form'])
})

test('stops filling frames after top-level navigation', async () => {
  const f = fixture()
  f.access.verify(f.event, '1234')
  f.target.mainFrame = { framesInSubtree: [
    { url: 'https://example.test', executeJavaScript: async () => {
      f.target.getURL = () => 'https://other.test'
      return false
    } },
    { url: 'https://example.test/form', executeJavaScript: async () => { throw Error('Filled after navigation') } }
  ] }
  assert.equal(await f.call('passwords-autofill', f.request), false)
})

test('Librus portal fills only its Synergia login frame on the login route', async () => {
  const handlers = new Map()
  const event = { sender: {} }
  let calls = 0
  const target = { isDestroyed: () => false, getType: () => 'webview', hostWebContents: event.sender,
    getURL: () => 'https://portal.librus.pl/rodzina/synergia/loguj',
    mainFrame: { framesInSubtree: [
      { url: 'https://synergia.librus.pl/login', executeJavaScript: async script => {
        assert.ok(script.includes('"https://synergia.librus.pl"'))
        calls++; return true
      } }
    ] } }
  registerAutofill({ ipcMain: { handle: (k, fn) => handlers.set(k, fn) }, trusted: e => e === event,
    access: { allowed: () => true }, fingerprint: () => '', readPreference: () => ({}),
    getContents: () => target,
    loadPasswords: () => [{site:'portal.librus.pl',user:'synthetic',plainPass:'TEST-ONLY'}] })
  const fill = () => handlers.get('passwords-autofill')(event,{id:1,site:'portal.librus.pl',user:'synthetic'})
  assert.equal(await fill(),true)
  target.mainFrame.framesInSubtree[0] = {
    url: 'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata',
    executeJavaScript: async script => {
      assert.ok(script.includes('"https://api.librus.pl"'))
      calls++; return true
    }
  }
  assert.equal(await fill(),true)
  for (const url of ['https://api.librus.pl/other?client_id=46',
    'https://api.librus.pl/OAuth/Authorization?client_id=99',
    'http://api.librus.pl/OAuth/Authorization?client_id=46']) {
    target.mainFrame.framesInSubtree[0].url = url
    assert.equal(await fill(),false)
  }
  target.mainFrame.framesInSubtree[0].url = 'https://api.librus.pl/OAuth/Authorization?client_id=46'
  target.getURL = () => 'https://portal.librus.pl/rodzina'
  assert.equal(await fill(),false)
  target.getURL = () => 'https://portal.librus.pl/rodzina/synergia/loguj'
  target.mainFrame.framesInSubtree[0].url = 'https://synergia.librus.pl.attacker.test/login'
  assert.equal(await fill(),false)
  assert.equal(calls,2)
})
