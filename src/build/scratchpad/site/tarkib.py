# Таркиб режими: сўз остидаги ёзувлар (IRB.s), шибҳи жумла/жумла қавслари ва гап тури — IRB.k дан ҳисобланади.
import re
AR=r'[؀-ۿﷲﷺ]+'
SKIP=('таънис','муаннаслик','фарқлаш','ишбоъ','сақловчи','виқоя','хитоб ҳарфи','хитоб')
HS=[('зоида жар','жар'),('жар ҳарф','жар'),('жарр','жар'),('атф ҳарф','атф'),('нафий','нафий'),('истифҳом ҳарф','истифҳом'),
    ('насб ва масдар','насб'),('насб ва жавоб','насб'),('насб ҳарф','насб'),('жазм ва наҳй','наҳй'),('наҳий','наҳй'),('жазм ва талаб','амр лоси'),('жазм ҳарф','жазм'),
    ('истиқбол','истиқбол'),('сабабни билдирувчи','сабаб'),('шарт жавобига','жавоб'),('жавобига кирган','жавоб'),('шарт ва тафсил','шарт'),('шарт ҳарф','шарт'),
    ('таъкид ва масдар','таъкид'),('таъкид ва насб','таъкид'),('таъкид ломи','таъкид'),('таъкид ҳарф','таъкид'),('ибтидо','ибтидо'),('истидрок','истидрок'),
    ('вовул ҳол','вовул ҳол'),('ҳол вови','вовул ҳол'),('вовул маъийя','вовул маъийя'),('нидо','нидо'),('жавоб ҳарф','жавоб'),('таҳқиқ','таҳқиқ'),
    ('истиъноф','истиъноф'),('таълил','таълил'),('фасиҳа','фаи фасиҳа'),('масдар ҳарф','масдар'),('ҳаср','ҳаср'),('истисно','истисно'),('зоида','зоида'),('узоқлик','узоқлик'),('зотни инкор','нафий')]
def clean(d):
    d=re.sub(r'«[^»]*»','',d); d=re.sub(r'\([^()]*\)','',d); d=re.sub(r'\([^()]*\)','',d)
    return re.sub(r'\s+',' ',d).strip()
def harf(c):
    for a,b in HS:
        if a in c: return b
    return None
def role(c):
    """c: role phrase (after бўлиб), returns abbreviation or None"""
    c=c.strip()
    c=re.sub(r'^у ','',c)
    if re.search(r'(2-|иккинчи )мафъулун биҳ',c): return '2-маф.биҳ'
    if re.search(r'(1-|биринчи )мафъулун биҳ',c): return '1-маф.биҳ'
    if 'мафъулун биҳ' in c: return 'маф.биҳ'
    if 'мафъулун мутлақ' in c: return 'маф.мутлақ'
    if 'мафъулун лиажлиҳ' in c: return 'маф.лиажлиҳ'
    if 'мафъулун маъа' in c: return 'маф.маъаҳ'
    if 'мафъулун фийҳ' in c or re.search(r'зарф',c): return 'зарф'
    if 'музофун илайҳ' in c: return 'муз.илайҳ'
    if 'мубтадо муаххар' in c or 'кейинга ўтган мубтадо' in c: return 'мубтадо муаххар'
    if re.search(r'хабари? муқаддам',c): return 'хабар муқаддам'
    m=re.search(r'('+AR+r') нинг (?:иккинчи |кейинга ўтган )?(исми|хабари)',c)
    if m: return m.group(1)+' '+m.group(2)
    if 'хабари' in c or re.search(r'\bхабар\b',c) or c.startswith('хабар'): return 'хабар'
    if 'ноиби фоил' in c: return 'ноиби фоил'
    if 'фоил' in c: return 'фоил'
    if 'мубтадо' in c: return 'мубтадо'
    if 'маътуф' in c: return 'маътуф'
    if 'бадал' in c: return 'бадал'
    if 'таъкид' in c: return 'таъкид'
    if 'сифат' in c: return 'сифат'
    if '2-ҳол' in c: return '2-ҳол'
    if re.search(r'(^|\s)ҳол',c): return 'ҳол'
    if 'тамйиз' in c: return 'тамйиз'
    if 'мунодо' in c: return 'мунодо'
    if 'мустасно' in c: return 'мустасно'
    if 'мажрур' in c: return 'мажрур'
    return None
def verb(c):
    if 'мажҳул' in c and 'феъл' in c: return 'мажҳ.феъли'
    if 'ноқис' in c: return 'ноқис феъл'
    if 'бошлаш феъли' in c: return 'бошлаш феъли'
    if 'мозий феъли' in c: return 'моз.феъли'
    if 'музорий феъли' in c: return 'муз.феъли'
    if 'амр феъли' in c: return 'амр феъли'
    return None
def part(desc):
    """one k line -> list of labels"""
    out=[]
    d=clean(desc)
    if re.match(AR+r' — ',d) and ';' in d:
        for p in d.split(';'):
            p=re.sub('^'+AR+r' — ','',p.strip())
            out+=part(p)
        return out
    if 'фасиҳа' in desc: return ['фаи фасиҳа']
    if 'шибҳи жумла' in re.split(r'[,;]',d)[0] or d.startswith('маҳзуф'): return []
    cl=[x.strip() for x in re.split(r'[,;]',d)]
    c0=cl[0]
    if ' — ' in c0: c0=c0.split(' — ',1)[1]
    if any(s in c0 for s in SKIP): return []
    if 'фасл замири' in c0: return ['фасл замири']
    if 'жазм ва қалб' in d: return ['жазм']
    v=verb(c0)
    if v:
        out.append(v)
        m=re.search(r'бориз муттасил замир бўлиб,? у ([^,]+)',d)
        if m:
            r=role(m.group(1))
            if r: out.append(r)
        return out
    if 'бўлиб' in c0 and 'шибҳи жумла' not in c0:
        r=c0.split('бўлиб',1)[1].strip()
        if not r and len(cl)>1: r=cl[1]
        if 'сақловчи' in c0: return []
        rr=role(r) or verb(r)
        if rr: return [rr]
    if 'ҳарф' in c0 or c0 in ('нафий','лом') or 'ломи' in c0 or 'вови' in c0 or 'вовул' in c0 or 'нуни' in c0:
        h=harf(c0)
        return [h or c0]
    rr=role(c0)
    if rr: return [rr]
    for c in cl[1:]:
        if 'мабний' in c or 'аломати' in c or 'қилинган' in c: continue
        rr=role(c)
        if rr: return [rr]
    if 'жар ўринда' in d: return ['мажрур']
    return ['?'+c0]
FULLH={'жар':'жар ҳарфи','атф':'атф ҳарфи','нафий':'нафий ҳарфи','истифҳом':'истифҳом ҳарфи','насб':'насб ҳарфи','жазм':'жазм ҳарфи'}
def label(E):
    parts=[]
    for l in E['k']:
        if len(l)>2 or not l[0].strip(): continue
        if ' ' in l[0].strip(): continue   # guruh qatori (فِي أَمْرٍ)
        parts+=part(l[1])
    return parts

HV=set(b for a,b in HS)
def newlabel(E,word=''):
    old=E.get('s') or ''
    p=label(E)
    if not p or any(x.startswith('?') for x in p) or 'ﷺ' in word or len(p)>4: return old
    if len(p)==1:
        x=p[0]
        if x in HV:
            return old if old and old!='ҳарф' else FULLH.get(x,x+' ҳарфи')
        return x
    return '+'.join(p)

import re
HAR=re.compile('[ً-ْٰـ~،؟.:!«»"،؟۔ ]')
def bare(w): return HAR.sub('',w).replace('ٱ','ا').replace('أ','ا').replace('إ','ا').replace('آ','ا')
def words(D):
    return [[f.split('|')[0] for f in l[1].split('/')] for l in D]
def labs(IRB,i,n,ws=None):
    return [newlabel(IRB[f'{i}-{j}'],ws[j] if ws else '') if f'{i}-{j}' in IRB else '' for j in range(n)]
def isjar(x): return 'жар' in x.split('+') or x.startswith('жар')
def segs(GT,i,n):
    L=GT.get(str(i)) if GT else None
    if not L: return [(0,n-1,None)]
    out=[];a=0
    for e,t in L:
        out.append((a,e,t)); a=e+1
    if a<=n-1: out.append((a,n-1,None))
    return out
def sj_text(d):
    d=clean(d)
    r=d.rsplit('шибҳи жумла',1)[1]
    r=r.split('бўлиб',1)[1] if 'бўлиб' in r else r
    r=r.strip(' ,')
    m=re.match(r'маҳзуф (хабари? муқаддам|хабар)\s*бўлмиш\s*('+AR+r')',r)
    if m:
        h='хабар муқаддам' if 'муқаддам' in m.group(1) else 'хабар'
        return 'шибҳи жумла — маҳзуф '+h+' ('+m.group(2)+') га мутааллиқ'
    r=re.sub(r'феълига мутааллиқ','га мутааллиқ',r)
    i=r.find('мутааллиқ')
    if i>=0: r=r[:i+9]
    r=r.strip(' ,')
    return 'шибҳи жумла — '+r if r else 'шибҳи жумла' 
def jm_text(d):
    d=clean(d)
    if 'маътуф' in d and 'олдинги жумла' in d: return 'жумла — олдинги жумлага маътуф'
    m=re.search(r'жумла(?:си)?\b\s*(?:—\s*)?(.*)$',d)
    r=m.group(1) if m else d
    r=r.replace('бўлиб,',',').replace(' бўлиб',',')
    r=re.sub(r'\s+,',',',r).strip(' ,—;')
    r=r.split(';')[0].strip()
    return 'жумла — '+r if r else 'жумла'
def jhead(note):
    return ('жумла' in note and 'шибҳи жумла' not in note and 'силаси' not in note and 'дуо жумласи' not in note
            and any(x in note for x in ('ўринда','маътуф','хабари','ўрин йўқ','ўрни йўқ','сифати','ҳол')))
PUN='[،؛؟.:!؛،]'
CLH={'атф','ибтидо','истиъноф','вовул ҳол','сабаб','фаи фасиҳа','истидрок','жавоб','таълил'}
VB=('моз.феъли','муз.феъли','амр феъли','мажҳ.феъли','ноқис феъл','бошлаш феъли')
GOV={'насб','жазм','нафий','наҳй','истиқбол','таҳқиқ','шарт','масдар','таъкид','амр лоси'}
def clause_start(L,q):
    p=L[q].split('+')
    if not p[0]: return False
    if p[0] in CLH or p[0] in ('атф ҳарфи','истидрок ҳарфи'):
        rest=p[1:]
        if not rest: return True
        x=rest[0]
        return x.startswith(VB) or x in GOV or x.endswith(' исми') or x in ('истидрок',)
    if p[0].startswith(VB):
        pv=L[q-1].split('+') if q>0 else ['']
        if pv[-1] in GOV or pv[-1] in HV or pv[-1].endswith('ҳарфи'): return False
        return True
    return False
# Gap turi qo'lda (29.10.2026): ma'lumotda faqat ma'no turi (хабарийя, истифҳомийя…) yozilgan gaplar.
# كَانَ/أَصْبَحَ/أَخَذَ bilan boshlangan gap — Ibn Hishom («Mug'niy») bo'yicha феълийя.
ST_FIX={
 "بخير": "исмийя",
 "اهلا وسهلا": "феълийя",
 "وكيف عالجه الرسول": "феълийя",
 "العسل": "исмийя",
 "سبحان الله": "феълийя",
 "نعم العسل": "исмийя",
 "ماذا تفعل": "феълийя",
 "كيف تزيد وزنها": "феълийя",
 "اخذت زينب تتناول كثيرا من الطعام": "феълийя",
 "ورغم ذلك ظلت نحيفة": "феълийя",
 "كيف ينقص وزنها": "феълийя",
 "اخذت مريم تاكل كثيرا فزاد وزنها ولم ينقص": "феълийя",
 "ماذا افعل يا دكتور": "феълийя",
 "ما شاء الله": "исмийя",
 "ماذا فعلت": "феълийя",
 "كانت علامة الصحة في الماضي ان يكون الانسان سمينا كثير اللحم والشحم": "феълийя",
 "وكان الناس ياكلون كثيرا اذا وجدوا الطعام": "феълийя",
 "وكان الرجال يفضلون الزواج بالمراة السمينة ولا يحبون الزواج بالمراة النحيفة": "феълийя",
 "واخذ الناس يتبعون الحمية فيتناولون طعاما قليلا ويبتعدون عن السكريات والدهون والنشويات": "феълийя",
 "واصبح الاطباء يحذرون الناس من الطعام الابيض والحليب كامل الدسم قائلين": "феълийя",
 "واصبح الناس يتبعون الحمية فياكلون قليلا من اللحم الاحمر والبيض ويتناولون كثيرا من السمك والدجاج والخضروات والفواكه": "феълийя",
 "فان كان لا محالة فثلث لطعامه وثلث لشرابه وثلث لنفسه": "феълийя",
 "شكرا": "феълийя",
 "كيف تحافظ على دينهم وثقافتهم ولغتهم اذا اغتربوا معك": "феълийя",
 "وشكرا على نصيحتك": "феълийя",
 "خمس سنوات فقط ثم اعود ان شاء الله": "феълийя",
 "يا ابراهيم": "феълийя",
 "شكرا لك": "феълийя",
 "ماذا يقصد": "феълийя",
 "يا له من امر عجيب": "феълийя",
 "يا لها من نصيحة طيبة": "феълийя",
 "ماذا تقول للانسان الذي لا يحب العمل": "феълийя",
 "وبعد انتهاء هذه المدة رجع اليه الاعرابي وقد اشترى ثيابا وطعاما": "феълийя",
 "اليس هذا خيرا لك من ان تسال الناس اعطوك او منعوك": "феълийя"
}
def stkey(ws): return ' '.join(re.sub('[^\u0621-\u064A]','',bare(w)) for w in ws).strip()
def groups(IRB,GT,D):
    W=words(D); G={}; T={}
    for i,ws in enumerate(W):
        n=len(ws); L=labs(IRB,i,n,ws); gs=[]
        SG=segs(GT,i,n)
        def seg_end(j):
            for a,b,t in SG:
                if a<=j<=b: return b
            return n-1
        heads=[]
        for j in range(n):
            E=IRB.get(f'{i}-{j}')
            if not E: continue
            for l in E['k']:
                d=l[1]
                if 'шибҳи жумла' in d and 'дан кейинги шибҳи жумла' not in d:
                    parts=L[j].split('+')
                    if l[0].strip() and ' ' in l[0].strip():
                        tk=l[0].split(); k=len(tk); a=j
                        for q in range(max(0,j-k+1),j+1):
                            if bare(ws[q])==bare(tk[0]): a=q;break
                        b=min(n-1,a+k-1)
                    elif isjar(L[j]) or parts[0]=='зарф' and 'муз.илайҳ' in parts:
                        a=b=j
                    elif parts[0]=='зарф' or 'зарф' in parts:
                        a=j;b=j+1 if j+1<n and L[j+1].startswith('муз.илайҳ') else j
                    else:
                        a=j
                        while a>0 and not isjar(L[a]): a-=1
                        if not isjar(L[a]): a=j
                        b=j
                    while b+1<n and L[b+1].startswith('муз.илайҳ') and b+1<=seg_end(j): b+=1
                    gs.append([a,b,sj_text(d),'s'])
                elif len(l)>2 and jhead(d):
                    a=j
                    m=re.match('('+AR+r')',clean(d))
                    if m and 'кейинги жумла' not in d:
                        t0=bare(m.group(1))
                        for q in range(j,max(-1,j-4),-1):
                            if bare(ws[q]).endswith(t0) or bare(ws[q])==t0: a=q;break
                    heads.append((a,j,jm_text(d),'маътуф' in d))
                elif 'силаси' in d and len(l)>2:
                    heads.append((j+1,j+1,'жумла — сила жумласи, эъробдан унга ўрин йўқ',False))
        for a,j,t,mt in heads:
            e=seg_end(a)
            if 'мафъули' not in t:
                for q in range(a,e+1):
                    if q>a and clause_start(L,q): e=q-1;break
                    if re.search(PUN,ws[q]): e=q;break
            for s2,_,_,mt2 in heads:
                if s2>a and s2<=e and mt2: e=min(e,s2-1)
            gs.append([a,e,t,'j'])
        # dedupe
        u=[];seen=set()
        for g in gs:
            key=(g[0],g[1],g[2])
            if key not in seen: seen.add(key);u.append(g)
        if u: G[i]=u
        # gap turi
        tt=[]
        for a,b,t in SG:
            if not t: continue
            st=''
            NAS={bare(x) for x in ('إِنَّ','أَنَّ','لَكِنَّ','كَأَنَّ','لَيْتَ','لَعَلَّ','لَا')}
            for q in range(a,b+1):
                if not L[q]: continue
                P=L[q].split('+')
                if any(x in ('таъкид','истидрок') for x in P) or L[q] in ('таъкид ҳарфи','истидрок ҳарфи'): st='исмийя'; break
                p=[x for x in P if x and x not in HV and not x.endswith('ҳарфи')]
                if not p: continue
                x=p[0]
                if x in ('мажрур','зарф','муз.илайҳ'): continue
                if x in ('моз.феъли','муз.феъли','амр феъли','мажҳ.феъли'): st='феълийя'
                elif x.startswith('мубтадо') or x.startswith('хабар муқаддам'): st='исмийя'
                elif x.endswith(' исми') and bare(x.split()[0]) in NAS: st='исмийя'
                break
            st=ST_FIX.get(stkey(ws[a:b+1]),st)
            tt.append([b,'Жумлатун '+(st+', ' if st else '')+t+'.'])
        if tt: T[i]=tt
    return G,T

def parse_D(doc):
    i=doc.find('var D=[')
    assert i>=0
    D=[]
    for mm in re.finditer(r'\["([^"]*)",`([^`]*)`\]',doc[i:]):
        D.append((mm.group(1),mm.group(2)))
        if doc[i+mm.end():i+mm.end()+4].lstrip().startswith('];'): break
    return D
def apply(doc):
    """IRB даги s ни янгилайди; (doc, TKG, TKT) қайтаради"""
    import json
    m=re.search(r'\bIRB=\{',doc); a=m.start()+4
    IRB,e=json.JSONDecoder().raw_decode(doc,a)
    m2=re.search(r'\bGT=\{',doc)
    GT=json.JSONDecoder().raw_decode(doc,m2.start()+3)[0] if m2 else {}
    D=parse_D(doc); W=words(D)
    G,T=groups(IRB,GT,D)
    for k,v in IRB.items():
        i,j=map(int,k.split('-'))
        w=W[i][j] if i<len(W) and j<len(W[i]) else ''
        v['s']=newlabel(v,w).replace('+','+​')
    doc=doc[:a]+json.dumps(IRB,ensure_ascii=False)+doc[e:]
    return doc,G,T
