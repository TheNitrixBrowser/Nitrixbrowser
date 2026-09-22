'use strict'
// Real browser window, isolated profile. No backend flag: test automatic restart.
const {app,BrowserWindow}=require('electron')
const fs=require('node:fs'),os=require('node:os'),path=require('node:path')
const {execFileSync}=require('node:child_process')
const assert=require('node:assert/strict')
const profile=process.env.NITRIX_AERO_TEST_PROFILE || fs.mkdtempSync(path.join(os.tmpdir(),'nitrix-aero-browser-'))
process.env.NITRIX_AERO_TEST_PROFILE=profile
console.log('TEST PROFILE',profile)
app.setPath('appData',profile)
process.env.XDG_DATA_HOME=path.join(profile,'data')
process.env.XDG_CONFIG_HOME=path.join(profile,'config')
fs.mkdirSync(path.join(profile,'Nitrix'),{recursive:true})
fs.writeFileSync(path.join(profile,'Nitrix/settings.json'),JSON.stringify({theme:'transparent',aeroBlur:50,aeroAreas:['tabs','navigation','bookmarks','ui'],startupBehavior:'custom',startupCustomUrl:'about:blank'}))
const pause=ms=>new Promise(r=>setTimeout(r,ms))
console.log('START BACKEND',app.commandLine.getSwitchValue('ozone-platform'),process.argv)
require('../main')
setTimeout(()=>app.exit(1),20000).unref()
app.whenReady().then(async()=>{
 try {
  let win
  for(let i=0;i<100;i++) {win=BrowserWindow.getAllWindows()[0];if(win?.nitrixAeroLayout)break;await pause(100)}
  assert.ok(win?.nitrixAeroLayout,'renderer sent native regions')
  await pause(1000)
  const id=String(win.getNativeWindowHandle().readUInt32LE(0))
  const property=()=>execFileSync('xprop',['-id',id,'_KDE_NET_WM_BLUR_BEHIND_REGION'],{encoding:'utf8'})
  console.log('LAYOUT',win.nitrixAeroLayout,'AVAILABLE',win.nitrixAero.available,property())
  assert.match(property(),/= \d/)
  const layout=win.nitrixAeroLayout
  for(const strength of [0,1,50]) {
    await win.webContents.executeJavaScript(`electronAPI.setAeroRegions(${JSON.stringify({...layout,strength})})`)
    await pause(200)
    assert.match(property(),/= \d/,'ambient blur remains active even at zero opacity')
  }
  await win.webContents.executeJavaScript(`electronAPI.setWindowTheme('dark')`)
  await pause(250)
  assert.match(property(),/not found|no such atom/)
  console.log('PASS browser renderer → IPC → native blur, and theme cleanup')
  fs.writeFileSync(path.join(profile,'result.json'),JSON.stringify({ok:true,backend:app.commandLine.getSwitchValue('ozone-platform'),layout:win.nitrixAeroLayout}))
  win.destroy();app.exit(0)
 }catch(error){fs.writeFileSync(path.join(profile,'result.json'),JSON.stringify({ok:false,error:error.stack}));console.error(error);app.exit(1)}
})
