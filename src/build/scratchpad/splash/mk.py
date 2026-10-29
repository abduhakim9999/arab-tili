from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
F='/tmp/claude-0/-home-claude-arab-tili/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/icn/gf/ofl/amiri/Amiri-Bold.ttf'
f=TTFont(F); gs=f.getGlyphSet(); cm=f.getBestCmap()
ain=cm[0x0639]; fat=cm[0x064E]
def bounds(g):
    b=BoundsPen(gs); gs[g].draw(b); return b.bounds
ab=bounds(ain); fb=bounds(fat)
aw=ab[2]-ab[0]; ah=ab[3]-ab[1]
# target: letter (with fatha) height ~150px centred at (262,268)
gap=60  # font units between ain top and fatha bottom
fh=fb[3]-fb[1]; total=ah+gap+fh
s=185/total
cx,cy=263,268
# ain placement: map font (x,y) -> (X,Y): X = (x - ab_cx)*s + cx ; Y = top - (y - ab[3])*s ...
top_px=cy-total*s/2   # pixel y of fatha top
ain_top_px=top_px+(fh+gap)*s
acx=(ab[0]+ab[2])/2
def tr_ain():
    # X = s*x + (cx - s*acx);  Y = -s*y + (ain_top_px + s*ab[3])
    return (s,0,0,-s,cx-s*acx,ain_top_px+s*ab[3])
fcx_target=ab[0]+0.62*aw  # over the head
fcx=(fb[0]+fb[2])/2
def tr_fat():
    return (s,0,0,-s,cx+s*(fcx_target-acx)-s*(fcx-fcx),0)
# fatha: X = s*(x - fcx) + cx + s*(fcx_target-acx); Y = -s*y + (top_px + s*fb[3])
tf=(s,0,0,-s,cx+s*(fcx_target-acx)-s*fcx,top_px+s*fb[3])
p1=SVGPathPen(gs); gs[ain].draw(TransformPen(p1,tr_ain()))
p2=SVGPathPen(gs); gs[fat].draw(TransformPen(p2,tf))
letter=p1.getCommands()+p2.getCommands()
book=("M138 64H360A18 18 0 0 1 378 82V430A18 18 0 0 1 360 448H138A18 18 0 0 1 120 430V82A18 18 0 0 1 138 64Z"
      "M384 82H392A8 8 0 0 1 400 90V422A8 8 0 0 1 392 430H384Z"
      "M142 64H149V448H142Z"
      "M178 392V196Q178 148 263 108Q348 148 348 196V392Z")
d=book+letter
svg='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill-rule="evenodd" d="%s"/></svg>'%d
open('splash.svg','w').write(svg)
print(len(svg), 'scale',round(s,4))
