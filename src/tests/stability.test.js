'use strict'
const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const vm = require('node:vm')
const crypto = require('node:crypto')
const { createStore, isRecord, isBookmarks, isHistory } = require('../browser-core')["persistence"]
const { readLimitedFile, isSettings, isBlockedRules, isBooleanRecord } = require('../browser-core')["persistence"]
const root = path.join(__dirname, '..')

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nitrix-storage-test-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  return { dir, file: path.join(dir, 'data.json'), store: createStore(dir) }
}

test('removed webpage Aero settings migrate without resetting other preferences', () => {
  const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8')
  const previous = { theme: 'transparent', aeroBlur: 63, homepageUrl: 'https://example.org',
    aeroAreas: ['tabs', 'ui', 'homepage', 'search'] }
  let written
  const context = vm.createContext({ settingsFile: 'settings.json', isSettings, store: {
    read: () => structuredClone(previous), write: (_, data) => { written = JSON.parse(JSON.stringify(data)); return true },
    report: () => assert.fail('unexpected migration error')
  } })
  const start = main.indexOf('function loadSettings()')
  vm.runInContext(main.slice(start, main.indexOf('function _applyLocalIpProtection', start)), context)
  const loaded = JSON.parse(JSON.stringify(context.loadSettings()))
  assert.deepEqual(loaded.aeroAreas, ['tabs', 'ui'])
  assert.equal(loaded.aeroBlur, 63)
  assert.equal(loaded.homepageUrl, previous.homepageUrl)
  assert.equal(context.saveSettings({ aeroAreas: ['bookmarks', 'homepage', 'search'] }), true)
  assert.deepEqual(written.aeroAreas, ['bookmarks'])
  assert.equal(written.homepageUrl, previous.homepageUrl)
  assert.equal(context.saveSettings({aeroTopOpacity: 1, aeroAreas: ['cards','ui']}), true)
  assert.equal(written.aeroTopOpacity, 1)
  assert.equal(written.aeroTopBlur, undefined)
  assert.deepEqual(written.aeroAreas, ['cards','ui'])
  assert.equal(written.aeroBlur, 63)
  for(const invalid of [{aeroTopOpacity:101},{aeroTopOpacity:-1},{aeroTopOpacity:'5'},{aeroTopBlur:1}]) {
    assert.equal(context.saveSettings(invalid), false)
  }
})

test('rejects structurally invalid data without replacing the existing file', t => {
  const { file, store } = fixture(t)
  assert.equal(store.write(file, [{ name: 'Example', url: 'https://example.org' }], isBookmarks), true)
  const original = fs.readFileSync(file, 'utf8')
  for (const value of [null, {}, [null], [{ url: 7 }], [{ url: 'x', name: {} }]]) {
    assert.equal(store.write(file, value, isBookmarks), false)
    assert.equal(fs.readFileSync(file, 'utf8'), original)
  }
  assert.equal(isHistory([{ url: 'x', timestamp: '123' }]), false)
  assert.equal(isRecord([]), false)
})

test('backs up malformed JSON before allowing replacement', t => {
  const { file, store } = fixture(t)
  fs.writeFileSync(file, '{broken')
  assert.deepEqual(store.read(file, isRecord, () => ({})), {})
  assert.equal(fs.readFileSync(file + '.recovery', 'utf8'), '{broken')
  assert.equal(store.write(file, { theme: 'dark' }, isRecord), true)
  assert.deepEqual(store.read(file, isRecord, () => null), { theme: 'dark' })
})

test('does not overwrite an earlier recovery copy or the unbacked original', t => {
  const { file, store } = fixture(t)
  fs.writeFileSync(file, 'null')
  fs.writeFileSync(file + '.recovery', 'earlier data')
  assert.deepEqual(store.read(file, isRecord, () => ({})), {})
  assert.equal(store.write(file, {}, isRecord), false)
  assert.equal(fs.readFileSync(file, 'utf8'), 'null')
  assert.equal(fs.readFileSync(file + '.recovery', 'utf8'), 'earlier data')
})

test('failed rename cleans up temporary files and preserves the target', t => {
  const { dir, file, store } = fixture(t)
  fs.mkdirSync(file)
  assert.equal(store.write(file, {}, isRecord), false)
  assert.equal(fs.statSync(file).isDirectory(), true)
  assert.equal(fs.readdirSync(dir).some(name => name.endsWith('.tmp')), false)
})

test('missing files use defaults without creating an error log', t => {
  const { dir, file, store } = fixture(t)
  assert.deepEqual(store.read(file, isBookmarks, () => []), [])
  assert.deepEqual(fs.readdirSync(dir), [])
})

const renderer = fs.readFileSync(path.join(root, 'renderer.js'), 'utf8')
const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8')
function clock() {
  const pending = new Map()
  let next = 0
  return { pending,
    setTimeout(fn) { pending.set(++next, fn); return next },
    clearTimeout(id) { pending.delete(id) },
    tick() { const current = [...pending.values()]; pending.clear(); current.forEach(fn => fn()) }
  }
}

test('double close cannot remove a neighbouring tab; closing the last tab closes the window', () => {
  const timers = clock()
  let disposed = 0
  let closed = 0
  function tab(id) {
    return { id, dispose() { disposed++ }, tabEl: { style: {}, classList: { add() {} },
      getBoundingClientRect: () => ({ width: 100 }), remove() {} }, wv: { remove() {} } }
  }
  const context = vm.createContext({ ...timers, tabs: [tab(1), tab(2)], activeTabId: 1,
    findTab: null, closePageFind() {}, browserFeatures: null, window: { electronAPI: { close() { closed++ } } },
    hideSecPopup() {}, activateTab(id) { context.activeTabId = id },
    tabNewBtn: { style: {} }, requestAnimationFrame: fn => fn(),
    _adbEnabledMap: {}, updateTabSizes() {}, createTab() { context.tabs.push(tab(3)) } })
  const start = renderer.indexOf('  function closeTab(id) {')
  vm.runInContext(renderer.slice(start, renderer.indexOf('  function updateTabSizes()', start)), context)
  context.closeTab(1)
  context.closeTab(1)
  assert.equal(timers.pending.size, 1)
  timers.tick()
  assert.deepEqual(context.tabs.map(tab => tab.id), [2])
  context.closeTab(2)
  context.closeTab(2)
  timers.tick()
  assert.deepEqual(context.tabs.map(tab => tab.id), [])
  assert.equal(closed, 1)
  assert.equal(disposed, 2)
})

test('favicon queue and cache stay bounded; stalled loads release their slots', () => {
  const timers = clock()
  const images = []
  const context = vm.createContext({ ...timers, Image: class { constructor() { images.push(this) } },
    document: { createElement: () => ({ getContext: () => ({ drawImage() {} }), toDataURL: () => 'data:icon' }) } })
  const start = renderer.indexOf('  const _faviconCache = new Map()')
  const end = renderer.indexOf('  function _getCachedFavicon', start)
  vm.runInContext(renderer.slice(start, end) + '\nthis.state = () => [_faviconCache.size, _faviconQueue.length, _faviconActive]', context)
  for (let i = 0; i < 1000; i++) context._cacheFavicon('site' + i)
  assert.equal(context.state()[1], 64)
  assert.equal(context.state()[2], 3)
  for (let i = 0; i < 30; i++) timers.tick()
  assert.deepEqual(Array.from(context.state()), [0, 0, 0])
  for (let i = 0; i < 1000; i++) {
    context._cacheFavicon('loaded' + i)
    images.at(-1).onload()
  }
  assert.deepEqual(Array.from(context.state()), [256, 0, 0])
  assert.equal(timers.pending.size, 0)
})

test('renderer integrity matches CSP and script tag; versions agree', () => {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'renderer.js'))).digest('base64')
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  const hashes = [...html.matchAll(/sha256-([A-Za-z0-9+/=]+)/g)].map(match => match[1])
  const featureHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'renderer-features.js'))).digest('base64')
  assert.equal(hashes.filter(h => h === hash).length, 2)
  assert.equal(hashes.filter(h => h === featureHash).length, 2)
  const pkg = require('../package.json')
  const lock = require('../package-lock.json')
  assert.equal(pkg.version, '2.1.0')
  assert.equal(lock.version, pkg.version)
  assert.equal(lock.packages[''].version, pkg.version)
})

test('history keeps 5000 entries and retains unsaved changes after a write failure', () => {
  const timers = clock()
  const entries = Array.from({ length: 5000 }, (_, timestamp) => ({ url: 'https://example.org/' + timestamp, timestamp }))
  let succeed = false
  const context = vm.createContext({ ...timers, historyFile: 'history.json', isHistory,
    store: { read: () => entries, write: () => succeed } })
  const start = main.indexOf('function loadHistory()')
  vm.runInContext(main.slice(start, main.indexOf('// ═', start)), context)
  const cacheStart = main.indexOf('let _historyCache = null')
  vm.runInContext(main.slice(cacheStart, main.indexOf('function addHistoryEntry', cacheStart)), context)
  assert.equal(context.getHistoryCache().length, 5000)
  context.getHistoryCache()[0].title = 'Pending change'
  context.scheduleSaveHistory()
  timers.tick()
  assert.equal(context.getHistoryCache()[0].title, 'Pending change')
  assert.equal(vm.runInContext('_historyCache !== null', context), true)
  succeed = true
  context.scheduleSaveHistory()
  timers.tick()
  assert.equal(vm.runInContext('_historyCache', context), null)
})

test('normal shutdown flushes pending bookmarks and history', () => {
  const timers = clock()
  const writes = []
  let quit
  const context = vm.createContext({ ...timers, bookmarksFile: 'bookmarks.json', historyFile: 'history.json',
    isBookmarks, isHistory, store: { read: () => [], write(file, value) { writes.push({ file, value }); return true } },
    app: { on(event, fn) { assert.equal(event, 'before-quit'); quit = fn } } })
  const start = main.indexOf('let _bookmarksCache = null')
  vm.runInContext(main.slice(start, main.indexOf('// ═', start)), context)
  const cacheStart = main.indexOf('let _historyCache = null')
  vm.runInContext(main.slice(cacheStart, main.indexOf('function addHistoryEntry', cacheStart)), context)
  const quitStart = main.indexOf("app.on('before-quit'")
  vm.runInContext(main.slice(quitStart, main.indexOf('\n})', quitStart) + 3), context)
  context.saveBookmarks([{ name: 'Saved', url: 'https://example.org' }])
  context.getHistoryCache().push({ url: 'https://example.org', timestamp: 123 })
  context.scheduleSaveHistory()
  assert.equal(writes.length, 0)
  quit()
  assert.deepEqual(writes.map(write => write.file), ['bookmarks.json', 'history.json'])
  assert.equal(timers.pending.size, 0)
})

test('interface crashes have a restart limit and window closing clears timers', () => {
  const { EventEmitter } = require('node:events')
  const timers = clock()
  const win = new EventEmitter()
  win.webContents = new EventEmitter()
  let loads = 0, destroyed = false, warnings = 0
  win.loadFile = async () => { loads++ }
  win.isDestroyed = () => destroyed
  win.destroy = () => { destroyed = true; win.emit('closed') }
  win.webContents.forcefullyCrashRenderer = () => win.webContents.emit('render-process-gone', {}, { reason: 'crashed' })
  const context = vm.createContext({ ...timers, win, path, __dirname: root, console: { log() {}, warn() {}, error() {} },
    store: { report() {} }, dialog: { showErrorBox() { warnings++ } } })
  const start = main.indexOf('  let interfaceClosing =')
  vm.runInContext(main.slice(start, main.indexOf('  // Pokaż okno dopiero', start)), context)
  win.emit('unresponsive')
  win.emit('unresponsive')
  assert.equal(timers.pending.size, 1)
  win.emit('responsive')
  assert.equal(timers.pending.size, 0)
  for (let i = 0; i < 3; i++) {
    win.webContents.emit('render-process-gone', {}, { reason: 'crashed' })
    timers.tick()
  }
  assert.equal(loads, 3)
  assert.equal(warnings, 1)
  assert.equal(destroyed, true)
  assert.equal(timers.pending.size, 0)
})

test('closing during interface load suppresses abort dialogs but genuine failures still report', async () => {
  const { EventEmitter } = require('node:events')
  for (const closing of [true, false]) {
    const timers = clock()
    const win = new EventEmitter()
    win.webContents = new EventEmitter()
    let rejectLoad, warnings = 0, reports = 0, loads = 0, destroyed = false
    win.loadFile = () => { loads++; return new Promise((resolve, reject) => { rejectLoad = reject }) }
    win.isDestroyed = () => destroyed
    win.destroy = () => { destroyed = true; win.emit('closed') }
    const context = vm.createContext({ ...timers, win, path, __dirname: root, console: { log() {}, warn() {}, error() {} },
      store: { report() { reports++ } }, dialog: { showErrorBox() { warnings++ } } })
    const start = main.indexOf('  let interfaceClosing =')
    vm.runInContext(main.slice(start, main.indexOf('  // Pokaż okno dopiero', start)), context)
    if (closing) {
      win.webContents.emit('render-process-gone', {}, { reason: 'crashed' })
      win.emit('close')
      win.emit('unresponsive')
      win.webContents.emit('render-process-gone', {}, { reason: 'crashed' })
      assert.equal(destroyed, false)
      assert.equal(timers.pending.size, 0)
    }
    rejectLoad(new Error(closing ? 'ERR_ABORTED' : 'ERR_FILE_NOT_FOUND'))
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(warnings, closing ? 0 : 1)
    assert.equal(reports, closing ? 0 : 1)
    assert.equal(loads, 1)
  }
})

test('network polling stops on close and notifies every window independently', () => {
  const { EventEmitter } = require('node:events')
  const timers = clock()
  let online = true, reads = 0
  const context = vm.createContext({ WeakMap, setInterval: timers.setTimeout, clearInterval: timers.clearTimeout,
    net: { isOnline() { reads++; return online } } })
  const start = main.indexOf('const networkPollers =')
  vm.runInContext(main.slice(start, main.indexOf('function setupDownloadHandling', start)), context)
  const windows = [new EventEmitter(), new EventEmitter()]
  const received = [[], []]
  windows.forEach((win, i) => {
    win.isDestroyed = () => false
    win.webContents = { isDestroyed: () => false, send: (_, value) => received[i].push(value.online) }
    context._startNetworkPolling(win)
    context._startNetworkPolling(win)
  })
  assert.equal(timers.pending.size, 2)
  online = false
  for (const fn of timers.pending.values()) fn()
  assert.deepEqual(received, [[false], [false]])
  windows.forEach(win => win.emit('closed'))
  const before = reads
  assert.equal(timers.pending.size, 0)
  timers.tick()
  assert.equal(reads, before)
})

test('SQLite constructor and query failures always remove the snapshot directory', async t => {
  const { dir, file } = fixture(t)
  fs.writeFileSync(file, 'not a database')
  for (const phase of ['constructor', 'query', 'success']) {
    let closed = 0
    const context = vm.createContext({ fs, path, dataDir: dir, readLimitedFile, store: { report() {} },
      _loadSqlJs: async () => ({ Database: class {
        constructor() { if (phase === 'constructor') throw new Error('invalid database') }
        exec() { if (phase === 'query') throw new Error('query failed'); return [] }
        close() { closed++ }
      } }) })
    const start = main.indexOf('async function _readSqliteRows')
    vm.runInContext(main.slice(start, main.indexOf('// ── Pojedyncza instancja', start)), context)
    if (phase === 'success') assert.equal((await context._readSqliteRows(file, 'SELECT 1')).length, 0)
    else await assert.rejects(context._readSqliteRows(file, 'SELECT 1'))
    assert.equal(closed, phase === 'constructor' ? 0 : 1)
    assert.deepEqual(fs.readdirSync(dir), ['data.json'])
  }
})

test('failed SQLite initialization can be retried', async () => {
  let attempts = 0
  const requireMock = () => () => ++attempts === 1 ? Promise.reject(new Error('WASM failed')) : Promise.resolve({ ready: true })
  requireMock.resolve = () => '/tmp/sql.js'
  const context = vm.createContext({ require: requireMock, path })
  const start = main.indexOf('let _sqlJsPromise = null')
  vm.runInContext(main.slice(start, main.indexOf('async function _readSqliteRows', start)), context)
  await assert.rejects(context._loadSqlJs())
  assert.equal((await context._loadSqlJs()).ready, true)
  assert.equal(attempts, 2)
})

test('JSON byte limits and settings structures are enforced', t => {
  const { file, store } = fixture(t)
  fs.writeFileSync(file, '12345')
  assert.equal(readLimitedFile(file, 5).toString(), '12345')
  assert.throws(() => readLimitedFile(file, 4), { code: 'DATA_TOO_LARGE' })
  assert.equal(isSettings({ blockLocalIp: 'false' }), false)
  for (const aeroScope of ['ui', 'tabs-ui', 'bookmarks-ui', 'all', 'tabs', 'bookmarks', 'navigation', 'navigation-ui']) assert.equal(isSettings({ aeroScope }), true)
  for (const aeroScope of ['invalid', null, true, {}]) assert.equal(isSettings({ aeroScope }), false)
  assert.equal(isSettings({ startupBookmarks: [null] }), false)
  assert.equal(isSettings({ theme: 'dark', blockLocalIp: true, startupBookmarks: [] }), true)
  assert.equal(isBooleanRecord({ enabled: {} }), false)
  assert.equal(isBlockedRules({ 'example.org': [null] }), false)
  assert.equal(isBlockedRules({ 'example.org': ['.advert'] }), true)
  const fd = fs.openSync(file, 'w')
  fs.ftruncateSync(fd, 32 * 1024 * 1024 + 1)
  fs.closeSync(fd)
  assert.deepEqual(store.read(file, isRecord, () => ({})), {})
  assert.equal(store.write(file, {}, isRecord), false)
})

test('bookmark timer write errors remain handled and retain pending changes', t => {
  const { dir, file, store } = fixture(t)
  fs.mkdirSync(file)
  const timers = clock()
  const context = vm.createContext({ ...timers, store, bookmarksFile: file, isBookmarks, isHistory })
  const start = main.indexOf('let _bookmarksCache = null')
  vm.runInContext(main.slice(start, main.indexOf('function loadHistory()', start)), context)
  context.saveBookmarks([{ name: 'Example', url: 'https://example.org' }])
  assert.doesNotThrow(() => timers.tick())
  assert.equal(vm.runInContext('_bookmarksDirty', context), true)
  fs.rmdirSync(file)
  context.flushBookmarks()
  assert.equal(vm.runInContext('_bookmarksDirty', context), false)
  assert.equal(JSON.parse(fs.readFileSync(file, 'utf8'))[0].name, 'Example')
  assert.equal(fs.readdirSync(dir).some(name => name.endsWith('.tmp')), false)
})

test('deep Chromium bookmark folders are traversed without recursive stack overflow', t => {
  const { file } = fixture(t)
  const depth = 15000
  fs.writeFileSync(file, '{"roots":{"bookmark_bar":' + '{"children":['.repeat(depth)
    + '{"type":"url","url":"https://example.org","name":"Example"}' + ']}'.repeat(depth) + '}}')
  const context = vm.createContext({ fs, readLimitedFile, isRecord })
  const start = main.indexOf('function _parseChromiumBookmarks')
  vm.runInContext(main.slice(start, main.indexOf('async function _parseFirefoxBookmarks', start)), context)
  assert.equal(context._parseChromiumBookmarks(file)[0].url, 'https://example.org')
})
