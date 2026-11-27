# Lug'at tekshiruvi uchun: dars sahifasidan VOC va matn (D) ni o'qish
import json,re,os
R=os.path.dirname(os.path.abspath(__file__))+'/../../../..'
DARSLAR=list(range(1,13))+list(range(70,75))+list(range(90,99))
def yl(s):
    s=re.sub('[ً-ٰٟـ]','',s)
    s=re.sub('[أإآٱ]','ا',s).replace('ة','ت').replace('ى','ي')
    return re.sub('[^ء-ي ]',' ',s)
def sahifa(n,pre=''):
    return open(f'{R}/{pre}{n}.html',encoding='utf-8').read()
def voc(n,pre=''):
    h=sahifa(n,pre); i=h.index('var VOC=')+8; j=h.index('\n',i)
    s=h[i:j].rstrip().rstrip(';')
    return json.loads(s),(i,i+len(s)),h
def matn(n):
    h=sahifa(n); i=h.index('var D=['); j=h.index('\n];',i)
    w=[]
    for m in re.finditer(r'`([^`]*)`',h[i:j]):
        for seg in m.group(1).split('/'):
            w.append(seg.split('|')[0].replace('~',' '))
    return ' '.join(w)
def tek(s): return ' '.join(yl(s).split())
