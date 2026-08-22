import json, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.misc.transform import Transform

# argv: fontSize baselineY shear json_positions text
FS, BY, K = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
XS = json.loads(sys.argv[4])          # per-character pen x, from the browser
TEXT = sys.argv[5]
f = TTFont("anybody-latin.woff2")
if "fvar" in f:
    f = instantiateVariableFont(f, {"wdth": 100.0}, inplace=True, updateFontNames=False)
gs, cmap = f.getGlyphSet(), f.getBestCmap()
S = FS / f["head"].unitsPerEm
pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
for ch, x in zip(TEXT, XS):
    gs[cmap[ord(ch)]].draw(TransformPen(pen, Transform(S, 0, S * K, -S, x, BY)))
print(json.dumps({"d": pen.getCommands()}))
