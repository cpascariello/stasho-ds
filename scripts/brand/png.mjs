import { inflateSync } from 'node:zlib'
export function inkStats(buf, thresh = 40, cx = null, cy = null) {
  let pos = 8, idat = [], w, h, ct
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), typ = buf.toString('ascii', pos + 4, pos + 8)
    if (typ === 'IHDR') { w = buf.readUInt32BE(pos + 8); h = buf.readUInt32BE(pos + 12); ct = buf[pos + 17] }
    if (typ === 'IDAT') idat.push(buf.subarray(pos + 8, pos + 8 + len))
    pos += 12 + len
  }
  const raw = inflateSync(Buffer.concat(idat))
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[ct], stride = w * ch
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
  let prev = Buffer.alloc(stride), i = 0
  let minx = w, maxx = -1, miny = h, maxy = -1
  const CX = cx ?? w / 2, CY = cy ?? h / 2
  let maxR2 = 0
  for (let y = 0; y < h; y++) {
    const f = raw[i++]; const line = Buffer.from(raw.subarray(i, i + stride)); i += stride
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? line[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0
      if (f === 1) line[x] = (line[x] + a) & 255
      else if (f === 2) line[x] = (line[x] + b) & 255
      else if (f === 3) line[x] = (line[x] + ((a + b) >> 1)) & 255
      else if (f === 4) line[x] = (line[x] + paeth(a, b, c)) & 255
    }
    for (let x = 0; x < w; x++) {
      if (line[x * ch] > thresh) {
        if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y
        const dx = x + 0.5 - CX, dy = y + 0.5 - CY, r2 = dx * dx + dy * dy
        if (r2 > maxR2) maxR2 = r2
      }
    }
    prev = line
  }
  return { x: minx, y: miny, w: maxx - minx + 1, h: maxy - miny + 1,
           maxR: Math.sqrt(maxR2), frameW: w, frameH: h }
}
export const inkBox = inkStats
