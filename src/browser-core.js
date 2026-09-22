'use strict'

// Main-process services. Each section retains a private scope and lazy initialization.
const factories = Object.create(null)
const instances = Object.create(null)
function service(name) {
  if (!instances[name]) {
    const instance = { exports: {} }
    instances[name] = instance
    try { factories[name](instance, instance.exports) }
    catch (error) { delete instances[name]; throw error }
  }
  return instances[name].exports
}

// ===== browser-shortcuts =====
factories["browser-shortcuts"] = function(module, exports) {
'use strict'

function getBrowserShortcut(input) {
  if (!input || input.type !== 'keyDown' || input.isComposing) return null
  const key = String(input.key || '').toLowerCase()
  const control = input.control === true || input.meta === true
  if(input.alt) return !control && !input.shift ? ({arrowleft:'back',arrowright:'forward'}[key] || null) : null
  if(key==='escape') return 'escape'
  if(control) {
    if(key==='q' && !input.shift)return 'quit-shortcut'
    if(key==='t')return input.shift?'reopen-tab':'new-tab'
    if(key==='w' && !input.shift)return 'close-tab'
    if(key==='tab' || key==='pagedown')return input.shift?'previous-tab':'next-tab'
    if(key==='pageup')return 'previous-tab'
    if(key==='n')return input.shift?'private-window':'new-window'
    if(key==='j')return input.shift?'console':'downloads'
    if(['+','=','add'].includes(key))return 'zoom-in'
    if(['-','subtract'].includes(key))return 'zoom-out'
    if(key==='0')return 'zoom-reset'
    if(!input.shift && ({d:'bookmark',h:'history',k:'address',l:'address',u:'source'})[key])return ({d:'bookmark',h:'history',k:'address',l:'address',u:'source'})[key]
  }

  if (key === 'f5') return control ? 'hard-reload' : 'reload'
  if (control && key === 'r') return input.shift ? 'hard-reload' : 'reload'
  if ((control && key === 'f') || key === 'f3') return 'find'
  if (control && input.shift && key === 't') return 'reopen-tab'
  return null
}

module.exports = { getBrowserShortcut }

}

// ===== persistence =====
factories["persistence"] = function(module, exports) {
'use strict'

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const isBookmark = value => isRecord(value) && typeof value.url === 'string'
  && value.url.length > 0 && (value.title === undefined || typeof value.title === 'string')
  && (value.name === undefined || typeof value.name === 'string')
const isHistoryEntry = value => isBookmark(value) && Number.isFinite(value.timestamp)
const isBookmarks = value => Array.isArray(value) && value.every(isBookmark)
const isHistory = value => Array.isArray(value) && value.every(isHistoryEntry)
const settingBooleans = new Set(['expandBar', 'historySuggestions', 'bookmarkSuggestions',
  'qrShowInBar', 'qrDisableYtTime', 'blockLocalIp', 'aeroTabsDisabled', 'aeroTopBlur', 'backdropContrast', 'skipQuitShortcutPrompt'])
const settingStrings = new Set(['theme', 'bkBarMode', 'searchEngine', 'homepage', 'homepageUrl',
  'customHomepageUrl', 'privateSuggestionsMode', 'lang', 'startupBehavior', 'startupCustomUrl', 'lastOpenedUrl'])
const settingNumbers = new Set(['aeroBlur', 'aeroTopOpacity'])
const isSettings = value => isRecord(value) && Object.entries(value).every(([key, item]) => {
  // Legacy webpage areas are accepted on disk; loadSettings filters them out.
  if (key === 'aeroAreas') return Array.isArray(item) && item.length <= 6 && new Set(item).size === item.length
    && item.every(area => ['tabs', 'bookmarks', 'navigation', 'ui', 'cards', 'homepage', 'search'].includes(area))
  if (['__proto__', 'constructor', 'prototype'].includes(key)) return false
  if (key === 'aeroScope') return ['ui', 'tabs-ui', 'bookmarks-ui', 'all', 'tabs', 'bookmarks', 'navigation', 'navigation-ui'].includes(item)
  if (settingBooleans.has(key)) return typeof item === 'boolean'
  if (settingStrings.has(key)) return typeof item === 'string' && item.length <= 32768
  if (settingNumbers.has(key)) return Number.isInteger(item) && item >= 0 && item <= 100
  if (key === 'startupBookmarks') return Array.isArray(item) && item.length <= 10000
    && item.every(url => typeof url === 'string' && url.length <= 32768)
  return true
})
const MAX_JSON_BYTES = 32 * 1024 * 1024
function readLimitedFile(file, limit = MAX_JSON_BYTES) {
  const fd = fs.openSync(file, 'r')
  try {
    if (fs.fstatSync(fd).size > limit) throw Object.assign(new Error('File too large'), { code: 'DATA_TOO_LARGE' })
    const chunks = []
    let total = 0
    while (true) {
      const chunk = Buffer.alloc(Math.min(64 * 1024, limit + 1 - total))
      const count = fs.readSync(fd, chunk, 0, chunk.length, null)
      if (!count) return Buffer.concat(chunks, total)
      total += count
      if (total > limit) throw Object.assign(new Error('File too large'), { code: 'DATA_TOO_LARGE' })
      chunks.push(chunk.subarray(0, count))
    }
  } finally { fs.closeSync(fd) }
}
const isBooleanRecord = value => isRecord(value) && Object.values(value).every(item => typeof item === 'boolean')
const isBlockedRules = value => isRecord(value) && Object.entries(value).every(([host, selectors]) =>
  host.length <= 253 && !['__proto__', 'constructor', 'prototype'].includes(host)
  && Array.isArray(selectors) && selectors.length <= 10000
  && selectors.every(selector => typeof selector === 'string' && selector.length <= 4096))

function createStore(directory) {
  const blockedWrites = new Set()
  const reported = new Set()
  function report(operation, file, error) {
    // Bez adresów odwiedzanych stron, haseł i treści błędnych danych.
    const event = { time: new Date().toISOString(), operation,
      file: path.basename(file), code: String(error?.code || error?.name || 'UNKNOWN').slice(0, 64) }
    const key = `${event.operation}:${event.file}:${event.code}`
    if (reported.has(key)) return
    if (reported.size >= 100) reported.clear()
    reported.add(key)
    try {
      const log = path.join(directory, 'storage-errors.log')
      if (fs.existsSync(log) && fs.statSync(log).size > 256 * 1024) {
        fs.renameSync(log, log + '.previous')
      }
      fs.appendFileSync(log, JSON.stringify(event) + '\n', { mode: 0o600 })
    } catch {}
    try { console.error('[Nitrix] Storage:', event) } catch {}
  }

  function read(file, validate, fallback) {
    try {
      const value = JSON.parse(readLimitedFile(file).toString('utf8'))
      if (!validate(value)) throw Object.assign(new Error('Invalid structure'), { code: 'INVALID_STRUCTURE' })
      blockedWrites.delete(file)
      return value
    } catch (error) {
      if (error.code === 'ENOENT') { blockedWrites.delete(file); return fallback() }
      report('read', file, error)
      // Zachowaj oryginał. Jeśli kopia się nie uda, nie nadpisuj go wartościami domyślnymi.
      blockedWrites.add(file)
      if (error instanceof SyntaxError || error.code === 'INVALID_STRUCTURE') {
        try {
          const backup = file + '.recovery'
          if (!fs.existsSync(backup) || !readLimitedFile(backup).equals(readLimitedFile(file))) {
            fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL)
          }
          blockedWrites.delete(file)
        } catch (backupError) { report('backup', file, backupError) }
      }
      return fallback()
    }
  }

  function write(file, value, validate) {
    let temporary
    try {
      if (!validate(value)) throw Object.assign(new Error('Invalid structure'), { code: 'INVALID_STRUCTURE' })
      if (blockedWrites.has(file)) throw Object.assign(new Error('Original not backed up'), { code: 'WRITE_BLOCKED' })
      const json = JSON.stringify(value, null, 2)
      if (Buffer.byteLength(json) > 32 * 1024 * 1024) {
        throw Object.assign(new Error('File too large'), { code: 'DATA_TOO_LARGE' })
      }
      temporary = file + '.' + crypto.randomUUID() + '.tmp'
      const fd = fs.openSync(temporary, 'wx', 0o600)
      try {
        fs.writeFileSync(fd, json)
        fs.fsyncSync(fd)
      } finally { fs.closeSync(fd) }
      fs.renameSync(temporary, file)
      return true
    } catch (error) {
      report('write', file, error)
      return false
    } finally {
      if (temporary) { try { fs.unlinkSync(temporary) } catch {} }
    }
  }
  return { read, write, report }
}

module.exports = { createStore, isRecord, isBookmark, isHistoryEntry, isBookmarks, isHistory,
  readLimitedFile, isBooleanRecord, isBlockedRules, isSettings }

}

// ===== whatsapp-compat =====
factories["whatsapp-compat"] = function(module, exports) {
'use strict'

// Chrome Stable, 2026-09-08. To profil zgodności, nie aktualizacja silnika.
const CHROME_VERSION = '153.0.8010.36'
function isWhatsApp(url) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && parsed.hostname === 'web.whatsapp.com' }
  catch { return false }
}
function chromeUserAgent(platform = process.platform) {
  const system = platform === 'win32' ? 'Windows NT 10.0; Win64; x64'
    : platform === 'darwin' ? 'Macintosh; Intel Mac OS X 10_15_7' : 'X11; Linux x86_64'
  return `Mozilla/5.0 (${system}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_VERSION} Safari/537.36`
}
const configuredSessions = new WeakSet()
function configureWhatsApp(contents) {
  const original = contents.getUserAgent()
  contents.on('did-start-navigation', (_event, url, _inPlace, mainFrame) => {
    if (mainFrame && !contents.isDestroyed()) contents.setUserAgent(isWhatsApp(url) ? chromeUserAgent() : original)
  })
  const session = contents.session
  if (configuredSessions.has(session)) return
  configuredSessions.add(session)
  session.webRequest.onBeforeSendHeaders({ urls: ['https://web.whatsapp.com/*'] }, (details, callback) => {
    const headers = { ...details.requestHeaders }
    for (const key of Object.keys(headers)) if (key.toLowerCase() === 'user-agent') delete headers[key]
    headers['User-Agent'] = chromeUserAgent()
    callback({ requestHeaders: headers })
  })
}
module.exports = { isWhatsApp, chromeUserAgent, configureWhatsApp }

}

// ===== webview-security =====
factories["webview-security"] = function(module, exports) {
'use strict'

function hardenWebview(event, preferences, params, expectedPartition) {
  if (params.partition !== expectedPartition) { event.preventDefault(); return }
  delete preferences.preload
  delete preferences.preloadURL
  preferences.sandbox = true
  preferences.contextIsolation = true
  preferences.nodeIntegration = false
  preferences.nodeIntegrationInSubFrames = false
  preferences.nodeIntegrationInWorker = false
  preferences.webSecurity = true
  preferences.allowRunningInsecureContent = false
  preferences.webviewTag = false
  preferences.experimentalFeatures = false
}

module.exports = { hardenWebview }

}

// ===== password-autofill =====
factories["password-autofill"] = function(module, exports) {
'use strict'

function credentialOrigin(site) {
  try {
    const url = new URL(/^https?:\/\//i.test(site) ? site : 'https://' + site)
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.origin : null
  } catch { return null }
}

function allowedFrameOrigin(savedOrigin, topUrl, frameUrl) {
  const frameOrigin = credentialOrigin(frameUrl)
  if (frameOrigin === savedOrigin) return frameOrigin
  // The portal embeds Synergia's login. This exception is deliberately
  // limited to the login route and the verified Synergia/OAuth endpoints.
  try {
    const top = new URL(topUrl)
    if (savedOrigin === 'https://portal.librus.pl'
      && top.origin === savedOrigin
      && /^\/rodzina\/synergia\/loguj\/?$/.test(top.pathname)) {
      if (frameOrigin === 'https://synergia.librus.pl') return frameOrigin
      const frame = new URL(frameUrl)
      if (frameOrigin === 'https://api.librus.pl'
        && /^\/OAuth\/Authorization(?:\/|$)/.test(frame.pathname)
        && frame.searchParams.get('client_id') === '46') return frameOrigin
    }
  } catch {}
  return null
}

function fillInPage(origin, user, password) {
  if (location.origin !== origin) return false
  function find(selectors, excluded, root = document) {
    for (const selector of selectors) {
      const element = Array.from(root.querySelectorAll(selector)).find(el => {
        const style = getComputedStyle(el)
        return el !== excluded && !el.disabled && !el.readOnly && el.type !== 'hidden'
          && el.getClientRects().length > 0 && style.display !== 'none'
          && style.visibility !== 'hidden' && style.opacity !== '0'
      })
      if (element) return element
    }
    return null
  }
  const pass = find(['input[type="password"]'], null)
  const loginSelectors = ['input[autocomplete="username"]', 'input[type="email"]',
    'input[name="identifier"]', 'input[name*="login" i]', 'input[name*="user" i]',
    'input[name*="mail" i]', 'input[id*="login" i]']
  const loginRoot = pass?.form || document
  const login = find(loginSelectors, pass, loginRoot)
    || (pass ? find(['input[type="text"]', 'input:not([type])'], pass, loginRoot) : null)
  function fill(el, value) {
    el.focus()
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    setter.call(el, value)
    el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertText', data: value }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    el.blur()
    return el.value === value
  }
  let filled = false
  if (user && login) filled = fill(login, user)
  if (pass) filled = fill(pass, password) || filled
  return filled
}

function registerAutofill({ ipcMain, trusted, access, hasPin, fingerprint,
  readPreference, writePreference, loadPasswords, getContents }) {
  function skipEnabled() {
    const pin = fingerprint()
    const preference = readPreference()
    return !!pin && preference.enabled === true && preference.pin === pin
  }
  ipcMain.handle('passwords-autofill-skip-get', event => trusted(event) && skipEnabled())
  ipcMain.handle('passwords-autofill-skip-set', (event, enabled) => {
    if (!trusted(event) || typeof enabled !== 'boolean') return false
    if (enabled && (!hasPin() || !access.allowed(event))) return false
    const pin = fingerprint()
    if (enabled && !pin) return false
    const saved = writePreference({ enabled, pin: enabled ? pin : '' })
    if (saved) access.lock(event)
    return saved
  })
  ipcMain.handle('passwords-autofill', async (event, request) => {
    if (!trusted(event) || !request || !Number.isInteger(request.id)
      || typeof request.site !== 'string' || typeof request.user !== 'string') return false
    if (!skipEnabled() && !access.allowed(event)) return false
    const target = getContents(request.id)
    if (!target || target.isDestroyed() || target.getType() !== 'webview'
      || target.hostWebContents !== event.sender) return false
    const origin = credentialOrigin(request.site)
    if (!origin || credentialOrigin(target.getURL()) !== origin) return false
    const entry = loadPasswords().find(item => item.site === request.site && item.user === request.user)
    if (!entry || typeof entry.plainPass !== 'string') return false
    const script = `(${fillInPage.toString()})(${JSON.stringify(origin)},${JSON.stringify(entry.user)},${JSON.stringify(entry.plainPass)})`
    // Check each frame separately, including the narrowly scoped Librus login.
    const frames = target.mainFrame?.framesInSubtree
    if (!frames) {
      try { return (await target.executeJavaScript(script)) === true }
      catch { return false }
    }
    for (const frame of frames) {
      try {
        if (target.isDestroyed() || credentialOrigin(target.getURL()) !== origin) return false
        const frameOrigin = allowedFrameOrigin(origin, target.getURL(), frame.url)
        if (!frameOrigin) continue
        const frameScript = `(${fillInPage.toString()})(${JSON.stringify(frameOrigin)},${JSON.stringify(entry.user)},${JSON.stringify(entry.plainPass)})`
        if (await frame.executeJavaScript(frameScript) === true) return true
      } catch { /* A frame may disappear or navigate while filling. */ }
    }
    return false
  })
}

module.exports = { registerAutofill, credentialOrigin, fillInPage }

}

// ===== backdrop-content =====
factories["backdrop-content"] = function(module, exports) {
'use strict'


// BGRA input and output. Only pixels belonging to detected glyphs are repaired;
// the rest of the output remains transparent, preserving the live page beneath.
function repairGlyphs(source,width,height,words,regions) {
  const length=width*height,mask=new Uint8Array(length)
  const inside=(x,y)=>regions.some(r=>x>=r.x*width && y>=r.y*height && x<(r.x+r.width)*width && y<(r.y+r.height)*height)
  for(const word of words) {
    if(!Number.isFinite(word.confidence) || word.confidence<75) continue
    const box=word.bbox
    const left=Math.max(2,Math.floor(box.x0)-2),right=Math.min(width-3,Math.ceil(box.x1)+2)
    const top=Math.max(2,Math.floor(box.y0)-2),bottom=Math.min(height-3,Math.ceil(box.y1)+2)
    if(right<=left || bottom<=top || (right-left)*(bottom-top)>length/3) continue
    const bins=new Map()
    const sample=(x,y)=>{
      const i=(y*width+x)*4,key=(source[i]>>4)*256+(source[i+1]>>4)*16+(source[i+2]>>4)
      const b=bins.get(key)||[0,0,0,0];b[0]++;b[1]+=source[i];b[2]+=source[i+1];b[3]+=source[i+2];bins.set(key,b)
    }
    for(let x=left;x<=right;x++){sample(x,top);sample(x,bottom)}
    for(let y=top;y<=bottom;y++){sample(left,y);sample(right,y)}
    const dominant=[...bins.values()].sort((a,b)=>b[0]-a[0])[0]
    if(!dominant) continue
    const background=dominant.slice(1).map(c=>c/dominant[0])
    // Inpainting is only safe on a locally plain background. A letter-shaped
    // OCR box is not evidence that every contrasting detail is a glyph.
    const distance=(i,color)=>Math.max(...color.map((c,k)=>Math.abs(c-source[i+k])))
    let border=0,plain=0
    const check=(x,y)=>{border++;if(distance((y*width+x)*4,background)<24)plain++}
    for(let x=left;x<=right;x++){check(x,top);check(x,bottom)}
    for(let y=top;y<=bottom;y++){check(left,y);check(right,y)}
    if(plain/border<.95) continue
    const symbols=word.symbols?.length ? word.symbols : [{bbox:box}]
    for(const symbol of symbols) {
      if(Number.isFinite(symbol.confidence) && symbol.confidence<75) continue
      const b=symbol.bbox
      const x0=Math.max(1,Math.floor(b.x0)-1),x1=Math.min(width-2,Math.ceil(b.x1)+1)
      const y0=Math.max(1,Math.floor(b.y0)-1),y1=Math.min(height-2,Math.ceil(b.y1)+1)
      const foreground=[]
      let backgroundPixels=0
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++) {
        const i=(y*width+x)*4,d=distance(i,background)
        if(d<24)backgroundPixels++
        else if(d>80)foreground.push(i)
      }
      if(backgroundPixels/((x1-x0+1)*(y1-y0+1))<.2 || !foreground.length)continue
      // Text strokes have a coherent ink color; photo texture generally does not.
      const ink=[0,1,2].map(c=>foreground.map(i=>source[i+c]).sort((a,b)=>a-b)[Math.floor(foreground.length/2)])
      if(foreground.filter(i=>distance(i,ink)<48).length/foreground.length<.55)continue
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++) {
        const i=(y*width+x)*4
        const difference=Math.max(...background.map((c,k)=>Math.abs(c-source[i+k])))
        if(difference>36) mask[y*width+x]=1
      }
    }
  }
  // Include antialiasing around detected strokes, not the entire word rectangle.
  const dilated=mask.slice()
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(mask[y*width+x]) {
    for(const d of [-width,-1,1,width])dilated[y*width+x+d]=1
  }
  const pixels=Buffer.from(source),output=Buffer.alloc(length*4),queue=new Uint32Array(length),filled=[]
  let head=0,tail=0
  const neighbours=i=>[i-width,i-1,i+1,i+width].filter(n=>n>=0&&n<length&&Math.abs(n%width-i%width)<=1)
  for(let i=0;i<length;i++)if(dilated[i] && neighbours(i).some(n=>!dilated[n])) {queue[tail++]=i;dilated[i]=2}
  while(head<tail) {
    const i=queue[head++],known=neighbours(i).filter(n=>dilated[n]===0||dilated[n]===3)
    if(!known.length) continue
    for(let c=0;c<3;c++) pixels[i*4+c]=Math.round(known.reduce((sum,n)=>sum+pixels[n*4+c],0)/known.length)
    dilated[i]=3;filled.push(i)
    for(const n of neighbours(i))if(dilated[n]===1){dilated[n]=2;queue[tail++]=n}
  }
  // Relax the repaired strokes into the adjacent colors.
  for(let pass=0;pass<4;pass++)for(const i of filled) {
    const ns=neighbours(i)
    for(let c=0;c<3;c++) pixels[i*4+c]=Math.round(ns.reduce((sum,n)=>sum+pixels[n*4+c],0)/ns.length)
  }
  // Repair the complete stroke first, then clip. Otherwise the uncovered half
  // of an edge letter is incorrectly used as the replacement background.
  let count=0
  for(const i of filled)if(inside(i%width,Math.floor(i/width))){output[i*4]=pixels[i*4];output[i*4+1]=pixels[i*4+1];output[i*4+2]=pixels[i*4+2];output[i*4+3]=255;count++}
  return {bitmap:output,count}
}

const path=require('node:path')
const crypto=require('node:crypto')
let workerPromise=null,busy=false,idleTimer=null,stopped=false
const cache=new WeakMap()
const physical=file=>file.replace(/app\.asar([\\/])/,'app.asar.unpacked$1')
async function worker() {
  if(stopped) throw Error('OCR stopped')
  if(!workerPromise) {
    const {createWorker}=require('tesseract.js')
    workerPromise=createWorker('eng+pol',1,{
      workerPath:physical(require.resolve('tesseract.js/src/worker-script/node/index.js')),
      langPath:physical(path.join(__dirname,'assets','ocr')),
      cacheMethod:'none',logger:()=>{},errorHandler:()=>{}
    }).then(async w=>{await w.setParameters({tessedit_pageseg_mode:'11',user_defined_dpi:'96'});return w})
    workerPromise.catch(()=>{workerPromise=null})
  }
  return workerPromise
}
async function release(permanent=false) {
  if(permanent) stopped=true
  clearTimeout(idleTimer)
  const previous=workerPromise;workerPromise=null
  if(previous) try{await (await previous).terminate()}catch{}
}
function wordsFrom(data) {
  const words=[]
  for(const block of data.blocks||[])for(const paragraph of block.paragraphs||[])for(const line of paragraph.lines||[])for(const word of line.words||[]) {
    if(word.confidence>=75 && /[\p{L}\p{N}]/u.test(word.text||''))words.push(word)
  }
  return words
}
async function repair(guest,regions) {
  if(!regions.length||busy||stopped||guest.isDestroyed())return null
  busy=true;clearTimeout(idleTimer)
  let timeout
  try {
    const {nativeImage}=require('electron')
    const surfaces=await guest.executeJavaScriptInIsolatedWorld(1107,[{code:`(() => {
      const roots=[document], result=[], text=[];
      const normalized=r=>({x:r.left/innerWidth,y:r.top/innerHeight,width:r.width/innerWidth,height:r.height/innerHeight});
      for(const root of roots)for(const el of root.querySelectorAll('*')) {
        if(el.shadowRoot)roots.push(el.shadowRoot);
        if(el.matches('script,style,noscript'))continue;
        for(const node of el.childNodes)if(node.nodeType===3 && node.textContent.trim()) {
          const range=document.createRange();range.selectNodeContents(node);
          for(const r of range.getClientRects())if(r.width&&r.height)text.push(normalized(r));
        }
        if(el.matches('input,textarea,select,svg text,iframe') || ['::before','::after'].some(p=>{const c=getComputedStyle(el,p).content;return c && c!=='none' && c!=='normal' && c!=='""'}))text.push(normalized(el.getBoundingClientRect()));
        const style=getComputedStyle(el);
        if(!el.matches('img,canvas,svg image') && !/url\\(/.test(style.backgroundImage))continue;
        const r=el.getBoundingClientRect();
        if(r.width && r.height && r.bottom>0 && r.right>0 && r.top<innerHeight && r.left<innerWidth)
          result.push({x:r.left/innerWidth,y:r.top/innerHeight,width:r.width/innerWidth,height:r.height/innerHeight});
      }
      return {graphics:result,text};
    })()`}])
    // OCR is only allowed to repair pixels belonging to graphical surfaces.
    regions=regions.flatMap(r=>surfaces.graphics.map(g=>{
      const x=Math.max(r.x,g.x,0),y=Math.max(r.y,g.y,0);
      return {x,y,width:Math.min(r.x+r.width,g.x+g.width,1)-x,height:Math.min(r.y+r.height,g.y+g.height,1)-y};
    }).filter(r=>r.width>0&&r.height>0))
    if(!regions.length)return {image:null,count:0}
    let image=await guest.capturePage()
    if(image.isEmpty())return null
    let {width,height}=image.getSize()
    if(width*height>16000000) {
      const scale=Math.sqrt(16000000/(width*height))
      image=image.resize({width:Math.floor(width*scale),height:Math.floor(height*scale)})
      ;({width,height}=image.getSize())
    }
    // Context outside the popup lets OCR recognize words crossing its edges.
    // Only the final patch is clipped to the actual popup footprint.
    const x=Math.max(0,Math.floor(Math.min(...regions.map(r=>r.x))*width)-96)
    const y=Math.max(0,Math.floor(Math.min(...regions.map(r=>r.y))*height)-96)
    const right=Math.min(width,Math.ceil(Math.max(...regions.map(r=>r.x+r.width))*width)+96)
    const bottom=Math.min(height,Math.ceil(Math.max(...regions.map(r=>r.y+r.height))*height)+96)
    if(right<=x||bottom<=y)return null
    const cropped=image.crop({x,y,width:right-x,height:bottom-y})
    const png=cropped.toPNG()
    const hash=crypto.createHash('sha256').update(png).update(JSON.stringify(regions)).update(JSON.stringify(surfaces.text)).update(width+':'+height).digest('hex')
    if(cache.get(guest)?.hash===hash)return cache.get(guest).result
    // Keep native text resolution. Overlapping tiles provide context at seams
    // without sending a whole high-resolution desktop to OCR in one operation.
    const words=[], seen=new Set(), w=await worker()
    for(let ty=y;ty<bottom;ty+=1024)for(let tx=x;tx<right;tx+=1024) {
      if(guest.isDestroyed()||stopped)return null
      const left=Math.max(x,tx-96),top=Math.max(y,ty-96)
      const tile=image.crop({x:left,y:top,width:Math.min(right,tx+1120)-left,height:Math.min(bottom,ty+1120)-top})
      const result=await Promise.race([w.recognize(tile.toPNG(),{}, {text:false,blocks:true}),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('OCR timeout')),15000)})])
      clearTimeout(timeout)
      for(const word of wordsFrom(result.data)) {
        const move=b=>({x0:b.x0+left,x1:b.x1+left,y0:b.y0+top,y1:b.y1+top})
        const bbox=move(word.bbox),cx=(bbox.x0+bbox.x1)/2,cy=(bbox.y0+bbox.y1)/2
        if(surfaces.text.some(r=>bbox.x1>r.x*width && bbox.x0<(r.x+r.width)*width && bbox.y1>r.y*height && bbox.y0<(r.y+r.height)*height))continue
        if(cx<tx||cx>=Math.min(right,tx+1024)||cy<ty||cy>=Math.min(bottom,ty+1024))continue
        const key=JSON.stringify(bbox)+word.text
        if(seen.has(key))continue
        seen.add(key)
        words.push({...word,bbox,symbols:(word.symbols||[]).map(s=>({...s,bbox:move(s.bbox)}))})
      }
    }
    if(guest.isDestroyed()||stopped)return null
    const patch=words.length ? repairGlyphs(image.toBitmap(),width,height,words,regions) : {count:0}
    const value={image:patch.count?nativeImage.createFromBitmap(patch.bitmap,{width,height}).toDataURL():null,count:patch.count}
    cache.set(guest,{hash,result:value})
    return value
  } catch(error) { if(process.env.NITRIX_BACKDROP_DEBUG)console.error(error);await release();return null }
  finally {clearTimeout(timeout);busy=false;if(!stopped){idleTimer=setTimeout(()=>release(),30000);idleTimer.unref?.()}}
}
function invalidate(guest){cache.delete(guest)}


// Runs in an isolated guest world. Glyphs touching a panel (including its edge) are
// hidden; layout, backgrounds, pictures and the document text stay untouched.
function updateTextMask(regions, maskCSS) {
  const key = '__nitrixBackdropText'
  if (!CSS.highlights || typeof Highlight !== 'function') return
  if (globalThis[key]) return globalThis[key](regions)
  const name = 'nitrix-backdrop-text'
  let areas = [], timer = 0, watching = false, revision = 0
  const controls = new Set()
  const shadowSheets = new Map()
  const observer = new MutationObserver(schedule)
  function schedule() {
    if (areas.length && !timer) timer = setTimeout(paint, 60)
  }
  async function paint() {
    const generation = ++revision
    clearTimeout(timer); timer = 0
    const boxes = areas.map(r => ({ left:r.x*innerWidth, top:r.y*innerHeight,
      right:(r.x+r.width)*innerWidth, bottom:(r.y+r.height)*innerHeight }))
    const covered = r => r.width > 0 && r.height > 0 && boxes.some(b =>
      r.left >= b.left && r.right <= b.right && r.top >= b.top && r.bottom <= b.bottom)
    const intersects = r => boxes.some(b => r.right>b.left && r.left<b.right && r.bottom>b.top && r.top<b.bottom)
    const full = boxes.some(b => b.left<=1 && b.top<=1 && b.right>=innerWidth-1 && b.bottom>=innerHeight-1)
    document.documentElement.toggleAttribute('data-nitrix-backdrop-full', full)
    const roots=[document]
    for(const root of roots)for(const element of root.querySelectorAll('*')) {
      if(element.shadowRoot)roots.push(element.shadowRoot)
    }
    for(const root of roots.slice(1)) {
      if(!shadowSheets.has(root)) {
        const sheet=new CSSStyleSheet();shadowSheets.set(root,sheet)
        root.adoptedStyleSheets=[...root.adoptedStyleSheets,sheet]
      }
      shadowSheets.get(root).replaceSync(maskCSS.replaceAll('html[data-nitrix-backdrop-full] body', full ? ':host' : ':host([data-nitrix-unused])'))
      if(watching)observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class','hidden','value','placeholder']})
    }
    for(const [root,sheet] of shadowSheets)if(!areas.length || !root.host.isConnected) {
      root.adoptedStyleSheets=root.adoptedStyleSheets.filter(s=>s!==sheet);shadowSheets.delete(root)
    }
    const currentControls = new Set()
    if (boxes.length) for (const root of roots)for (const element of root.querySelectorAll('*')) {
      const rect=element.getBoundingClientRect()
      const textRects=[]
      for(const node of element.childNodes)if(node.nodeType===3 && node.textContent.trim()) {
        const range=document.createRange();range.selectNodeContents(node)
        textRects.push(...range.getClientRects())
      }
      const textCovered=textRects.length>0 && textRects.every(covered)
      const generated=['::before','::after','::marker'].some(p=>{
        const content=getComputedStyle(element,p).content
        return content && content!=='none' && content!=='normal' && content!=='""'
      })
      if (intersects(rect) && (element.matches('input,textarea,select,svg text') || textCovered || covered(rect) && generated)) {
        currentControls.add(element)
        element.setAttribute('data-nitrix-backdrop-control', '')
      }
    }
    for (const element of controls) if (!currentControls.has(element)) element.removeAttribute('data-nitrix-backdrop-control')
    controls.clear()
    for (const element of currentControls) controls.add(element)
    const highlight = new Highlight()
    for(const root of roots) {
    const walker = document.createTreeWalker(root === document ? document.body || document.documentElement : root, NodeFilter.SHOW_TEXT)
    let node, visits = 0
    while (!full && boxes.length && (node=walker.nextNode())) {
      if (++visits % 100 === 0) {
        await new Promise(resolve=>setTimeout(resolve,0))
        if (generation !== revision) return
      }
      if (!node.textContent.trim() || node.parentElement?.closest('script,style,noscript,textarea,select')) continue
      const range = document.createRange(); range.selectNodeContents(node)
      if (!intersects(range.getBoundingClientRect())) continue
      const rects = [...range.getClientRects()]
      if (rects.length && rects.every(covered)) { highlight.add(range); continue }
      let start = -1
      const flush = end => { if (start<0) return; const part=document.createRange(); part.setStart(node,start); part.setEnd(node,end); highlight.add(part); start=-1 }
      for (let i=0;i<node.length;) {
        const end = i + (node.textContent.codePointAt(i)>0xffff ? 2 : 1)
        range.setStart(node,i); range.setEnd(node,end)
        if ([...range.getClientRects()].some(intersects)) { if(start<0) start=i } else flush(i)
        i=end
        if (i===node.length) flush(i)
      }
    }
    }
    if (highlight.size) CSS.highlights.set(name,highlight)
    else CSS.highlights.delete(name)
    // Nie pokazuj tekstu nowego dokumentu przed narysowaniem pierwszej maski.
    document.documentElement?.setAttribute('data-nitrix-backdrop-ready', '1')
  }
  globalThis[key] = next => {
    areas = next
    if (areas.length && !watching) {
      observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class','hidden']})
      addEventListener('scroll',schedule,true); addEventListener('resize',schedule)
      watching=true
    } else if (!areas.length && watching) {
      observer.disconnect(); removeEventListener('scroll',schedule,true); removeEventListener('resize',schedule); watching=false
    }
    return paint()
  }
  addEventListener('pagehide',()=>globalThis[key]([]),{once:true})
  return globalThis[key](regions)
}

const states = new WeakMap()
const TEXT_MASK_CSS = `
  html[data-nitrix-backdrop-full] body,
  html[data-nitrix-backdrop-full] body *,
  html[data-nitrix-backdrop-full] body *::before,
  html[data-nitrix-backdrop-full] body *::after,
  html[data-nitrix-backdrop-full] body *::placeholder {
    -webkit-text-fill-color: transparent !important;
    -webkit-text-stroke-color: transparent !important;
    text-shadow: none !important;
    text-decoration-color: transparent !important;
    caret-color: transparent !important;
  }
  html[data-nitrix-backdrop-full] svg text { fill: transparent !important; stroke: transparent !important; }
  html:not([data-nitrix-backdrop-ready="1"]) body * {
    color: transparent !important;
    text-shadow: none !important;
    text-decoration-color: transparent !important;
  }
  html:not([data-nitrix-backdrop-ready="1"]) body input,
  html:not([data-nitrix-backdrop-ready="1"]) body textarea,
  html:not([data-nitrix-backdrop-ready="1"]) body select {
    -webkit-text-fill-color: transparent !important;
    caret-color: transparent !important;
  }
  ::highlight(nitrix-backdrop-text) { color: transparent; background-color: transparent; text-shadow: none; text-decoration-color: transparent; }
  [data-nitrix-backdrop-control], [data-nitrix-backdrop-control]::placeholder,
  [data-nitrix-backdrop-control]::before, [data-nitrix-backdrop-control]::after, [data-nitrix-backdrop-control]::marker {
    -webkit-text-fill-color: transparent !important; -webkit-text-stroke-color: transparent !important; text-shadow: none !important; caret-color: transparent !important;
  }
  svg text[data-nitrix-backdrop-control] { fill: transparent !important; stroke: transparent !important; }
`
async function setTextMask(guest, regions) {
  const insertMaskCSS=async()=>{
    await guest.insertCSS('[data-nitrix-backdrop-control],html[data-nitrix-backdrop-full] body * {-webkit-text-fill-color:transparent!important;-webkit-text-stroke-color:transparent!important;text-shadow:none!important}',{cssOrigin:'user'})
    return guest.insertCSS(TEXT_MASK_CSS)
  }
  let state = states.get(guest)
  if (!state) {
    state={pending:null,running:false,css:null,active:false}; states.set(guest,state)
    guest.on('did-start-navigation',(_event,_url,inPlace,mainFrame)=>{
      if(mainFrame && !inPlace) {
        state.pending=[]
        // Reinject the guard before the new document can paint. The old
        // document's CSS key cannot be assumed to survive navigation.
        if(state.active) state.css=insertMaskCSS().catch(()=>{ state.css=null })
      }
    })
  }
  state.pending=regions
  state.active=regions.length>0
  if(state.running) return
  state.running=true
  try {
    while(state.pending && !guest.isDestroyed()) {
      const next=state.pending; state.pending=null
      if (!state.css && next.length) state.css=await insertMaskCSS()
      await guest.executeJavaScriptInIsolatedWorld(1107,[{code:`(${updateTextMask.toString()})(${JSON.stringify(next)},${JSON.stringify(TEXT_MASK_CSS)})`}])
    }
  } catch { /* Navigation can destroy the old document while updating it. */ }
  finally { state.running=false }
}

module.exports={setTextMask,repair,release,invalidate,repairGlyphs}

}

// ===== password-access =====
factories["password-access"] = function(module, exports) {
'use strict'

function createPasswordAccess({ trusted, hasPin, verifyPin, now = Date.now }) {
  let grants = new WeakMap()
  let failures = 0
  let retryAt = 0
  return {
    allowed(event) {
      if (!trusted(event)) return false
      return !hasPin() || (grants.get(event.senderFrame) || 0) > now()
    },
    verify(event, pin) {
      if (!trusted(event) || typeof pin !== 'string' || !/^\d{4,12}$/.test(pin)) return false
      grants.delete(event.senderFrame)
      if (now() < retryAt || !hasPin()) return false
      if (!verifyPin(pin)) {
        failures++
        retryAt = now() + (failures >= 5 ? 30000 : 1000)
        return false
      }
      failures = 0
      retryAt = 0
      grants.set(event.senderFrame, now() + 60000)
      return true
    },
    lock(event) { if (trusted(event)) grants.delete(event.senderFrame) },
    revoke() { grants = new WeakMap() }
  }
}

module.exports = { createPasswordAccess }

}

// ===== native-aero =====
factories["native-aero"] = function(module, exports) {
'use strict'
const path = require('node:path')
const { execFile } = require('node:child_process')

function configureBackend(app, env = process.env, platform = process.platform, argv = process.argv) {
  if (platform !== 'linux' || !env.DISPLAY || !/(^|:)KDE(:|$)/i.test(env.XDG_CURRENT_DESKTOP || '')) return false
  const requested = app.commandLine.getSwitchValue('ozone-platform')
  // Electron adds its automatic Wayland selection to commandLine before main.js.
  // Only argv identifies an explicit user choice; don't mistake the automatic
  // selection for an override. Headless tests must still remain headless.
  const explicit = argv.slice(1).some(arg => arg === '--ozone-platform' || arg.startsWith('--ozone-platform='))
  if (requested === 'headless' || (explicit && requested && requested !== 'x11')) return false
  app.commandLine.appendSwitch('ozone-platform', 'x11')
  return true
}
function restartForBackend(app, enabled, env = process.env, argv = process.argv) {
  if (!enabled || !env.WAYLAND_DISPLAY || argv.some((arg, i) => arg === '--ozone-platform=x11'
      || (arg === '--ozone-platform' && argv[i+1] === 'x11'))) return false
  // Ozone is initialized before the app script in recent Electron versions.
  // Re-exec once, before any browser windows or session data are opened.
  app.relaunch({ args: [...argv.slice(1), '--ozone-platform=x11'] })
  app.exit(0)
  return true
}
function physicalRegions(regions, size, scale) {
  if (!Array.isArray(regions) || regions.length > 3 || !Number.isFinite(scale) || scale <= 0 || scale > 8) return null
  const output = []
  for (const rect of regions) {
    if (!rect || !['x','y','width','height'].every(k => Number.isFinite(rect[k]))) return null
    if (rect.width <= 0 || rect.height <= 0) continue
    const x = Math.max(0, Math.min(size[0], rect.x)), y = Math.max(0, Math.min(size[1], rect.y))
    const right = Math.min(size[0], rect.x + rect.width), bottom = Math.min(size[1], rect.y + rect.height)
    if (right <= x || bottom <= y) continue
    const px = Math.floor(x * scale), py = Math.floor(y * scale)
    const width = Math.ceil(right * scale) - px, height = Math.ceil(bottom * scale) - py
    if ([px,py,width,height].some(n => n > 65535)) return null
    output.push(px,py,width,height)
  }
  return output
}
function attach(win, app, enabled, run = execFile) {
  let timer, busy = false, closed = false, wanted = null, applied = null, failures = 0
  const helper = app.isPackaged ? path.join(process.resourcesPath, 'nitrix-aero') : path.join(__dirname, 'build', 'nitrix-aero')
  function flush() {
    timer = null
    if (!enabled || closed || busy || wanted === null || wanted === applied || failures >= 3 || win.isDestroyed()) return
    let id
    try { id = String(win.getNativeWindowHandle().readUInt32LE(0)) } catch { return }
    const sent = wanted
    busy = true
    // Fixed executable and numeric arguments only; no shell, no user-selected window.
    run(helper, [id, String(process.pid), ...JSON.parse(sent).map(String)], { timeout: 2000, maxBuffer: 1024 }, error => {
      busy = false
      if (closed) return
      if (error) failures++
      else { applied = sent; failures = 0 }
      if (wanted !== sent) timer = setTimeout(flush, 80)
    })
  }
  function update(regions) {
    if (!enabled || closed || !Array.isArray(regions)) return
    wanted = JSON.stringify(regions)
    clearTimeout(timer); timer = setTimeout(flush, 80)
  }
  win.once('closed', () => { closed = true; clearTimeout(timer) })
  return { update, get available() { return enabled && failures < 3 } }
}
module.exports = { configureBackend, restartForBackend, physicalRegions, attach }

}

// ===== ip-location =====
factories["ip-location"] = function(module, exports) {
'use strict'

const ENDPOINT = 'https://ipwho.is/?fields=success,latitude,longitude'
function createIPLocation() {
  const active = new WeakSet(), epochs = new WeakMap()
  async function lookup(sess) {
    const response = await sess.fetch(ENDPOINT, { credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw Error('LOCATION_UNAVAILABLE')
    const reader = response.body.getReader(); let size = 0; const chunks = []
    try {
      for (;;) {
        const {done, value} = await reader.read(); if (done) break
        size += value.byteLength; if (size > 16384) throw Error('LOCATION_RESPONSE_TOO_LARGE')
        chunks.push(Buffer.from(value))
      }
    } finally { await reader.cancel().catch(() => {}) }
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (data.success !== true || !Number.isFinite(data.latitude) || Math.abs(data.latitude) > 90
      || !Number.isFinite(data.longitude) || Math.abs(data.longitude) > 180) throw Error('LOCATION_UNAVAILABLE')
    // IP coordinates describe a broad area, not a GPS fix.
    return { latitude: data.latitude, longitude: data.longitude, accuracy: 100000 }
  }
  function reset(wc) {
    epochs.set(wc, (epochs.get(wc) || 0) + 1)
    if (active.delete(wc)) { try { if (!wc.isDestroyed() && wc.debugger.isAttached()) wc.debugger.detach() } catch {} }
  }
  async function prepare(wc) {
    const epoch = epochs.get(wc) || 0
    let position
    try { position = await lookup(wc.session) } catch { position = {} }
    if (wc.isDestroyed() || (epochs.get(wc) || 0) !== epoch) return false
    try {
      if (!active.has(wc)) {
        if (wc.debugger.isAttached()) return false
        wc.debugger.attach('1.3'); active.add(wc)
        wc.debugger.once('detach', () => active.delete(wc))
      }
      // An empty override yields POSITION_UNAVAILABLE when the service is offline.
      await wc.debugger.sendCommand('Emulation.setGeolocationOverride', position)
      return !wc.isDestroyed() && (epochs.get(wc) || 0) === epoch
    } catch { return false }
  }
  return {prepare, reset, ready: wc => active.has(wc) && wc.debugger.isAttached()}
}
module.exports = {createIPLocation, ENDPOINT}

}

// ===== browser-features =====
factories["browser-features"] = function(module, exports) {
'use strict'
const path = require('node:path')
const fs = require('node:fs/promises')
const { randomUUID } = require('node:crypto')

const DEFAULTS = { warnClose: true, sleepTabs: true, sleepMinutes: 30, sleepExceptions: [] }
const PERMISSIONS = ['camera', 'microphone', 'geolocation', 'notifications']
function originOf(url) {
  try { const u = new URL(url); return ['https:', 'http:'].includes(u.protocol) ? u.origin : null } catch { return null }
}
function safeTabUrl(url) {
  if (typeof url !== 'string' || url.length > 8192) return false
  try { const u = new URL(url); return ['http:', 'https:', 'file:'].includes(u.protocol) && !u.username && !u.password } catch { return false }
}
function validOptions(v) {
  return !!v && typeof v.warnClose === 'boolean' && typeof v.sleepTabs === 'boolean'
    && [5, 15, 30, 60].includes(v.sleepMinutes) && Array.isArray(v.sleepExceptions)
    && v.sleepExceptions.length <= 100 && v.sleepExceptions.every(h => typeof h === 'string' && /^[a-z0-9.-]{1,253}$/i.test(h))
}
function validSnapshot(v) {
  return !!v && Array.isArray(v.tabs) && v.tabs.length <= 500 && Number.isInteger(v.active)
    && v.active >= 0 && v.active < Math.max(1, v.tabs.length)
    && v.tabs.every(t => t && safeTabUrl(t.url) && typeof t.title === 'string' && t.title.length <= 512)
}
function bookmarkHTML(bookmarks) {
  const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
  return '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Nitrix Bookmarks</TITLE>\n<H1>Nitrix Bookmarks</H1>\n<DL><p>\n'
    + bookmarks.filter(b => safeTabUrl(b.url)).map(b => `  <DT><A HREF="${escape(b.url)}">${escape(b.name || b.title || b.url)}</A>`).join('\n') + '\n</DL><p>\n'
}

// Runs in the page solely to decide whether discarding its document is safe.
function pageCanSleep() {
  if (document.readyState !== 'complete' || document.fullscreenElement || window.onbeforeunload) return false
  if (window.__nitrixFormEdited) return false
  if ([...document.querySelectorAll('audio,video')].some(e => !e.paused && !e.ended)) return false
  if (document.querySelector('[contenteditable]:not([contenteditable="false"])')) return false
  return ![...document.querySelectorAll('input,textarea,select')].some(e => {
    if (e.type === 'hidden' || e.disabled) return false
    if (e.type === 'checkbox' || e.type === 'radio') return e.checked !== e.defaultChecked
    if (e.tagName === 'SELECT') return [...e.options].some(o => o.selected !== o.defaultSelected)
    return !!e.value || e.value !== e.defaultValue
  })
}

function installFeatures({ app, ipcMain, dialog, session, store, dataDir, trusted, getOwnedWebview, loadBookmarks, loadSettings }) {
  const windows = new Map(), configuredSessions = new WeakMap(), mediaProtected = new Set(), downloads = new Map()
  const sessionConfigs = new Set(), guests = new Map()
  const location = require('./browser-core')["ip-location"].createIPLocation()
  const optionsFile = path.join(dataDir, 'browser-options.json')
  let options = store.read(optionsFile, validOptions, () => ({ ...DEFAULTS }))
  const sessionFile = path.join(dataDir, 'session-recovery.json')
  const validRecovery = v => Array.isArray(v) && v.length <= 50 && v.every(x => x && typeof x.key === 'string' && x.key.length <= 64 && validSnapshot(x.snapshot))
  let recovery = store.read(sessionFile, validRecovery, () => [])
  let recoveryOwner = null
  const permissionFile = path.join(dataDir, 'site-permissions.json')
  const validPermissions = v => !!v && !Array.isArray(v) && typeof v === 'object' && Object.keys(v).length <= 2000
    && Object.entries(v).every(([o, p]) => originOf(o) === o && p && typeof p === 'object'
      && Object.entries(p).every(([k, value]) => PERMISSIONS.includes(k) && ['allow', 'block'].includes(value)))
  let savedPermissions = store.read(permissionFile, validPermissions, () => ({}))
  let saveTimer = null
  function flushSessions() {
    clearTimeout(saveTimer); saveTimer = null
    const live = [...windows.values()].filter(w => !w.private && w.snapshot?.tabs.length)
      .map(w => ({ key: w.key, snapshot: w.snapshot }))
    store.write(sessionFile, [...recovery, ...live].slice(-50), validRecovery)
  }
  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(flushSessions, 150) }
  function stateFor(e) { return trusted(e) ? windows.get(e.sender.id) : null }
  const permissionPrompts = new Map()
  ipcMain.handle('features-close-answer', (e, token, close, remember) => {
    const state = stateFor(e)
    if (!state || !state.closePending || state.closeToken !== token || typeof close !== 'boolean' || typeof remember !== 'boolean') return false
    state.closePending = false; state.closeToken = null
    if (!close || state.win.isDestroyed()) return true
    if (remember) {
      const next = { ...options, warnClose: false }
      if (store.write(optionsFile, next, validOptions)) {
        options = next
        for (const w of windows.values()) if (!w.win.isDestroyed()) w.win.webContents.send('features-options-changed', options)
      }
    }
    state.approved = true; state.win.close(); return true
  })
  ipcMain.handle('features-permission-answer', (e, token, allow, remember) => {
    if (!stateFor(e) || typeof token !== 'string' || typeof allow !== 'boolean' || typeof remember !== 'boolean') return false
    const pending = permissionPrompts.get(e.sender.id)
    if (!pending || pending.token !== token) return false
    pending.finish({ response: allow ? 1 : 0, checkboxChecked: remember }); return true
  })
  function askPermission(owner, wc, origin, kinds) {
    const host = owner.win.webContents, id = host.id
    if (permissionPrompts.has(id)) return Promise.resolve({ response: 0, checkboxChecked: false })
    return new Promise(resolve => {
      const token = randomUUID()
      const finish = result => {
        if (permissionPrompts.get(id)?.token !== token) return
        permissionPrompts.delete(id); clearTimeout(timer)
        wc.removeListener('did-start-navigation', navigate); wc.removeListener('destroyed', cancel)
        owner.win.removeListener('closed', cancel); host.removeListener('render-process-gone', cancel)
        if (!owner.win.isDestroyed()) host.send('features-permission-cancel', token)
        resolve(result)
      }
      const cancel = () => finish({ response: 0, checkboxChecked: false, cancelled: true })
      const navigate = () => cancel()
      const timer = setTimeout(cancel, 60000)
      permissionPrompts.set(id, { token, origin, finish })
      wc.on('did-start-navigation', navigate); wc.once('destroyed', cancel)
      owner.win.once('closed', cancel); host.once('render-process-gone', cancel)
      try { host.send('features-permission-prompt', { token, origin, kinds }) } catch { cancel() }
    })
  }
  function language() { return loadSettings().lang === 'en' ? 'en' : 'pl' }
  function tabPermissions(wc) { return configuredSessions.get(wc.session) }
  function permissionKinds(permission, details) {
    if (permission === 'media') {
      const types = details.mediaTypes || (details.mediaType ? [details.mediaType] : [])
      return types.length ? [...new Set(types.map(t => t === 'video' ? 'camera' : t === 'audio' ? 'microphone' : null))].filter(Boolean) : ['camera', 'microphone']
    }
    return PERMISSIONS.includes(permission) ? [permission] : []
  }
  function configureSession(sess, privateMode) {
    if (configuredSessions.has(sess)) return
    const config = { private: privateMode, grants: {}, pending: new Set(), transient: new Map() }
    sessionConfigs.add(config)
    configuredSessions.set(sess, config)
    const grants = () => privateMode ? config.grants : savedPermissions
    const decision = (wc, origin, kind) => grants()[origin]?.[kind] || config.transient.get(wc.id)?.[origin]?.[kind]
    sess.setPermissionCheckHandler((wc, permission, requestingOrigin, details = {}) => {
      if (!wc || wc.isDestroyed() || wc.getType() !== 'webview' || !windows.has(wc.hostWebContents?.id)) return false
      const origin = originOf(requestingOrigin)
      const kinds = permissionKinds(permission, details)
      const allowed = !!origin && kinds.length > 0 && kinds.every(k => decision(wc, origin, k) === 'allow')
      if (allowed && permission === 'media') mediaProtected.add(wc.id)
      return allowed && (permission !== 'geolocation' || location.ready(wc))
    })
    sess.setPermissionRequestHandler(async (wc, permission, callback, details = {}) => {
      const owner = wc && !wc.isDestroyed() ? windows.get(wc.hostWebContents?.id) : null
      const origin = originOf(details.securityOrigin || details.requestingUrl || wc?.getURL())
      if (!owner || owner.win.isDestroyed() || wc.getType() !== 'webview' || !origin) { callback(false); return }
      if (['fullscreen', 'pointerLock', 'clipboard-sanitized-write'].includes(permission)) { callback(true); return }
      const kinds = permissionKinds(permission, details)
      if (!kinds.length || kinds.some(k => decision(wc, origin, k) === 'block')) { callback(false); return }
      const protectMedia = () => { if (kinds.some(k => ['camera', 'microphone'].includes(k))) mediaProtected.add(wc.id) }
      if (kinds.every(k => decision(wc, origin, k) === 'allow')) {
        protectMedia(); callback(permission !== 'geolocation' || await location.prepare(wc)); return
      }
      if (config.pending.has(wc.id)) { callback(false); return }
      config.pending.add(wc.id)
      const initialURL = wc.getURL()
      let stale = false
      const navigation = (_e, _url, inPlace, main) => { if (main && !inPlace) stale = true }
      wc.on('did-start-navigation', navigation)
      try {
        const result = await askPermission(owner, wc, origin, kinds)
        if (result.cancelled) { callback(false); return }
        if (stale || wc.isDestroyed() || owner.win.isDestroyed() || wc.getURL() !== initialURL) { callback(false); return }
        const allow = result.response === 1
        const temporary = config.transient.get(wc.id) || {}
        config.transient.set(wc.id, { ...temporary, [origin]: { ...temporary[origin], ...Object.fromEntries(kinds.map(k => [k, allow ? 'allow' : 'block'])) } })
        if (result.checkboxChecked) {
          const next = { ...grants(), [origin]: { ...grants()[origin], ...Object.fromEntries(kinds.map(k => [k, allow ? 'allow' : 'block'])) } }
          if (privateMode) config.grants = next
          else if (store.write(permissionFile, next, validPermissions)) savedPermissions = next
        }
        if (allow) protectMedia()
        const ready = !allow || permission !== 'geolocation' || await location.prepare(wc)
        callback(allow && ready && !stale && !wc.isDestroyed() && wc.getURL() === initialURL)
      } catch { callback(false) }
      finally { config.pending.delete(wc.id); if (!wc.isDestroyed()) wc.removeListener('did-start-navigation', navigation) }
    })
    sess.on('will-download', (_event, item, wc) => {
      if (!wc) return
      downloads.set(wc.id, (downloads.get(wc.id) || 0) + 1)
      item.once('done', () => { const n = (downloads.get(wc.id) || 1) - 1; if (n) downloads.set(wc.id, n); else downloads.delete(wc.id) })
    })
  }
  function clearPermissions(origin = null, privateOnly = false) {
    const next = { ...savedPermissions }
    if (origin) delete next[origin]
    if (!privateOnly) {
      if (!store.write(permissionFile, origin ? next : {}, validPermissions)) return false
      savedPermissions = origin ? next : {}
    }
    for (const config of sessionConfigs) {
      if (privateOnly && !config.private) continue
      if (origin) delete config.grants[origin]; else config.grants = {}
      for (const [id, entries] of config.transient) {
        if (origin) delete entries[origin]; else config.transient.delete(id)
      }
    }
    for (const [id, pending] of permissionPrompts) if ((!privateOnly || windows.get(id)?.private) && (!origin || pending.origin === origin)) pending.finish({response:0,checkboxChecked:false,cancelled:true})
    for (const wc of guests.values()) if (!wc.isDestroyed() && (!privateOnly || tabPermissions(wc)?.private) && (!origin || originOf(wc.getURL()) === origin)) { location.reset(wc); wc.reload() }
    return true
  }
  function attachWindow(win, privateMode) {
    const id = win.webContents.id
    const state = { win, private: privateMode, key: randomUUID(), snapshot: null, count: 0, closePending: false, closeToken: null, approved: false }
    windows.set(id, state)
    win.webContents.on('context-menu', (_event, params) => {
      const template = []
      const en = language() === 'en'
      if (params.selectionText && params.editFlags.canCopy) template.push({role:'copy',label:en?'Copy':'Kopiuj'})
      if (params.isEditable) template.push({role:'paste',label:en?'Paste':'Wklej',enabled:params.editFlags.canPaste})
      if (template.length) require('electron').Menu.buildFromTemplate(template).popup({window:win})
    })
    configureSession(session.fromPartition(privateMode ? 'persist:nitrix_private' : 'persist:main'), privateMode)
    win.on('close', e => {
      if (e.defaultPrevented || state.approved || !options.warnClose || state.count <= 1) return
      e.preventDefault()
      if (state.closePending) return
      state.closePending = true
      state.closeToken = randomUUID()
      try { win.webContents.send('features-close-prompt', {token:state.closeToken,count:state.count}) }
      catch { state.closePending = false; state.closeToken = null }
    })
    win.webContents.on('render-process-gone', () => { state.closePending = false; state.closeToken = null })
    win.once('closed', () => {
      windows.delete(id)
      if (recoveryOwner === id) recoveryOwner = null
      if (!privateMode) flushSessions()
      else if (![...windows.values()].some(w => w.private)) {
        const config = configuredSessions.get(session.fromPartition('persist:nitrix_private'))
        if (config) config.grants = {}
      }
    })
    return state
  }
  ipcMain.on('features-snapshot', (e, snapshot, count) => {
    const state = stateFor(e)
    if (!state) return
    if (Number.isInteger(count) && count >= 0 && count <= 1000) state.count = count
    if (state.private || !validSnapshot(snapshot)) return
    state.snapshot = snapshot
    scheduleSave()
  })
  ipcMain.handle('features-init', e => {
    const state = stateFor(e)
    if (!state) return null
    let recoverable = []
    if (!state.private) {
      if (state.snapshot?.tabs.length) recoverable = [{ key: state.key, snapshot: state.snapshot }]
      else if (recoveryOwner === null || recoveryOwner === e.sender.id) {
        recoveryOwner = e.sender.id
        let count = 0
        for (const entry of recovery) {
          if (count + entry.snapshot.tabs.length > 500) break
          recoverable.push(entry); count += entry.snapshot.tabs.length
        }
      }
    }
    return { options, recovery: recoverable.map(x => ({ key: x.key, snapshot: x.snapshot })) }
  })
  ipcMain.handle('features-recovery-consume', (e, keys) => {
    const state = stateFor(e)
    if (!state || state.private || !Array.isArray(keys) || keys.length > 50) return false
    recovery = recovery.filter(x => !keys.includes(x.key))
    if (recoveryOwner === e.sender.id) recoveryOwner = null
    flushSessions(); return true
  })
  ipcMain.handle('features-options', (e, next) => {
    if (!stateFor(e) || !validOptions(next) || !store.write(optionsFile, next, validOptions)) return false
    options = next
    for (const w of windows.values()) if (!w.win.isDestroyed()) w.win.webContents.send('features-options-changed', options)
    return true
  })
  ipcMain.handle('features-export-bookmarks', async e => {
    const state = stateFor(e)
    if (!state) return { ok: false }
    try {
      const en = language() === 'en'
      const result = await dialog.showSaveDialog(state.win, { title: en ? 'Export bookmarks' : 'Eksport zakładek',
        defaultPath: 'Nitrix-bookmarks.html', filters: [{ name: 'HTML', extensions: ['html'] }] })
      if (result.canceled || !result.filePath) return { canceled: true }
      await fs.writeFile(result.filePath, bookmarkHTML(loadBookmarks()), { mode: 0o600 })
      return { ok: true }
    } catch { return { ok: false } }
  })
  ipcMain.handle('features-site-get', (e, id) => {
    const wc = getOwnedWebview(e, id), state = stateFor(e)
    if (!wc || !state) return null
    const origin = originOf(wc.getURL()), config = tabPermissions(wc)
    if (!origin || !config) return null
    const grants = config.private ? config.grants : savedPermissions
    return { origin, permissions: { ...config.transient.get(wc.id)?.[origin], ...grants[origin] } }
  })
  ipcMain.handle('features-site-set', (e, id, expectedOrigin, permission, value) => {
    const wc = getOwnedWebview(e, id)
    if (!stateFor(e) || !wc || originOf(wc.getURL()) !== expectedOrigin || !PERMISSIONS.includes(permission) || !['ask', 'allow', 'block'].includes(value)) return false
    const config = tabPermissions(wc)
    if (!config) return false
    const grants = config.private ? config.grants : savedPermissions
    const entry = { ...grants[expectedOrigin] }
    for (const entries of config.transient.values()) if (entries[expectedOrigin]) delete entries[expectedOrigin][permission]
    if (value === 'ask') delete entry[permission]; else entry[permission] = value
    const next = { ...grants, [expectedOrigin]: entry }
    if (config.private) config.grants = next
    else { if (!store.write(permissionFile, next, validPermissions)) return false; savedPermissions = next }
    // Existing streams and watches end when the page reloads.
    if (value !== 'allow') { location.reset(wc); wc.reload() }
    return true
  })
  ipcMain.handle('features-site-clear', async (e, id, expectedOrigin) => {
    const state = stateFor(e), wc = getOwnedWebview(e, id)
    if (!state || !wc || !originOf(expectedOrigin) || originOf(wc.getURL()) !== expectedOrigin) return false
    try {
      await wc.session.clearData({ origins: [expectedOrigin], originMatchingMode: 'origin-in-all-contexts',
        dataTypes: ['cookies', 'cache', 'fileSystems', 'indexedDB', 'localStorage', 'serviceWorkers', 'webSQL', 'backgroundFetch'] })
      if (!clearPermissions(expectedOrigin, !!tabPermissions(wc)?.private)) return false
      if (!guests.has(wc.id) && !wc.isDestroyed() && originOf(wc.getURL()) === expectedOrigin) wc.reload()
      return true
    } catch { return false }
  })
  ipcMain.handle('features-can-sleep', async (e, id, manual = false) => {
    const wc = getOwnedWebview(e, id)
    if (!stateFor(e) || !wc || (!options.sleepTabs && manual !== true) || !originOf(wc.getURL()) || wc.isLoading()
      || wc.isCurrentlyAudible() || wc.isBeingCaptured() || mediaProtected.has(id) || downloads.has(id)) return false
    const url = wc.getURL(), host = new URL(url).hostname
    if (manual !== true && options.sleepExceptions.some(h => host === h || host.endsWith('.' + h))) return false
    try {
      for (const frame of wc.mainFrame.framesInSubtree) if (await frame.executeJavaScript(`(${pageCanSleep.toString()})()`) !== true) return false
      return !wc.isDestroyed() && wc.getURL() === url && !wc.isLoading() && !wc.isCurrentlyAudible() && !mediaProtected.has(id)
    } catch { return false }
  })
  function attachGuest(wc) {
    const id = wc.id
    guests.set(id, wc)
    wc.on('did-frame-finish-load', (_e, _main, processId, routingId) => {
      try {
        const frame = require('electron').webFrameMain.fromId(processId, routingId)
        frame?.executeJavaScript(`if (!window.__nitrixEditListener) { window.__nitrixEditListener = true; document.addEventListener('input', () => { window.__nitrixFormEdited = true }, true) }`).catch(() => {})
      } catch {}
    })
    wc.on('did-start-navigation', (_e, _url, inPlace, main) => { if (main && !inPlace) { location.reset(wc); mediaProtected.delete(id); configuredSessions.get(wc.session)?.transient.delete(id) } })
    wc.once('destroyed', () => { location.reset(wc); mediaProtected.delete(id); downloads.delete(id); guests.delete(id); for (const config of sessionConfigs) config.transient.delete(id) })
  }
  app.on('before-quit', flushSessions)
  return { attachWindow, attachGuest, clearPermissions, approveQuit: () => { for(const state of windows.values())state.approved=true }, privateWindowCount: () => [...windows.values()].filter(w => w.private).length }
}
module.exports = { installFeatures, safeTabUrl, validSnapshot, validOptions, bookmarkHTML, pageCanSleep, DEFAULTS }

}

for (const name of Object.keys(factories)) {
  Object.defineProperty(module.exports, name, { enumerable: true, get: () => service(name) })
}
