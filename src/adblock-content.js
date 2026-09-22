// adblock-content.js — Nitrix Adblock Engine
;(function installNitrixAdblock() {
  'use strict'
  // Browser tools and the source viewer are not ordinary web documents.
  if (!/^https?:$/.test(location.protocol) || location.href.startsWith('view-source:')) return
  const fetchDescriptor = Object.getOwnPropertyDescriptor(window, 'fetch')
  if (fetchDescriptor && fetchDescriptor.writable === false && !fetchDescriptor.set) return
  if (!document.documentElement) {
    document.addEventListener('DOMContentLoaded', installNitrixAdblock, { once: true })
    return
  }

  // ══ Stan adblockera — przechowywany w dataset aby być widocznym z executeJavaScript ══
  // document.documentElement.dataset jest WSPÓŁDZIELONY między światem preloadu i main world,
  // dzięki czemu executeJavaScript() z renderera może czytać/pisać te same wartości.

  function _nitrixTrack(url, type) {
    try {
      const el   = document.documentElement
      const list = JSON.parse(el.dataset.nitrixBlocked || '[]')
      if (list.length >= 300) list.splice(0, 50)
      list.push({ url, type })
      el.dataset.nitrixBlocked = JSON.stringify(list)
    } catch(e) {}
  }

  function _nitrixIsEnabled() {
    try { return document.documentElement.dataset.nitrixAdblockOff !== '1' } catch(e) { return true }
  }
  // Wbudowane listy Nitrix (reklamy + YT + polskie) — czytane z nitrix-adb-vars.js
  function _nitrixIsBuiltIn() {
    try { return window.__nitrix_adb?.nitrixBuiltIn !== false } catch(e) { return true }
  }

  function _nitrixIsAggressive() {
    try { return document.documentElement.dataset.nitrixAggressive === '1' } catch(e) { return false }
  }

  // Zresetuj dane przy każdej nowej nawigacji
  window.addEventListener('beforeunload', () => {
    try {
      document.documentElement.dataset.nitrixBlocked    = '[]'
      document.documentElement.dataset.nitrixAdblockOff = '0'
      // Nie resetuj nitrixAggressive — jest ustawiany przez main.js, nie per-nawigację
    } catch(e) {}
  })


  // ════════════════════════════════════════════════════════════════════
  //  SAFE DOMAINS — nigdy nie blokuj tych domen
  // ════════════════════════════════════════════════════════════════════
  const SAFE_DOMAINS = new Set([
    'cdn.office.net','microsoft.com','microsoftonline.com','live.com',
    'office.com','sharepoint.com','office.net',
    'bing.com','bing.net','bingapis.com','bingst.net',
    'msn.com','msedge.net',
    'wpimg.pl','wp.pl','wimg.pl','wpcdn.pl',
    'ocdn.eu','i.ocdn.eu','s.ocdn.eu','static.onet.pl','img.onet.pl',
    'ytimg.com',  // tylko thumbnails/statyczne zasoby YT — reklamy lecą z youtube.com i googlevideo.com
    'vimeo.com','vimeocdn.com','flowplayer.com',
    'cloudflare.com','cloudflare.net','cdnjs.cloudflare.com',
    'jsdelivr.net','unpkg.com','fastly.net','akamaized.net','akamai.net',
    'twimg.com','twitter.com','x.com','gravatar.com',
  ])

  // Trackery będące subdomenami bezpiecznych domen — mają priorytet nad SAFE_DOMAINS
  const SAFE_EXCEPTIONS = new Set([
    'bat.bing.com','c.bing.com','clarity.ms',
  ])

  function isSafeDomain(url) {
    if (!url || typeof url !== 'string') return false
    try {
      let h = new URL(url.startsWith('//') ? 'https:' + url : url).hostname.toLowerCase()
      if (SAFE_EXCEPTIONS.has(h)) return false   // tracker — nie zwalniaj z blokady
      while (h.includes('.')) {
        if (SAFE_DOMAINS.has(h)) return true
        h = h.slice(h.indexOf('.') + 1)
      }
    } catch(e) {}
    return false
  }

  // ════════════════════════════════════════════════════════════════════
  //  AD DOMAINS
  // ════════════════════════════════════════════════════════════════════
  const AD_DOMAINS = new Set([
    'googleadservices.com','googlesyndication.com','doubleclick.net',
    'adservice.google.com','pagead2.googlesyndication.com',
    'stats.g.doubleclick.net','adwords.google.com',
    'connect.facebook.net','an.facebook.com','pixel.facebook.com',
    'amazon-adsystem.com','aax.amazon-adsystem.com',
    'bat.bing.com','clarity.ms',
    'adnxs.com','adsrvr.org','advertising.com','adroll.com','adform.net',
    'casalemedia.com','contextweb.com','criteo.com','criteo.net',
    'emxdgt.com','everesttech.net','flashtalking.com',
    'gumgum.com','kargo.com','lijit.com','lkqd.net','media.net',
    'moatads.com','nexac.com','openx.net','outbrain.com','pubmatic.com',
    'revcontent.com','rubiconproject.com','smartadserver.com',
    'spotx.tv','spotxchange.com','taboola.com','teads.tv',
    'valueclick.com','valueclick.net','yieldmo.com','zedo.com',
    'bidswitch.net','buysellads.com','carbonads.com',
    'demdex.net','doubleverify.com','iasds01.com','propellerads.com',
    'adocean.pl','hit.gemius.pl','imgsyn.gemius.pl','gemius.pl',
    'netsprint.eu','netsprint.pl','adsrv.wp.pl','wpads.pl',
    'tradedoubler.com','mediaplex.com',
    'csr.onet.pl','r.onet.pl','stat.onet.pl','creatives.onet.pl','adretargeting.onet.pl',
    'oas.ringieraxelspringer.pl','adserver.ringieraxelspringer.pl','ringieraxelspringer.tech',
    'redlink.pl','bidr.io','pulsemtc.pl','dreamlab.pl',
    'cxense.com','opecloud.com','salesmanago.com',
    'indexww.com','connectad.io','creativecdn.com','pushpushgo.com',
    'fundingchoicesmessages.google.com','events.ocdn.eu',
    'google-analytics.com','googletagmanager.com','googletagservices.com',
    'analytics.google.com','hotjar.com','mouseflow.com','fullstory.com',
    'segment.com','mixpanel.com','quantserve.com','scorecardresearch.com',
    'mc.yandex.ru','mc.yandex.com',
  ])

  // ════════════════════════════════════════════════════════════════════
  //  AGGRESSIVE DOMAINS — blokowane tylko w trybie agresywnym
  // ════════════════════════════════════════════════════════════════════
  const AGGRESSIVE_DOMAINS = new Set([
    'facebook.com','facebook.net','fbcdn.net','fbsbx.com',
    'instagram.com','cdninstagram.com',
    'tiktok.com','tiktokcdn.com','muscdn.com',
    'snapchat.com','snap-ci.com',
    'linkedin.com','licdn.com',
    'pinterest.com','pinimg.com',
    'reddit.com','redd.it','redditstatic.com',
    'twitter.com','x.com',
  ])

  function isAdUrl(url) {
    if (!url || typeof url !== 'string') return false
    if (!_nitrixIsBuiltIn()) return false
    if (isSafeDomain(url)) return false
    try {
      let h = new URL(url.startsWith('//') ? 'https:' + url : url).hostname.toLowerCase()
      while (h.includes('.')) {
        if (AD_DOMAINS.has(h)) return true
        if (_nitrixIsAggressive() && AGGRESSIVE_DOMAINS.has(h)) return true
        h = h.slice(h.indexOf('.') + 1)
      }
    } catch(e) {}
    return false
  }

  // ════════════════════════════════════════════════════════════════════
  //  VAST URL DETECTION — wzorce URL reklam wideo
  // ════════════════════════════════════════════════════════════════════
  const EMPTY_VAST = '<?xml version="1.0" encoding="UTF-8"?><VAST version="4.1"></VAST>'

  const VAST_PATTERNS = [
    /imasdk\.googleapis\.com/i,
    /securepubads\.g\.doubleclick\.net/i,
    /partner\.googleadservices\.com/i,
    /\/vast(\.xml|\.php|\.asp)?(\?|\/|$)/i,
    /[?&](adTagUrl|ad_tag_url|vast_url|vastUrl|adtag|ad_url)=/i,
    /\/(preroll|midroll|postroll)(\/|\.|$)/i,
    /springserve\.(com|net)/i,
    /springserve\./i,
    /spotx\.tv\/vast/i,
    /spotxchange\.com\/vast/i,
    /jwpads\./i,
    /jwplatform\.com.*\/ads\//i,
    /\/ad\/vast/i,
    /\/adsrv\//i,
    /brightcove\.com.*\/ads\//i,
    /kaltura\.com.*\/ads\//i,
    /lkqd\.net/i,
    /teads\.tv\/page-level-tag/i,
    /onetads\.pl/i,
    /onetadserver\.pl/i,
    /adserver\.onet\.pl/i,
    /vidazoo\.com/i,
    /video\.unrulymedia\.com/i,
    /ads\.stickyadstv\.com/i,
    /adserver\.adtech\.de/i,
    /video\.ads\.yieldmo\.com/i,
  ]

  function isVastUrl(url) {
    if (!url || typeof url !== 'string') return false
    if (!_nitrixIsBuiltIn()) return false
    if (isSafeDomain(url)) return false  // nigdy nie blokuj bezpiecznych domen (CDN, Microsoft, itd.)
    for (let i = 0; i < VAST_PATTERNS.length; i++) {
      if (VAST_PATTERNS[i].test(url)) return true
    }
    return false
  }

  function _blockResponse(url, type, isVast) {
    _nitrixTrack(url, type)
    if (isVast) {
      return Promise.resolve(new Response(EMPTY_VAST, {
        status: 200,
        headers: { 'Content-Type': 'application/xml' }
      }))
    }
    return Promise.resolve(new Response('{}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }))
  }

  // ════════════════════════════════════════════════════════════════════
  //  YOUTUBE — helpery do parsowania odpowiedzi /youtubei
  //  Definicja PRZED głównym fetchem — muszą być dostępne wewnątrz interceptora
  // ════════════════════════════════════════════════════════════════════
  const YT_AD_KEYS = new Set([
    'adSlots','playerAds','adBreakHeartbeatParams','adPlacements',
    'adParams','adBreaks','adBreakScheduled','adBreakInfo',
    'adClientDataEntry','adIntermission','interstitialAdRenderer',
    'instreamVideoAdRenderer','linearAd','nonlinearAd',
    'videoAdRenderer','adRenderer','adInfoRenderer','adBadgeRenderer',
    'adDurationRemaining','adPreviewRenderer','adHoverTextRenderer',
    'adVideoProgressRenderer','adActionInterstitialRenderer',
    'adTimedPieCountdownRenderer','adSkipButtonRenderer',
    'adSurveyRenderer','adFeedbackDialogRenderer',
    'externalVideoId','playerAdParams','auxiliaryUi',
  ])

  function _ytStripAdData(obj) {
    if (!obj || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) { obj.forEach(_ytStripAdData); return obj }
    for (const k of Object.keys(obj)) {
      if (YT_AD_KEYS.has(k)) {
        obj[k] = Array.isArray(obj[k]) ? [] : (typeof obj[k] === 'object' ? {} : obj[k])
      } else {
        _ytStripAdData(obj[k])
      }
    }
    return obj
  }

  function _isYTPlayerUrl(url) {
    if (typeof url !== 'string') return false
    return (url.includes('youtube.com/youtubei/') || url.includes('youtube-nocookie.com/youtubei/')) &&
           (url.includes('/player') || url.includes('/next'))
  }

  // ── Shorts — filtrowanie reklam z feed /reel_watch_sequence ──────────
  // Odpowiednik filterShortsAd z vBlockTube
  function _filterShortsAd(entry) {
    try { return entry?.command?.reelWatchEndpoint?.adClientParams?.isAd !== true } catch(e) { return true }
  }

  function _processReelWatchSequence(data) {
    try {
      if (Array.isArray(data?.entries) && data.entries[0]?.command?.reelWatchEndpoint) {
        data.entries = data.entries.filter(_filterShortsAd)
      }
      if (Array.isArray(data?.reelWatchSequenceResponse?.entries) &&
          data.reelWatchSequenceResponse.entries[0]?.command?.reelWatchEndpoint) {
        data.reelWatchSequenceResponse.entries = data.reelWatchSequenceResponse.entries.filter(_filterShortsAd)
      }
    } catch(e) {}
  }

  // ── Tracking URLs — blokowane we fetch i XHR (port z vBlockTube) ────
  // log_event, stats/qoe, ptracking, generate_204 — czyste puste odpowiedzi 204
  const YT_TRACKING_URLS = [
    '/youtubei/v1/log_event',
    '/api/stats/qoe',
    '/ptracking',
    '/generate_204',
  ]
  function _isYTTrackingUrl(url) {
    if (typeof url !== 'string') return false
    for (let i = 0; i < YT_TRACKING_URLS.length; i++) {
      if (url.includes(YT_TRACKING_URLS[i])) return true
    }
    return false
  }

  // ════════════════════════════════════════════════════════════════════
  //  PATCH fetch() i XHR
  // ════════════════════════════════════════════════════════════════════
  const _fetch = window.fetch
  window.fetch = function(input, init) {
    if (!_nitrixIsEnabled()) return _fetch.apply(this, arguments)
    const url = typeof input === 'string' ? input : (input && input.url) || ''
    if (isAdUrl(url))   return _blockResponse(url, 'fetch', false)
    if (isVastUrl(url)) return _blockResponse(url, 'vast',  true)
    // Strumienie wideo reklam YT + przechwytywanie JSON — tylko gdy nitrixBuiltIn włączony
    if (_nitrixIsBuiltIn()) {
    if (url.includes('googlevideo.com')) {
      if (/[?&]oad=/.test(url)) return _blockResponse(url, 'yt-ad-oad', false)
      if (url.includes('videoplayback') && (/[?&]adformat=/.test(url) || /[?&]ad_type=/.test(url))) {
        return _blockResponse(url, 'yt-ad-stream', false)
      }
    }
    // Endpointy statystyk i planowania reklam YT
    if (url.includes('youtube.com/api/stats/ads') ||
        url.includes('youtube.com/pagead/') ||
        url.includes('youtube.com/get_midroll_info')) {
      return _blockResponse(url, 'yt-ad-api', false)
    }
    // Tracking URLs — puste 204 zamiast blokady (nie triggeruje detekcji)
    if (_isYTTrackingUrl(url)) {
      return Promise.resolve(new Response('{}', { status: 204, statusText: 'No Content' }))
    }
    } // end nitrixBuiltIn
    // Przechwytuj /youtubei/v1/player i /youtubei/v1/next — wytnij pola reklamowe z JSON-a
    if (_nitrixIsBuiltIn() && _isYTPlayerUrl(url)) {
      return _fetch.apply(this, arguments).then(function(resp) {
        if (!resp || !resp.ok) return resp
        const ct = resp.headers.get('content-type') || ''
        if (!ct.includes('json')) return resp
        return resp.json().then(function(data) {
          try { _ytStripAdData(data) } catch(e) {}
          // WAŻNE: przekazujemy TYLKO Content-Type, nie wszystkie headery.
          // Oryginalna odpowiedź może mieć Content-Encoding: gzip/br — po .json()
          // ciało jest już zdekompresowane, więc przekazanie oryginalnych headerów
          // powoduje błąd CORS/dekodowania (przeglądarka próbuje zdekompresować drugi raz).
          return new Response(JSON.stringify(data), {
            status: resp.status, statusText: resp.statusText,
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          })
        }).catch(function() { return resp })
      }).catch(function(err) { throw err })
    }
    // Shorts — /reel_watch_sequence: wyfiltruj reklamy z feed
    if (_nitrixIsBuiltIn() && url.includes('/reel_watch_sequence')) {
      return _fetch.apply(this, arguments).then(function(resp) {
        if (!resp || !resp.ok) return resp
        const ct = resp.headers.get('content-type') || ''
        if (!ct.includes('json')) return resp
        return resp.json().then(function(data) {
          try { _processReelWatchSequence(data) } catch(e) {}
          return new Response(JSON.stringify(data), {
            status: resp.status, statusText: resp.statusText,
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          })
        }).catch(function() { return resp })
      }).catch(function(err) { throw err })
    }
    // /browse — czyszczenie reklam z feed głównego (port z vBlockTube)
    if (_nitrixIsBuiltIn() && url.includes('youtube.com/youtubei/') && url.includes('/browse')) {
      return _fetch.apply(this, arguments).then(function(resp) {
        if (!resp || !resp.ok) return resp
        const ct = resp.headers.get('content-type') || ''
        if (!ct.includes('json')) return resp
        return resp.json().then(function(data) {
          try { _ytStripAdData(data) } catch(e) {}
          return new Response(JSON.stringify(data), {
            status: resp.status, statusText: resp.statusText,
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          })
        }).catch(function() { return resp })
      }).catch(function(err) { throw err })
    }
    return _fetch.apply(this, arguments)
  }
  // configurable: true — niezbędne żeby inne skrypty (np. Service Worker polyfill) mogły się z tym ułożyć
  Object.defineProperty(window, 'fetch', { value: window.fetch, writable: false, configurable: true })

  // ── XHR — subclass zamiast prototype patching (port z vBlockTube) ───
  // Subklasowanie jest czystsze: nie mutuje globalnego prototype,
  // get response()/responseText jako computed properties działają niezawodnie.
  const _OrigXHR = XMLHttpRequest
  window.XMLHttpRequest = class NitrixXHR extends _OrigXHR {
    open(method, url, ...rest) {
      this._nUrl = typeof url === 'string' ? url : ''
      // Blokada tracking URLs (204 pusta odpowiedź)
      if (_nitrixIsEnabled() && _nitrixIsBuiltIn() && _isYTTrackingUrl(this._nUrl)) {
        this._nTracking = true
        return
      }
      // Blokada domen reklamowych
      const blocked = _nitrixIsEnabled() && (isAdUrl(this._nUrl) || isVastUrl(this._nUrl))
      this._nitrixBlocked = blocked
      this._nitrixVast    = blocked && isVastUrl(this._nUrl)
      // YT player/next URL — będziemy przechwytywać response
      this._nitrixYTUrl   = !blocked && _nitrixIsEnabled() && _nitrixIsBuiltIn() && _isYTPlayerUrl(this._nUrl)
      if (blocked) _nitrixTrack(this._nUrl, this._nitrixVast ? 'vast' : 'xhr')
      if (!blocked) return super.open(method, url, ...rest)
    }

    send(body) {
      // Tracking URL — symuluj pustą odpowiedź 204
      if (this._nTracking) {
        setTimeout(() => {
          try { this.dispatchEvent(new Event('readystatechange')) } catch(e) {}
          try { this.dispatchEvent(new Event('load')) } catch(e) {}
        }, 1)
        return
      }
      // Zablokowane żądanie reklamowe
      if (this._nitrixBlocked) {
        const vastBody = this._nitrixVast ? EMPTY_VAST : '{}'
        setTimeout(() => {
          try { this.onreadystatechange && this.onreadystatechange() } catch(e) {}
          try { this.dispatchEvent(new Event('readystatechange')) } catch(e) {}
          try { this.dispatchEvent(new Event('load')) } catch(e) {}
        }, 1)
        return
      }
      // YT player URL — przechwytuj response po załadowaniu
      if (this._nitrixYTUrl) {
        this.addEventListener('load', () => {
          try {
            if (this.responseType !== '' && this.responseType !== 'text') return
            const data = JSON.parse(super.responseText)
            _ytStripAdData(data)
            this._nPatchedResponse = JSON.stringify(data)
          } catch(e) {}
        }, { once: true })
      }
      return super.send(body)
    }

    get responseText() {
      if (this._nTracking) return '{}'
      if (this._nitrixBlocked) return this._nitrixVast ? EMPTY_VAST : '{}'
      if (this._nPatchedResponse) return this._nPatchedResponse
      return super.responseText
    }

    get response() {
      if (this._nTracking) return '{}'
      if (this._nitrixBlocked) return this._nitrixVast ? EMPTY_VAST : '{}'
      if (this._nPatchedResponse) return this._nPatchedResponse
      return super.response
    }

    get status() {
      if (this._nTracking) return 204
      if (this._nitrixBlocked) return 200
      return super.status
    }

    get readyState() {
      if (this._nTracking || this._nitrixBlocked) return 4
      return super.readyState
    }
  }

  // ════════════════════════════════════════════════════════════════════
  //  SPOOFING obiektów reklamowych
  // ════════════════════════════════════════════════════════════════════
  if (_nitrixIsEnabled() && _nitrixIsBuiltIn()) {
  if (!window.googletag) {
    window.googletag = {
      cmd: { push: (fn) => { try { fn() } catch(e) {} } },
      defineSlot: () => ({ addService: () => ({}) }),
      defineOutOfPageSlot: () => ({ addService: () => ({}) }),
      pubads: () => ({
        enableSingleRequest: () => {}, collapseEmptyDivs: () => {},
        disableInitialLoad: () => {}, setTargeting: () => ({}),
        refresh: () => {}, addEventListener: () => {}, removeEventListener: () => {},
        getSlots: () => [], enableLazyLoad: () => {},
      }),
      companionAds: () => ({ enableSyncLoading: () => {} }),
      sizeMapping: () => ({ addSize: function(){ return this }, build: () => [] }),
      enableServices: () => {}, display: () => {}, destroySlots: () => true,
      _loadStarted: true,
    }
  }
  if (!window.adsbygoogle) {
    Object.defineProperty(window, 'adsbygoogle', {
      get: () => ({ loaded: true, push: () => {} }), configurable: true,
    })
  }
  if (!window.__tcfapi)   window.__tcfapi   = (cmd,v,cb) => { try { cb({ cmpStatus:'loaded', eventStatus:'tcloaded', gdprApplies:false, tcString:'' }, true) } catch(e) {} }
  if (!window.__uspapi)   window.__uspapi   = (c,v,cb) => { try { cb('1---', true) } catch(e) {} }
  if (!window.__cmp)      window.__cmp      = () => {}
  if (!window.OBR)        window.OBR        = { extern: { researchWidget: () => {}, reloadWidget: () => {} } }
  if (!window._taboola)   window._taboola   = { push: () => {} }
  if (!window.apstag)     window.apstag     = { init: () => {}, fetchBids: (_c,cb) => { try { cb([]) } catch(e) {} }, setDisplayBids: () => {}, targetingKeys: () => [] }
  if (!window.pbjs)       window.pbjs       = { que: { push: (fn) => { try { fn() } catch(e) {} } }, requestBids: () => {}, addAdUnits: () => {}, setConfig: () => {}, getHighestCpmBids: () => [] }
  if (!window.Criteo)     window.Criteo     = { DisplayAd: () => {}, events: { push: () => {} } }
  if (!window.criteo_q)   window.criteo_q   = { push: () => {} }
  if (!window.adf)        window.adf        = { run: () => {} }
  if (!window.gemius_hit)    window.gemius_hit    = () => {}
  if (!window.gemius_event)  window.gemius_event  = () => {}
  if (!window.pp_gemius_hit) window.pp_gemius_hit = () => {}
  if (!window.hj)         window.hj         = () => {}
  if (!window.ga)         window.ga         = () => {}
  if (!window.gtag)       window.gtag       = () => {}
  if (!window.dataLayer)  window.dataLayer  = { push: () => {} }
  } // end nitrixBuiltIn — SPOOFING obiektów reklamowych

  // ════════════════════════════════════════════════════════════════════
  //  GOOGLE IMA SDK — pełna atrapa anti-detection
  //  Większość playerów wideo używa IMA3. Atrapa sprawia że player
  //  "myśli" iż reklamy załadowały się i odtworzyły pomyślnie.
  //  Brak jakichkolwiek śladów blokowania → zero detekcji.
  // ════════════════════════════════════════════════════════════════════
  ;(function _nitrixIMA() {
    if (!_nitrixIsEnabled()) return
    if (!_nitrixIsBuiltIn()) return
    if (window.google && window.google.ima && window.google.ima.__nitrix) return

    // Mini EventEmitter
    function Emitter() { this._h = {} }
    Emitter.prototype.addEventListener    = function(t, fn) { if (!this._h[t]) this._h[t] = []; this._h[t].push(fn) }
    Emitter.prototype.removeEventListener = function(t, fn) { if (this._h[t]) this._h[t] = this._h[t].filter(f => f !== fn) }
    Emitter.prototype._emit               = function(t, ev) { ;(this._h[t] || []).slice().forEach(fn => { try { fn(ev) } catch(e) {} }) }

    // Fake Ad object
    function FakeAd() {}
    FakeAd.prototype = {
      getAdId:()=>'nitrix-0', getAdPodInfo:()=>({getAdPosition:()=>1,getTotalAds:()=>1,getTimeOffset:()=>0,getMaxDuration:()=>-1,isBumper:()=>false,getPodIndex:()=>0}),
      getAdvertiserName:()=>'', getApiFramework:()=>null, getCompanionAds:()=>[], getContentType:()=>'video/mp4',
      getCreativeId:()=>'', getDealId:()=>'', getDescription:()=>'', getDuration:()=>0,
      getHeight:()=>0, getWidth:()=>0, getId:()=>'', getMinSuggestedDuration:()=>-1, getSkipTimeOffset:()=>-1,
      getSurveyUrl:()=>null, getTitle:()=>'', getTraffickingParameters:()=>({}), getTraffickingParametersString:()=>'',
      getUiElements:()=>[], getUniversalAdIdRegistry:()=>'unknown', getUniversalAdIdValue:()=>'unknown',
      getVastMediaBitrate:()=>0, getVastMediaHeight:()=>0, getVastMediaWidth:()=>0, getVideoUrl:()=>'',
      isLinear:()=>true, isPausable:()=>true, isSkippable:()=>false,
    }

    function mkAdEvent(type) { return { type, getAd: () => new FakeAd(), getAdData: () => ({}) } }

    // Fake AdsManager — serce spoofowania
    // Po wywołaniu start() natychmiast symuluje kompletny cykl reklamy
    function FakeAdsManager(videoEl) { Emitter.call(this); this._videoEl = videoEl; this._vol = 1 }
    FakeAdsManager.prototype = Object.assign(Object.create(Emitter.prototype), {
      init:   function() {},
      start:  function() {
        const s = this, T = google.ima.AdEvent.Type
        setTimeout(() => {
          [T.AD_BUFFERING, T.LOADED, T.STARTED, T.IMPRESSION,
           T.FIRST_QUARTILE, T.MIDPOINT, T.THIRD_QUARTILE,
           T.COMPLETE, T.ALL_ADS_COMPLETED, T.CONTENT_RESUME_REQUESTED
          ].forEach(t => s._emit(t, mkAdEvent(t)))
        }, 1)
      },
      stop:()=>{}, pause:()=>{}, resume:()=>{}, destroy:()=>{}, skip:()=>{},
      resize:()=>{}, collapse:()=>{}, expand:()=>{}, focus:()=>{},
      setVolume: function(v) { this._vol = v }, getVolume: function() { return this._vol },
      getAdSkippableState:()=>false, getRemainingTime:()=>0,
      isCustomClickTrackingUsed:()=>false, isCustomPlaybackUsed:()=>false,
      updateAdsRenderingSettings:()=>{}, discardAdBreak:()=>{},
      getPlayAdsAfterTime:()=>-1, getAdsManagerDelegate:()=>null, getCuePoints:()=>[],
    })

    function FakeAdsManagerLoadedEvent(videoEl) {
      this.type = 'ADS_MANAGER_LOADED'; this._mgr = new FakeAdsManager(videoEl)
    }
    FakeAdsManagerLoadedEvent.prototype.getAdsManager = function(v, r) { return this._mgr }

    // Fake AdsLoader — requestAds natychmiast odpala ADS_MANAGER_LOADED
    function FakeAdsLoader(container) {
      Emitter.call(this)
      this._videoEl = container && container._videoEl
    }
    FakeAdsLoader.prototype = Object.assign(Object.create(Emitter.prototype), {
      requestAds: function(req) {
        const self = this
        setTimeout(() => {
          self._emit('ADS_MANAGER_LOADED', new FakeAdsManagerLoadedEvent(self._videoEl))
        }, 1)
      },
      contentComplete: ()=>{}, destroy: ()=>{},
      getSettings: function() { return google.ima.settings },
    })

    function FakeAdDisplayContainer(containerEl, videoEl, clickEl) {
      this._containerEl = containerEl; this._videoEl = videoEl
    }
    FakeAdDisplayContainer.prototype = { initialize:()=>{}, destroy:()=>{} }

    // Enumeracje zgodne z IMA3 SDK
    const AdEventType = {
      AD_BREAK_READY:'adBreakReady', AD_BUFFERING:'adBuffering', AD_CAN_PLAY:'adCanPlay',
      AD_ERROR:'adError', AD_METADATA:'adMetadata', AD_PROGRESS:'adProgress',
      ALL_ADS_COMPLETED:'allAdsCompleted', CLICK:'click', COMPLETE:'complete',
      CONTENT_PAUSE_REQUESTED:'contentPauseRequested', CONTENT_RESUME_REQUESTED:'contentResumeRequested',
      DURATION_CHANGE:'durationChange', EXPANDED_CHANGED:'expandedChanged',
      FIRST_QUARTILE:'firstQuartile', IMPRESSION:'impression', INTERACTION:'interaction',
      LINEAR_CHANGED:'linearChanged', LOADED:'loaded', LOG:'log', MIDPOINT:'midpoint',
      PAUSED:'pause', RESUMED:'resume', SKIPPABLE_STATE_CHANGED:'skippableStateChanged',
      SKIPPED:'skip', STARTED:'start', THIRD_QUARTILE:'thirdQuartile',
      USER_CLOSE:'userClose', VIDEO_CLICKED:'videoClicked', VIDEO_ICON_CLICKED:'videoIconClicked',
      VIEWABLE_IMPRESSION:'viewableImpression', VOLUME_CHANGED:'volumeChange', VOLUME_MUTED:'mute',
    }
    function FakeAdError(msg, code, type) { this.message=msg||''; this.errorCode=code||0; this.type=type||'adError' }
    FakeAdError.prototype = {
      getMessage:function(){return this.message}, getErrorCode:function(){return this.errorCode},
      getType:function(){return this.type}, getInnerError:()=>null, getVastErrorCode:()=>0,
    }

    const ima = {
      __nitrix: true,
      VERSION: '3.560.1',
      AdDisplayContainer: FakeAdDisplayContainer,
      AdsLoader: FakeAdsLoader,
      AdsManager: FakeAdsManager,
      AdsManagerLoadedEvent: Object.assign(FakeAdsManagerLoadedEvent, { Type: { ADS_MANAGER_LOADED:'ADS_MANAGER_LOADED' } }),
      AdsRequest: function AdsRequest() {},
      AdsRenderingSettings: function AdsRenderingSettings() {},
      CompanionAdSelectionSettings: Object.assign(function(){},{
        CreativeType:  { ALL:'All', FLASH:'Flash', IMAGE:'Image' },
        ResourceType:  { ALL:'All', HTML:'Html', IFRAME:'IFrame', STATIC:'Static' },
        SizeCriteria:  { IGNORE:'ignoreSizeCriteria', SELECT_EXACT_MATCH:'selectExactMatch', SELECT_NEAR_MATCH:'selectNearMatch' },
      }),
      AdError: Object.assign(FakeAdError, {
        Type: { AD_LOAD:'adLoadError', AD_PLAY:'adPlayError', AD_ABORT:'adAbortError' },
        ErrorCode: {
          VIDEO_PLAY_ERROR:400, FAILED_TO_REQUEST_ADS:1005, REQUIRED_LISTENERS_NOT_ADDED:900,
          UNKNOWN_ERROR:900, VAST_LOAD_TIMEOUT:301, VAST_NO_ADS_AFTER_WRAPPER:303,
          VAST_EMPTY_RESPONSE:303, VAST_TOO_MANY_REDIRECTS:302,
          VAST_INVALID_XML:100, NONLINEAR_DIMENSIONS_ERROR:501,
          COMPANION_REQUIRED_ERROR:602, UNKNOWN_AD_RESPONSE:200,
        },
      }),
      AdErrorEvent: { Type: { AD_ERROR:'adError' } },
      AdEvent: Object.assign(function FakeAdEvent(){}, { Type: AdEventType }),
      AdCuePoints: function(){}, AdPodInfo: function(){},
      ImaSdkSettings: Object.assign(function(){},{
        CompanionBackfillMode: { ALWAYS:'always', ON_MASTER_AD:'on_master_ad' },
        VpaidMode: { DISABLED:0, ENABLED:1, INSECURE:2 },
      }),
      settings: {
        setAutoPlayAdBreaks:()=>{}, setCompanionBackfill:()=>{}, setDisableCustomPlaybackForIOS10Plus:()=>{},
        setFeatureFlags:()=>{}, setLocale:()=>{}, setNumRedirects:()=>{}, setPlayerType:()=>{},
        setPlayerVersion:()=>{}, setPpid:()=>{}, setSessionId:()=>{}, setVpaidMode:()=>{},
        setVpaidAllowed:()=>{}, getCompanionBackfill:()=>0, getDisableCustomPlaybackForIOS10Plus:()=>false,
        getLocale:()=>'pl', getNumRedirects:()=>4, getPpid:()=>null, getVpaidMode:()=>0,
        setAutoPlayAdBreaks:()=>{},
      },
      UiElements:    { AD_ATTRIBUTION:'adAttribution', COUNTDOWN:'countdown' },
      ViewMode:      { FULLSCREEN:'fullscreen', NORMAL:'normal' },
      OmidVerificationVendor: { OTHER:1, GOOGLE:2 },
      OmidAccessMode:         { DOMAIN:'domain', FULL:'full', LIMITED:'limited' },
    }
    if (!window.google) window.google = {}
    window.google.ima = ima
  })()

  // ════════════════════════════════════════════════════════════════════
  //  VIDEOJS / JW PLAYER — spoof wtyczek reklamowych
  // ════════════════════════════════════════════════════════════════════
  ;(function _nitrixPlayerSpoof() {
    if (!_nitrixIsEnabled()) return
    if (!_nitrixIsBuiltIn()) return
    // VideoJS — zarejestruj puste wtyczki ads/ima zanim oryginalny kod je załaduje
    function hookVideoJS(vjs) {
      if (!vjs || vjs.__nitrix) return
      vjs.__nitrix = true
      try {
        const noop = function() {
          return {
            playAd:()=>{}, preloadAd:()=>{}, cancel:()=>{}, adError:()=>{},
            startLinearAdMode:()=>{}, endLinearAdMode:()=>{}, skipLinearAdMode:()=>{},
            isInAdMode:()=>false, isContentResuming:()=>false,
          }
        }
        if (typeof vjs.registerPlugin === 'function') {
          vjs.registerPlugin('ads', noop)
          vjs.registerPlugin('ima', noop)
          vjs.registerPlugin('contrib-ads', noop)
        }
      } catch(e) {}
    }

    const _vjsOrig = window.videojs
    if (_vjsOrig) hookVideoJS(_vjsOrig)
    try {
      Object.defineProperty(window, 'videojs', {
        get: () => window._vjs_nitrix,
        set: (v) => { window._vjs_nitrix = v; hookVideoJS(v) },
        configurable: true,
      })
      window._vjs_nitrix = _vjsOrig
    } catch(e) {}

    // JW Player — wyczyść konfigurację reklam przed setup()
    function hookJWPlayer(jwp) {
      if (!jwp || jwp.__nitrix) return
      jwp.__nitrix = true
      try {
        const _orig = jwp.prototype && jwp.prototype.setup
        if (typeof _orig === 'function') {
          jwp.prototype.setup = function(cfg) {
            if (cfg) { delete cfg.advertising; delete cfg.adschedule }
            return _orig.call(this, cfg)
          }
        }
      } catch(e) {}
    }
    const _jwOrig = window.jwplayer
    if (typeof _jwOrig === 'function') hookJWPlayer(_jwOrig)
    try {
      Object.defineProperty(window, 'jwplayer', {
        get: () => window._jw_nitrix,
        set: (v) => { window._jw_nitrix = v; if (typeof v === 'function') hookJWPlayer(v) },
        configurable: true,
      })
      window._jw_nitrix = _jwOrig
    } catch(e) {}

    // Bitmovin / Brightcove / Kaltura — zeruj moduły reklamowe
    try { if (!window.bitmovin) window.bitmovin = { player: function(){} } } catch(e) {}
    try { if (!window.bc) window.bc = function(){} } catch(e) {}
  })()

  // ════════════════════════════════════════════════════════════════════
  //  YOUTUBE — blokowanie reklam wideo
  //  Logika 1:1 z userscriptu youtube-adb (iamfugui) v6.21
  // ════════════════════════════════════════════════════════════════════
  ;(function _nitrixYouTubeAdsBypass() {
    if (!_nitrixIsEnabled()) return
    if (!_nitrixIsBuiltIn()) return
    const host = location.hostname
    const isYT = host === 'youtube.com' || host.endsWith('.youtube.com') ||
                 host === 'youtube-nocookie.com' || host.endsWith('.youtube-nocookie.com') ||
                 host === 'youtu.be'
    if (!isYT) return

    (function() {
        'use strict';

        const DEBUG_CONFIG = {
          enabled: false,
          prefix: '[YouTube Ads-Bypass]'
        };

        const LANGS = {
            en: { wait_or_skip: 'Wait or Press Skip' },
            pl: { wait_or_skip: 'Czekaj lub nacisnij Pomin' }
        };

        const userLang = navigator.language.substring(0, 2);
        const LNG = (userLang in LANGS) ? LANGS[userLang] : LANGS.en;

        function log(message, type = 'log') {
            if (!DEBUG_CONFIG.enabled) return;
            if (type === 'error') console.error(`${DEBUG_CONFIG.prefix} ${message}`);
            else if (type === 'warn') console.warn(`${DEBUG_CONFIG.prefix} ${message}`);
            else if (type === 'info') console.info(`${DEBUG_CONFIG.prefix} ${message}`);
            else console.log(`${DEBUG_CONFIG.prefix} ${message}`);
        }

        log('Starting script...', 'info');

        const SELECTORS = {
            toHide: [
                '.ytp-ad-message-container',
                'ytd-player-legacy-desktop-watch-ads-renderer',
                'ytd-ad-slot-renderer',
                '#masthead-ad',
                'tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)',
                '.yt-mealbar-promo-renderer',
                '.ytp-ad-player-overlay-layout__player-card-container',
                '.ytp-ad-player-overlay-layout__ad-info-container',
                '.ytp-ad-player-overlay-layout__ad-disclosure-banner-container',
                '.ytp-ad-player-overlay',
                '.ad-showing > video',
                '.ad-interrupting > video',
                'div:has(> div#banner)',
                'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
                'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)',
                'ytmusic-mealbar-promo-renderer',
                'ytd-in-feed-ad-layout-renderer',
                '#player-ads',
                '.ytd-video-masthead-ad-v3-renderer',
                'ytd-ad-selection-preview-renderer',
                '.ytp-ad-image-overlay',
                '#root.yt-chips-search-renderer-header-v2',
                '.ytp-cued-thumbnail-overlay',
                '.ytp-ad-avatar',
                '.ytp-ad-button-vm'
            ],
            player: [
                '#movie_player',
                '.html5-video-player'
            ],
            adsClasses: [
                '.ad-showing',
                '.ad-interrupting',
                '.ytp-ad-player-overlay'
            ],
            skipButtons: [
                '.ytp-ad-skip-button-modern',
                '.ytp-skip-ad-button',
                '.ytp-ad-skip-button',
                '.ytp-ad-skip-button-slot',
                '.ytp-ad-skip-button-container'
            ]
        };

        const selector = {
            playerSpinner: '.ytp-spinner',
            adPlayerOverlay: '.ytp-ad-player-overlay-layout',
            cuedThumbOverlay: '.ytp-cued-thumbnail-overlay',
        };

        const selectors = Object.fromEntries(
           Object.entries(SELECTORS).map(([key, value]) => [key, value.join(', ')])
        );

        let player = null;
        let playerObserver = null;
        let video = null;
        let spinner = null;
        let cuedThumbOverlay = null;
        let lastSkipAttempt = 0;
        let isAdDetected = false;
        let stylesInjected = false;

        const injectStyles = () => {
            if (stylesInjected) return;
            stylesInjected = true;
            const style = document.createElement('style');
            style.textContent = `
                 @keyframes animateSkip {
                   0% {
                       transform: translate(-8px, 0);
                       opacity: 0;
                   }
                   25% {
                       opacity: 1;
                   }
                   75% {
                       opacity: 1;
                   }
                   100% {
                       transform: translate(30px, 0);
                       opacity: 0;
                   }
                }
                ${selectors.toHide} {
                    display: flex !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    height: 1px !important;
                    width: 1px !important;
                    overflow: hidden !important;
                }
                ${selectors.skipButtons} {
                    display: flex !important;
                    border: 1px solid yellow !important;
                    background-color: rgba(247,241,40,0.6) !important;
                    box-shadow: 0 0 20px #DD3 !important;
                    overflow: hidden !important;
                }
                .ytp-skip-ad {
                    display: flex !important;
                }
                .ytp-prev-button,
                .ytp-next-button {
                    display: flex !important;
                }
                .ad-simple-attributed-string {
                    visibility: hidden;
                }
                .ad-simple-attributed-string::before {
                    content: "${LNG.wait_or_skip}";
                    display: flex !important;
                    visibility: visible;
                    color: white;
                    width: 100% !important;
                    justify-content: center !important;
                    white-space: nowrap !important;
                }
                .ytp-skip-ad-button__icon {
                    transform: translate(-8px, 0);
                    animation: 1s linear 0s infinite animateSkip;
                }
            `;
            (document.head || document.documentElement).appendChild(style);
            log('Styles injected', 'info');
        };

        const isAdActive = () => {
            return (
                player.classList.contains('ad-showing') ||
                player.classList.contains('ad-interrupting') ||
                player.classList.contains('ytp-ad-player-overlay')
            );
        }

        const skipAction = () => {
            const overlay = player.querySelector(selector.adPlayerOverlay);
            if (overlay){
                overlay.style.display = '';
                overlay.setAttribute('style', '');
            }
            if (spinner){
                spinner.style.display = '';
                if (cuedThumbOverlay){
                    cuedThumbOverlay.style.display = 'none';
                }
            }
            if (video.style.display != 'none') {
                video.style.display = 'none';
            }
            if (!video.paused){
                log('Ad paused', 'info');
                video.pause();
                try { video.paused = true; } catch(e) {}
            }
            if (!video.muted) {
                video.muted = true;
                video.volume = 0;
                log('Ad muted', 'info');
            }
            if (video.playbackRate !== 2.0) {
                video.playbackRate = 2.0;
                log('Ad accelerated', 'info');
            }
            if (isFinite(video.duration) && video.duration > 0) {
                video.currentTime = video.duration - 0.1;
                log('Ad seekToEnd', 'info');
            }
            if (video.style.display == 'none') {
                video.style.display = 'block';
            }
            if (video.paused) {
                video.play();
                log('Ad play', 'info');
            }
        };

        const checkAndSkip = () => {
           if (!video || !video.isConnected) {
                video = document.querySelector('video');
            }
            if (!video || !player) return;

            const now = Date.now();
            if (now - lastSkipAttempt < 500) return;
            lastSkipAttempt = now;

            if (isAdActive()) {
                isAdDetected = true;
                log('SkipAd start', 'info');
                skipAction();
                log('SkipAd end', 'info');
            } else if (isAdDetected) {
                isAdDetected = false;
                video.style.display = 'block';
                if (spinner) {
                    spinner.style.display = 'none';
                    if (cuedThumbOverlay){
                        cuedThumbOverlay.style.display = 'none';
                    }
                    log('Hide spinner and cued thumbnail', 'info');
                }
                if (video.muted) {
                    video.muted = false;
                    log('Restore mute', 'info');
                }
                if (video.playbackRate > 1) {
                    video.playbackRate = 1;
                    log('Restore playRate', 'info');
                }
                log('Restore Play', 'info');
            }
        };

        const setupPlayerObserver = () => {
            const currentPlayer = document.querySelector(selectors.player);
            if (playerObserver && currentPlayer && currentPlayer !== player) {
                playerObserver.disconnect();
                playerObserver = null;
            }
            player = currentPlayer;

            if (player && !playerObserver) {
                playerObserver = new MutationObserver(() => checkAndSkip(player));
                playerObserver.observe(player, { attributes: true, attributeFilter: ['class'] });

                spinner = player.querySelector(selector.playerSpinner);
                cuedThumbOverlay = player.querySelector(selector.cuedThumbOverlay);

                checkAndSkip(player);
            }
        };

        window.addEventListener('yt-navigate-finish', setupPlayerObserver);
        window.addEventListener('yt-page-data-updated', setupPlayerObserver);
        window.addEventListener('load', (event) => {
            setupPlayerObserver();
        });

        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', (event) => {
                injectStyles();
            });
        } else {
            injectStyles();
        }

        let retry = 0;
        const fallback = setInterval(() => {
            log('attempt setupPlayerObserver:' + retry, 'info');
            setupPlayerObserver();
            if (playerObserver || retry > 10) clearInterval(fallback);
            retry++;
        }, 1000);

        log('Script loaded!', 'info');
    })();
  })();

  ;(function _nitrixYouTubeLegacyDisabled() {
    return;
    if (!_nitrixIsEnabled()) return
    if (!_nitrixIsBuiltIn()) return  // Wbudowane listy wyłączone
    const host = location.hostname
    const isYT = host === 'youtube.com' || host.endsWith('.youtube.com') ||
                 host === 'youtube-nocookie.com' || host.endsWith('.youtube-nocookie.com') ||
                 host === 'youtu.be'
    if (!isYT) return

    let video;
    let adMutedVideo = null;
    let fastForwardedAdVideo = null;
    let previousPlaybackRate = 1;
    let adStartedAt = 0;
    let lastSkipAt = 0;
    let lastUnskippableSkipAt = 0;
    let skipRetryTimer = null;
    // Selektory CSS elementów reklamowych w interfejsie
    const cssSelectorArr = [
        `#masthead-ad`,                                                                              // Baner reklamowy na górze strony głównej
        `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`, // Reklama w siatce wideo na stronie głównej
        `.video-ads.ytp-ad-module`,                                                                  // Reklama na dole odtwarzacza
        `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`,                                         // Okno promocji Premium na stronie odtwarzacza
        `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`,              // Reklamy polecane w prawym górnym rogu odtwarzacza
        `#related #player-ads`,                                                                      // Reklamy sponsorowane po prawej stronie komentarzy
        `#related ytd-ad-slot-renderer`,                                                             // Reklamy wideo po prawej stronie komentarzy
        `ytd-ad-slot-renderer`,                                                                      // Reklamy na stronie wyników wyszukiwania
        `yt-mealbar-promo-renderer`,                                                                 // Reklama polecająca Premium na stronie odtwarzacza
        `ytd-popup-container:has(a[href="/premium"])`,                                               // Popup blokujący z linkiem do Premium
        `ad-slot-renderer`,                                                                          // Reklamy zewnętrzne na stronie odtwarzacza (mobile)
        `ytm-companion-ad-renderer`,                                                                 // Link reklamy wideo do pominięcia (mobile)
    ];
    window.dev=false; // tryb deweloperski — false = wyłączony

    /**
    * Formatuje datę do czytelnego ciągu znaków
    * @param {Date} time obiekt Date
    * @return {String}
    */
    function moment(time) {
        // Pobierz rok, miesiąc, dzień, godzinę, minuty, sekundy
        let y = time.getFullYear()
        let m = (time.getMonth() + 1).toString().padStart(2, `0`)
        let d = time.getDate().toString().padStart(2, `0`)
        let h = time.getHours().toString().padStart(2, `0`)
        let min = time.getMinutes().toString().padStart(2, `0`)
        let s = time.getSeconds().toString().padStart(2, `0`)
        return `${y}-${m}-${d} ${h}:${min}:${s}`
    }

    /**
    * Wypisuje komunikat do konsoli (tylko w trybie dev)
    * @param {String} msg treść komunikatu
    * @return {undefined}
    */
    function log(msg) {
        if(!window.dev){
            return false;
        }
        console.log(window.location.href);
        console.log(`${moment(new Date())}  ${msg}`);
    }

    /**
    * Ustawia flagę uruchomienia (wstawia pusty element <style> z danym id)
    * @param {String} name nazwa flagi
    * @return {undefined}
    */
    function setRunFlag(name){
        let style = document.createElement(`style`);
        style.id = name;
        (document.head || document.body).appendChild(style); // Dołącz węzeł do HTML
    }

    /**
    * Pobiera flagę uruchomienia po nazwie
    * @param {String} name nazwa flagi
    * @return {undefined|Element}
    */
    function getRunFlag(name){
        return document.getElementById(name);
    }

    /**
    * Sprawdza czy flaga uruchomienia jest ustawiona; jeśli nie — ustawia ją
    * @param {String} name nazwa flagi
    * @return {Boolean}
    */
    function checkRunFlag(name){
        if(getRunFlag(name)){
            return true;
        }else{
            setRunFlag(name)
            return false;
        }
    }

    /**
    * Generuje element <style> usuwający reklamy z interfejsu i dołącza go do HTML
    * @param {String} id identyfikator elementu-flagi
    * @return {undefined}
    */
    function generateRemoveADHTMLElement(id) {
        // Jeśli już było uruchomione — wyjdź
        if (checkRunFlag(id)) {
            log(`Węzeł ukrywający reklamy interfejsu już istnieje`);
            return false
        }

        // Utwórz i dołącz element <style> z regułami CSS ukrywającymi reklamy
        let style = document.createElement(`style`); // Stwórz element style
        (document.head || document.body).appendChild(style); // Dołącz do HTML
        style.appendChild(document.createTextNode(generateRemoveADCssText(cssSelectorArr))); // Dodaj reguły CSS
        log(`Węzeł ukrywający reklamy interfejsu wygenerowany pomyślnie`);
    }

    /**
    * Generuje tekst CSS ukrywający elementy reklamowe
    * @param {Array} cssSelectorArr tablica selektorów CSS do ukrycia
    * @return {String}
    */
    function generateRemoveADCssText(cssSelectorArr){
        cssSelectorArr.forEach((selector,index)=>{
            cssSelectorArr[index]=`${selector}{display:none!important}`; // Ustaw display:none dla każdego selektora
        });
        return cssSelectorArr.join(` `); // Złącz w jeden ciąg
    }

    /**
    * Symuluje zdarzenie dotknięcia (dla urządzeń mobilnych)
    * @return {undefined}
    */
    function nativeTouch(){
        // Stwórz obiekt Touch
        let touch = new Touch({
            identifier: Date.now(),
            target: this,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        // Stwórz zdarzenie touchstart
        let touchStartEvent = new TouchEvent(`touchstart`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });

        // Wyślij zdarzenie touchstart do elementu docelowego
        this.dispatchEvent(touchStartEvent);

        // Stwórz zdarzenie touchend
        let touchEndEvent = new TouchEvent(`touchend`, {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        });

        // Wyślij zdarzenie touchend do elementu docelowego
        this.dispatchEvent(touchEndEvent);
    }


    /**
    * Pobiera element <video> z DOM
    * @return {undefined}
    */
    function getVideoDom(){
        video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`);
    }

    function isPlayerShowingAd(){
        return !!document.querySelector(`.ad-showing, .ytp-ad-player-overlay, .ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern`);
    }

    function restoreVideoAfterAd(){
        if (isPlayerShowingAd()) return;
        const mainVideo = document.querySelector(`video.html5-main-video`) || document.querySelector(`video`);
        const target = mainVideo || adMutedVideo;
        if (target && target === adMutedVideo) {
            try { target.muted = false } catch(e) {}
        }
        if (fastForwardedAdVideo) {
            try { fastForwardedAdVideo.playbackRate = previousPlaybackRate || 1 } catch(e) {}
        }
        adMutedVideo = null;
        fastForwardedAdVideo = null;
        previousPlaybackRate = 1;
        adStartedAt = 0;
    }

    function skipUnskippableAd(now){
        if (!video || !isPlayerShowingAd()) return;
        if (!adStartedAt) adStartedAt = now;
        if (now - adStartedAt < 900) return;
        if (now - lastUnskippableSkipAt < 1200) return;
        lastUnskippableSkipAt = now;

        try {
            if (fastForwardedAdVideo !== video) {
                fastForwardedAdVideo = video;
                previousPlaybackRate = Number(video.playbackRate) || 1;
            }
            if (!adMutedVideo) adMutedVideo = video;
            try { video.muted = true } catch(e) {}
            video.playbackRate = Math.max(Number(video.playbackRate) || 1, 16);
            if (video.paused) video.play().catch(() => {});
            _nitrixCountYTAd();
            log(`Przyspieszono reklame bez przycisku`);
        } catch(e) {}

        if (skipRetryTimer) clearTimeout(skipRetryTimer);
        skipRetryTimer = setTimeout(() => {
            skipRetryTimer = null;
            if (isPlayerShowingAd()) {
                getVideoDom();
                skipUnskippableAd(Date.now());
            } else {
                restoreVideoAfterAd();
            }
        }, 800);
    }


    /**
    * Automatycznie wznawia odtwarzanie po zakończeniu reklamy
    * @return {undefined}
    */
    function playAfterAd(){
        if(!video) return;
        restoreVideoAfterAd();
        if(!isPlayerShowingAd() && video.paused && video.currentTime<1){
            video.play();
            log(`Automatyczne wznowienie odtwarzania wideo`);
        }
    }


    /**
    * Usuwa popup blokujący YT i zamyka warstwę przesłaniającą (backdrop)
    * @return {undefined}
    */
    function closeOverlay(){
        // Usuń popup YT z linkiem do /premium
        const premiumContainers = [...document.querySelectorAll(`ytd-popup-container`)];
        const matchingContainers = premiumContainers.filter(container => container.querySelector(`a[href="/premium"]`));

        if(matchingContainers.length>0){
            matchingContainers.forEach(container => container.remove());
            log(`Usunięto blokujący popup YT`);
        }

        // Pobierz wszystkie elementy backdrop
        const backdrops = document.querySelectorAll(`tp-yt-iron-overlay-backdrop`);
        // Znajdź backdrop z konkretnym z-index
        const targetBackdrop = Array.from(backdrops).find(
            (backdrop) => backdrop.style.zIndex === `2201`
        );
        // Jeśli znaleziono — wyczyść klasy i usuń atrybut opened
        if (targetBackdrop) {
            targetBackdrop.className = ``; // Wyczyść wszystkie klasy
            targetBackdrop.removeAttribute(`opened`); // Usuń atrybut opened
            log(`Zamknięto warstwę przesłaniającą`);
        }
    }


    // ── Licznik zablokowanych reklam YT ─────────────────────────────
    function _nitrixCountYTAd() {
        _nitrixTrack('youtube.com/ad-skipped', 'yt-skip')
    }

    /**
    * Pomija reklamę wideo — klika przycisk "pomiń" lub wymusza koniec reklamy
    * @return {undefined}
    */
    function skipAd(mutationsList, observer) {
        const skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-skip-ad-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
        const shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`) || document.querySelector(`.ytp-ad-button-icon`) || document.querySelector(`.ad-showing`);
        const adShowing = isPlayerShowingAd();
        const now = Date.now();

        if (!adShowing) {
            restoreVideoAfterAd();
            return;
        }
        if (!adStartedAt) adStartedAt = now;

        if((skipButton || shortAdMsg) && window.location.href.indexOf(`https://m.youtube.com/`) === -1){ // Na mobile wyciszanie powoduje bug
            if(video && !adMutedVideo) {
                adMutedVideo = video;
                try { video.muted = true } catch(e) {}
            }
        }

        if(skipButton){
            if (now - lastSkipAt < 1200) return;
            lastSkipAt = now;
            skipButton.click();            // PC — klik myszą
            nativeTouch.call(skipButton);  // Mobile — symulacja dotyku
            _nitrixCountYTAd()
            log(`Kliknięto przycisk pomijania reklamy`);
            if (skipRetryTimer) clearTimeout(skipRetryTimer);
            skipRetryTimer = setTimeout(() => {
                skipRetryTimer = null;
                if (isPlayerShowingAd()) skipAd();
                else restoreVideoAfterAd();
            }, 1500);
        }else if(shortAdMsg){
            skipUnskippableAd(now);
            log(`Wykryto reklame bez przycisku - bez przeskoku czasu`);
        }

    }

    /**
    * Uruchamia MutationObserver wykrywający i usuwający reklamy wideo
    * @return {undefined}
    */
    function removePlayerAD(id){
        // Jeśli już uruchomiony — wyjdź
        if (checkRunFlag(id)) {
            log(`Funkcja usuwania reklam wideo już działa`);
            return false
        }

        // Obserwuj zmiany w body i reaguj na reklamy
        const targetNode = document.body; // Obserwuj bezpośrednio body
        const config = {childList: true, subtree: true }; // Obserwuj węzeł i całe jego poddrzewo
        let pending = false;
        const observer = new MutationObserver(()=>{
            if (!_nitrixIsEnabled() || !_nitrixIsBuiltIn()) return; // Nie działaj gdy adblocker wyłączony
            if (pending) return;
            pending = true;
            setTimeout(() => {
                pending = false;
                getVideoDom();closeOverlay();skipAd();playAfterAd();
            }, 250);
        }); // Obsługa reklam wideo
        observer.observe(targetNode, config); // Rozpocznij obserwację
        log(`Funkcja usuwania reklam wideo uruchomiona pomyślnie`);
    }

    /**
    * Funkcja główna — uruchamia wszystkie mechanizmy blokowania reklam YT
    */
    function main(){
        generateRemoveADHTMLElement(`removeADHTMLElement`); // Ukryj reklamy interfejsu
        removePlayerAD(`removePlayerAD`);                   // Usuń reklamy wideo
    }

    if (document.readyState === `loading`) {
        document.addEventListener(`DOMContentLoaded`, main); // DOM jeszcze się ładuje — czekamy
        log(`Skrypt blokowania reklam YT — oczekuje na DOMContentLoaded`);
    } else {
        main(); // DOM już gotowy — uruchamiamy natychmiast
        log(`Skrypt blokowania reklam YT — szybkie uruchomienie`);
    }

    let resumeVideo = () => {
        const videoelem = document.body.querySelector('video.html5-main-video')
        if (videoelem && videoelem.paused) {
             console.log('resume video')
             videoelem.play()
        }
    }

    let removePop = node => {
        const elpopup = node.querySelector('.ytd-popup-container > .ytd-popup-container > .ytd-enforcement-message-view-model')

        if (elpopup) {
            elpopup.parentNode.remove()
            console.log('remove popup', elpopup)
            const bdelems = document
                .getElementsByTagName('tp-yt-iron-overlay-backdrop')
            for (var x = (bdelems || []).length; x--;)
                bdelems[x].remove()
            resumeVideo()
        }

        if (node.tagName.toLowerCase() === 'tp-yt-iron-overlay-backdrop') {
            node.remove()
            resumeVideo()
            console.log('remove backdrop', node)
        }
    }

    let obs = new MutationObserver(mutations => {
        if (!_nitrixIsEnabled() || !_nitrixIsBuiltIn()) return; // Nie działaj gdy adblocker wyłączony
        mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            Array.from(mutation.addedNodes)
                .filter(node => node.nodeType === 1)
                .map(node => removePop(node))
        }
    })})

    // Obserwuj zmiany w body w poszukiwaniu popupów enforcement
    if (document.body) {
        obs.observe(document.body, {
            childList: true,
            subtree: true
        })
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            obs.observe(document.body, {
                childList: true,
                subtree: true
            })
        }, { once: true })
    }
})();

  // ════════════════════════════════════════════════════════════════════
  //  CSS VIDEO ADS — ukrywanie kontenerów reklam wideo na innych stronach
  // ════════════════════════════════════════════════════════════════════
  if (_nitrixIsEnabled() && _nitrixIsBuiltIn()) try {
    const vAdCss = document.createElement('style')
    vAdCss.id = '__nitrix_vads'
    vAdCss.textContent = `
      /* VideoJS ad containers */
      .vjs-ad-loading, .vjs-ad-playing, .vjs-ads-loading,
      .vjs-ad-control-bar, .vjs-ima-ads-manager,
      .vjs-ad-display, .ima-ad-container, .bmpui-ui-ad-ui,
      /* JW Player */
      .jw-ad-container, .jw-ad-badge, .jw-nextup-container.jw-nextup-sticky,
      .jw-ima-ad-container,
      /* Generic video ad overlays */
      [class*="video-ad"]:not(video), [id*="video-ad"]:not(video),
      [class*="VideoAd"]:not(video), [id*="VideoAd"]:not(video),
      [class*="videoAd"]:not(video), [id*="videoAd"]:not(video),
      [class*="preroll"]:not(video), [id*="preroll"]:not(video),
      [class*="midroll"]:not(video), [id*="midroll"]:not(video),
      .ad-overlay-video, .video-overlay-ad,
      /* Onet / WP video reklamy */
      .onet-player__ad-container, .wp-player__ad,
      [class*="AdContainer"]:not(video), [class*="ad-slot-video"],
      /* Brightcove / Kaltura */
      .bc-player-wrapper .vjs-ad-playing .vjs-ad-control-bar,
      .kaltura-player .ad-container,
      /* Generyczne kontenery "skip" */
      .skip-ad-button, [class*="skip-ad"], [id*="skip-ad"],
      [class*="skipAd"], [id*="skipAd"]
      { display:none !important; visibility:hidden !important; }
    `
    ;(document.head || document.documentElement).appendChild(vAdCss)
  } catch(e) {}
  if (_nitrixIsEnabled() && _nitrixIsBuiltIn()) try {
    const s = document.createElement('style')
    s.id = '__nitrix_css'
    s.textContent = `
      [class*="adblock"],[id*="adblock"],[class*="adblocker"],[id*="adblocker"],
      [class*="anti-adblock"],[class*="antiAdblock"],[class*="noAdblock"],
      [class*="blockAdblock"],[class*="adblock-wall"],[class*="adblock-gate"],
      [class*="adblock-modal"],[class*="adblock-overlay"],[class*="adblock-notice"],
      [data-adblock-gate],[data-adblock-wall],
      .onetAdbGate,.onet-adb-gate,.onet-adblock,
      .wp-adblock-gate,.wp-adblock,[class*="adbGate"],
      .adblock-screen,.adblock-screen-wrapper,
      [class*="ab-modal"],[id*="ab-modal"],
      [class*="abwall"],[id*="abwall"] {
        display:none !important; visibility:hidden !important;
        opacity:0 !important; pointer-events:none !important;
      }
      html.adblock-detected, body.adblock-detected,
      html.no-ads, body.no-ads {
        overflow:auto !important; height:auto !important;
      }
    `
    ;(document.head || document.documentElement).appendChild(s)
  } catch(e) {}

  // ════════════════════════════════════════════════════════════════════
  //  OVERLAY DETECTION + MutationObserver
  // ════════════════════════════════════════════════════════════════════
  const OVERLAY_KW = ['adblock','adblocker','anti-ad','antiad','adb-gate','adbgate','adwall','ad-wall','ab-modal','abwall']

  function isOverlay(el) {
    if (!el || el.nodeType !== 1) return false
    const s = ((el.className && typeof el.className === 'string' ? el.className : '') + ' ' + (el.id || '')).toLowerCase()
    return OVERLAY_KW.some(k => s.includes(k))
  }

  function hideOverlay(el) {
    if (!el || el._nitrixHide) return
    el.style.setProperty('display',    'none',   'important')
    el.style.setProperty('visibility', 'hidden', 'important')
    el.style.setProperty('opacity',    '0',      'important')
    el._nitrixHide = true
    try { document.body.style.removeProperty('overflow') } catch(e) {}
    try { document.documentElement.style.removeProperty('overflow') } catch(e) {}
  }

  function scanOverlays(root) {
    if (!_nitrixIsEnabled() || !_nitrixIsBuiltIn()) return
    try {
      for (const el of root.querySelectorAll('*')) if (isOverlay(el)) hideOverlay(el)
    } catch(e) {}
  }

  // ════════════════════════════════════════════════════════════════════
  //  READER MODE
  // ════════════════════════════════════════════════════════════════════
  // Tłumaczenia reader mode — czytane LAZY (w momencie użycia, nie przy starcie)
  // window.__nitrix_lang jest wstrzykiwane przez main.js via executeJavaScript po did-finish-load
  const READER_T = {
    pl: {
      mode: 'Tryb czytnika', back: 'Wróć do strony',
      no_content: 'Nie udało się wyodrębnić treści tej strony.',
      btn: 'Nie tracę czasu, przeglądam dalej',
    },
    en: {
      mode: 'Reader mode', back: 'Back to site',
      no_content: 'Could not extract content from this page.',
      btn: 'Skip the noise, keep reading',
    },
  }
  function rt(key) {
    const lang = (typeof window.__nitrix_lang === 'string' && window.__nitrix_lang) || 'pl'
    return (READER_T[lang] || READER_T.pl)[key] || READER_T.pl[key]
  }

  let readerBtnShown = false

  function getPageTitle() {
    try {
      return document.querySelector('h1')?.textContent?.trim()
        || document.title?.split(/[-|–]/)[0]?.trim()
        || document.title
    } catch(e) { return document.title || '' }
  }

  function extractMainContent() {
    const candidates = [
      'article','main','[role="main"]',
      '.article-body','.article__body','.article-content','.article__content',
      '.entry-content','.post-content','.story-content','.news-content',
      '.content-body','.main-content','.page-content',
      '#article-body','#article-content','#main-content','#content',
    ]
    for (const sel of candidates) {
      try {
        const el = document.querySelector(sel)
        if (el && el.innerText && el.innerText.trim().length > 200) return el
      } catch(e) {}
    }
    let best = null, bestLen = 0
    try {
      for (const el of document.querySelectorAll('div, section')) {
        const len = (el.innerText || '').trim().length
        if (len > bestLen && el.offsetHeight > 100) { bestLen = len; best = el }
      }
    } catch(e) {}
    return best
  }

  function activateReaderMode() {
    const content  = extractMainContent()
    const title    = getPageTitle()
    const pageUrl  = location.href
    const hostname = (() => { try { return new URL(pageUrl).hostname } catch(e) { return pageUrl } })()

    // Pomocnik: wyciągnij prawdziwy src obrazu (obsługa lazy-load)
    function getRealSrc(img) {
      const lazySrc = img.dataset.src || img.dataset.lazySrc || img.dataset.original ||
        img.dataset.lazy || img.getAttribute('data-src') || img.getAttribute('data-lazy') ||
        img.getAttribute('data-original') ||
        (img.getAttribute('data-srcset') || '').split(/[\s,]+/).filter(Boolean)[0] ||
        (img.srcset || '').split(/[\s,]+/).filter(Boolean)[0] || ''
      if (img.src && !img.src.startsWith('data:') && img.src !== location.href) return img.src
      return lazySrc
    }

    // Pomocnik: czy obraz jest za mały żeby go pokazać (ikony, avatary itp.)
    function isTooSmall(img) {
      const w = img.naturalWidth  || parseInt(img.getAttribute('width'))  || 0
      const h = img.naturalHeight || parseInt(img.getAttribute('height')) || 0
      if (w === 0 && h === 0) return false  // nieznane wymiary (lazy) — nie odrzucaj
      return w < 80 || h < 80
    }

    // Zbierz elementy w ORYGINALNEJ kolejności — tekst i media razem
    const elements = content
      ? [...content.querySelectorAll(
          'p, h2, h3, h4, blockquote, figure, picture, img, video, ' +
          'iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[src*="vimeo"]'
        )]
      : []

    const seen = new Set()
    const bodyHTML = elements.map(el => {
      if (seen.has(el)) return ''
      seen.add(el)
      const tag = el.tagName
      if (tag === 'P') {
        const t = el.innerText?.trim()
        if (!t || t.length < 8) return ''
        return `<p>${el.innerHTML}</p>`
      }
      if (/^H[2-4]$/.test(tag)) {
        const t = el.textContent?.trim()
        return t ? `<${tag.toLowerCase()}>${t}</${tag.toLowerCase()}>` : ''
      }
      if (tag === 'BLOCKQUOTE') return `<blockquote>${el.innerHTML}</blockquote>`
      if (tag === 'FIGURE') {
        const img = el.querySelector('img')
        if (!img) return ''
        seen.add(img)
        const src = getRealSrc(img)
        if (!src || isTooSmall(img)) return ''
        const cap = el.querySelector('figcaption')?.textContent?.trim() || ''
        return `<figure><img src="${src}" alt="${img.alt||''}" loading="lazy">${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`
      }
      if (tag === 'PICTURE') {
        const img = el.querySelector('img')
        if (!img) return ''
        seen.add(img)
        const src = getRealSrc(img) ||
          (el.querySelector('source[srcset]')?.getAttribute('srcset') || '').split(/[\s,]+/).filter(Boolean)[0] || ''
        if (!src || isTooSmall(img)) return ''
        return `<figure><img src="${src}" alt="${img.alt||''}" loading="lazy"></figure>`
      }
      if (tag === 'IMG') {
        if (el.closest('figure') || el.closest('picture')) return ''
        const src = getRealSrc(el)
        if (!src || isTooSmall(el)) return ''
        return `<figure><img src="${src}" alt="${el.alt||''}" loading="lazy"></figure>`
      }
      if (tag === 'VIDEO') {
        const src = el.currentSrc || el.getAttribute('src') || el.querySelector('source')?.getAttribute('src') || ''
        const poster = el.getAttribute('poster') || ''
        if (!src && !poster) return ''
        const srcAttr = src ? ` src="${src}"` : ''
        const posterAttr = poster ? ` poster="${poster}"` : ''
        return `<video${srcAttr}${posterAttr} controls playsinline style="max-width:100%;border-radius:8px;display:block;margin:18px 0"></video>`
      }
      if (tag === 'IFRAME') {
        const src = el.src || ''
        return src ? `<div class="video-wrap"><iframe src="${src}" allowfullscreen></iframe></div>` : ''
      }
      return ''
    }).join('')

    const readerHTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
    :root {
      --bg: #202124; --surface: #292a2d; --input-bg: #303134;
      --border: #5f6368; --text: #e8eaed; --text-dim: #9aa0a6;
      --accent: #8ab4f8; --hover: #3c4043;
    }
    html { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; font-size: 17px; line-height: 1.75; -webkit-font-smoothing: antialiased }
    body { max-width: 740px; margin: 0 auto; padding: 68px 24px 80px }
    .topbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
      height: 42px; display: flex; align-items: center; justify-content: space-between;
      background: #202124; border-bottom: 1px solid rgba(255,255,255,.08);
      padding: 0 16px;
    }
    .topbar-left { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text-dim) }
    .topbar-logo { color: var(--accent); font-weight: 600 }
    .topbar-sep { color: var(--border) }
    .exit-btn {
      padding: 6px 14px; border: 1px solid var(--border); border-radius: 8px;
      background: var(--surface); color: var(--text-dim);
      font-size: 12.5px; font-family: inherit; cursor: pointer;
      display: flex; align-items: center; gap: 6px;
      transition: background .12s, color .12s;
    }
    .exit-btn:hover { background: var(--hover); color: var(--text) }
    .exit-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round }
    header { margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,.08) }
    .reader-label { font-size: 11px; color: var(--text-dim); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 8px }
    h1 { font-size: clamp(1.3rem, 3.5vw, 1.85rem); line-height: 1.3; font-weight: 600 }
    h2 { font-size: 1.2rem; font-weight: 600; margin: 26px 0 8px }
    h3 { font-size: 1.05rem; font-weight: 600; margin: 20px 0 6px }
    h4 { font-size: .95rem; font-weight: 600; margin: 16px 0 5px; color: var(--text-dim) }
    p { margin: 0 0 15px }
    blockquote { border-left: 2px solid var(--accent); padding: 8px 16px; margin: 20px 0; color: var(--text-dim); font-style: italic; background: var(--surface); border-radius: 0 6px 6px 0 }
    a { color: var(--accent); text-decoration: none }
    a:hover { text-decoration: underline }
    figure { margin: 18px 0 }
    figure img { max-width: 100%; border-radius: 8px; display: block; border: 1px solid rgba(255,255,255,.08) }
    figcaption { font-size: 12px; color: var(--text-dim); margin-top: 6px; text-align: center }
    video { max-width: 100%; border-radius: 8px; display: block; margin: 18px 0 }
    .video-wrap { position: relative; padding-top: 56.25%; margin: 18px 0; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,.08) }
    .video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none }
  </style>
</head>
<body>
  <nav class="topbar">
    <div class="topbar-left">
      <span class="topbar-logo">Nitrix</span>
      <span class="topbar-sep">·</span>
      <span>${rt('mode')}</span>
      <span class="topbar-sep">·</span>
      <span>${hostname}</span>
    </div>
    <button class="exit-btn" onclick="history.back()">
      <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
      ${rt('back')}
    </button>
  </nav>
  <header>
    <div class="reader-label">${rt('mode')}</div>
    <h1>${title}</h1>
  </header>
  <div class="content">${bodyHTML || `<p style="color:var(--text-dim)">${rt('no_content')}</p>`}</div>
</body>
</html>`

    document.open()
    document.write(readerHTML)
    document.close()
    history.replaceState({ nitrixReader: true }, title, location.href)
  }

  function showReaderButton() {
    if (readerBtnShown) return
    readerBtnShown = true

    const btn = document.createElement('button')
    btn.id = '__nitrix_reader_btn'
    btn.style.cssText = [
      'position:fixed', 'bottom:28px', 'right:28px', 'z-index:2147483647',
      'display:flex', 'align-items:center', 'gap:8px',
      'padding:10px 16px',
      'border:1px solid #5f6368', 'border-radius:10px',
      'background:#292a2d', 'color:#9aa0a6',
      'font-size:13px', "font-family:'Segoe UI',system-ui,sans-serif",
      'cursor:pointer',
      'box-shadow:0 4px 16px rgba(0,0,0,.45)',
      'transition:background .12s,color .12s',
      'white-space:nowrap', 'outline:none', 'user-select:none',
    ].join(';')

    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8ab4f8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      <span>${rt('btn')}</span>
    `
    btn.addEventListener('mouseenter', () => { btn.style.background = '#3c4043'; btn.style.color = '#e8eaed' })
    btn.addEventListener('mouseleave', () => { btn.style.background = '#292a2d'; btn.style.color = '#9aa0a6' })
    btn.addEventListener('click', activateReaderMode)

    try { document.body.appendChild(btn) } catch(e) {}
  }

  // ════════════════════════════════════════════════════════════════════
  //  ADBLOCK TEXT DETECTION
  // ════════════════════════════════════════════════════════════════════
  const ADBLOCK_PHRASES = [
    'korzystasz z narzędzia blokującego reklamy',
    'korzystasz z adblocka','korzystasz z adblockera',
    'używasz adblocka','używasz adblockera','używasz blokady reklam',
    'wykryliśmy adblocka','wykryliśmy blokadę reklam',
    'wykryto adblocka','wykryto blokadę reklam',
    'wykryto blokowanie reklam','wykryliśmy blokowanie reklam',
    'blokowanie reklam','blokujesz reklamy','blokujesz nasze reklamy',
    'bloker reklam','blokada reklam',
    'wyłącz adblocka','wyłącz adblockera','wyłącz blokadę reklam',
    'wyłącz blokowanie reklam','wyłącz adblock',
    'prosimy o wyłączenie','prosimy wyłącz',
    'zablokowane przez adblocka','nie widzisz zawartości tej strony',
    'nie widzisz reklam','adblocker uniemożliwia','wyłącz wtyczkę blokującą',
    'reklamy pozwalają nam','reklamy umożliwiają nam','dzięki reklamom',
    'bez reklam nie możemy','finansujemy się z reklam',
    'wspieraj nas wyłączając','wspieraj serwis wyłączając',
    'zezwól na reklamy','zezwól na wyświetlanie reklam',
    'dodaj do wyjątków','dodaj nas do wyjątków','whitelist','biała lista',
    'disable your ad blocker','disable adblock',
    'ad blocker detected','adblock detected','adblock is on',
    'we detected an ad blocker','please disable your adblocker',
    'your ad blocker is on','turn off your ad blocker',
    'you are using an ad blocker','ads help us','we rely on ads',
    'please allow ads','allow ads on this site','add us to whitelist',
  ]

  function pageContainsAdblockText() {
    try {
      const t = (document.body?.innerText || '').toLowerCase()
      return ADBLOCK_PHRASES.some(p => t.includes(p))
    } catch(e) { return false }
  }

  function checkForAdblockWall() {
    if (!_nitrixIsEnabled() || !_nitrixIsBuiltIn()) return
    if (readerBtnShown) return
    if (pageContainsAdblockText()) { showReaderButton(); return }
    for (const el of document.querySelectorAll('*')) {
      if (!isOverlay(el)) continue
      try {
        const r = el.getBoundingClientRect()
        if (r.width < 100 || r.height < 100) continue
        const s = window.getComputedStyle(el)
        if (s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0) {
          showReaderButton(); return
        }
      } catch(e) {}
    }
  }

  // ════════════════════════════════════════════════════════════════════
  //  MUTATIONOBSERVER
  // ════════════════════════════════════════════════════════════════════
  const overlayObserver = new MutationObserver(mutations => {
    if (!_nitrixIsEnabled() || !_nitrixIsBuiltIn()) return
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue
        if (isOverlay(n)) hideOverlay(n)
        try { for (const k of n.querySelectorAll('*')) if (isOverlay(k)) hideOverlay(k) } catch(e) {}
      }
      if (m.type === 'attributes' && m.target) {
        const t = m.target
        if (isOverlay(t)) hideOverlay(t)
        if (t === document.body || t === document.documentElement) {
          t.style.removeProperty('overflow')
          t.style.removeProperty('height')
        }
      }
    }
    if (!readerBtnShown) checkForAdblockWall()
  })

  // ════════════════════════════════════════════════════════════════════
  //  INICJALIZACJA
  // ════════════════════════════════════════════════════════════════════
  function init() {
    scanOverlays(document.documentElement)
    overlayObserver.observe(document.documentElement, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['class', 'id', 'style'],
    })
    setTimeout(checkForAdblockWall, 1200)
    setTimeout(checkForAdblockWall, 3000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }

  window.addEventListener('load', () => {
    scanOverlays(document.documentElement)
    setTimeout(checkForAdblockWall, 800)
  }, { once: true })



  // Wlasne filtry kosmetyczne uzytkownika (Moje Filtry ##selector)
  ;(function applyUserCosmeticFilters() {
    var rules = window.__nitrix_adb && window.__nitrix_adb.customCosmeticRules
    if (!Array.isArray(rules) || !rules.length) return
    var id = '__nitrix_user_cosmetic'
    if (document.getElementById(id)) return
    var style = document.createElement('style')
    style.id = id
    var css = rules.map(function(sel) {
      try { document.querySelector(sel); return sel + '{display:none!important;visibility:hidden!important}' }
      catch(e) { return '' }
    }).filter(Boolean).join('\n')
    if (!css) return
    style.textContent = css
    ;(document.head || document.documentElement).appendChild(style)
  })()

  // Filtry kosmetyczne EasyList Cookie — wstrzykuj CSS, bez masowego trackingu
  ;(function applyCookieCosmeticFilters() {
    if (!_nitrixIsEnabled()) return
    var rules = window.__nitrix_adb && window.__nitrix_adb.cookieCosmeticRules
    if (!Array.isArray(rules) || !rules.length) return
    var id = '__nitrix_cookie_cosmetic'
    if (document.getElementById(id)) return
    var style = document.createElement('style')
    style.id = id
    var css = rules.map(function(sel) {
      try { document.querySelector(sel); return sel + '{display:none!important;visibility:hidden!important}' }
      catch(e) { return '' }
    }).filter(Boolean).join('\n')
    if (!css) return
    style.textContent = css
    ;(document.head || document.documentElement).appendChild(style)
  })()
})()
