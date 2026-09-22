'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { hardenWebview } = require('../browser-core')["webview-security"]

test('hostile webview preferences cannot disable isolation or inject a preload', () => {
  const prefs = { sandbox: false, contextIsolation: false, nodeIntegration: true,
    nodeIntegrationInSubFrames: true, nodeIntegrationInWorker: true,
    webSecurity: false, allowRunningInsecureContent: true, webviewTag: true,
    preload: '/untrusted.js', preloadURL: 'file:///untrusted.js' }
  hardenWebview({ preventDefault() { assert.fail('valid partition rejected') } }, prefs,
    { partition: 'persist:main' }, 'persist:main')
  for (const key of ['sandbox', 'contextIsolation', 'webSecurity']) assert.equal(prefs[key], true)
  for (const key of ['nodeIntegration', 'nodeIntegrationInSubFrames', 'nodeIntegrationInWorker',
    'allowRunningInsecureContent', 'webviewTag', 'experimentalFeatures']) assert.equal(prefs[key], false)
  assert.equal(prefs.preload, undefined)
  assert.equal(prefs.preloadURL, undefined)
})

test('webviews cannot access a different session partition', () => {
  for (const partition of ['', 'persist:main', 'unknown']) {
    let denied = false
    hardenWebview({ preventDefault() { denied = true } }, {}, { partition }, 'persist:nitrix_private')
    assert.equal(denied, true)
  }
})

test('sandbox is enabled globally and requested by the webview', () => {
  const main = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8')
  const renderer = fs.readFileSync(path.join(__dirname, '../renderer.js'), 'utf8')
  assert.ok(main.indexOf('app.enableSandbox()') < main.indexOf('app.whenReady()'))
  assert.ok(renderer.includes('sandbox=yes'))
  assert.equal(renderer.includes('sandbox=no'), false)
  assert.ok(main.includes("win.webContents.on('will-attach-webview'"))
  assert.ok(main.includes("win.webContents.on('will-navigate', protectInterfaceNavigation)"))
})
