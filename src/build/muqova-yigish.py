import sys
from PIL import Image, ImageOps
x0,x1,yc,k,out=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),float(sys.argv[4]),sys.argv[5]
im=Image.open(sys.argv[6] if len(sys.argv)>6 else 'src/build/muqova-rasm-2.jpg').convert('RGB'); s=400/(x1-x0)
up=im.crop((x0,0,x1,yc)).resize((400,round(yc*s)),Image.LANCZOS)
lo=im.crop((x0,yc,x1,720)).resize((400,round((720-yc)*s*k)),Image.LANCZOS)
h=up.size[1]+lo.size[1]; top=600-h
o=Image.new('RGB',(400,600)); o.paste(up,(0,top)); o.paste(lo,(0,top+up.size[1]))
wall=up.crop((0,0,400,round(270*s))); y=top; f=True
while y>0:
    b=ImageOps.flip(wall) if f else wall; o.paste(b,(0,y-b.size[1])); y-=b.size[1]; f=not f
o.save(out,quality=86,optimize=True); print(out,'window top',top+round(290*s))
