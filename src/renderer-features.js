'use strict'
window.NitrixFeatures = function ({ getTabs, getActiveTab, createTab, closeTab, getLang, isPrivate, container, setAddress, tabsBar, tabNewBtn }) {
  const api = window.electronAPI.features
  const words = {
    pl: {
      title: 'Karty i dane', close: 'Zamknij', cancel: 'Anuluj', error: 'Nie udało się wykonać tej operacji. Spróbuj ponownie.',
      permissionTitle: 'Prośba o dostęp', permissionBody: 'Ta strona chce korzystać z:', remember: 'Zapamiętaj dla tej strony', permit: 'Zezwól', deny: 'Zablokuj',
      locationHelp: 'Przybliżona lokalizacja po IP. Po zgodzie ipwho.is odczyta Twój publiczny adres IP. Wynik może wskazywać inną miejscowość, zwłaszcza przy VPN.',
      warn: 'Ostrzegaj przed zamknięciem wielu kart', sleep: 'Usypiaj nieaktywne karty',
      sleepHelp: 'Uśpiona karta wczyta stronę ponownie po otwarciu. Karty z odtwarzaniem, rozmową, pobieraniem lub wpisanymi danymi w formularzu pozostają aktywne.',
      after: 'Czas bezczynności', minutes: 'minut', exceptions: 'Nie usypiaj tych witryn', exceptionsHint: 'Jedna domena w wierszu, np. web.whatsapp.com. Obejmuje też jej subdomeny.',
      save: 'Zapisz', saved: 'Zapisano', export: 'Eksportuj zakładki do HTML', exportHelp: 'Zapisz kopię zakładek, którą można zaimportować w innej przeglądarce.', exported: 'Zakładki zostały wyeksportowane.',
      reopen: 'Przywróć zamkniętą kartę', reopenHint: 'Ctrl+Shift+T przywraca kolejne zamknięte karty. Lista jest przechowywana tylko do zamknięcia okna.',
      restoreTitle: 'Przywrócić poprzednią sesję?', restoreBody: 'Poprzednia sesja nie została prawidłowo zamknięta. Liczba zapisanych kart: ', restore: 'Przywróć karty', discard: 'Rozpocznij od nowa',
      site: 'Uprawnienia i dane strony', camera: 'Kamera', microphone: 'Mikrofon', geolocation: 'Lokalizacja', notifications: 'Powiadomienia', ask: 'Pytaj', allow: 'Zezwalaj', block: 'Blokuj',
      revokeHelp: 'Cofnięcie zgody przeładuje stronę, aby zakończyć korzystanie z uprawnienia. Zmiana dotyczy adresu widocznego powyżej.',
      clear: 'Usuń dane witryny i zgody', cleared: 'Dane witryny i zgody zostały usunięte.', reload: 'Odśwież uprawnienia',
      noSite: 'Otwórz witrynę HTTP lub HTTPS, aby zarządzać jej danymi.', sleeping: 'Uśpiona karta — kliknij, aby wczytać', invalid: 'Podaj poprawne domeny, bez adresów stron i ścieżek.',
      private: 'W trybie prywatnym karty nie są zapisywane do odzyskiwania. Uprawnienia stron są pamiętane tylko do zamknięcia okien prywatnych.',
      closeTabsTitle: 'Zamknąć okno?', closeTabsBody: 'Otwarte karty zostaną zamknięte.', closeWindow: 'Zamknij okno', dontAsk: 'Nie pytaj ponownie'
    },
    en: {
      title: 'Tabs and data', close: 'Close', cancel: 'Cancel', error: 'This operation could not be completed. Please try again.',
      permissionTitle: 'Permission request', permissionBody: 'This site wants to use:', remember: 'Remember for this site', permit: 'Allow', deny: 'Block',
      locationHelp: 'Approximate IP location. If allowed, ipwho.is will see your public IP address. The result may point to another town, especially with a VPN.',
      warn: 'Warn before closing multiple tabs', sleep: 'Put inactive tabs to sleep',
      sleepHelp: 'Sleeping tabs reload when opened. Tabs playing media, making calls, downloading files or containing entered form data stay active.',
      after: 'Idle time', minutes: 'minutes', exceptions: 'Never put these sites to sleep', exceptionsHint: 'One domain per line, e.g. web.whatsapp.com. Subdomains are included.',
      save: 'Save', saved: 'Saved', export: 'Export bookmarks to HTML', exportHelp: 'Save a copy of your bookmarks that other browsers can import.', exported: 'Bookmarks exported.',
      reopen: 'Reopen closed tab', reopenHint: 'Ctrl+Shift+T reopens recently closed tabs. This list is kept only until the window closes.',
      restoreTitle: 'Restore your previous session?', restoreBody: 'The previous session did not close properly. Saved tabs: ', restore: 'Restore tabs', discard: 'Start fresh',
      site: 'Site permissions and data', camera: 'Camera', microphone: 'Microphone', geolocation: 'Location', notifications: 'Notifications', ask: 'Ask', allow: 'Allow', block: 'Block',
      revokeHelp: 'Revoking access reloads the page to stop use of that permission. Changes apply to the address above.',
      clear: 'Clear site data and permissions', cleared: 'Site data and permissions cleared.', reload: 'Refresh permissions',
      noSite: 'Open an HTTP or HTTPS site to manage its data.', sleeping: 'Sleeping tab — click to load', invalid: 'Enter domain names without URL schemes or paths.',
      private: 'Private tabs are never saved for recovery. Site permissions are remembered only until all private windows close.',
      closeTabsTitle: 'Close this window?', closeTabsBody: 'Your open tabs will be closed.', closeWindow: 'Close window', dontAsk: 'Do not ask again'
    }
  }
  const text = k => (words[getLang()] || words.pl)[k] || k
  let options = { warnClose: true, sleepTabs: true, sleepMinutes: 30, sleepExceptions: [] }
  let initialized = false, snapshotTimer = null, sleepTimer = null, checking = false, disposed = false
  const closedTabs = []
  function node(tag, label, className) {
    const el = document.createElement(tag)
    if (label) el.textContent = label
    if (className) el.className = className
    return el
  }
  function button(label, action) {
    const el = node('button', label, 'nf-button'); el.type = 'button'; el.addEventListener('click', action); return el
  }
  function closeButton(action) {
    const el = node('button', '', 'icon-btn'); el.type = 'button'; el.title = text('close'); el.setAttribute('aria-label', text('close'))
    el.append(document.querySelector('#settings-close-security svg').cloneNode(true))
    el.addEventListener('click', action); return el
  }
  function dialogHeading(title, close) {
    const header = node('div', '', 'nf-dialog-heading')
    header.append(node('h2', title), closeButton(close)); return header
  }
  function siteIcon(kind) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    for (const [key,value] of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',class:'nf-site-icon'})) svg.setAttribute(key,value)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', {
      camera:'M4 7h3l2-3h6l2 3h3v13H4V7Z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
      microphone:'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5Z M6 10v2a6 6 0 0 0 12 0v-2 M12 18v4 M8 22h8',
      geolocation:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
      notifications:'M5 16l2-3V9a5 5 0 0 1 10 0v4l2 3v2H5v-2Z M10 21h4 M12 2v2',
      shield:'M12 3l8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z M8 12l3 3 5-6',
      trash:'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
      info:'M12 16v-5 M12 7h.01 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M3 12h18 M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z'
      ,tabs:'M5 6h14a2 2 0 0 1 2 2v10H3V8a2 2 0 0 1 2-2Z M7 3h4l2 3 M7 11h10 M7 15h7'
      ,'close-tabs':'M5 6h14a2 2 0 0 1 2 2v10H3V8a2 2 0 0 1 2-2Z M8 11l5 5 M13 11l-5 5'
      ,close:'M6 6l12 12M18 6 6 18'
      ,restore:'M4 8V3m0 0h5M4 3l4 4 M5 13a8 8 0 1 0 2-6'
    }[kind])
    svg.append(path); return svg
  }
  const modal = node('dialog', '', 'nf-dialog')
  function settingRow(label, control, description) {
    const row = node('div', '', 'setting-row-inline'), copy = node('div', '', 'setting-row-inline-text')
    copy.append(node('div', label, 'setting-label'))
    if (description) copy.append(node('div', description, 'setting-desc'))
    row.append(copy, control); return row
  }
  function segmented(label, values, selected, change) {
    const group = node('div', '', 'seg-control'); group.setAttribute('role', 'group'); group.setAttribute('aria-label', label)
    group.sync = value => group.querySelectorAll('button').forEach(b => {
      const active = b.dataset.value === String(value); b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active))
    })
    for (const [value, caption] of values) {
      const b = node('button', caption, 'seg-btn'); b.type = 'button'; b.dataset.value = value
      b.onclick = async () => {
        if (group.busy || b.disabled || b.classList.contains('active')) return
        group.busy = true; group.sync(value)
        try { if (await change(value)) selected = value } finally { group.sync(selected); group.busy = false }
      }
      group.append(b)
    }
    group.sync(selected); return group
  }
  document.body.appendChild(modal)
  let settleModal = null
  function dismiss(value = null) { if (modal.open) modal.close(); modal.classList.remove('nf-site-dialog', 'nf-clear-confirm'); const resolve = settleModal; settleModal = null; resolve?.(value) }
  modal.addEventListener('cancel', e => { e.preventDefault(); dismiss() })
  modal.addEventListener('click', e => { if (e.target === modal) dismiss() })
  const permissionDialog = node('dialog', '', 'nf-dialog nf-permission-dialog')
  document.body.appendChild(permissionDialog)
  const closeDialog = node('dialog', '', 'nf-dialog nf-close-tabs-dialog'); document.body.appendChild(closeDialog)
  let closeToken = null
  async function answerClose(close) {
    const token = closeToken
    if (!token) return
    const remember = closeDialog.querySelector('input')?.checked === true
    closeToken = null; if (closeDialog.open) closeDialog.close()
    try { await api.answerClose(token, close, remember) } catch {}
  }
  closeDialog.addEventListener('cancel', e => { e.preventDefault(); answerClose(false) })
  api.onClosePrompt(request => {
    if (!request || typeof request.token !== 'string' || !Number.isInteger(request.count)) return
    closeToken = request.token; closeDialog.replaceChildren()
    const header = dialogHeading(text('closeTabsTitle'), () => answerClose(false))
    const badge = node('span', '', 'nf-tabs-badge'); badge.append(siteIcon('tabs')); header.querySelector('h2').prepend(badge)
    const count = node('div', '', 'nf-close-tab-count'); count.append(siteIcon('tabs'), node('strong', String(request.count)), node('span', getLang()==='en'?'open tabs':'otwartych kart'))
    const control = node('label', '', 'toggle-switch'), input = node('input'); input.type='checkbox'; input.setAttribute('aria-label',text('dontAsk'))
    control.append(input,node('div','','toggle-track'),node('div','','toggle-thumb'))
    const actions=node('div','','bk-modal-btns nf-close-actions'),cancel=button(text('cancel'),()=>answerClose(false)),confirm=button(text('closeWindow'),()=>answerClose(true))
    cancel.className='btn-cancel';confirm.className='nf-close-confirm';confirm.prepend(siteIcon('close'));actions.append(cancel,confirm)
    closeDialog.append(header,node('p',text('closeTabsBody'),'nf-close-description'),count,settingRow(text('dontAsk'),control),actions)
    closeDialog.showModal();cancel.focus()
  })
  let permissionToken = null
  function closePermission() { permissionToken = null; if (permissionDialog.open) permissionDialog.close() }
  async function answerPermission(allow) {
    const token = permissionToken
    if (!token) return
    const remember = permissionDialog.querySelector('input').checked
    closePermission()
    try { await api.answerPermission(token, allow, remember) } catch {}
  }
  permissionDialog.addEventListener('cancel', e => { e.preventDefault(); answerPermission(false) })
  function positionPermission() {
    if (!permissionDialog.open) return
    const rect = document.getElementById('url-icon').getBoundingClientRect()
    const left = Math.max(8, Math.min(rect.left - 14, innerWidth - permissionDialog.offsetWidth - 8))
    const top = Math.max(8, Math.min(rect.bottom + 12, innerHeight - permissionDialog.offsetHeight - 8))
    permissionDialog.style.left = `${left}px`; permissionDialog.style.top = `${top}px`
    permissionDialog.style.setProperty('--nf-anchor', `${Math.max(16, Math.min(rect.left + rect.width / 2 - left, permissionDialog.offsetWidth - 16))}px`)
  }
  window.addEventListener('resize', positionPermission)
  const permissionAnchorObserver = new ResizeObserver(positionPermission)
  permissionAnchorObserver.observe(document.getElementById('url-wrap') || document.getElementById('url-icon'))
  api.onPermissionCancel(token => { if (token === permissionToken) closePermission() })
  api.onPermission(request => {
    if (!request || typeof request.token !== 'string' || !Array.isArray(request.kinds)) return
    closePermission(); permissionToken = request.token
    document.getElementById('sec-popup').classList.remove('open')
    permissionDialog.replaceChildren(dialogHeading(text('permissionTitle'), () => answerPermission(false)), node('p', request.origin, 'nf-origin'),
      node('p', text('permissionBody'), 'nf-help'))
    for (const kind of request.kinds) permissionDialog.append(node('div', text(kind), 'nf-permission-kind setting-label'))
    if (request.kinds.includes('geolocation')) permissionDialog.append(node('p', text('locationHelp'), 'nf-help'))
    const remember = node('label', '', 'toggle-switch'), input = node('input'); input.type = 'checkbox'; input.setAttribute('aria-label', text('remember'))
    remember.append(input, node('div', '', 'toggle-track'), node('div', '', 'toggle-thumb'))
    permissionDialog.append(settingRow(text('remember'), remember))
    const actions = node('div', '', 'nf-actions'), deny = button(text('deny'), () => answerPermission(false)), allow = button(text('permit'), () => answerPermission(true))
    allow.classList.add('nf-primary'); actions.append(deny, allow); permissionDialog.append(actions)
    permissionDialog.showModal(); positionPermission(); deny.focus()
  })
  function message(title, body, yes, no) {
    dismiss(false); modal.replaceChildren()
    modal.append(node('h2', title), node('p', body))
    const actions = node('div', '', 'nf-actions')
    if (no) actions.append(button(no, () => dismiss(false)))
    actions.append(button(yes || text('close'), () => dismiss(true)))
    modal.append(actions); modal.showModal(); actions.querySelector('button').focus()
    return new Promise(resolve => { settleModal = resolve })
  }
  function snapshot() {
    clearTimeout(snapshotTimer)
    const all = getTabs().filter(t => !t.closing)
    if (isPrivate) { api.snapshot(null, all.length); return }
    const saved = all.filter(t => /^(https?:|file:)\/\//i.test(t.url || '') && (t.url || '').length <= 8192).slice(0, 500)
    api.snapshot({ tabs: saved.map(t => ({ url: t.url, title: (t.titleEl.textContent || '').slice(0, 512) })),
      active: Math.max(0, saved.indexOf(getActiveTab())) }, all.length)
  }
  function confirmSiteClear(origin) {
    dismiss(false)
    const en = getLang() === 'en'
    modal.classList.add('nf-clear-confirm')
    const heading = dialogHeading(en ? 'Clear site data?' : 'Usunąć dane witryny?', () => dismiss(false))
    const badge = node('span', '', 'nf-clear-badge'); badge.append(siteIcon('trash'))
    heading.querySelector('h2').prepend(badge)
    const address = node('div', '', 'nf-site-origin'); address.append(siteIcon('globe'), node('span', origin))
    const description = node('p', en
      ? 'Cookies, cache, offline data and all remembered permissions and blocks will be removed.'
      : 'Usuniemy ciasteczka, pamięć podręczną, dane offline oraz wszystkie zapisane zgody i blokady.', 'nf-clear-description')
    const notice = node('div', '', 'nf-clear-notice'); notice.append(siteIcon('info'), node('span', en
      ? 'You will be signed out of this site.' : 'Nastąpi wylogowanie z tej witryny.'))
    const keep = node('p', en ? 'Your bookmarks and saved passwords will remain.' : 'Zakładki i zapisane hasła pozostaną bez zmian.', 'nf-clear-keep')
    const actions = node('div', '', 'bk-modal-btns nf-clear-actions')
    const cancel = button(text('cancel'), () => dismiss(false)); cancel.className = 'btn-cancel'
    const remove = button(en ? 'Clear data and permissions' : 'Usuń dane i zgody', () => dismiss(true)); remove.className = 'nf-clear-delete'; remove.prepend(siteIcon('trash'))
    actions.append(cancel, remove)
    modal.replaceChildren(heading, address, description, notice, keep, actions)
    modal.showModal(); cancel.focus()
    return new Promise(resolve => { settleModal = resolve })
  }
  function recoveryPage(count) {
    return new Promise(resolve => {
      const page = node('div', '', 'nf-recovery-page')
      const art = node('div', '', 'nf-recovery-art'); art.append(siteIcon('restore'))
      const title = node('h1', text('restoreTitle'))
      const description = node('p', text('restoreBody') + count, 'nf-recovery-description')
      const address = node('div', 'nitrix://restore-session', 'nf-recovery-address')
      const actions = node('div', '', 'nf-recovery-actions')
      const discard = button(text('discard'), () => finish(false)); discard.classList.add('nf-recovery-secondary')
      const restore = button(text('restore'), () => finish(true)); restore.classList.add('nf-primary'); restore.prepend(siteIcon('restore'))
      actions.append(discard, restore); page.append(art, title, address, description, actions); container.append(page)
      const tab = createTab('about:blank', page)
      tab.tabEl.classList.add('nf-recovery-tab')
      const tabTitle = getLang() === 'en' ? 'Nitrix — Session recovery' : 'Nitrix — Przywracanie sesji'
      tab.titleEl.textContent = tabTitle
      tab.faviconEl.src = 'icon.ico'; tab.faviconEl.style.display = ''
      tab.faviconEl.onerror = null
      document.title = tabTitle
      let settled = false
      tab.onInternalClose = () => { if (!settled) { settled = true; resolve(false) } }
      function finish(value) {
        if (settled) return
        settled = true
        if (!value && !getTabs().some(t => t !== tab && !t.closing)) createTab()
        closeTab(tab.id)
        resolve(value)
      }
      restore.focus()
    })
  }
  function scheduleSnapshot() { clearTimeout(snapshotTimer); snapshotTimer = setTimeout(snapshot, 80) }
  function tabCreated(tab) {
    tab.lastActive = Date.now()
    const moon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    moon.setAttribute('viewBox', '0 0 24 24'); moon.setAttribute('class', 'nf-moon'); moon.setAttribute('aria-hidden', 'true')
    moon.innerHTML = '<path d="M20.4 14.2A8.7 8.7 0 0 1 9.8 3.6a8.8 8.8 0 1 0 10.6 10.6Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
    tab.tabEl.insertBefore(moon, tab.titleEl)
    for (const event of ['did-navigate', 'did-navigate-in-page', 'page-title-updated', 'did-stop-loading']) tab.wv.addEventListener(event, scheduleSnapshot)
    snapshot()
  }
  function activate(tab) {
    const previous = getActiveTab()
    if (previous && previous !== tab) previous.lastActive = Date.now()
    tab.lastActive = Date.now()
    if (tab.sleeping) {
      tab.sleeping = false
      tab.tabEl.classList.remove('nf-sleeping'); tab.tabEl.removeAttribute('title')
      tab.hasError = false; tab.errOverlay?.classList.remove('visible')
      tab.wv.setAttribute('src', tab.url)
      container.appendChild(tab.wv)
    }
    scheduleSnapshot()
  }
  function rememberClosed(tab, index) {
    if (!tab.closing && /^(https?:|file:)\/\//i.test(tab.url || '')) {
      closedTabs.push({ url: tab.url, title: tab.titleEl.textContent || '', index })
      if (closedTabs.length > 25) closedTabs.shift()
    }
    scheduleSnapshot()
  }
  function reopen() {
    const entry = closedTabs.pop()
    if (!entry) return
    const tab = createTab(entry.url)
    tab.titleEl.textContent = entry.title
    const tabs = getTabs(), from = tabs.indexOf(tab)
    tabs.splice(from, 1)
    const index = Math.min(entry.index, tabs.length)
    tabs.splice(index, 0, tab)
    if (tabs[index + 1]) tab.tabEl.parentNode.insertBefore(tab.tabEl, tabs[index + 1].tabEl)
    snapshot()
  }
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 't'
      && !event.altKey && !event.isComposing && !document.querySelector('dialog[open]')) {
      event.preventDefault(); event.stopImmediatePropagation(); reopen()
    }
  }, true)
  async function checkSleeping() {
    if (!initialized || checking || !options.sleepTabs || disposed) return
    checking = true
    try {
      for (const tab of getTabs()) {
        if (tab.internalPage || tab.closing || tab.sleeping || tab.wv.classList.contains('wv-panel-source') || tab === getActiveTab() || tab.isLoading || Date.now() - tab.lastActive < options.sleepMinutes * 60000) continue
        const url = tab.url
        let safe = false
        try { safe = await api.canSleep(tab.wv.getWebContentsId()) } catch {}
        if (!safe || disposed || !options.sleepTabs || tab.closing || tab.wv.classList.contains('wv-panel-source') || tab === getActiveTab() || tab.url !== url) continue
        discardTab(tab)
      }
    } finally { checking = false }
  }
  function discardTab(tab) {
    tab.sleeping = true; tab.dispose(); tab.wv.remove(); tab.isLoading = false
    tab.tabEl.classList.add('nf-sleeping'); tab.tabEl.title = text('sleeping')
    snapshot()
  }
  async function sleepTab(tab) {
    if (!tab || tab.internalPage || tab.closing || tab.sleeping || tab.sleepPending) return
    tab.sleepPending = true
    const url = tab.url
    try {
      if (tab.closing || tab.sleeping || tab.url !== url || !getTabs().includes(tab)) return
      if (tab === getActiveTab()) {
        const next = getTabs().find(t => t !== tab && !t.closing)
        if (next) next.tabEl.click(); else createTab()
      }
      discardTab(tab)
    } finally { tab.sleepPending = false }
  }
  document.addEventListener('visibilitychange', checkSleeping)
  const section = node('div', '', 'settings-section nf-section'); section.id = 'section-karty-dane'
  document.getElementById('settings-content').appendChild(section)
  const sidebar = node('button', '', 'sidebar-item nf-sidebar'); sidebar.type = 'button'; sidebar.dataset.section = 'karty-dane'
  const sidebarIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  sidebarIcon.setAttribute('viewBox', '0 0 24 24'); sidebarIcon.setAttribute('width', '16'); sidebarIcon.setAttribute('height', '16')
  sidebarIcon.setAttribute('fill', 'none'); sidebarIcon.setAttribute('stroke', 'currentColor'); sidebarIcon.setAttribute('stroke-width', '1.5'); sidebarIcon.setAttribute('aria-hidden', 'true')
  const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  iconPath.setAttribute('d', 'M8 4h11a1 1 0 0 1 1 1v11M5 8h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z')
  sidebarIcon.appendChild(iconPath)
  const sidebarLabel = node('span')
  sidebar.append(sidebarIcon, sidebarLabel)
  document.getElementById('settings-sidebar').appendChild(sidebar)
  sidebar.onclick = () => {
    document.querySelectorAll('#settings-sidebar .sidebar-item').forEach(el => el.classList.toggle('active', el === sidebar))
    document.querySelectorAll('.settings-section').forEach(el => el.classList.toggle('active', el === section))
    renderSettings()
    document.getElementById('settings-content').scrollTop = 0
  }
  let saveQueue = Promise.resolve()
  function save(patch) {
    const task = saveQueue.then(async () => {
      try {
        const next = { ...options, ...patch }
        if (!await api.saveOptions(next)) throw Error('save')
        options = next; return true
      } catch { await message(text('title'), text('error')); return false }
    })
    saveQueue = task.catch(() => false)
    return task
  }
  function renderSettings() {
    sidebarLabel.textContent = text('title'); section.replaceChildren()
    const heading = node('div', '', 'settings-top')
    heading.append(node('div', text('title'), 'section-heading'), closeButton(() => document.getElementById('settings-overlay').classList.remove('open')))
    section.append(heading)
    function toggle(key, label) {
      const control = node('label', '', 'toggle-switch'), input = node('input'); input.type = 'checkbox'; input.checked = options[key]
      input.dataset.option = key; input.setAttribute('aria-label', text(label))
      input.onchange = async () => { input.disabled = true; await save({ [key]: input.checked }); input.disabled = false; syncSettings() }
      control.append(input, node('div', '', 'toggle-track'), node('div', '', 'toggle-thumb'))
      section.append(settingRow(text(label), control, key === 'sleepTabs' ? text('sleepHelp') : null))
    }
    toggle('warnClose', 'warn'); toggle('sleepTabs', 'sleep')
    const times = segmented(text('after'), [5,15,30,60].map(n => [n, `${n} min`]), options.sleepMinutes,
      n => save({ sleepMinutes: Number(n) }))
    times.dataset.option = 'sleepMinutes'; section.append(settingRow(text('after'), times))
    const domains = node('textarea'); domains.value = options.sleepExceptions.join('\n'); domains.rows = 3; domains.maxLength = 25500
    const domainLabel = node('label', text('exceptions'), 'nf-label'); domainLabel.append(domains)
    const domainRow = node('div', '', 'setting-row')
    domainRow.append(domainLabel, node('p', text('exceptionsHint'), 'nf-help'), button(text('save'), async () => {
      const exceptions = [...new Set(domains.value.toLowerCase().split(/[\s,;]+/).filter(Boolean))]
      if (exceptions.length > 100 || exceptions.some(h => !/^[a-z0-9.-]{1,253}$/.test(h))) { await message(text('exceptions'), text('invalid')); return }
      await save({ sleepExceptions: exceptions })
    }))
    domainRow.querySelector('button').className = 'homepage-custom-save'
    section.append(domainRow)
    for (const [label, action, help] of [['reopen', reopen, 'reopenHint'], ['export', exportBookmarks, 'exportHelp']]) {
      const row = node('div', '', 'setting-row')
      const control = button(text(label), action); control.className = 'sbk-open-btn'
      row.append(control, node('p', text(help), 'nf-help')); section.append(row)
    }
    if (isPrivate) section.append(node('p', text('private'), 'nf-help'))
    syncSettings()
  }
  function syncSettings() {
    section.querySelectorAll('input[data-option]').forEach(input => { input.checked = options[input.dataset.option] })
    const times = section.querySelector('[data-option="sleepMinutes"]')
    if (times) { times.sync(options.sleepMinutes); times.querySelectorAll('button').forEach(b => { b.disabled = !options.sleepTabs }) }
  }
  async function exportBookmarks() {
    try { const result = await api.exportBookmarks(); if (!result.canceled) await message(text('export'), text(result.ok ? 'exported' : 'error')) }
    catch { await message(text('export'), text('error')) }
  }
  const siteButton = button('', showSite)
  const siteButtonLabel = node('span', text('site'), 'nf-site-button-label')
  const siteButtonBadge = node('span', '', 'nf-site-button-badge'); siteButtonBadge.append(siteIcon('shield'))
  const siteButtonArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  siteButtonArrow.setAttribute('viewBox', '0 0 16 16'); siteButtonArrow.setAttribute('class', 'nf-site-button-arrow'); siteButtonArrow.setAttribute('aria-hidden', 'true')
  siteButtonArrow.innerHTML = '<path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
  siteButton.append(siteButtonBadge, siteButtonLabel, siteButtonArrow)
  siteButton.classList.add('nf-site-button'); document.getElementById('sec-popup').appendChild(siteButton)
  const exportButton = button(text('export'), exportBookmarks)
  document.getElementById('bk-all-footer').appendChild(exportButton)
  async function showSite() {
    document.getElementById('sec-popup').classList.remove('open')
    const tab = getActiveTab()
    try {
      if (!tab) return
      const id = tab.wv.getWebContentsId(), data = await api.siteGet(id)
      if (!data) { await message(text('site'), text('noSite')); return }
      dismiss(); modal.classList.add('nf-site-dialog')
      const heading = dialogHeading(text('site'), () => dismiss())
      heading.querySelector('h2').prepend(siteIcon('shield'))
      const origin = node('div', '', 'nf-site-origin'); origin.append(siteIcon('globe'), node('span', data.origin))
      modal.replaceChildren(heading, origin)
      for (const key of ['camera','microphone','geolocation','notifications']) {
        const control = segmented(text(key), ['ask','allow','block'].map(v => [v, text(v)]), data.permissions[key] || 'ask', async value => {
          try { if (!await api.siteSet(id, data.origin, key, value)) throw Error('set'); return true }
          catch { dismiss(); await message(text('site'), text('error')); return false }
        })
        const row = settingRow(text(key), control)
        const icon = node('span', '', 'nf-site-icon-wrap'); icon.append(siteIcon(key))
        row.querySelector('.setting-row-inline-text').prepend(icon)
        modal.append(row)
      }
      const hint = node('div', '', 'nf-site-hint'); hint.append(siteIcon('info'), node('p', text('revokeHelp'), 'nf-help'))
      modal.append(hint)
      if (isPrivate) modal.append(node('p', text('private'), 'nf-help'))
      const actions = node('div', '', 'nf-actions')
      actions.append(button(text('clear'), async () => {
        dismiss()
        if (!await confirmSiteClear(data.origin)) return
        try {
          if (!await api.siteClear(id, data.origin)) throw Error('clear')
          await message(text('site'), text('cleared'))
        } catch { await message(text('site'), text('error')) }
      }))
      actions.classList.add('bk-modal-btns')
      actions.querySelector('button').prepend(siteIcon('trash'))
      modal.append(actions); modal.showModal(); modal.querySelector('.icon-btn').focus()
    } catch { await message(text('site'), text('error')) }
  }
  api.onOptions(value => { options = value; syncSettings() })
  document.addEventListener('change', event => {
    if (event.target.name === 'nitrix-lang') {
      renderSettings(); siteButtonLabel.textContent = text('site'); exportButton.textContent = text('export')
    }
  })
  window.addEventListener('pagehide', () => {
    disposed = true; clearInterval(sleepTimer); clearTimeout(snapshotTimer); snapshot()
    permissionAnchorObserver.disconnect(); window.removeEventListener('resize', positionPermission)
    closedTabs.length = 0
  })
  async function initialize() {
    try {
      const data = await api.init()
      if (!data) return false
      options = data.options; initialized = true; renderSettings()
      sleepTimer = setInterval(checkSleeping, 60000)
      if (isPrivate || !data.recovery.length) return false
      const entries = data.recovery.flatMap(w => w.snapshot.tabs).slice(0,500)
      if (!entries.length) return false
      const restore = await recoveryPage(entries.length)
      if (restore) {
        const restoredTabs = entries.map(entry => { const tab = createTab(entry.url); tab.titleEl.textContent = entry.title; return tab })
        // Activate the previously selected tab of the first recovered window.
        const index = Math.min(data.recovery[0].snapshot.active, restoredTabs.length - 1)
        restoredTabs[index]?.tabEl.click()
        snapshot()
      }
      await api.consumeRecovery(data.recovery.map(w => w.key))
      return true
    } catch { await message(text('title'), text('error')); return false }
  }
  renderSettings()
  return { initialize, tabCreated, activate, rememberClosed, reopen, snapshot, checkSleeping, sleepTab }
}
