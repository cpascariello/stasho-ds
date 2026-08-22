from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont
import sys, json

f = TTFont("anybody-latin.woff2")
info = {"upm": f["head"].unitsPerEm, "isVF": "fvar" in f}
if "fvar" in f:
    info["axes"] = {a.axisTag: [a.minValue, a.defaultValue, a.maxValue] for a in f["fvar"].axes}
    loc = {}
    for a in f["fvar"].axes:
        loc[a.axisTag] = 100.0 if a.axisTag == "wdth" else (900.0 if a.axisTag == "wght" else a.defaultValue)
    f = instantiateVariableFont(f, loc, inplace=True, updateFontNames=False)
    info["instantiatedAt"] = loc
gs = f.getGlyphSet()
cmap = f.getBestCmap()
out = {}
for ch in ("s", "S"):
    name = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[name].draw(pen)
    g = f["hmtx"][name]
    out[ch] = {"glyph": name, "path": pen.getCommands(), "advance": g[0], "lsb": g[1]}
info["glyphs"] = out
print(json.dumps(info))
