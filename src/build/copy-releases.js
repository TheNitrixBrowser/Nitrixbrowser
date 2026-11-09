#!/usr/bin/env node
'use strict'

/**
 * Kopiuje JUZ OPUBLIKOWANE release'y z:
 *     TheNitrixBrowser/autoaktualizacjenitrix
 * do:
 *     TheNitrixBrowser/Nitrixbrowser
 *
 * Zrodlo zostaje nietkniete - to zwykla kopia (GitHub nie ma "przenoszenia"
 * releasow miedzy repozytoriami).
 *
 * Uzycie:
 *   cmd.exe:  set GH_TOKEN=twoj_token
 *   bash:     export GH_TOKEN=twoj_token
 *
 *   node build/copy-releases.js --dry-run   # podglad, nic nie tworzy
 *   node build/copy-releases.js             # wlasciwe kopiowanie
 *   node build/copy-releases.js --tags=v2.0.0-beta,v2.0.1-beta,v2.1.0-beta
 *                                           # kopiuj tylko wybrane wersje
 *   node build/copy-releases.js --notes-only # dopisz oryginalne daty do opisow
 *                                           # juz skopiowanych releasow
 *   node build/copy-releases.js --reset     # USUN wszystkie release'y (i tagi)
 *                                           # w repo docelowym i skopiuj od nowa
 *
 * Zasady, ktore ten skrypt pilnuje:
 *  - kopiuje od najstarszego do najnowszego,
 *  - kazda kopia ma "make_latest: false", ale GitHub i tak wskazuje jakis
 *    release jako "Latest" (najnowszy opublikowany), dlatego kopiuj PRZED
 *    wydaniem 2.1.1 - wtedy 2.1.1 opublikowane na koncu zostaje Latest,
 *  - release powstaje jako szkic, pliki sa wgrywane, a publikowany jest
 *    dopiero na koncu (jesli wszystkie pliki sie udaly),
 *  - jest idempotentny: opublikowany tag jest pomijany, a PRZERWANY szkic jest
 *    dokanczany (dogrywane sa tylko brakujace pliki) - wazne przy 1,8 GB,
 *  - data publikacji: GitHub nie pozwala ustawic jej wstecz, wiec oryginalna
 *    data z repo zrodlowego trafia na koniec opisu wydania.
 */

const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { Readable } = require('node:stream')
const { pipeline } = require('node:stream/promises')

const API = 'https://api.github.com'
const UPLOADS = 'https://uploads.github.com'
const SRC = { owner: 'TheNitrixBrowser', repo: 'autoaktualizacjenitrix' }
const DST = { owner: 'TheNitrixBrowser', repo: 'Nitrixbrowser' }

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || ''
const dryRun = process.argv.includes('--dry-run')
const tagsArg = process.argv.find(a => a.startsWith('--tags='))
const onlyTags = tagsArg
  ? new Set(tagsArg.slice('--tags='.length).split(',').map(s => s.trim()).filter(Boolean))
  : null
const notesOnly = process.argv.includes('--notes-only')
const reset = process.argv.includes('--reset')

function baseHeaders() {
  const h = { 'User-Agent': 'nitrix-copy-releases' }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...baseHeaders(), ...(options.headers || {}) },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let hint = ''
    if (res.status === 401) hint = ' - token nieprawidlowy lub wygasl'
    else if (res.status === 404) hint = ' - brak dostepu (token bez tego repo?) albo zla nazwa'
    else if (res.status === 403) hint = ' - brak uprawnien lub limit API'
    throw new Error(`${options.method || 'GET'} ${url} -> ${res.status}${hint}\n${text.slice(0, 500)}`)
  }
  return res
}

async function listReleases(repo) {
  const all = []
  for (let page = 1; page <= 10; page++) {
    const res = await api(`${API}/repos/${repo.owner}/${repo.repo}/releases?per_page=100&page=${page}`)
    const batch = await res.json()
    all.push(...batch)
    if (batch.length < 100) break
  }
  return all
}

function compareTags(a, b) {
  const parse = t => String(t).replace(/^v/i, '').split('-')[0].split('.').map(n => parseInt(n, 10) || 0)
  const A = parse(a)
  const B = parse(b)
  for (let i = 0; i < 3; i++) {
    const x = A[i] || 0
    const y = B[i] || 0
    if (x !== y) return x - y
  }
  const preA = String(a).includes('-')
  const preB = String(b).includes('-')
  if (preA !== preB) return preA ? -1 : 1
  return String(a).localeCompare(String(b))
}

async function downloadToFile(url, file) {
  // Repozytoria sa publiczne, wiec pobieramy bez naglowka Authorization
  // (przekierowanie na S3 nie lubi podpisanego naglowka).
  const res = await fetch(url, {
    headers: { 'User-Agent': 'nitrix-copy-releases' },
    redirect: 'follow',
  })
  if (!res.ok || !res.body) throw new Error(`pobieranie ${url} -> ${res.status}`)
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(file))
}

async function uploadAsset(releaseId, asset, tmpDir) {
  const tmp = path.join(tmpDir, asset.name)
  process.stdout.write(`      ${asset.name} (${(asset.size / 1048576).toFixed(1)} MB): pobieram... `)
  await downloadToFile(asset.browser_download_url, tmp)
  const size = fs.statSync(tmp).size
  process.stdout.write('wysylam... ')
  try {
    await api(`${UPLOADS}/repos/${DST.owner}/${DST.repo}/releases/${releaseId}/assets?name=${encodeURIComponent(asset.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(size) },
      body: Readable.toWeb(fs.createReadStream(tmp)),
      duplex: 'half',
    })
    console.log('ok')
  } finally {
    fs.rmSync(tmp, { force: true })
  }
}

async function main() {
  if (!dryRun && !token) {
    console.error('BLAD: ustaw GH_TOKEN (albo GITHUB_TOKEN) przed uruchomieniem.')
    console.error('  cmd.exe:  set GH_TOKEN=twoj_token')
    console.error('  bash:     export GH_TOKEN=twoj_token')
    process.exit(1)
  }

  const src = (await listReleases(SRC))
    .filter(r => !r.draft)
    .filter(r => !onlyTags || onlyTags.has(r.tag_name))
    .sort((a, b) => compareTags(a.tag_name, b.tag_name))

  if (src.length === 0) {
    console.log('Brak opublikowanych releasow w repo zrodlowym (albo zadny nie pasuje do --tags).')
    return
  }

  if (onlyTags) {
    const found = new Set(src.map(r => r.tag_name))
    const missing = [...onlyTags].filter(t => !found.has(t))
    if (missing.length) console.log(`UWAGA: nie znaleziono tagow: ${missing.join(', ')}`)
  }

  const dst = await listReleases(DST)
  const existingByTag = new Map(dst.map(r => [r.tag_name, r]))
  const dstInfo = await (await api(`${API}/repos/${DST.owner}/${DST.repo}`)).json()
  const targetCommitish = dstInfo.default_branch || 'main'

  console.log(`Zrodlo: ${SRC.owner}/${SRC.repo} - ${src.length} releasow`)
  console.log(`Cel   : ${DST.owner}/${DST.repo} - ${dst.length} juz istnieje`)
  if (dryRun) console.log('TRYB PODGLADU (--dry-run): nic nie zostanie utworzone.')
  console.log('Przerwane kopiowanie mozna wznowic: szkice w repo docelowym sa dokanczane, nie pomijane.')

  if (reset) {
    if (dst.length === 0) {
      console.log('Reset: repo docelowe nie ma zadnych releasow, nie ma czego usuwac.')
    } else {
      console.log(`Reset: ${dryRun ? 'usunalbym' : 'usuwam'} ${dst.length} releasow z ${DST.owner}/${DST.repo}:`)
      for (const rel of dst) {
        console.log(`  - ${rel.tag_name}${rel.draft ? ' (szkic)' : ''}`)
        if (dryRun) continue
        await api(`${API}/repos/${DST.owner}/${DST.repo}/releases/${rel.id}`, { method: 'DELETE' })
        try {
          await api(`${API}/repos/${DST.owner}/${DST.repo}/git/refs/tags/${encodeURIComponent(rel.tag_name)}`, { method: 'DELETE' })
        } catch (e) {
          // tag mogl nie istniec - to nie blokuje kopiowania
        }
      }
      existingByTag.clear()
      console.log(dryRun ? 'Reset (podglad): po usunieciu repo byloby puste.\n' : 'Reset: gotowe, repo docelowe jest puste.\n')
    }
  }

  if (notesOnly) {
    let updated = 0
    let alreadyOk = 0

    for (const rel of src) {
      const target = existingByTag.get(rel.tag_name)
      if (!target) {
        console.log(`- ${rel.tag_name}: brak w repo docelowym, pomijam`)
        continue
      }
      const originalDate = String(rel.published_at || rel.created_at || '').slice(0, 10)
      const line = originalDate ? `_Pierwotnie opublikowano: ${originalDate}._` : ''
      const current = (target.body || '').trim()

      if (!line || current.includes('Pierwotnie opublikowano')) {
        console.log(`- ${rel.tag_name}: opis juz zawiera date, pomijam`)
        alreadyOk++
        continue
      }

      console.log(`- ${rel.tag_name}: dopisuje "${line}"`)
      if (dryRun) continue

      await api(`${API}/repos/${DST.owner}/${DST.repo}/releases/${target.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: [current, line].filter(Boolean).join('\n\n') }),
      })
      updated++
    }

    console.log(`\nGotowe: opisow uaktualnionych ${updated}, juz poprawnych ${alreadyOk}.`)
    return
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nitrix-releases-'))
  let copied = 0
  let skipped = 0
  let failed = 0

  try {
    for (const rel of src) {
      const tag = rel.tag_name
      const totalSize = rel.assets.reduce((s, a) => s + a.size, 0)

      const already = existingByTag.get(tag)
      const resuming = Boolean(already && already.draft)

      if (already && !already.draft) {
        console.log(`- ${tag}: juz opublikowany w repo docelowym, pomijam`)
        skipped++
        continue
      }

      console.log(`- ${tag}: ${rel.assets.length} plikow, ${(totalSize / 1048576).toFixed(1)} MB${resuming ? ' - wznowienie przerwanego kopiowania' : ''}`)
      if (dryRun) continue

      const originalDate = String(rel.published_at || rel.created_at || '').slice(0, 10)
      const bodyWithDate = [
        (rel.body || '').trim(),
        originalDate ? `_Pierwotnie opublikowano: ${originalDate}._` : '',
      ].filter(Boolean).join('\n\n')

      const created = resuming
        ? already
        : await (await api(`${API}/repos/${DST.owner}/${DST.repo}/releases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tag_name: tag,
            target_commitish: targetCommitish,
            name: rel.name || tag,
            body: bodyWithDate,
            draft: true,
            prerelease: rel.prerelease,
            make_latest: 'false',
          }),
        })).json()

      const alreadyUploaded = new Set((created.assets || []).map(a => a.name))
      let ok = true
      for (const asset of rel.assets) {
        if (alreadyUploaded.has(asset.name)) {
          console.log(`      ${asset.name}: juz jest w szkicu, pomijam`)
          continue
        }
        try {
          await uploadAsset(created.id, asset, tmpDir)
        } catch (e) {
          ok = false
          console.error(`      BLAD przy ${asset.name}: ${e.message}`)
        }
      }

      if (ok) {
        await api(`${API}/repos/${DST.owner}/${DST.repo}/releases/${created.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft: false, make_latest: 'false' }),
        })
        console.log(`  -> ${tag} opublikowany w ${DST.repo}`)
        copied++
      } else {
        console.log(`  -> ${tag} zostal jako SZKIC (nie wszystkie pliki sie wgraly)`)
        failed++
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }

  console.log(`\nGotowe: skopiowane ${copied}, pominiete ${skipped}, z bledami ${failed}.`)
  if (!dryRun) console.log(`Sprawdz: https://github.com/${DST.owner}/${DST.repo}/releases`)
}

main().catch(e => {
  console.error('\nPRZERWANE:', e.message)
  process.exit(1)
})
