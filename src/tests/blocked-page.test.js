'use strict'

const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const { escapeHtml, normalizeBlockedDomain } = require('../browser-core')['blocked-page']

test('crafted ?d= values never reach the blocked page as markup', () => {
  const payloads = [
    '<script>alert(1)</script>',
    '"><img src=x onerror=alert(1)>',
    "'><svg onload=alert(1)>",
    '<iframe srcdoc="<script>alert(1)</script>">',
    'example.com<script>',
    'example.com\n<script>',
    '',
    null,
    undefined,
  ]
  for (const payload of payloads) assert.equal(normalizeBlockedDomain(payload), '', String(payload))
})

test('escapeHtml neutralises every HTML metacharacter', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;')
  assert.equal(escapeHtml(`"'&`), '&quot;&#39;&amp;')
  assert.equal(escapeHtml(null), '')
})

test('real hostnames survive normalization unchanged', () => {
  for (const domain of ['example.com', 'ads.example.co.uk', 'xn--mnchen-3ya.de', '127.0.0.1', '[::1]']) {
    assert.equal(normalizeBlockedDomain(domain), domain)
  }
})

test('buildBlockedHtml escapes the domain parameter', () => {
  const main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8')
  assert.match(main, /normalizeBlockedDomain\(domain\)/)
  assert.match(main, /escapeHtml\(safeDomain\)/)
  assert.doesNotMatch(main, /\$\{domain \|\| 'nieznana domena'\}/)
  assert.doesNotMatch(main, /<code>\|\|\$\{domain\}\^<\/code>/)
})
