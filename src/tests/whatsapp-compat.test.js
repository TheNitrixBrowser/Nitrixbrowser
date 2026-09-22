'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const { isWhatsApp, chromeUserAgent, configureWhatsApp } = require('../browser-core')["whatsapp-compat"]

test('WhatsApp compatibility is restricted to its HTTPS hostname', () => {
  assert.equal(isWhatsApp('https://web.whatsapp.com/'), true)
  for (const url of ['http://web.whatsapp.com/', 'https://web.whatsapp.com.evil.test/',
    'https://evil.test/?url=https://web.whatsapp.com', 'not a URL']) assert.equal(isWhatsApp(url), false)
  assert.match(chromeUserAgent('win32'), /Windows NT 10\.0/)
  assert.match(chromeUserAgent('linux'), /X11; Linux/)
  assert.match(chromeUserAgent(), /Chrome\/153\./)
  assert.doesNotMatch(chromeUserAgent(), /Electron|Nitrix/)
})

test('navigation restores the original agent and preserves other request headers', () => {
  const contents = new EventEmitter()
  let agent = 'Original Nitrix', registrations = 0, handler
  contents.getUserAgent = () => agent
  contents.setUserAgent = value => { agent = value }
  contents.isDestroyed = () => false
  contents.session = { webRequest: { onBeforeSendHeaders(filter, callback) {
    registrations++
    assert.deepEqual(filter.urls, ['https://web.whatsapp.com/*'])
    handler = callback
  } } }
  configureWhatsApp(contents)
  contents.emit('did-start-navigation', {}, 'https://web.whatsapp.com/', false, true)
  assert.equal(agent, chromeUserAgent())
  contents.emit('did-start-navigation', {}, 'https://other.test/', false, false)
  assert.equal(agent, chromeUserAgent())
  contents.emit('did-start-navigation', {}, 'https://other.test/', false, true)
  assert.equal(agent, 'Original Nitrix')
  handler({ requestHeaders: { 'user-agent': 'Original Nitrix', Accept: 'text/html' } }, result => {
    assert.equal(result.requestHeaders['User-Agent'], chromeUserAgent())
    assert.equal(result.requestHeaders['user-agent'], undefined)
    assert.equal(result.requestHeaders.Accept, 'text/html')
  })
  assert.equal(registrations, 1)
})
