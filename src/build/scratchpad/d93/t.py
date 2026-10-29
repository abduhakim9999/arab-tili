import os,re
exec(open('../d71/data71.py',encoding='utf-8').read())
exec(open('h93.py',encoding='utf-8').read())
exec(open('data93.py',encoding='utf-8').read())
for li,(sp,ws,tr) in enumerate(L):
    cov=sorted(x for t in tr for x in t[1])
    if cov!=list(range(len(ws))): print('COV',li,cov,len(ws))
    for w in ws:
        for f in ('v','ty','r','mn'):
            if re.search(r'[/|`]',w[f]): print('BAD',li,f,w[f])
print(len(L), sum(len(ws) for _,ws,_ in L))
for li,(sp,ws,tr) in enumerate(L): print(li, ' '.join(w['v']+w['pu'] for w in ws))
