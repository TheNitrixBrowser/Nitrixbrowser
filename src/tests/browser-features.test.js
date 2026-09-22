'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const { installFeatures, validSnapshot, validOptions, bookmarkHTML, DEFAULTS } = require('../browser-core')["browser-features"]
test('browser shortcuts map before page handlers without swallowing unrelated keys',()=>{
  const {getBrowserShortcut}=require('../browser-core')['browser-shortcuts']
  const cases=[['t',{},'new-tab'],['w',{},'close-tab'],['Tab',{},'next-tab'],['PageDown',{},'next-tab'],['Tab',{shift:true},'previous-tab'],['n',{},'new-window'],['n',{shift:true},'private-window'],['d',{},'bookmark'],['h',{},'history'],['j',{},'downloads'],['k',{},'address'],['j',{shift:true},'console'],['u',{},'source'],['+',{shift:true},'zoom-in'],['=',{},'zoom-in'],['-',{},'zoom-out'],['0',{},'zoom-reset'],['ArrowLeft',{control:false,alt:true},'back'],['ArrowRight',{control:false,alt:true},'forward'],['Escape',{control:false},'escape']]
  for(const [key,extra,expected]of cases)assert.equal(getBrowserShortcut({type:'keyDown',control:true,key,...extra}),expected,key)
  assert.equal(getBrowserShortcut({type:'keyUp',control:true,key:'t'}),null)
  assert.equal(getBrowserShortcut({type:'keyDown',key:'t'}),null)
  assert.equal(getBrowserShortcut({type:'keyDown',control:true,alt:true,key:'t'}),null)
})

function fixture() {
  const ipc = new EventEmitter(), handlers = new Map(), files = new Map(), app = new EventEmitter(), sessions = new Map()
  ipc.handle = (k, fn) => handlers.set(k, fn)
  let answer = { response: 0, checkboxChecked: false }, prompts = 0
  const dialog = { showMessageBox: async () => { prompts++; return answer } }
  const session = { fromPartition(key) {
    if (!sessions.has(key)) {
      const s = new EventEmitter()
      s.setPermissionCheckHandler = fn => { s.check = fn }
      s.setPermissionRequestHandler = fn => { s.request = fn }
      sessions.set(key, s)
    }
    return sessions.get(key)
  } }
  let nextId = 0
  const all = new Map()
  const store = { read: (p, validate, fallback) => files.has(p) ? files.get(p) : fallback(),
    write: (p, v, validate) => { assert.equal(validate(v), true); files.set(p, structuredClone(v)); return true } }
  const features = installFeatures({app,ipcMain:ipc,dialog,session,store,dataDir:'/test',
    trusted:e=>e?.trusted === true, getOwnedWebview:(e,id)=>e.trusted ? all.get(id) : null,
    loadBookmarks:()=>[],loadSettings:()=>({lang:'pl'})})
  function window(privateMode = false) {
    const win = new EventEmitter(), id = ++nextId
    win.webContents = new EventEmitter(); win.webContents.id = id
    win.webContents.send = (channel, value) => {
      if (channel === 'features-permission-prompt') {
        prompts++
        handlers.get('features-permission-answer')({trusted:true,sender:win.webContents},value.token,answer.response===1,!!answer.checkboxChecked)
      }
      if (channel === 'features-close-prompt') handlers.get('features-close-answer')({trusted:true,sender:win.webContents},value.token,answer.response===1,!!answer.checkboxChecked)
    }; win.isDestroyed = () => false
    win.close = () => { const e = {defaultPrevented:false,preventDefault(){this.defaultPrevented=true}}; win.emit('close',e); if (!e.defaultPrevented) win.emit('closed') }
    features.attachWindow(win,privateMode)
    return {win,event:{trusted:true,sender:win.webContents},session:session.fromPartition(privateMode?'persist:nitrix_private':'persist:main')}
  }
  const call=(k,e,...args)=>handlers.get(k)(e,...args)
  return {window,files,call,ipc,all,app,features,prompts:()=>prompts,answer:v=>{answer=v},
    flush:()=>app.emit('before-quit')}
}
test('recovery saves normal windows, excludes private tabs and removes closed windows', () => {
  const f=fixture(),normal=f.window(),priv=f.window(true)
  const snapshot={tabs:[{url:'https://example.test/',title:'Test'}],active:0}
  f.ipc.emit('features-snapshot',normal.event,snapshot,1)
  f.ipc.emit('features-snapshot',priv.event,{tabs:[{url:'https://private.test/',title:'Secret'}],active:0},1)
  f.flush()
  assert.equal(f.files.get('/test/session-recovery.json').length,1)
  assert.ok(!JSON.stringify([...f.files]).includes('private.test'))
  normal.win.close(); assert.deepEqual(f.files.get('/test/session-recovery.json'),[])
})
test('close warning cancels safely and remember choice applies on confirmation', async () => {
  const f=fixture(),w=f.window();let closed=0;w.win.on('closed',()=>closed++)
  f.ipc.emit('features-snapshot',w.event,{tabs:[],active:0},3)
  w.win.close();await new Promise(setImmediate);assert.equal(closed,0)
  f.answer({response:1,checkboxChecked:true});w.win.close();await new Promise(setImmediate)
  assert.equal(closed,1);assert.equal(f.files.get('/test/browser-options.json').warnClose,false)
})
test('permissions ask by default, remember denial, and private grants never persist', async () => {
  const f=fixture(),w=f.window(true),wc=new EventEmitter()
  wc.id=70;wc.getType=()=> 'webview';wc.isDestroyed=()=>false;wc.getURL=()=> 'https://site.test/';wc.hostWebContents=w.win.webContents
  const d={requestingUrl:'https://site.test/',mediaTypes:['audio']}
  assert.equal(w.session.check(wc,'media','https://site.test',{mediaType:'audio'}),false)
  f.answer({response:0,checkboxChecked:true})
  const result=await new Promise(resolve=>w.session.request(wc,'media',resolve,d))
  assert.equal(result,false);assert.equal(f.prompts(),1)
  await new Promise(resolve=>w.session.request(wc,'media',resolve,d));assert.equal(f.prompts(),1)
  f.flush();assert.ok(!JSON.stringify([...f.files]).includes('site.test'))
})
test('site data removal stays scoped and rejects stale or untrusted requests', async () => {
  const f=fixture(),w=f.window(),cleared=[]
  const wc={id:8,getURL:()=> 'https://site.test/',isDestroyed:()=>false,session:{clearData:async options=>cleared.push(options)},reload(){}}
  f.all.set(8,wc);f.answer({response:1})
  assert.equal(await f.call('features-site-clear',w.event,8,'https://other.test'),false)
  assert.equal(await f.call('features-site-clear',{trusted:false},8,'https://site.test'),false)
  assert.equal(await f.call('features-site-clear',w.event,8,'https://site.test'),true)
  assert.deepEqual(cleared[0].origins,['https://site.test']);assert.equal(cleared.length,1)
  f.flush()
})
test('export escapes HTML and omits unsafe URLs; persisted structures are bounded', () => {
  const html=bookmarkHTML([{name:'<script>"&',url:'https://test.example/?a=1&b=2'},{name:'bad',url:'javascript:alert(1)'}])
  assert.ok(html.includes('&lt;script&gt;&quot;&amp;'));assert.ok(html.includes('&amp;b=2'));assert.ok(!html.includes('javascript:'))
  assert.equal(validSnapshot({tabs:[{url:'javascript:1',title:'x'}],active:0}),false)
  assert.equal(validSnapshot({tabs:[],active:1}),false)
  assert.equal(validOptions({...DEFAULTS,sleepMinutes:0}),false)
})
test('permission replies reject foreign senders and stale tokens; navigation cancels the request', async () => {
  const f=fixture(),w=f.window(),other=f.window(),wc=new EventEmitter()
  wc.id=75;wc.getType=()=> 'webview';wc.isDestroyed=()=>false;wc.getURL=()=> 'https://site.test/';wc.hostWebContents=w.win.webContents
  let prompt
  w.win.webContents.send=(channel,value)=>{if(channel==='features-permission-prompt')prompt=value}
  const pending=new Promise(resolve=>w.session.request(wc,'notifications',resolve,{requestingUrl:wc.getURL()}))
  assert.ok(prompt.token)
  assert.equal(f.call('features-permission-answer',other.event,prompt.token,true,true),false)
  assert.equal(f.call('features-permission-answer',{...w.event,trusted:false},prompt.token,true,true),false)
  assert.equal(f.call('features-permission-answer',w.event,'wrong',true,true),false)
  wc.emit('did-start-navigation',{},'https://other.test/',false,true)
  assert.equal(await pending,false)
  assert.equal(f.call('features-permission-answer',w.event,prompt.token,true,true),false)
  assert.equal(wc.listenerCount('destroyed'),0)
  assert.equal(w.win.webContents.listenerCount('render-process-gone'),1)
  assert.ok(!f.files.has('/test/site-permissions.json'));f.flush()
})
test('one-time permissions pass follow-up checks; clearing removes temporary and persisted grants', async () => {
  const f=fixture(),w=f.window(),wc=new EventEmitter()
  wc.id=85;wc.getType=()=> 'webview';wc.isDestroyed=()=>false;wc.getURL=()=> 'https://site.test/';wc.hostWebContents=w.win.webContents
  f.answer({response:1,checkboxChecked:false})
  assert.equal(await new Promise(resolve=>w.session.request(wc,'notifications',resolve,{requestingUrl:wc.getURL()})),true)
  assert.equal(w.session.check(wc,'notifications','https://site.test'),true)
  assert.ok(!f.files.has('/test/site-permissions.json'))
  assert.equal(f.features.clearPermissions('https://site.test'),true)
  assert.equal(w.session.check(wc,'notifications','https://site.test'),false)
  f.answer({response:1,checkboxChecked:true})
  await new Promise(resolve=>w.session.request(wc,'notifications',resolve,{requestingUrl:wc.getURL()}))
  assert.equal(f.files.get('/test/site-permissions.json')['https://site.test'].notifications,'allow')
  assert.equal(f.features.clearPermissions(),true)
  assert.deepEqual(f.files.get('/test/site-permissions.json'),{})
  assert.equal(w.session.check(wc,'notifications','https://site.test'),false);f.flush()
})
