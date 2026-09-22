'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const { configureBackend, restartForBackend, physicalRegions, attach } = require('../browser-core')["native-aero"]
test('automatic Wayland startup re-execs once and preserves launch arguments', () => {
  const calls=[], app={relaunch:value=>calls.push(value),exit:code=>calls.push(code)}
  assert.equal(restartForBackend(app,true,{WAYLAND_DISPLAY:'wayland-0'},['electron','main.js','https://example.org']),true)
  assert.deepEqual(calls,[{args:['main.js','https://example.org','--ozone-platform=x11']},0])
  calls.length=0
  assert.equal(restartForBackend(app,true,{WAYLAND_DISPLAY:'wayland-0'},['electron','main.js','--ozone-platform=x11']),false)
  assert.equal(restartForBackend(app,false,{WAYLAND_DISPLAY:'wayland-0'},['electron','main.js']),false)
  assert.equal(restartForBackend(app,true,{},['electron','main.js']),false)
  assert.deepEqual(calls,[])
})
test('KDE backend is automatic for this app only and respects explicit backends', () => {
  for (const [desktop,display,requested,platform,expected] of [
    ['KDE',':0','', 'linux',true], ['KDE',':0','x11','linux',true],
    ['KDE',':0','wayland','linux',false], ['KDE',':0','headless','linux',false],
    ['GNOME',':0','','linux',false], ['KDE','','','linux',false], ['KDE',':0','','win32',false]
  ]) {
    const calls=[]
    const app={commandLine:{getSwitchValue:()=>requested,appendSwitch:(...args)=>calls.push(args)}}
    assert.equal(configureBackend(app,{XDG_CURRENT_DESKTOP:desktop,DISPLAY:display},platform,
      ['electron','main.js',...(requested ? ['--ozone-platform='+requested] : [])]),expected)
    assert.deepEqual(calls,expected?[['ozone-platform','x11']]:[])
  }
})
test('Electron automatic Wayland selection does not prevent KDE blur startup', () => {
  const calls=[]
  const app={commandLine:{getSwitchValue:()=> 'wayland',appendSwitch:(...args)=>calls.push(args)}}
  assert.equal(configureBackend(app,{XDG_CURRENT_DESKTOP:'KDE',DISPLAY:':0'},'linux',['electron','main.js']),true)
  assert.deepEqual(calls,[['ozone-platform','x11']])
})
test('native blur rectangles are clipped, scaled and bounded', () => {
  assert.deepEqual(physicalRegions([{x:0,y:42,width:900,height:48}],[800,600],1.5),[0,63,1200,72])
  assert.deepEqual(physicalRegions([{x:0,y:0,width:800,height:0}],[800,600],1),[])
  for(const regions of [null,{},Array(4).fill({}),[{x:NaN,y:0,width:1,height:1}], [{x:0,y:0,width:Infinity,height:1}]]) assert.equal(physicalRegions(regions,[800,600],1),null)
  assert.equal(physicalRegions([],[800,600],Infinity),null)
})
test('native blur updates coalesce and closing cancels pending work', async () => {
  const win=new EventEmitter(),calls=[]
  win.isDestroyed=()=>false
  win.getNativeWindowHandle=()=>Buffer.from([42,0,0,0])
  const controller=attach(win,{isPackaged:false},true,(_file,args,_options,done)=>{calls.push(args);done(null)})
  controller.update([0,0,800,42]);controller.update([0,0,900,42])
  await new Promise(resolve=>setTimeout(resolve,120))
  assert.deepEqual(calls, [['42',String(process.pid),'0','0','900','42']])
  controller.update([])
  await new Promise(resolve=>setTimeout(resolve,120))
  assert.deepEqual(calls[1],['42',String(process.pid)])
  controller.update([0,0,800,42]);win.emit('closed')
  await new Promise(resolve=>setTimeout(resolve,120))
  assert.equal(calls.length,2)
})
