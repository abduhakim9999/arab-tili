import re, json
s=open('/mnt/user-data/outputs/lesson70/index.html').read()
i=s.find('var D=[');j=s.find('\n];',i)
D=re.findall(r'\["([^"]*)",`([^`]*)`\]',s[i:j])
def syl(w):
    n=len(re.findall(r'[ً-ِ]',w))
    if 'ﷺ' in w: n+=7
    return max(1,n)
W=[[syl(x.split('|')[0]) for x in ws.split('/')] for sp,ws in D]
NS=json.load(open('map.json'))['NS']; SH=25.65
S={k:(a if k<=1 else a-SH, b if k<=1 else b-SH) for k,(a,b) in enumerate(NS)}
# (qatorlar, [(segmentlar, so'zlar soni yoki None=qolgani)])
G=[([1],[([1],None)]),([2],[([9],None)]),([3],[([10],1),([11],None)]),([4],[([12],None)]),([5],[([13],1),([14],None)]),
   ([6],[([15],7),([16],1),([17],4)]),([7],[([18],1),([19],3)]),([9,10],[([20],None)]),([11],[([21],None)]),
   ([12],[([22],1),([23],None)]),([13],[([24],1),([25],None)]),([14],[([26],1),([27],1),([28],2),([29],None)]),
   ([15],[([30],None)]),([16],[([31],None)]),([17],[([32],4),([33],None)]),([18],[([34],None)]),([19],[([35],None)])]
TM=[]
for lines,parts in G:
    words=[(l,w,W[l][w]) for l in lines for w in range(len(W[l]))]
    p=0
    for segs,cnt in parts:
        ws=words[p:p+cnt] if cnt else words[p:]; p+=len(ws)
        iv=[S[k] for k in segs]; sp=sum(b-a for a,b in iv); tot=sum(x[2] for x in ws)
        def at(f):
            t=f*sp
            for a,b in iv:
                if t<=b-a+1e-9: return a+t
                t-=b-a
            return iv[-1][1]
        cum=0
        for (l,w,sy) in ws:
            a=at(cum/tot); cum+=sy; b=at(cum/tot)
            TM.append([l,w,a,b])
    if p!=len(words): print('ovozsiz:',lines,words[p:])
TM.sort(key=lambda x:x[2])
out=[]
for k,(l,w,a,b) in enumerate(TM):
    nx=TM[k+1][2] if k+1<len(TM) else None
    t3=nx if (nx is not None and nx-b<0.45) else b
    out.append([l,w,round(max(0,a-0.04),2),round(t3,2),round(b,2)])
json.dump(out,open('tm70.json','w'))
print(len(out)); print([x for x in out if x[0] in (3,5,7,14)])
