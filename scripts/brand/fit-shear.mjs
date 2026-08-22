import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import { inkStats } from './png.mjs'

const G = JSON.parse(await readFile(new URL('./glyph.json', import.meta.url), 'utf8'))
const UPM = G.upm
const FONT = 'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..125,400;75..125,700;75..125,900&display=swap'
const W = 1400, H = 1400, FS = 1000

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
const ready = () => page.waitForFunction(() => document.fonts.ready.then(() => document.fonts.check('italic 900 200px Anybody')), null, { timeout: 20000 })

// reference: the browser's own synthetic-oblique rendering
const refDoc = (glyph) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT}">
<style>html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#000}</style></head>
<body><svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<text x="200" y="1000" fill="#fff" font-family="Anybody, sans-serif" font-size="${FS}"
      font-weight="900" font-style="italic">${glyph}</text></svg></body></html>`

// candidate: our outline, sheared by k, placed so its ink bbox matches the reference's
const pathDoc = (d, k, S, tx, ty) => `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#000}</style></head>
<body><svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<g transform="matrix(${S} 0 ${S * k} ${-S} ${tx} ${ty})"><path d="${d}" fill="#fff"/></g></svg></body></html>`

async function shot(html) { await page.setContent(html); return page.screenshot() }
async function mask(html) {
  const buf = await shot(html)
  return { buf, box: inkStats(buf) }
}
async function pixels(buf) {
  // reuse inkStats' decoder via a tiny re-decode in page for speed: instead diff in Node
  return buf
}

for (const ch of ['s', 'S']) {
  const d = G.glyphs[ch].path
  await page.setContent(refDoc(ch)); await ready()
  const refBuf = await page.screenshot()
  const ref = inkStats(refBuf)

  let best = null
  for (let k = 0.00; k <= 0.36; k += 0.01) {
    // fit S/tx/ty so the sheared outline's ink bbox equals ref's, then measure disagreement
    let S = FS / UPM, tx = 200, ty = 1000
    for (let i = 0; i < 3; i++) {
      const { box } = await mask(pathDoc(d, k, S, tx, ty))
      if (box.w < 2 || box.h < 2) break
      S *= (ref.w / box.w + ref.h / box.h) / 2
      const { box: b2 } = await mask(pathDoc(d, k, S, tx, ty))
      tx += ref.x - b2.x; ty += ref.y - b2.y
    }
    const buf = await shot(pathDoc(d, k, S, tx, ty))
    const diff = diffPct(refBuf, buf)
    if (!best || diff < best.diff) best = { k: +k.toFixed(3), S, tx, ty, diff }
  }
  console.log(`${ch}: best shear k=${best.k}  mismatch ${best.diff.toFixed(3)}%  (scale ${best.S.toFixed(6)})`)
  G.glyphs[ch].fit = best
}
await browser.close()
await (await import('node:fs/promises')).writeFile(new URL('./glyph-fit.json', import.meta.url), JSON.stringify(G, null, 1))

import { inflateSync } from 'node:zlib'
function raw(buf) {
  let pos = 8, idat = [], w, h, ct
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), typ = buf.toString('ascii', pos + 4, pos + 8)
    if (typ === 'IHDR') { w = buf.readUInt32BE(pos + 8); h = buf.readUInt32BE(pos + 12); ct = buf[pos + 17] }
    if (typ === 'IDAT') idat.push(buf.subarray(pos + 8, pos + 8 + len))
    pos += 12 + len
  }
  const r = inflateSync(Buffer.concat(idat)), ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[ct], stride = w * ch
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
  let prev = Buffer.alloc(stride), i = 0; const out = Buffer.alloc(w * h)
  for (let y = 0; y < h; y++) {
    const f = r[i++]; const line = Buffer.from(r.subarray(i, i + stride)); i += stride
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? line[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0
      if (f === 1) line[x] = (line[x] + a) & 255; else if (f === 2) line[x] = (line[x] + b) & 255
      else if (f === 3) line[x] = (line[x] + ((a + b) >> 1)) & 255; else if (f === 4) line[x] = (line[x] + paeth(a, b, c)) & 255
    }
    for (let x = 0; x < w; x++) out[y * w + x] = line[x * ch]
    prev = line
  }
  return { px: out, w, h }
}
function diffPct(a, b) {
  const A = raw(a), B = raw(b); let bad = 0, ink = 0
  for (let i = 0; i < A.px.length; i++) {
    const ai = A.px[i] > 127, bi = B.px[i] > 127
    if (ai || bi) ink++
    if (ai !== bi) bad++
  }
  return ink ? (bad / ink) * 100 : 100
}
