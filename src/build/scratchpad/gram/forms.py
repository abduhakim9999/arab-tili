import re,sys
ar=re.compile('[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿‌-‏‪-‮]+')
seen=set()
for n in range(50,95):
    try: L=open(f't2/{n}.txt').read()
    except: continue
    # join wrapped lines: merge lines into paragraphs where tarkib lines start with ' - '
    lines=[l.strip() for l in L.split('\n')]
    buf=[];out=[]
    for l in lines:
        if not l: continue
        u=ar.sub('·',l)
        u=re.sub(r'[·\s]+',' ',u).strip()
        if re.match(r'^[·\s]*-\s',ar.sub('·',l).replace('ً','')) or u.startswith('- ') or u.startswith('· -'):
            if buf: out.append(' '.join(buf))
            buf=[u]
        elif buf and not re.search(r'[?:]$',u) and len(buf)<4 and re.match(r'^[а-яўқғҳ·,(]',u):
            buf.append(u)
        else:
            if buf: out.append(' '.join(buf)); buf=[]
    if buf: out.append(' '.join(buf))
    for s in out:
        if not re.search('мабний|қилинган|ўринда|мунодо|мутааллиқ|маҳзуф|тобеъ',s): continue
        k=re.sub(r'[·\s]+',' ',s)
        if k in seen: continue
        seen.add(k); print(n,'|',k)
