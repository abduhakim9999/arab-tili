import re, json, math
s=open('/mnt/user-data/outputs/lesson70/index.html').read()
i=s.find('var D=[');j=s.find('\n];',i)
D=re.findall(r'\["([^"]*)",`([^`]*)`\]',s[i:j])
def syl(w):
    n=len(re.findall(r'[ً-ِ]',w))
    if 'ﷺ' in w: n+=7
    return max(1,n)
L=[]
for sp,ws in D:
    words=[x.split('|')[0] for x in ws.split('/')]
    L.append([syl(w) for w in words])
SEG=json.load(open('map.json'))['NS']
SEG=[s for s in SEG if s[0]>33]   # S9.. (old content + last line)
lines=list(range(2,20))
START=[re.sub(r'[\u064B-\u0652]','',D[l][1].split('|')[0].split('~')[0]) for l in lines]
SHORTW=[x in ('نعم','لا') for x in START]
SY=[sum(L[l]) for l in lines]
dur=[b-a for a,b in SEG]
rate=sum(SY)/sum(dur)
print(START,SHORTW);print('rate',round(rate,2),'syl/s', 'lines',len(lines),'segs',len(SEG))
INF=1e9
nL,nS=len(lines),len(SEG)
best={(0,0):(0,None)}
import functools
@functools.lru_cache(None)
def f(li,si):
    if li==nL and si==nS: return (0,())
    if li==nL or si==nS: return (INF,())
    res=(INF,())
    for k in (1,2,3):
        for m in (1,2,3,4):
            if li+k>nL or si+m>nS: continue
            if k>1 and m>1: continue
            sy=sum(SY[li:li+k]); d=sum(dur[si:si+m])
            c=math.log(d*rate/sy)**2 + (0.3 if k>1 else 0) + 0.02*(m-1)
            short=dur[si]<0.7
            if SHORTW[li] and not (short and m>1): c+=1.0
            if (not SHORTW[li]) and short: c+=1.0
            sub=f(li+k,si+m)
            if c+sub[0]<res[0]: res=(c+sub[0],((li,k,si,m),)+sub[1])
    return res
cost,path=f(0,0)
print('cost',round(cost,2))
for li,k,si,m in path:
    print('lines',[lines[x] for x in range(li,li+k)],'syl',sum(SY[li:li+k]),'segs',['S%d'%(x+9) for x in range(si,si+m)],'dur',round(sum(dur[si:si+m]),2),'exp',round(sum(SY[li:li+k])/rate,2))
