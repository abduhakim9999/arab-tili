import re, json, sys
S='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad'
def forms(ar):
    ar = re.sub(r'\s*\([^)]*\)', '', ar).strip()
    if '..' in ar or '…' in ar: return None
    parts = re.split(r'\s+(?:ج|مؤ\.)\s+|\s+–\s+|،\s*', ar)
    return [p.strip() for p in parts if p.strip()]
out = {}
for n in (7,8,9):
    NN='%02d'%n; g={}
    exec(open(S+'/d%s/voc%s.py'%(NN,NN),encoding='utf-8').read(), g)
    out[n] = {i: forms(v[1]) for i, v in enumerate(g['VOC'])}
json.dump(out, open('forms789.json','w'), ensure_ascii=False, indent=0)
for n in out:
    for i,f in out[n].items(): print(n, i, f)
