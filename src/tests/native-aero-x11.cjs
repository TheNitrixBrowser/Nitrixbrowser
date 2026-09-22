'use strict'
// Run on an X11/XWayland display; only touches a hidden test window.
const { app, BrowserWindow } = require('electron')
const { execFile } = require('node:child_process')
const { promisify } = require('node:util')
const path = require('node:path'), fs = require('node:fs'), os = require('node:os'), assert = require('node:assert/strict')
app.setPath('userData',fs.mkdtempSync(path.join(os.tmpdir(),'nitrix-native-aero-')))
app.commandLine.appendSwitch('ozone-platform','x11')
const run=promisify(execFile)
app.whenReady().then(async()=>{
  const win=new BrowserWindow({show:false,width:300,height:150,frame:false,transparent:true,webPreferences:{sandbox:true}})
  try {
    const id=String(win.getNativeWindowHandle().readUInt32LE(0)),helper=path.join(__dirname,'../build/nitrix-aero')
    const args=[id,String(process.pid)]
    await run(helper,[...args,'0','0','300','42','0','42','300','48'])
    const property=await run('xprop',['-id',id,'_KDE_NET_WM_BLUR_BEHIND_REGION'])
    assert.match(property.stdout,/0, 0, 300, 42, 0, 42, 300, 48/)
    await assert.rejects(run(helper,[id,'1','0','0','300','42']))
    await run(helper,args)
    const cleared=await run('xprop',['-id',id,'_KDE_NET_WM_BLUR_BEHIND_REGION'])
    assert.match(cleared.stdout,/not found|no such atom/)
    console.log('PASS native XWayland blur regions, ownership check and cleanup')
    win.destroy(); app.exit(0)
  } catch(error) { console.error(error);win.destroy();app.exit(1) }
})
