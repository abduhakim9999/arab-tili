from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
F='/tmp/claude-0/-home-claude-arab-tili/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/icn/gf/ofl/amiri/Amiri-Bold.ttf'
f=TTFont(F); gs=f.getGlyphSet(); cm=f.getBestCmap()
ain=cm[0x0639]; fat=cm[0x064E]
class SubPen(BasePen):
    def __init__(s,gs): super().__init__(gs); s.subs=[]; s.cur=None
    def _moveTo(s,p): s.cur={'start':p,'segs':[]}
    def _lineTo(s,p): s.cur['segs'].append(('L',p))
    def _curveToOne(s,a,b,c): s.cur['segs'].append(('C',a,b,c))
    def _closePath(s):
        if s.cur and s.cur['segs']: s.subs.append(s.cur)
        s.cur=None
    _endPath=_closePath
def bounds(g):
    b=BoundsPen(gs); gs[g].draw(b); return b.bounds
ab=bounds(ain); fb=bounds(fat); aw=ab[2]-ab[0]; ah=ab[3]-ab[1]; fh=fb[3]-fb[1]; gap=60
s=185/(ah+gap+fh); cx,cy=263,268
top_px=cy-(ah+gap+fh)*s/2; ain_top_px=top_px+(fh+gap)*s; acx=(ab[0]+ab[2])/2
fcx_t=ab[0]+0.62*aw; fcx=(fb[0]+fb[2])/2
pen=SubPen(gs)
gs[ain].draw(TransformPen(pen,(s,0,0,-s,cx-s*acx,ain_top_px+s*ab[3])))
gs[fat].draw(TransformPen(pen,(s,0,0,-s,cx+s*(fcx_t-acx)-s*fcx,top_px+s*fb[3])))
letter=pen.subs
K=0.5523
def rrect(x0,y0,x1,y1,r):
    p=SubPen(None); 
    st=(x0+r,y0); segs=[('L',(x1-r,y0)),('C',(x1-r+K*r,y0),(x1,y0+r-K*r),(x1,y0+r)),('L',(x1,y1-r)),('C',(x1,y1-r+K*r),(x1-r+K*r,y1),(x1-r,y1)),('L',(x0+r,y1)),('C',(x0+r-K*r,y1),(x0,y1-r+K*r),(x0,y1-r)),('L',(x0,y0+r)),('C',(x0,y0+r-K*r),(x0+r-K*r,y0),(x0+r,y0))]
    return {'start':st,'segs':segs}
def q2c(p0,q,p1): return (('C',(p0[0]+2/3*(q[0]-p0[0]),p0[1]+2/3*(q[1]-p0[1])),(p1[0]+2/3*(q[0]-p1[0]),p1[1]+2/3*(q[1]-p1[1])),p1))
book=rrect(120,64,378,448,18)
page=rrect(384,82,400,430,7)
spine={'start':(142,64),'segs':[('L',(149,64)),('L',(149,448)),('L',(142,448))]}
arch={'start':(178,392),'segs':[('L',(178,196)),q2c((178,196),(178,148),(263,108)),q2c((263,108),(348,148),(348,196)),('L',(348,392))]}
def pts(sp):
    P=[sp['start']]; cur=sp['start']
    for sg in sp['segs']:
        if sg[0]=='L': P.append(sg[1]); cur=sg[1]
        else:
            a,b,c=sg[1],sg[2],sg[3]
            for t in [i/8 for i in range(1,9)]:
                u=1-t; P.append((u**3*cur[0]+3*u*u*t*a[0]+3*u*t*t*b[0]+t**3*c[0],u**3*cur[1]+3*u*u*t*a[1]+3*u*t*t*b[1]+t**3*c[1]))
            cur=c
    return P
def area(sp):
    P=pts(sp); return sum(P[i][0]*P[(i+1)%len(P)][1]-P[(i+1)%len(P)][0]*P[i][1] for i in range(len(P)))/2
def rev(sp):
    nodes=[sp['start']]+[sg[-1] for sg in sp['segs']]
    out={'start':nodes[-1],'segs':[]}
    for i in range(len(sp['segs'])-1,-1,-1):
        sg=sp['segs'][i]; prev=nodes[i]
        out['segs'].append(('L',prev) if sg[0]=='L' else ('C',sg[2],sg[1],prev))
    return out
def orient(sp,sign): return sp if (area(sp)>0)==(sign>0) else rev(sp)
print('letter contour areas',[round(area(x)) for x in letter])
S=1
subs=[orient(book,S),orient(page,S),orient(spine,-S),orient(arch,-S)]+[orient(x,S) for x in letter]
fm=lambda v:('%.1f'%v).rstrip('0').rstrip('.')
def d(sp):
    o='M%s %s'%(fm(sp['start'][0]),fm(sp['start'][1]))
    for sg in sp['segs']:
        o+= ('L%s %s'%(fm(sg[1][0]),fm(sg[1][1]))) if sg[0]=='L' else 'C'+' '.join('%s %s'%(fm(p[0]),fm(p[1])) for p in sg[1:])
    return o+'Z'
D=''.join(d(x) for x in subs)
open('arab-tili-splash.svg','w').write('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="%s"/></svg>'%D)
print('ok',len(D))
