import json,subprocess,sys,numpy as np
SR=24000
def load(f):
    b=subprocess.run(['ffmpeg','-v','error','-i',f,'-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True,check=True).stdout
    return np.frombuffer(b,np.int16).astype(np.float32)/32768
def rms(x,t,w=0.015):
    i=int(t*SR); s=x[max(0,i):i+int(w*SR)]; return float(np.sqrt((s**2).mean())) if len(s) else 0
def save(y,f,title=None):
    cmd=['ffmpeg','-v','error','-y','-f','s16le','-ar',str(SR),'-ac','1','-i','-','-b:a','64k']
    if title: cmd+=['-id3v2_version','3','-metadata','title='+title,'-metadata','artist=نور الطالب']
    subprocess.run(cmd+[f],input=(np.clip(y,-1,1)*32767).astype(np.int16).tobytes(),check=True)
def clips(mp3, al, groups):
    """groups: har fe'l uchun so'zlar soni (yordamchi so'zsiz). Har fe'ldan keyin bitta yordamchi so'z bor."""
    x=load(mp3); W=json.load(open(al)); p=0; out=[]
    for n in groups:
        a=max(0,W[p]['start']-0.06); e=W[p+n-1]['end']; d0=W[p+n]['start']
        ts=np.arange(e-0.02,d0+0.03,0.005); b=float(ts[int(np.argmin([rms(x,t) for t in ts]))])
        y=x[int(a*SR):int(b*SR)].copy(); k=int(.01*SR); m=int(.03*SR)
        y[:k]*=np.linspace(0,1,k); y[-m:]*=np.linspace(1,0,m); out.append(y); p+=n+1
    return out
