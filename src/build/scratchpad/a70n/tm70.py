import re, json, base64
s=open('/mnt/user-data/outputs/lesson70/index.html').read()
i=s.find('var D=[');j=s.find('\n];',i)
D=re.findall(r'\["([^"]*)",`([^`]*)`\]',s[i:j])
def syl(w):
    n=len(re.findall(r'[ً-ِ]',w))
    if 'ﷺ' in w: n+=7
    return max(1,n)
W=[[syl(x.split('|')[0]) for x in ws.split('/')] for sp,ws in D]
NS=json.load(open('map.json'))['NS']
SH=29.4
S={k:(a if k==0 else a-SH, b if k==0 else b-SH) for k,(a,b) in enumerate(NS)}
# guruhlar: (qatorlar, segmentlar)
G=[([1],[0]),([2],[9]),([3],[10,11]),([4],[12]),([5],[13,14]),([6],[15]),([7],[16,17,18]),([8],[19]),([9,10],[20]),([11],[21]),
   ([12],[22,23]),([13],[24,25]),([14],[26,27,28,29]),([15],[30]),([16],[31]),([17],[32,33]),([18],[34]),([19],[35])]
TM=[]
for lines,segs in G:
    words=[(l,w,W[l][w]) for l in lines for w in range(len(W[l]))]
    tot=sum(x[2] for x in words)
    iv=[S[k] for k in segs]; sp=sum(b-a for a,b in iv)
    def at(f):
        t=f*sp
        for a,b in iv:
            if t<=b-a+1e-9: return a+t
            t-=b-a
        return iv[-1][1]
    # segment chegaralariga so'zlarni moslash: har segment boshlanishiga eng yaqin so'z chegarasini tortish
    cum=0; bounds=[0.0]
    for x in words: cum+=x[2]; bounds.append(cum/tot)
    segf=[];acc=0
    for a,b in iv[:-1]: acc+=(b-a)/sp; segf.append(acc)
    for f in segf:
        k=min(range(1,len(bounds)-1),key=lambda q:abs(bounds[q]-f)) if len(bounds)>2 else None
        if k: bounds[k]=f
    for q,(l,w,_) in enumerate(words):
        a=at(bounds[q]); b=at(bounds[q+1])
        # segment chegarasida turgan bo'lsa: keyingi segment boshidan
        if q>0 and any(abs(bounds[q]-f)<1e-9 for f in segf):
            idx=[abs(bounds[q]-f)<1e-9 for f in segf].index(True); a=iv[idx+1][0]
        if any(abs(bounds[q+1]-f)<1e-9 for f in segf):
            idx=[abs(bounds[q+1]-f)<1e-9 for f in segf].index(True); b=iv[idx][1]
        TM.append([l,w,a,b])
TM.sort(key=lambda x:x[2])
out=[]
for k,(l,w,a,b) in enumerate(TM):
    nx=TM[k+1][2] if k+1<len(TM) else None
    t3=nx if (nx is not None and nx-b<0.45) else b
    out.append([l,w,round(max(0,a-0.04),2),round(t3,2),round(b,2)])
json.dump(out,open('tm70.json','w'))
for x in out: print(x)
