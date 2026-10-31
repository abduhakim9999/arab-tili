# -*- coding: utf-8 -*-
"""Eshitish ovozlari uchun YAGONA qolip (31.10.2026). Har darsda bir xil ishlatiladi.

  python3 src/build/ovoz.py matn NN      -> listen/uNN/matn.json : ElevenLabs'ga beriladigan hamma matnlar
                                            (o'zbekcha gaplar, lug'at arabcha+o'zbekcha, dars raqami)
  python3 src/build/ovoz.py tekshir NN   -> o'zbekcha bo'laklarni bitta faylga yig'adi: align/in/kNN.uz.mp3
                                            (push qilinsa GitHub Action Whisper bilan o'zbekcha eshitib yozadi)
  python3 src/build/ovoz.py natija NN    -> align/out/kNN.uz.whisper.json ni yuborilgan matn bilan solishtiradi;
                                            mos kelmagan bo'laklarni chiqaradi (talaffuz xatosi gumoni)

Qoidalar (o'zgartirish — faqat shu yerda va talaffuz.json da):
  * O'zbekcha matn ovozga DOIM lotinda beriladi (kirilcha avtomatik o'giriladi); qavslar vergulga.
  * talaffuz.json["uz"] — ovoz noto'g'ri o'qiydigan so'zlar almashtiriladi (vrach -> shifokor ...). Yangi xato
    topilsa — faqat shu faylga bir qator qo'shiladi.
  * Lug'at o'zbekchasi: «ma'no; jam: ko'pligi.» (ko'plik avtomatik: har ma'noga -lar; kerak bo'lsa vocNN.py da
    OVOZ = {tartib: 'matn'} bilan almashtiriladi).
  * Lug'at arabchasi vaqfsiz: tanvin nun bilan yoziladi (سِتٌّ -> سِتُّنْ), har so'z (juft) alohida generatsiya.
"""
import os, re, sys, json, difflib, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
S = '/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad'
TAL = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'talaffuz.json'), encoding='utf-8'))

# ---------- kirilcha -> lotin (o'zbek) ----------
CY = {'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'ғ': 'gʻ', 'д': 'd', 'ё': 'yo', 'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y',
      'к': 'k', 'қ': 'q', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ў': 'oʻ', 'ф': 'f', 'х': 'x', 'ҳ': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': 'ʼ', 'ь': '', 'э': 'e',
      'ю': 'yu', 'я': 'ya'}
VOW = set('аеёиоуўэюяaeiou')


def lat(t):
    out = []
    for i, ch in enumerate(t):
        lo = ch.lower()
        if lo == 'е':
            prev = t[i - 1].lower() if i else ' '
            r = 'ye' if (not prev.isalpha() or prev in VOW or prev in 'ъь') else 'e'
        elif lo in CY:
            r = CY[lo]
        else:
            out.append(ch); continue
        if ch != lo and r:
            r = r[0].upper() + r[1:]
        out.append(r)
    return ''.join(out)


def uz_ovoz(t):
    """Sahifadagi kirilcha matn -> ovoz uchun lotin matn (talaffuz.json qo'llanadi)."""
    t = re.sub(r'\((мз|мн|мн\.|эр\.исми)\)', '', t)
    t = t.replace('ёки.', 'ёки ')
    t = lat(t)
    t = re.sub(r'\s*\(\s*', ', ', t); t = re.sub(r'\s*\)\s*', ', ', t)
    t = t.replace('“', '').replace('”', '').replace('«', '').replace('»', '').replace('—', ',')
    for a, b in TAL['uz'].items():
        t = re.sub(r'(?<![\wʻʼ])%s(?![\wʻʼ])' % re.escape(a), b, t)
        t = re.sub(r'(?<![\wʻʼ])%s(?![\wʻʼ])' % re.escape(a.capitalize()), b.capitalize(), t)
    t = re.sub(r'\s*,\s*([,.!?;:])', r'\1', t); t = re.sub(r',\s*,', ',', t)
    t = re.sub(r'\s+', ' ', t).strip(' ,')
    if t and t[-1] not in '.!?':
        t += '.'
    return t[0].upper() + t[1:] if t else t


# ---------- arabcha: vaqfsiz (tanvin -> nun) ----------
def ar_vaqfsiz(w):
    w = w.strip()
    w = re.sub(r'ةٌ$', 'تُنْ', w); w = re.sub(r'ةٍ$', 'تِنْ', w); w = re.sub(r'ةً$', 'تَنْ', w)
    w = re.sub(r'ٌّ$', 'ُّنْ', w); w = re.sub(r'ٍّ$', 'ِّنْ', w)
    w = re.sub(r'(ًا|اً)$', 'َنْ', w); w = re.sub(r'ًى$', 'َنْ', w)
    w = re.sub(r'ٌ$', 'ُنْ', w); w = re.sub(r'ٍ$', 'ِنْ', w); w = re.sub(r'ً$', 'َنْ', w)
    return w


def voc_ar(s):
    """«طَالِبٌ ج طُلَّابٌ», «سِتٌّ مؤ. سِتَّةٌ», «فَكَّرَ – يُفَكِّرُ (فِي ..)» -> «طَالِبُنْ، طُلَّابُنْ»"""
    s = re.sub(r'\([^)]*\)', ' ', s)
    parts = re.split(r'\s+(?:ج|مؤ\.|–|-)\s+|،', s)
    ws = []
    for p in parts:
        p = p.strip()
        if not p or p.startswith('..') or '..' in p:
            continue
        ws.append(' '.join(ar_vaqfsiz(x) for x in p.split()))
    return '، '.join(ws) or ('وَ' if s.strip().startswith('وَ') else s.strip())


def voc_uz(entry):
    num, ar, mns, ex = entry[:4]
    fem = '(мн)' in mns[0]
    m = re.sub(r'^\d+\.\s*', '', mns[0])
    m = re.sub(r'\s\d+\.\s*', '; ', m)
    base = uz_ovoz(m).rstrip('.')
    items = []
    for x in re.split(r'[;,]\s*', base):
        if x and not re.fullmatch(r'[\d\s\-]+', x) and x.lower() not in [i.lower() for i in items]:
            items.append(x)
    t = ', '.join(items) + (', muannas uchun' if fem else '')
    if ' ج ' in ar and not re.search(r' ج \.\.', ar):
        t += '; jam: ' + ', '.join(i.lower() + 'lar' for i in items)
    return t[0].upper() + t[1:] + '.'


# ---------- tartib son (dars raqami) ----------
BIR = ['', 'bir', 'ikki', 'uch', 'toʻrt', 'besh', 'olti', 'yetti', 'sakkiz', 'toʻqqiz']
ON = ['', 'oʻn', 'yigirma', 'oʻttiz', 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', 'toʻqson']


def tartib(n):
    s = ('bir yuz ' if n >= 100 else '') + ON[(n % 100) // 10] + (' ' if (n % 100) // 10 and n % 10 else '') + BIR[n % 10]
    s = s.strip()
    s += 'nchi' if s[-1] in 'aeiou' else 'inchi'
    return s[0].upper() + s[1:] + ' dars.'


# ---------- dars ma'lumotini yuklash ----------
def load(nn):
    d = os.path.join(S, 'd%02d' % nn if nn < 10 else 'd%d' % nn)
    g = {'__file__': os.path.join(d, 'x.py')}
    cwd = os.getcwd(); os.chdir(d)
    exec(open('../d71/data71.py', encoding='utf-8').read(), g)
    for f in ('../d93/h93.py',):
        if nn >= 90 and os.path.exists(f):
            exec(open(f, encoding='utf-8').read(), g)
    exec(open([f for f in os.listdir('.') if f.startswith('data')][0], encoding='utf-8').read(), g)
    vf = [f for f in os.listdir('.') if f.startswith('voc') and f.endswith('.py')]
    if vf:
        exec(open(vf[0], encoding='utf-8').read(), g)
    os.chdir(cwd)
    return g


def cmd_matn(nn):
    g = load(nn)
    L, VOC, OV = g['L'], g.get('VOC', []), g.get('OVOZ', {})
    lines = {}
    for li, (sp, ws, tr) in enumerate(L):
        if li == 0:
            continue
        lines[li] = uz_ovoz(' '.join(c[0] for c in tr))
    voc = [{'i': i, 'ar': voc_ar(v[1]), 'uz': OV.get(i) or voc_uz(v)} for i, v in enumerate(VOC)]
    out = {'raqam_uz': tartib(nn), 'gaplar_uz': lines, 'lugat': voc}
    od = os.path.join(S, 'listen', 'u%02d' % nn); os.makedirs(od, exist_ok=True)
    json.dump(out, open(os.path.join(od, 'matn.json'), 'w'), ensure_ascii=False, indent=1)
    print(json.dumps(out, ensure_ascii=False, indent=1))


# ---------- tekshiruv ----------
def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))


def cmd_tekshir(nn, files_texts):
    """files_texts: [(mp3, matn), ...] — o'zbekcha bo'laklar. Bitta fayl + vaqtlar jadvali."""
    od = os.path.join(S, 'listen', 'u%02d' % nn); tmp = os.path.join(od, 'k'); os.makedirs(tmp, exist_ok=True)
    gap = os.path.join(tmp, 'gap.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', '1.5', gap], check=True)
    lst, tab, t = [], [], 0.0
    for k, (f, txt) in enumerate(files_texts):
        w = os.path.join(tmp, '%03d.wav' % k)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ar', '24000', '-ac', '1', w], check=True)
        d = dur(w); tab.append([t, t + d, txt, os.path.basename(f)]); t += d + 1.5
        lst += [w, gap]
    open(os.path.join(tmp, 'l.txt'), 'w').write(''.join("file '%s'\n" % x for x in lst))
    out = os.path.join(ROOT, 'align', 'in', 'k%02d.uz.mp3' % nn)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(tmp, 'l.txt'), '-b:a', '48k', out], check=True)
    json.dump(tab, open(os.path.join(od, 'tekshir.json'), 'w'), ensure_ascii=False, indent=0)
    print(out, len(tab), 'bo\'lak')


TRK = {'ç': 'ch', 'ş': 'sh', 'ı': 'i', 'ğ': 'g', 'c': 'j', 'ö': 'o', 'ü': 'u', 'â': 'a', 'q': 'k', 'x': 'h'}


def norm(s):
    s = s.lower()
    for a, b in TRK.items():  # Whisper o'zbekchani ba'zan turkcha harflarda yozadi — bir xil tovushlar
        s = s.replace(a, b).replace('ʻ', "'").replace('ʼ', "'").replace('‘', "'").replace('’', "'").replace('`', "'")
    return re.sub(r"[^a-z' ]", ' ', s).split()


def cmd_natija(nn, chegara=0.8):
    od = os.path.join(S, 'listen', 'u%02d' % nn)
    tab = json.load(open(os.path.join(od, 'tekshir.json')))
    W = json.load(open(os.path.join(ROOT, 'align', 'out', 'k%02d.uz.whisper.json' % nn)))
    yomon = 0
    for a, b, txt, f in tab:
        heard = ' '.join(w['text'] for w in W if a - 0.3 <= (w['start'] + w['end']) / 2 <= b + 0.3)
        r = difflib.SequenceMatcher(None, ' '.join(norm(txt)), ' '.join(norm(heard))).ratio()
        bad = [x for x in norm(txt) if not any(difflib.SequenceMatcher(None, x, y).ratio() > 0.75 for y in norm(heard))]
        if r < chegara or bad:
            yomon += 1
            print('⚠ %s  %.2f\n   yuborilgan: %s\n   eshitildi : %s\n   shubhali  : %s' % (f, r, txt, heard, ' '.join(bad)))
    print('Tekshirildi: %d bo\'lak, shubhali: %d' % (len(tab), yomon))


if __name__ == '__main__':
    c, nn = sys.argv[1], int(sys.argv[2])
    if c == 'matn':
        cmd_matn(nn)
    elif c == 'natija':
        cmd_natija(nn)
    elif c == 'tekshir':
        # bo'laklar ro'yxati: listen/uNN/tekshir_kirish.json = [[mp3, matn], ...]
        cmd_tekshir(nn, json.load(open(os.path.join(S, 'listen', 'u%02d' % nn, 'tekshir_kirish.json'))))
