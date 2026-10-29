import numpy as np, re, subprocess
from scipy.signal import fftconvolve
SR=8000
o=np.fromfile('old.raw',dtype=np.float32); n=np.fromfile('new.raw',dtype=np.float32)
def segs(f,dur):
    out=subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=n=-35dB:d=0.25','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]; en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
    r=[];p=0.0
    for a,b in zip(st,en):
        if a>p+0.05:r.append((p,a))
        p=b
    if p<dur-0.1:r.append((p,dur))
    return r
OS=segs('old.mp3',len(o)/SR); NS=segs('new.mp3',len(n)/SR)
def ncc(seg,sig):
    seg=seg-seg.mean(); L=len(seg)
    c=fftconvolve(sig,seg[::-1],mode='valid')
    s2=np.convolve(sig**2,np.ones(L),'valid'); s1=np.convolve(sig,np.ones(L),'valid')
    den=np.sqrt(np.maximum(s2-s1**2/L,1e-9)*np.sum(seg**2))
    return c/den
res=[]
for k,(a,b) in enumerate(OS):
    seg=o[int(a*SR):int(b*SR)]
    if len(seg)<SR*0.2: continue
    c=ncc(seg,n); i=int(np.argmax(c))
    res.append((k,round(a,2),round(b,2),round(i/SR,3),round(float(c[i]),3)))
    print(k,round(a,2),round(b,2),'-> new',round(i/SR,2),'ncc',round(float(c[i]),3),'shift',round(i/SR-a,2))
print('NEW',[(round(a,2),round(b,2)) for a,b in NS])
import json; json.dump({'map':res,'OS':OS,'NS':NS},open('map.json','w'))
