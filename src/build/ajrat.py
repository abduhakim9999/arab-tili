#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dars sahifalaridan ma'lumot fayllarini chiqaradi (repo ildizidan):

    python3 src/build/ajrat.py            # data/lugat.json, mashq.json, qoida.json, darslar.json
    python3 src/build/ajrat.py --ochir    # yo'qolgan kalitlarning raqamini «o'chgan» ro'yxatiga o'tkazadi

Manba — tayyor dars sahifalari (N.html), index.html (darslar ro'yxati) va tinglash.html (lug'at ovozi vaqtlari).
data/ fayllari QO'LDA O'ZGARTIRILMAYDI — faqat shu skript yozadi.
Raqamlar (id) src/build/idlar.json da qulflangan: bir marta berilgan raqam hech qachon o'zgarmaydi va qayta ishlatilmaydi.
Mashq savollari sahifaning o'z kodi (qpool/qends) bilan olinadi — shuning uchun Playwright + Chrome kerak.
Batafsil: docs/texnik.md 14-bo'lim.
"""
import sys, os, re, json, hashlib, threading, http.server
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lugat_gap import gap_tanla

ROOT = os.getcwd()
B = os.path.join(ROOT, 'src', 'build')
OUT = os.path.join(ROOT, 'data')
HK = re.compile('[ً-ْٰ]')          # harakatlar
dec = json.JSONDecoder()


def plain(s):
    return HK.sub('', s)


def grab(s, name):
    """Sahifadagi `var NAME = <JSON>` ni o'qiydi (JSON bo'lmasa None)."""
    m = re.search(r'(?:var|const|let)\s+' + name + r'\s*=\s*', s)
    if not m:
        return None
    try:
        return dec.raw_decode(s, m.end())[0]
    except ValueError:
        return None


def manba_xesh(s):
    """Dars ma'lumoti o'zgarganini bilish uchun xesh (tekshir_data.py ham shuni hisoblaydi)."""
    h = hashlib.sha1()
    for nm in ('VOC', 'TRK', 'QMP', 'TR'):
        h.update(json.dumps(grab(s, nm), ensure_ascii=False, sort_keys=True).encode())
    m = re.search(r'var D=\[\n(.*?)\n\];', s, re.S)
    h.update((m.group(1) if m else s).encode())
    return h.hexdigest()[:12]


# ---------- lug'at yozuvini bo'laklash ----------
def kengayt(bosh, j):
    """Kitobdagi «..ُونَ / ..َاتٌ» qisqartmasini to'liq ko'plikka aylantiradi."""
    j = j.strip()
    if not j.startswith('..'):
        return j
    suf = j.lstrip('.')
    b = bosh
    if suf.startswith('ُون'):                      # ُونَ
        b = re.sub('[ً-ٍ]', '', b)                      # tanvin
        b = re.sub('[َ-ِ]$', '', b)
        return b + suf
    if suf.startswith('َات'):                      # َاتٌ
        b = re.sub('ة[ً-ِ]*$', '', b)              # ة va harakati
        b = re.sub('َ$', '', b)
        b = re.sub('َ(ّ)$', r'\1', b)
        return b + suf
    return j


def bolakla(asl):
    """«صُورَةٌ ج صُوَرٌ», «سَبْعٌ مؤ. سَبْعَةٌ», «قَالَ – يَقُولُ – قُلْ – قَوْلٌ», «سَلَامٌ (اَلسَّلَامُ)»."""
    r = {}
    a = asl.strip()
    if ' – ' in a:
        f = [x.strip() for x in a.split(' – ')]
        r['ar'] = f[0]
        r['fel'] = f
        return r
    m = re.search(r'\s+مؤ\.\s+(.+)$', a)
    if m:
        r['mn'] = m.group(1).strip()
        a = a[:m.start()]
    m = re.search(r'\s+ج\s+(.+)$', a)
    jam = None
    if m:
        jam = m.group(1)
        a = a[:m.start()]
    m = re.search(r'\s*\(([^)]+)\)\s*$', a)
    if m:
        r['al'] = m.group(1).strip()
        a = a[:m.start()]
    r['ar'] = a.strip()
    if jam:
        r['jam'] = [kengayt(r['ar'], x) for x in re.split(r'\s*،\s*', jam) if x.strip()]
    return r


def turi(bosh, uz, fel):
    """bosh — bosh shakl (ko'plik qisqartmasisiz). «..» — bog'lanib keladigan harf yoki zamir."""
    u = ' '.join(uz)
    if fel:
        return 'fel'
    if '..' in bosh:
        return 'zamir' if bosh.startswith('.') else 'harf'
    if 'ҳарфи)' in u:
        return 'harf'
    if re.search(r'\((эр\.исми|аёл исми|вил\.шаҳ\.|вил\.|шаҳ\.|дав\.|қитъа)\)', u):
        return 'atoqli'
    return 'soz'


# ---------- sahifaning o'z kodi bilan: gaplar va mashq savollari ----------
JS = """() => {
  var lines = D.map(function(l, i){
    var ws = l[1].split('/');
    return {sp: l[0], w: ws.map(function(w){var x = info(w); return [x.v, x.pu || '']}),
            nt: ws.map(function(w){return w.split('|')[2] || ''}), gl: ws.map(function(w){return w.split('|')[3] || ''}),
            trc: (typeof TR !== 'undefined' && TR[i]) || [],
            tr: ((typeof TR !== 'undefined' && TR[i]) || []).map(function(t){return t[0]}).join(' ')};
  });
  var q = qpool().map(function(p){
    var k = p.l + '-' + p.w, o = get(k), ops = qends(k);
    return {k: k, l: p.l, w: p.w, v: o.v,
            ops: ops.map(function(x){return [x.w, x.c, x.lb || QV[x.c][2]]}),
            am: TRK[k] || null, qm: (typeof QMP !== 'undefined' && QMP[k]) || []};
  });
  return {lines: lines, q: q};
}"""


def sahifalardan(darslar):
    from playwright.sync_api import sync_playwright
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=ROOT, **k)

        def log_message(self, *a):
            pass
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    port = srv.server_address[1]
    out = {}
    with sync_playwright() as p:
        kw = {'args': ['--no-sandbox']}
        if os.path.exists('/usr/bin/google-chrome'):
            kw['executable_path'] = '/usr/bin/google-chrome'
        br = p.chromium.launch(**kw)
        cx = br.new_context(service_workers='block')
        cx.add_init_script("try{localStorage.setItem('fe-tour','1')}catch(e){}")
        pg = cx.new_page()
        for n in darslar:
            pg.goto('http://127.0.0.1:%d/%d.html' % (port, n), wait_until='load')
            pg.wait_for_function("typeof D !== 'undefined' && typeof qpool === 'function'")
            out[n] = pg.evaluate(JS)
        br.close()
    srv.shutdown()
    return out


def yoz(nom, obj_head, rows, tail=''):
    """Har yozuv bir qatorda — git farqi o'qiladigan bo'lsin."""
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, nom)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(obj_head + '\n')
        f.write(',\n'.join(json.dumps(r, ensure_ascii=False, separators=(',', ':')) for r in rows))
        f.write('\n' + tail + '\n')
    return p


def main():
    ochir = '--ochir' in sys.argv
    idx = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    LESSONS = grab(idx, 'LESSONS')
    UNITS = grab(idx, 'UNITS')
    ESH = grab(idx, 'ESH') or []
    tg = open(os.path.join(ROOT, 'tinglash.html'), encoding='utf-8').read()
    m = re.search(r'LIST\s*=\s*', tg)
    LIST = {x['n']: x for x in dec.raw_decode(tg, m.end())[0]}
    lock_p = os.path.join(B, 'idlar.json')
    LOCK = json.load(open(lock_p, encoding='utf-8')) if os.path.exists(lock_p) else \
        {'w': {}, 'q': {}, 'wn': 1, 'qn': 1, 'ochgan': {'w': [], 'q': []}}
    for t in ('w', 'q'):                          # 19.11.2026: parallel tarmoqlar birlashtirilganda bir raqam ikki kalitga berilgan bo'lishi mumkin
        egasi = {}
        for k, v in LOCK[t].items():
            if v in egasi:
                sys.exit("TO'XTA: idlar.json — %d raqami ikki kalitda (%s | %s): tarmoqlar birlashtirilganda to'qnashgan — keyingisiga yangi raqam bering, lugat-moziy.json/lugat-tuzatish.json da ham (docs/texnik.md 1)" % (v, egasi[v], k))
            egasi[v] = k
        LOCK[t + 'n'] = max([LOCK[t + 'n']] + [v + 1 for v in LOCK[t].values()])
    TUZ = json.load(open(os.path.join(B, 'lugat-tuzatish.json'), encoding='utf-8'))
    MZ = json.load(open(os.path.join(B, 'lugat-moziy.json'), encoding='utf-8'))   # fe'lning testdagi o'tgan zamon ma'nosi (18.11.2026)
    GUR = json.load(open(os.path.join(B, 'qoida-guruh.json'), encoding='utf-8'))

    nums = [x['n'] for x in LESSONS]
    # 1-kitob oldin, keyin dars tartibida — raqamlar birinchi marta shu tartibda beriladi
    kitob = lambda x: int(UNITS[x['u']][4])
    LESSONS.sort(key=lambda x: (kitob(x), x['n']))
    sah = sahifalardan(nums)

    seen_w, seen_q = set(), set()
    OGOH = []
    lug, msh, drs = [], [], []
    QT, QTsrc, QTfarq = {}, {}, {}
    bosh_id = {}
    BOG = []                                          # aniq bog'langan yozuvlar (ay / asl) — oxirida tekshiriladi

    def idber(tur, key):
        T = LOCK[tur]
        if key not in T:
            T[key] = LOCK[tur + 'n']
            LOCK[tur + 'n'] += 1
        return T[key]

    for L in LESSONS:
        n = L['n']
        s = open(os.path.join(ROOT, '%d.html' % n), encoding='utf-8').read()
        VOC = grab(s, 'VOC') or []
        U = UNITS[L['u']]
        # --- lug'at
        vt = (LIST.get(n) or {}).get('v') or {}
        vseg = {}
        for seg in vt.get('m', []):
            if seg[1] == 'ar':
                vseg[seg[0]] = [seg[2], seg[3]]
        vl = vt.get('l') or {}
        cnt = {}
        voc0 = len(lug)
        for v in VOC:
            kn, asl, uz, ex = v[0], v[1], v[2], v[3]
            pk = plain(asl)
            cnt[pk] = cnt.get(pk, 0) + 1
            key = '%d|%s|%d' % (n, pk, cnt[pk])
            wid = idber('w', key)
            seen_w.add(key)
            r = {'id': wid, 'd': n, 'kn': kn}
            r.update(bolakla(asl))
            r['tur'] = turi(r['ar'], uz, 'fel' in r)
            t = TUZ.get(str(wid)) or {}
            r.update({k: t[k] for k in t if k != 'izoh'})
            bk = ('D.' if r['ar'].lstrip().startswith('.') else 'D:') + re.sub(r'[.\u0640\s]', '', r['ar']) if '.' in r['ar'] else r['ar']   # «..كَ» (zamir) va «كَ..» (harf) — boshqa so'z   # 19.11.2026: «بِ..», «بِ...», «بِـ...» — bitta so'z
            e4 = v[4] if len(v) > 4 and isinstance(v[4], dict) else {}
            if e4.get('ay') or e4.get('asl'):         # 22.11.2026: darsning hamma so'zi lug'atda — eski so'z aniq bog'lanadi (docs/texnik.md 14)
                if e4.get('ay'):
                    r['ay'] = e4['ay']                # aynan shu ma'noli yozuv: o'z kartasi yo'q, holati o'shaniki
                else:
                    r['asl'] = e4['asl']              # yangi ma'no — o'z kartasi (keyingi ma'no)
                BOG.append(r)
            elif bk in bosh_id and bosh_id[bk] != wid:
                r['asl'] = bosh_id[bk]                # shu so'zning keyingi ma'nosi: so'z sanog'ida birinchisi, takrorda — o'z kartasi (takror.js)
            else:
                bosh_id[bk] = wid
            r['tk'] = 1 if (r['tur'] in ('soz', 'fel', 'harf', 'zamir') and 'asl' not in r and 'ay' not in r and t.get('tk', 1)) else 0   # 13.11.2026: harf va olmoshlar ham bazaga kiradi (atoqli ot — yo'q)
            r['uz'] = uz
            if str(wid) in MZ:
                r['mz'] = MZ[str(wid)]
            elif r['tur'] == 'fel':
                OGOH.append("%d-dars lug'at %s: fe'lning o'tgan zamon ma'nosi yo'q — src/build/lugat-moziy.json ga qo'shing (id %d)" % (n, kn, wid))
            if ex:                                      # 19.11.2026: misoldagi belgilar ({…} so'z, […] «...» o'rni) — faqat sahifada, ma'lumotga belgisiz
                r['x'] = [[re.sub(r'[{}\[\]]', '', t) if isinstance(t, str) else t for t in e] for e in ex]
            vi = len(lug) - voc0                      # Eshitish Луғат yo'lagida tartib = lug'at tartibi
            if str(vi) in vl and vi in vseg:
                if plain(vl[str(vi)][0]).split()[0].strip('.؟،') != plain(asl).split()[0].strip('.؟،'):
                    OGOH.append("%d-dars lug'at %s: ovoz yo'lagidagi so'z boshqa (%s) — ovoz ulanmadi" % (n, kn, vl[str(vi)][0]))
                else:
                    r['au'] = vseg[vi]
            r['yozuv'] = asl
            if len(v) > 4 and isinstance(v[4], dict):   # 19.11.2026: kitob lug'ati kelmagan darsda Claude qoralamasi (docs/texnik.md 14)
                e = v[4]
                for k0, k1 in (('y', 'y'), ('w', 'mw')):
                    if e.get(k0):
                        r[k1] = e[k0]                   # y — qo'shimcha ma'no, mw — matndagi o'rinlar («qator-so'z»)
                if e.get('q'):
                    r['qr'] = 1                         # qoralama: kitob lug'ati kelsa almashtiriladi
            lug.append(r)
        # --- mashq
        P = sah[n]
        lines = P['lines']
        nq = 0
        cq = {}
        for q in P['q']:
            ln = lines[q['l']]
            lp = ' '.join(plain(w[0]) for w in ln['w'])
            key = '%d|%s|%d' % (n, lp, q['w'])
            cq[key] = cq.get(key, 0) + 1
            if cq[key] > 1:
                key += '|%d' % cq[key]
            qid = idber('q', key)
            seen_q.add(key)
            t = [o[1] for o in q['ops'] if o[0] == q['v']]
            if len(t) != 1:
                OGOH.append("%d-dars %s (%s): to'g'ri javob variantlar ichida %d marta — savol olinmadi; variantlar: %s"
                            % (n, q['k'], q['v'], len(t), ' / '.join(o[0] for o in q['ops'])))
                continue
            r = {'id': qid, 'd': n, 'k': q['k'], 'gap': ln['w'], 'w': q['w'], 't': t[0], 'var': q['ops']}
            if ln['sp']:
                r['sp'] = ln['sp']
            if ln['tr']:
                r['tr'] = ln['tr']
            if q['am']:
                hl, hw = [int(x) for x in q['am'][0].split('-')]
                r['hk'] = [hl, hw]
                r['sabab'] = q['am'][1]
                if hl != q['l']:
                    r['oldgap'] = lines[hl]['w']       # hukm bergan so'z boshqa qatorda
            if q['qm']:
                r['q'] = q['qm']
            msh.append(r)
            nq += 1
        # --- takror kartasidagi gap (19.11.2026; lugat_gap.py): kitob misoli yoki dars matnidagi gap
        for r in lug[voc0:]:
            if r['tur'] != 'atoqli':
                g = gap_tanla(r, lines)
                if g:
                    r['g'] = g
        # --- qoida kartalari
        Q = grab(s, 'QT') or {}
        for k, v in Q.items():
            j = json.dumps(v, ensure_ascii=False)
            if k in QT and json.dumps(QT[k], ensure_ascii=False) != j:
                QTfarq.setdefault(k, set()).update([QTsrc[k], n])
        # --- dars
        aud = re.search(r'a%d-[0-9a-f]+\.mp3' % n, s)
        d = {'n': n, 'kitob': int(U[4]), 'bob': L['u'], 'bobnom': U[1], 'uz': L['uz'], 'ar': L['ar'],
             'sahifa': '%d.html' % n, 'holat': L['key'], 'lugat': len(VOC), 'mashq': nq,
             'eshitish': 1 if n in ESH else 0, 'h': manba_xesh(s)}
        if aud:
            d['audio'] = aud.group(0)
        if vt.get('f'):
            d['lv'] = vt['f']
        drs.append(d)

    # qoida matni: eng yangi yasalgan sahifadagisi (QT_TARTIB), har kalit bir marta
    for n in GUR['_tartib'] + [x for x in nums if x not in GUR['_tartib']]:
        if n not in nums:
            continue
        Q = grab(open(os.path.join(ROOT, '%d.html' % n), encoding='utf-8').read(), 'QT') or {}
        for k, v in Q.items():
            if k not in QT:
                QT[k], QTsrc[k] = v, n
    qrows = []
    for k in sorted(QT):
        g = GUR.get(k) or {}
        r = {'k': k, 'nom': QT[k][0], 'g': g.get('g', 'boshqa')}
        if g.get('kb'):
            r['kb'] = g['kb']
        r['d'] = QTsrc[k]
        r['matn'] = QT[k][1]
        qrows.append(r)

    # --- qulf: yo'qolgan kalitlar
    for tur, seen in (('w', seen_w), ('q', seen_q)):
        yoq = [k for k in LOCK[tur] if k not in seen]
        if yoq and not ochir:
            print("TO'XTA: quyidagi yozuvlar sahifalarda topilmadi (matn o'zgargan yoki o'chirilgan):")
            for k in yoq:
                print('   %s  id=%d  %s' % (tur, LOCK[tur][k], k))
            print("Matn tuzatilgan bo'lsa — src/build/idlar.json da kalitni yangisiga almashtiring (raqam saqlanadi).")
            print("Haqiqatan o'chirilgan bo'lsa — python3 src/build/ajrat.py --ochir")
            sys.exit(2)
        for k in yoq:
            LOCK['ochgan'][tur].append(LOCK[tur].pop(k))

    # --- aniq bog'langan yozuvlar (22.11.2026): ay — aynan shu ma'noli yozuv (o'zi bazaga kirmaydi, holati o'shaniki), asl — bosh yozuv
    BY = {r['id']: r for r in lug}
    for r in BOG:
        t0 = BY.get(r.get('ay') or r.get('asl'))
        if not t0:
            print("TO'XTA: %d-dars lug'at %s: bog'langan yozuv topilmadi (id %s)" % (r['d'], r['kn'], r.get('ay') or r.get('asl')))
            sys.exit(2)
        if r.get('ay'):
            if t0.get('ay'):
                r['ay'] = t0['ay']; t0 = BY[t0['ay']]
            r['asl'] = t0.get('asl') or t0['id']
        elif BY[r['asl']].get('asl') or BY[r['asl']].get('ay'):
            print("TO'XTA: %d-dars lug'at %s: asl bosh yozuv emas (id %s)" % (r['d'], r['kn'], r['asl']))
            sys.exit(2)
    yoz('lugat.json', '{"v":1,"s":[', lug, ']}')
    yoz('mashq.json', '{"v":1,"s":[', msh, ']}')
    yoz('qoida.json', '{"v":1,"guruh":%s,"s":[' % json.dumps(GUR['_guruh'], ensure_ascii=False), qrows, ']}')
    yoz('darslar.json', '{"v":1,"s":[', drs, ']}')
    with open(lock_p, 'w', encoding='utf-8') as f:
        json.dump(LOCK, f, ensure_ascii=False, indent=0, sort_keys=True)
        f.write('\n')
    tk = sum(1 for r in lug if r['tk'])
    print("lug'at: %d yozuv (takrorga %d) · mashq: %d savol · qoida: %d · dars: %d"
          % (len(lug), tk, len(msh), len(qrows), len(drs)))
    for o in OGOH:
        print('OGOHLANTIRISH:', o)
    if QTfarq:
        print("eslatma: qoida matni darslarda har xil:", {k: sorted(v) for k, v in QTfarq.items()})
    nog = [r['k'] for r in qrows if r['k'] not in GUR]
    if nog:
        print("eslatma: guruhi yozilmagan qoidalar (src/build/qoida-guruh.json):", nog)


if __name__ == '__main__':
    main()
