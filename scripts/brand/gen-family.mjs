import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { inkStats } from './png.mjs'

const FONT = 'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..125,400;75..125,700;75..125,900&display=swap'
const K = 0.25, FS = 200, BASELINE = 180
const HERE = new URL('.', import.meta.url).pathname

// each entry mirrors an existing DS component's exact <text> placement
const SPECS = [
  { id: 'wordmark', text: 'stasho', x: 0,   vb: '0 0 880 229',  w: 880,  h: 229 },
  { id: 'letter',   text: 's',      x: 0,   vb: '0 0 164 229',  w: 164,  h: 229 },
  { id: 'full',     text: 'stasho', x: 261, vb: '0 0 1383 229', w: 1383, h: 229 },
]

const browser = await chromium.launch()
const out = {}
for (const s of SPECS) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 })
  const textSvg = (fill) => `<svg width="${s.w}" height="${s.h}" viewBox="${s.vb}" xmlns="http://www.w3.org/2000/svg">
<rect width="${s.w}" height="${s.h}" fill="#000"/>
<text id="t" x="${s.x}" y="${BASELINE}" fill="${fill}" font-family="Anybody, sans-serif" font-size="${FS}" font-weight="900" font-style="italic">${s.text}</text></svg>`
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT}"><style>html,body{margin:0;overflow:hidden}svg{display:block}</style></head><body>${textSvg('#fff')}</body></html>`)
  await page.waitForFunction(() => document.fonts.ready.then(() => document.fonts.check('italic 900 200px Anybody')), null, { timeout: 20000 })

  // exact per-glyph pen positions after the engine's own shaping/kerning
  const xs = await page.evaluate(() => {
    const t = document.getElementById('t')
    return Array.from({ length: t.getNumberOfChars() }, (_, i) => t.getStartPositionOfChar(i).x)
  })
  const refBuf = await page.screenshot()

  const baked = JSON.parse(execFileSync('uv', ['run', '--quiet', '--with', 'fonttools', '--with', 'brotli',
    'python', 'bake-text.py', String(FS), String(BASELINE), String(K), JSON.stringify(xs), s.text],
    { cwd: HERE, encoding: 'utf8' })).d

  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}svg{display:block}</style></head><body>
<svg width="${s.w}" height="${s.h}" viewBox="${s.vb}" xmlns="http://www.w3.org/2000/svg">
<rect width="${s.w}" height="${s.h}" fill="#000"/><path d="${baked}" fill="#fff"/></svg></body></html>`)
  const newBuf = await page.screenshot()

  const a = inkStats(refBuf), b = inkStats(newBuf)
  const delta = { dx: b.x - a.x, dy: b.y - a.y, dw: b.w - a.w, dh: b.h - a.h }
  console.log(`${s.id.padEnd(9)} glyph x: [${xs.map(v => v.toFixed(1)).join(', ')}]`)
  console.log(`${' '.repeat(9)} ink text ${a.w}x${a.h}@(${a.x},${a.y})  path ${b.w}x${b.h}@(${b.x},${b.y})  delta ${JSON.stringify(delta)}  path ${baked.length} chars`)
  out[s.id] = { d: baked, viewBox: s.vb, delta }
  await page.close()
}
await writeFile(new URL('./family-paths.json', import.meta.url), JSON.stringify(out, null, 1))
await browser.close()
