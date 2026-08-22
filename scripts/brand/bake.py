import json, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.misc.transform import Transform

S, k, tx, ty, ch = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
f = TTFont("anybody-latin.woff2")
if "fvar" in f:
    f = instantiateVariableFont(f, {"wdth": 100.0}, inplace=True, updateFontNames=False)
gs = f.getGlyphSet()
name = f.getBestCmap()[ord(ch)]
pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
gs[name].draw(TransformPen(pen, Transform(S, 0, S * k, -S, tx, ty)))
print(json.dumps({"d": pen.getCommands()}))
