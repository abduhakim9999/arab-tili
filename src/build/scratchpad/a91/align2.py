import re,json,subprocess,math,sys,numpy as np
sys.setrecursionlimit(100000)
P='/mnt/user-data/outputs/lesson91/index.html'
s=open(P,encoding='utf-8').read()
d=s[s.find('var D=['):s.find('];',s.find('var D=['))]
lines=re.findall(r'\["[^"]*",`([^`]*)`\]',d)
def wt(v): return len(re.findall(r'[ء-ي]',v))+v.count('ّ')
W=[];
for li in range(9,len(lines)):
    ws=lines[li].split('/')
    for wi,w in enumerate(ws):
        f=w.split('|')[0].split('~');W.append((li,wi,wt(f[0]),bool(len(f)>1 and f[1].strip()) or wi==len(ws)-1))
n=len(W);CUT=11.15
o=subprocess.run(['ffmpeg','-hide_banner','-i','/mnt/user-data/uploads/70.mp3','-af','silencedetect=noise=-32dB:d=0.06','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)];en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
C=[(en[k],st[k+1]) for k in range(len(st)-1) if st[k+1]>CUT+0.05]
C=[(max(a,CUT),b) for a,b in C if b-a>0.04]
S=len(C);L=[x[2] for x in W];PU=[x[3] for x in W]
pre=[0]
for x in L:pre.append(pre[-1]+x)
def run(rate):
    import functools
    @functools.lru_cache(None)
    def best(i,j):
        if j==S: return (0.0,()) if i==n else (1e9,())
        res=(1e9,())
        d=C[j][1]-C[j][0]
        nb=best(i,j+1)
        if nb[0]+2.5<res[0]:res=(nb[0]+2.5,(0,)+nb[1])
        for m in range(1,min(9,n-i)+1):
            l=pre[i+m]-pre[i];c=math.log(d/(l*rate))**2
            if not PU[i+m-1] and i+m<n: c+=0.3
            c+=0.5*sum(1 for q in range(i,i+m-1) if PU[q])
            nb=best(i+m,j+1)
            if nb[0]+c<res[0]:res=(nb[0]+c,(m,)+nb[1])
        return res
    return best(0,0)
rate=sum(b-a for a,b in C)/pre[-1]
for it in range(3):
    c,ms=run(rate)
    i=0;dd=0;ll=0
    for j,m in enumerate(ms):
        if m: dd+=C[j][1]-C[j][0];ll+=pre[i+m]-pre[i];i+=m
    rate=dd/ll
    print('iter',it,'cost',round(c,2),'rate',round(rate,4),'skipped',ms.count(0))
x=subprocess.run(['ffmpeg','-loglevel','error','-i','/mnt/user-data/uploads/70.mp3','-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
a=np.frombuffer(x,np.int16).astype(np.float32)/32768;H=160;N=len(a)//H
db=20*np.log10(np.sqrt((a[:N*H].reshape(N,H)**2).mean(1))+1e-6);db=np.convolve(db,np.ones(3)/3,'same')
TMn=[];i=0
for j,m in enumerate(ms):
    if not m: continue
    t0,t1=C[j];l=pre[i+m]-pre[i];b=[t0]
    for k in range(i,i+m-1):b.append(b[-1]+(t1-t0)*L[k]/l)
    b.append(t1)
    for q in range(1,len(b)-1):
        i0=int((b[q]-0.1)*100);i1=int((b[q]+0.1)*100);i0=max(i0,int(b[q-1]*100)+4);i1=min(i1,int(b[q+1]*100)-4)
        if i1>i0:
            seg=db[i0:i1];jj=int(np.argmin(seg))
            if np.median(db[max(0,i0-10):i1+10])-seg[jj]>4:b[q]=(i0+jj)/100
    for q,k in enumerate(range(i,i+m)):
        TMn.append([W[k][0],W[k][1],round(b[q]-CUT+29.95,2),round(b[q+1]-CUT+29.95,2)])
    i+=m
json.dump(TMn,open('tm_teacher.json','w'))
m=re.search(r'var TM=(\[\[.*?\]\]),au=',s,re.S);old={(t[0],t[1]):t for t in json.loads(m.group(1))}
diffs=[(abs(t[2]-old[(t[0],t[1])][2]),t[0],t[1]) for t in TMn]
diffs.sort(reverse=True);print('words',len(TMn),'max start diffs',[(round(a,2),l,w) for a,l,w in diffs[:12]])
print('mean diff',round(sum(x[0] for x in diffs)/len(diffs),3))
