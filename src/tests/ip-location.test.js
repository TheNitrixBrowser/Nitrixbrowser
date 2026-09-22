'use strict'
const {test} = require('node:test')
const assert = require('node:assert/strict')
const {EventEmitter} = require('node:events')
const {createIPLocation, ENDPOINT} = require('../browser-core')["ip-location"]

function fixture(fetch) {
  const commands = [], debug = new EventEmitter()
  let attached = false
  debug.isAttached = () => attached
  debug.attach = () => { attached = true }
  debug.detach = () => { attached = false; debug.emit('detach') }
  debug.sendCommand = async (name, data) => { commands.push({name, data}) }
  const wc = {session: {fetch}, debugger: debug, isDestroyed: () => false}
  return {wc, commands, location: createIPLocation()}
}
test('IP location uses the approved HTTPS endpoint without cookies and reports approximate accuracy', async () => {
  const f = fixture(async (url, options) => {
    assert.equal(url, ENDPOINT); assert.equal(new URL(url).hostname, 'ipwho.is')
    assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error')
    return Response.json({success: true, latitude: 52, longitude: 21})
  })
  assert.equal(await f.location.prepare(f.wc), true)
  assert.deepEqual(f.commands[0], {name:'Emulation.setGeolocationOverride', data:{latitude:52,longitude:21,accuracy:100000}})
  assert.equal(f.location.ready(f.wc), true)
  f.location.reset(f.wc); assert.equal(f.location.ready(f.wc), false)
})
test('revocation during an IP lookup cannot apply the late coordinates', async () => {
  let respond
  const f = fixture(() => new Promise(resolve => { respond = resolve }))
  const pending = f.location.prepare(f.wc)
  f.location.reset(f.wc)
  respond(Response.json({success:true,latitude:52,longitude:21}))
  assert.equal(await pending, false); assert.deepEqual(f.commands, [])
})
test('invalid, oversized or unavailable provider responses yield position unavailable, never invented coordinates', async () => {
  for (const response of [Response.json({success:true,latitude:100,longitude:21}), Response.json({success:false}),
    new Response('x'.repeat(17000)), new Response('', {status:429})]) {
    const f = fixture(async () => response)
    assert.equal(await f.location.prepare(f.wc), true)
    assert.deepEqual(f.commands[0].data, {})
  }
})
