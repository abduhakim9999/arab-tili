import json,sys
P=json.load(open('prompts.json'))
items=P.items() if isinstance(P,dict) else enumerate(P,1)
rev={v.strip():int(k) for k,v in items}
G=json.load(open(sys.argv[1]))['generations']
for g in G:
    d=rev.get(g['prompt'].strip())
    assert d, g['prompt'][:50]
    open('/home/claude/arab-tili/align/in/ev%02d.url'%d,'w').write(g['content_url'])
    print(d, round(g['duration_secs'],1))
