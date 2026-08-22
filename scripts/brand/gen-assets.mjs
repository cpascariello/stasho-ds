import { chromium } from 'playwright'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { inkStats } from './png.mjs'

const SIZE = 512, R = SIZE / 2, RING = 0.14, K = 0.25
const TARGET_R = R - RING * SIZE
const G = JSON.parse(await readFile(new URL('./glyph.json', import.meta.url), 'utf8'))
const UPM = G.upm, RAW = G.glyphs.s.path

const PALETTES = [
  { id: 'void', label: 'Void',      bg: '#07080a', fg: '#22d3ee' },
  { id: 'cyan', label: 'Cyan',      bg: '#22d3ee', fg: '#07080a' },
  { id: 'deep', label: 'Deep blue', bg: '#00004e', fg: '#22d3ee' },
  { id: 'mono', label: 'Mono',      bg: '#07080a', fg: '#ffffff' },
]

const svgWith = (inner, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="${bg}"/>${inner}</svg>`
const grpSvg = (S, tx, ty, bg, fg) => svgWith(`<g transform="matrix(${S} 0 ${S * K} ${-S} ${tx} ${ty})"><path d="${RAW}" fill="${fg}"/></g>`, bg)
const bakedSvg = (d, bg, fg) => svgWith(`<path d="${d}" fill="${fg}"/>`, bg)
const page1 = (svg) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${SIZE}px;height:${SIZE}px;overflow:hidden}svg{display:block}</style></head><body>${svg}</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 })
const shot = async (html) => { await page.setContent(html); return page.screenshot() }

// solve S/tx/ty: ink centred, farthest ink pixel exactly TARGET_R from centre
let S = 0.22, tx = 100, ty = 380
for (let i = 0; i < 8; i++) {
  const st = inkStats(await shot(page1(grpSvg(S, tx, ty, '#000', '#fff'))))
  tx += (SIZE - st.w) / 2 - st.x
  ty += (SIZE - st.h) / 2 - st.y
  const st2 = inkStats(await shot(page1(grpSvg(S, tx, ty, '#000', '#fff'))))
  if (Math.abs(st2.maxR - TARGET_R) < 0.15) break
  const f = TARGET_R / st2.maxR
  S *= f; tx = SIZE / 2 + (tx - SIZE / 2) * f; ty = SIZE / 2 + (ty - SIZE / 2) * f
}
const solved = inkStats(await shot(page1(grpSvg(S, tx, ty, '#000', '#fff'))))
console.log(`solved  scale ${S.toFixed(6)}  maxR ${solved.maxR.toFixed(2)} (target ${TARGET_R})  ring ${((R - solved.maxR) / SIZE * 100).toFixed(2)}%  ink ${solved.w}x${solved.h}`)

// bake the transform into one path
const baked = JSON.parse(execFileSync('uv', ['run', '--quiet', '--with', 'fonttools', '--with', 'brotli',
  'python', 'bake.py', String(S), String(K), String(tx), String(ty), 's'],
  { cwd: new URL('.', import.meta.url).pathname, encoding: 'utf8' })).d

// verify baking is lossless
const diff = async (a, b) => {
  const A = inkStats(a), B = inkStats(b)
  return { dx: B.x - A.x, dy: B.y - A.y, dw: B.w - A.w, dh: B.h - A.h, dr: +(B.maxR - A.maxR).toFixed(3) }
}
const grpBuf = await shot(page1(grpSvg(S, tx, ty, '#000', '#fff')))
const bakBuf = await shot(page1(bakedSvg(baked, '#000', '#fff')))
console.log('baked vs transform-group:', JSON.stringify(await diff(grpBuf, bakBuf)))

await mkdir(new URL('./assets/', import.meta.url), { recursive: true })
const PNG_SIZES = [512, 256, 192, 180, 128, 64, 48, 32, 16]
for (const p of PALETTES) {
  const svg = bakedSvg(baked, p.bg, p.fg)
  await writeFile(new URL(`./assets/stasho-mark-${p.id}.svg`, import.meta.url), svg + '\n')
  for (const s of PNG_SIZES) {
    const pg = await browser.newPage({ viewport: { width: s, height: s }, deviceScaleFactor: 1 })
    await pg.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${s}px;height:${s}px;overflow:hidden}svg{display:block;width:${s}px;height:${s}px}</style></head><body>${svg}</body></html>`)
    await pg.screenshot({ path: new URL(`./assets/stasho-mark-${p.id}-${s}.png`, import.meta.url).pathname })
    await pg.close()
  }
}
// fidelity check against the chosen tile
const chosen = await readFile(new URL('./out/c-lc-a14-void.png', import.meta.url))
const made = await readFile(new URL('./assets/stasho-mark-void-512.png', import.meta.url))
console.log('vs chosen c-lc-a14-void.png:', JSON.stringify(await diff(chosen, made)))
await writeFile(new URL('./assets/path.json', import.meta.url), JSON.stringify({ viewBox: `0 0 ${SIZE} ${SIZE}`, d: baked, ring: RING, shear: K, scale: S }, null, 1))
await browser.close()
console.log(`\n${PALETTES.length} SVGs + ${PALETTES.length * PNG_SIZES.length} PNGs, path ${baked.length} chars`)
