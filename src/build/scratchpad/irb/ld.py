import json
P='/mnt/user-data/outputs/lesson92/index.html'
def load():
    h=open(P,encoding='utf-8').read()
    a=h.index('var IRB=');b=h.index(';\n',a)
    return h,a,b,json.loads(h[a+8:b])
def save(h,a,b,E):
    h=h[:a]+'var IRB='+json.dumps(E,ensure_ascii=False,separators=(',',':'))+h[b:]
    open(P,'w',encoding='utf-8').write(h)
