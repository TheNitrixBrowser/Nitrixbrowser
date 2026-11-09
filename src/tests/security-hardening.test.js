'use strict'

const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const { isBlockedRules } = require('../browser-core')['persistence']

const root = path.join(__dirname, '..')
const read = name => fs.readFileSync(path.join(root, name), 'utf8')

test('element picker rules cannot smuggle markup into the interface', () => {
  for (const selector of ['"><img src=x onerror=alert(1)>', 'a<b', 'x<\u0000y']) {
    assert.equal(isBlockedRules({ 'example.org': [selector] }), false, selector)
  }
  for (const selector of ['.advert', '#main > .banner', 'div[data-x="1"]']) {
    assert.equal(isBlockedRules({ 'example.org': [selector] }), true, selector)
  }
})

test('custom blocked selectors are HTML-escaped before rendering', () => {
  const renderer = read('renderer.js')
  assert.match(renderer, /const safeSel = escHtml\(sel\)/)
  assert.doesNotMatch(renderer, /title="\$\{sel\}"/)
})

test('password metadata requires the unlocked password manager', () => {
  assert.match(read('main.js'), /ipcMain\.handle\('passwords-list', e => passwordAccess\.allowed\(e\)/)
})

test('private windows share the partition their webviews use', () => {
  const main = read('main.js')
  assert.match(main, /isPrivate \? 'persist:nitrix_private' : 'persist:main'/)
  assert.doesNotMatch(main, /private:\$\{Date\.now\(\)\}/)
})

test('autofill is injected through an isolated world', () => {
  const core = read('browser-core.js')
  assert.match(core, /executeJavaScriptInIsolatedWorld\(worldId, \[frameScript\(/)
  assert.match(core, /const frameScript = targetOrigin => \(\{/)
})
