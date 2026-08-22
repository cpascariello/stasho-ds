import { readFile, writeFile } from 'node:fs/promises'
// ICO container holding PNG entries (PNG-in-ICO: supported by every browser since IE11)
const SIZES = [16, 32, 48]
const pngs = await Promise.all(SIZES.map(s =>
  readFile(new URL(`./assets/stasho-mark-void-${s}.png`, import.meta.url))))
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(SIZES.length, 4)
const dir = Buffer.alloc(16 * SIZES.length)
let offset = 6 + dir.length
SIZES.forEach((s, i) => {
  const o = i * 16
  dir[o] = s === 256 ? 0 : s          // width
  dir[o + 1] = s === 256 ? 0 : s      // height
  dir[o + 2] = 0                      // palette count
  dir[o + 3] = 0                      // reserved
  dir.writeUInt16LE(1, o + 4)         // colour planes
  dir.writeUInt16LE(32, o + 6)        // bits per pixel
  dir.writeUInt32LE(pngs[i].length, o + 8)
  dir.writeUInt32LE(offset, o + 12)
  offset += pngs[i].length
})
const ico = Buffer.concat([header, dir, ...pngs])
await writeFile(new URL('./assets/favicon.ico', import.meta.url), ico)
console.log(`favicon.ico ${ico.length} bytes, entries ${SIZES.join('/')}`)
// sanity: re-read the directory back
const t = await readFile(new URL('./assets/favicon.ico', import.meta.url))
const n = t.readUInt16LE(4)
for (let i = 0; i < n; i++) {
  const o = 6 + i * 16
  const w = t[o] || 256, sz = t.readUInt32LE(o + 8), off = t.readUInt32LE(o + 12)
  const isPng = t.subarray(off, off + 8).toString('hex') === '89504e470d0a1a0a'
  console.log(`  entry ${w}x${w}  ${sz}B @${off}  png-signature ${isPng ? 'ok' : 'BAD'}`)
}
