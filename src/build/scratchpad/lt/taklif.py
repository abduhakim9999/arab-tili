# Jar harfli fe'llar misolida «‹…›» belgisi takliflari (ko'rib chiqish uchun)
from oqi import *
import re,json
OLIB={(70,'1501'),(74,'23.12'),(91,'2113.19'),(94,'51'),(96,'42'),(98,'15')}
JAR={'فِي':'في','عَلَى':'علي','إِلَى':'الي','مِنْ':'من','عَنْ':'عن','مَعَ':'مع','بِـ':'ب','بِ':'ب','لِـ':'ل'}
def jar(y):
    m=re.search(r'\(([^()]*?)\s*\.\.\)\s*$',y); 
    return m and m.group(1).strip()
out=[]
for n in DARSLAR:
    V,_,_=voc(n)
    for q in V:
        j=jar(q[1])
        if not j or (n,q[0]) in OLIB: continue
        um=re.match(r'^\s*(?:\d\.\s*)?\(\.\.\.\s*([^)]*)\)',q[2][0]); us=um and um.group(1).strip()
        for xi,e in enumerate(q[3]):
            out.append(dict(n=n,k=q[0],j=j,us=us,xi=xi,ar=e[0],uz=e[1] if len(e)>1 else ''))
json.dump(out,open('jar_taklif.json','w'),ensure_ascii=False,indent=0)
for o in out: print(o['n'],o['k'],o['xi'],o['j'],'|',o['us'],'|',o['ar'],'|',o['uz'])
