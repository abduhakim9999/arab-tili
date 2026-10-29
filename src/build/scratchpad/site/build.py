import os, re, base64, json, shutil, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tarkib

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get('OUT') or '/mnt/user-data/outputs/arab-tili'
VER = '149'

LESSONS = [
    # (raqam, manba, sarlavha, arabcha sarlavha, kalit, savollar soni)
    (1, '/mnt/user-data/outputs/lesson01/index.html', 'Саломлашиш ва танишиш', 'اَلسَّلَامُ عَلَيْكُمْ', 'dars01-holat', 10),
    (2, '/mnt/user-data/outputs/lesson02/index.html', 'Хавла ва Хадича', 'خَوْلَةُ وَخَدِيجَةُ', 'dars02-holat', 10),
    (3, '/mnt/user-data/outputs/lesson03/index.html', 'Муҳаммад ва Шариф', 'مُحَمَّدٌ وَشَرِيفٌ', 'dars03-holat', 9),
    (4, '/mnt/user-data/outputs/lesson04/index.html', 'Марям ва Зайнаб', 'مَرْيَمُ وَزَيْنَبُ', 'dars04-holat', 9),
    (70, '/mnt/user-data/outputs/lesson70/index.html', 'Асалда шифо бор', 'فِي الْعَسَلِ شِفَاءٌ', 'dars70-holat', 22),
    (71, '/mnt/user-data/outputs/lesson71/index.html', 'Зайнаб ва Марям дугонадир', 'زَيْنَبُ وَمَرْيَمُ صَدِيقَتَانِ', 'dars71-holat', 26),
    (72, '/mnt/user-data/outputs/lesson72/index.html', 'Врач ҳузурида', 'عِنْدَ الطَّبِيبِ', 'dars72-holat', 14),
    (73, '/mnt/user-data/outputs/lesson73/index.html', 'Соғлик — ўтмишда ва ҳозир', 'الصِّحَّةُ بَيْنَ الْمَاضِي وَالْحَاضِرِ', 'dars73-holat', 31),
    (74, '/mnt/user-data/outputs/lesson74/index.html', 'Инсон дам олишга эҳтиёж сезади', 'الْإِنْسَانُ يَحْتَاجُ إِلَى التَّرْوِيحِ', 'dars74-holat', 25),
    (91, '/mnt/user-data/outputs/lesson91/index.html', 'Аёл кишининг ишлаши', 'عَمَلُ الْمَرْأَةِ', 'dars91-holat', 30),
    (92, '/mnt/user-data/outputs/lesson92/index.html', 'Ишлаш учун четга кетиш', 'الِاغْتِرَابُ لِلْعَمَلِ', 'dars92-holat', 17),
    (93, '/mnt/user-data/outputs/lesson93/index.html', 'Ишлаш сўрашдан яхшироқ', 'عَمَلٌ خَيْرٌ مِنْ مَسْأَلَةٍ', 'dars93-holat', 41),
]

LISTEN = [74]
HDRD = '/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/hdr'
HCFG = json.load(open(HDRD + '/hcfg.json'))
DROP0 = {70, 74, 91, 92, 93}
TITLE = {1: 0, 2: 0, 3: 0, 4: 0, 70: 1, 71: 0, 72: 0, 73: 0, 74: 1, 91: 1, 92: 1, 93: 1}  # mavzu qatori  # 0-qatori «الدرس …» — sarlavha bilan takrorlanmasin
U1 = ('الْوَحْدَةُ الْأُولَى: التَّحِيَّةُ وَالتَّعَارُفُ', '1-боб: Саломлашиш ва танишиш')
U21 = ('الْوَحْدَةُ الْأُولَى: الْعِنَايَةُ بِالصِّحَّةِ', '1-боб: Соғлиққа эътибор')
U22 = ('الْوَحْدَةُ الثَّانِيَةُ: التَّرْوِيحُ عَنِ النَّفْسِ', '2-боб: Ўзига дам бериш')
U26 = ('الْوَحْدَةُ السَّادِسَةُ: الْمِهَنُ', '6-боб: Касблар')
# Dars boshi: bismillah, keyin dars raqami va mavzu. Ваҳда nomi faqat ваҳданинг 1-darsida (SHOWU) yoziladi.
SHOWU = {1, 70, 74}
TKNEW = {l[0] for l in LESSONS}  # Таркиб: yangi ko'rinish (tarkib2.js) — hamma darslarda
TOPIC = {1: 'topic_hiwar.mp3', 2: 'topic_hiwar.mp3', 3: 'topic_hiwar.mp3', 4: 'topic_hiwar.mp3'}  # МАВЗУ (حِوَارْ) ovozi — ElevenLabs Mehdi VO, vaqf bilan; sarlavhadan keyin qo'shiladi  # Таркиб'нинг янги кўриниши (tarkib2.js) — синов
LN = {3: 'اَلدَّرْسُ الثَّالِثُ', 4: 'اَلدَّرْسُ الرَّابِعُ'}  # 3–4-darslar: raqam ElevenLabs (Mehdi) bilan qo'shilgan (hdr/mk_hnum.py); h3/h4 dagi eski «الْحِوَارُ» (cf[2]…) kesiladi, mavzu — matndagi حِوَارٌ
HDR = {3: (('الْحِوَارُ', 'Суҳбат'), ''), 4: (('الْحِوَارُ', 'Суҳбат'), ''), 1: (U1, 'اَلدَّرْسُ الْأَوَّلُ'), 2: (U1, 'اَلدَّرْسُ الثَّانِي'), 70: (U21, 'اَلدَّرْسُ السَّبْعُونَ'), 71: (U21, 'اَلدَّرْسُ الْحَادِي وَالسَّبْعُونَ'),
       72: (U21, 'اَلدَّرْسُ الثَّانِي وَالسَّبْعُونَ'), 73: (U21, 'اَلدَّرْسُ الثَّالِثُ وَالسَّبْعُونَ'),
       74: (U22, 'اَلدَّرْسُ الرَّابِعُ وَالسَّبْعُونَ'),
       91: (U26, 'اَلدَّرْسُ الْحَادِي وَالتِّسْعُونَ'), 92: (U26, 'اَلدَّرْسُ الثَّانِي وَالتِّسْعُونَ'),
       93: (U26, 'اَلدَّرْسُ الثَّالِثُ وَالتِّسْعُونَ')}

UNIT = {1: 'k1b1', 2: 'k1b1', 3: 'k1b1', 4: 'k1b1', 70: 'k2b1', 71: 'k2b1', 72: 'k2b1', 73: 'k2b1', 74: 'k2b2', 91: 'k2b6', 92: 'k2b6', 93: 'k2b6'}
# kalit: [yorliq, arabcha nomi, kitob, belgi foni]
UNITS = {'k1b1': ['1-БОБ', 'التَّحِيَّةُ وَالتَّعَارُفُ', '1-КИТОБ', '#E3F2EA', '1', 'الْكِتَابُ الْأَوَّلُ'],
         'k2b1': ['1-БОБ', 'الْعِنَايَةُ بِالصِّحَّةِ', '2-КИТОБ', '#FDE8E4', '2', 'الْكِتَابُ الثَّانِي'],
         'k2b2': ['2-БОБ', 'التَّرْوِيحُ عَنِ النَّفْسِ', '2-КИТОБ', '#E4EEF8', '2', 'الْكِتَابُ الثَّانِي'],
         'k2b6': ['6-БОБ', 'الْمِهَنُ', '2-КИТОБ', '#F3EBDD', '2', 'الْكِتَابُ الثَّانِي']}
shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(OUT, exist_ok=True)
font_b64 = None
AUD = []

HEAD_ADD = '''<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#0f766e">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-192.png">
<link rel="stylesheet" href="shell.css">
<script src="tg.js" data-key="{key}" data-home="{home}"></script>
<style>
.home{{display:inline-block;margin:2px 0 4px;font-size:14px;color:var(--ac);text-decoration:none}}
</style>
</head>'''

for num, src, uz, ar, key, nq in LESSONS:
    s = open(src, encoding='utf-8').read()
    # manba yorliqlari o'quvchiga kerak emas
    s = s.replace('<div class="qmn">📘 белгилидан бошқалари — Ҳужжатда йўқ, умумий наҳв китобларидан</div>', '')
    s = s.replace('<div class="qmn">Ҳужжатда йўқ — умумий наҳв китобларидан</div>', '')
    s = s.replace('📘 Бизнинг китобда (65-дарс) — саҳифада шу:', '✅ Саҳифада шу:')
    a = s.find('<!DOCTYPE html>')
    b = s.find('</body>\n</html>', a)
    assert a > 0 and b > a
    if font_b64 is None:
        i = s.find('window.DARSFONT="') + 17
        font_b64 = s[i:s.find('"', i)]
    doc = s[a:b]
    assert doc.count('</head>') == 1
    home = './#k' + UNITS[UNIT[num]][4] if num in UNIT else './'
    doc = doc.replace('</head>', HEAD_ADD.format(key=key, home=home))
    assert doc.count('<h1>') == 1
    doc = doc.replace('<h1>', '<a class="home" href="' + home + '">‹ Дарслар</a>\n<h1>')
    t0 = s.find('<script>window.DARSFONT=')
    t1 = s.rfind('</body></html>')
    assert t0 > b and t1 > t0
    tail = s[t0:t1]
    tail = re.sub(r'window\.DARSFONT="[^"]*"', 'window.DARSFONT=""', tail)
    tail, nf = re.subn(r'var m=\[0,window\.DARSFONT\|\|""\];if\(!m\[1\]\)\{say\("[^"]*"\);return\}(if\(!window\.FontFace\)\{say\("[^"]*"\);return\})\s*var bin=atob\(m\[1\]\),u=new Uint8Array\(bin\.length\);for\(var i=0;i<bin\.length;i\+\+\)u\[i\]=bin\.charCodeAt\(i\);\s*var f=new FontFace\("DarsNaskh",u\.buffer\);',
                       lambda m: m.group(1) + 'var f=new FontFace("DarsNaskh","url(naskh.woff)");', tail)
    assert nf == 1, (num, nf)
    assert tail.count('if(S.tab&&S.tab!=1)tab(S.tab);') + doc.count('if(S.tab&&S.tab!=1)tab(S.tab);') == 1, num
    tail = tail.replace('if(S.tab&&S.tab!=1)tab(S.tab);', '')
    doc = doc.replace('if(S.tab&&S.tab!=1)tab(S.tab);', '')
    doc += tail
    # Таркиб режими: сўз ости ёзувлари, қавслар, гап тури
    doc, TKG, TKT = tarkib.apply(doc)
    doc = doc.replace('>Тартиб</button>', '>Таркиб</button>')
    # so'zni bosganda ovoz chiqmaydi (avtomatik kesilgan ovozlar noaniq edi) — faqat belgilanadi
    assert doc.count('hl(+q[0],[+q[1]]);pw(+q[0],+q[1])') == 1, num
    doc = doc.replace('hl(+q[0],[+q[1]]);pw(+q[0],+q[1])', 'hl(+q[0],[+q[1]])')
    doc = doc.replace('👆 Босинг — эшитасиз<br>', '')
    am = re.search(r'src="data:audio/mpeg;base64,([A-Za-z0-9+/=]+)"', doc)
    assert am and doc.count('data:audio/mpeg;base64,') == 1, num
    ab = base64.b64decode(am.group(1))
    doc = doc[:am.start()] + 'src="__AUDIO__"' + doc[am.end():]
    import hashlib, subprocess, tempfile
    if num in HDR:
        # sarlavha (bismillah + bob + dars) asosiy audioning boshiga qo'shiladi; TM vaqtlari suriladi
        mt = list(re.finditer(r'\bTM=\[\[', doc)); assert len(mt) == 1, (num, len(mt)); i = mt[0].start() + 3
        TMv, e = json.JSONDecoder().raw_decode(doc, i)
        drop0 = num in DROP0
        if drop0:
            TMv = [x for x in TMv if x[0] != 0]
        tcut = max(0.0, TMv[0][2] - 0.3) if drop0 else 0.0
        td = tempfile.mkdtemp()
        open(td + '/m.mp3', 'wb').write(ab)
        hp = '%s/h%d.mp3' % (HDRD, num)
        dur = lambda p: float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))
        hd = dur(hp)
        (ua, uu), la = HDR[num]
        cf = HCFG[str(num)]
        s0, s1 = cf[0], cf[1]
        if num in LN:
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', hp, '-af', 'atrim=0:%.3f' % cf[2], '-ac', '1', '-b:a', '64k', td + '/hh.mp3'], check=True)
            hp = td + '/hh.mp3'
            hd = dur(hp)
            rows = [{'a': LN[num], 'u': '%d-дарс' % num, 't': [s0, round(hd, 2)]}]
        elif num in SHOWU:
            rows = [{'a': ua, 'u': uu, 't': [s0, s1]}, {'a': la, 'u': '%d-дарс' % num, 't': [s1, round(hd, 2)]}]
        else:
            # ваҳда qismi (s0…s1) ovozdan kesiladi
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', hp, '-filter_complex',
                            '[0:a]atrim=0:%.3f,asetpts=PTS-STARTPTS[a];[0:a]atrim=%.3f,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1[o]' % (s0, s1),
                            '-map', '[o]', '-ac', '1', '-b:a', '64k', td + '/hh.mp3'], check=True)
            hp = td + '/hh.mp3'
            hd = dur(hp)
            rows = [{'a': la, 'u': '%d-дарс' % num, 't': [s0, round(hd, 2)]}]
        he = hd  # sarlavha qatorlari oxiri
        tp = None
        if num in TOPIC:
            def meanv(p):
                r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
                return float(re.search(r'mean_volume: (-?[\d.]+)', r).group(1))
            src_t = HDRD + '/' + TOPIC[num]
            g = meanv(hp) - meanv(src_t)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', hp, '-i', src_t, '-filter_complex',
                            '[0:a]aformat=sample_rates=44100:channel_layouts=mono[a];anullsrc=r=44100:cl=mono,atrim=0:0.45[s];'
                            '[1:a]volume=%.2fdB,alimiter=limit=0.95,aformat=sample_rates=44100:channel_layouts=mono[b];[a][s][b]concat=n=3:v=0:a=1[o]' % g,
                            '-map', '[o]', '-ac', '1', '-b:a', '64k', td + '/ht.mp3'], check=True)
            tp = [round(hd + 0.45, 2), round(dur(td + '/ht.mp3'), 2)]
            hp = td + '/ht.mp3'
            hd = dur(hp)
        GAPH = 0.4
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', hp, '-i', td + '/m.mp3', '-filter_complex',
                        '[0:a]aformat=sample_rates=44100:channel_layouts=mono[a];anullsrc=r=44100:cl=mono,atrim=0:%.2f[s];'
                        '[1:a]atrim=%.3f,asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[b];[a][s][b]concat=n=3:v=0:a=1[o]' % (GAPH, tcut),
                        '-map', '[o]', '-ac', '1', '-b:a', '64k', td + '/o.mp3'], check=True)
        ab = open(td + '/o.mp3', 'rb').read()
        sh = hd + GAPH - tcut
        TMv = [x[:2] + [round(v + sh, 2) for v in x[2:]] for x in TMv]
        if tp:
            TMv = [x for x in TMv if x[0] != 0]
            TMv.insert(0, [0, 0, tp[0], tp[1], tp[1]])
        doc = doc[:i] + json.dumps(TMv) + doc[e:]
        if drop0:
            doc = doc.replace('</head>', '<style>#tx>.ln:first-child{display:none}</style></head>', 1)
        HJS = '<script>window.HDR=' + json.dumps({'s0': s0, 'e': round(he, 2), 'rows': rows}, ensure_ascii=False) + '</script>\n<script src="hdr.js"></script>\n'
    else:
        HJS = ''
    an = 'a%s-%s.mp3' % (num, hashlib.md5(ab).hexdigest()[:8])
    open(os.path.join(OUT, an), 'wb').write(ab)
    AUD.append(an)
    doc = doc.replace('src="__AUDIO__"', 'src="' + an + '"', 1)
    if num in TITLE:
        k = TITLE[num] + 1
        sel = '#tx>.ln:nth-child(%d)' % k
        doc = doc.replace('</head>', '<style>' + sel + '{background:linear-gradient(180deg,rgba(15,122,79,.10),rgba(15,122,79,.03));border:1.5px solid rgba(15,122,79,.35);text-align:center;padding-top:22px;position:relative}'
                          + sel + '::before{content:"МАВЗУ";position:absolute;top:7px;left:0;right:0;text-align:center;font-size:11px;font-weight:800;letter-spacing:.14em;color:var(--ac)}'
                          + sel + ' .ws{justify-content:center}' + sel + ' .ws span{font-weight:700;color:var(--ac);font-size:calc(var(--fs,22px) + 6px)}'
                          + sel + ' .tr{text-align:center;font-weight:600;color:var(--tx)}</style></head>', 1)
    doc += HJS + '<script src="sarflink.js"></script>\n'
    doc += '<script>window.TKG=' + json.dumps(TKG, ensure_ascii=False) + ';window.TKT=' + json.dumps(TKT, ensure_ascii=False) + '</script>\n<script src="%s"></script>\n' % ('tarkib2.js' if num in TKNEW else 'tarkib.js')
    # joy faqat oxirgi ochilgan darsda eslab qolinadi; boshqa darslar boshidan ochiladi
    m_tg = re.search(r'<script src="tg.js" data-key="([^"]+)"[^>]*></script>', doc)
    if m_tg:
        JOY = '<script>(function(){try{var K="%s",N="%s",L=localStorage;if(L.getItem("joy-dars")!==N){var S=JSON.parse(L.getItem(K)||"{}")||{};if(S.at!=null||S.pos||S.tab){delete S.at;delete S.pos;delete S.tab;L.setItem(K,JSON.stringify(S))}}L.setItem("joy-dars",N)}catch(e){}})()</script>' % (m_tg.group(1), num)
        doc = doc[:m_tg.end()] + JOY + doc[m_tg.end():]
    doc += '<script src="shell.js"></script>\n'
    if num in LISTEN:
        doc += ('<style>.dh .lq{width:44px;height:44px;flex:none;border-radius:22px;border:1px solid var(--bd);background:var(--cd);color:var(--ac);display:flex;align-items:center;justify-content:center;text-decoration:none;margin-right:6px}</style>'
                '<script>(function(){var d=document.querySelector(".dh"),q=d&&d.querySelector(".q");if(!q)return;var a=document.createElement("a");a.className="lq";a.href="tinglash.html?d=%d";a.setAttribute("aria-label","Тинглаш");'
                'a.innerHTML=\'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="5" height="7" rx="2" fill="currentColor"/><rect x="16" y="14" width="5" height="7" rx="2" fill="currentColor"/></svg>\';d.insertBefore(a,q)})()</script>\n') % num
    doc += '<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(function(){})</script>\n</body>\n</html>\n'
    open('%s/%s.html' % (OUT, num), 'w', encoding='utf-8').write(doc)

open(OUT + '/naskh.woff', 'wb').write(base64.b64decode(font_b64))
for f in ('icon-192.png', 'icon-512.png', 'icon-maskable-512.png'):
    shutil.copy(os.path.join(HERE, f), OUT)

shutil.copytree(os.path.join(HERE, '..', 'fq'), OUT + '/fq')  # fe'l testi audiolari (bot uchun)
for f in ('tg.js', 'shell.js', 'shell.css', 'hdr.js', 'sarflink.js', 'fel.html', 'tarkib.js', 'tarkib2.js'):
    shutil.copy(os.path.join(HERE, f), OUT)
idx = open(os.path.join(HERE, 'index.tpl.html'), encoding='utf-8').read()
idx = idx.replace('__LESSONS__', json.dumps([{"n": l[0], "uz": l[2], "ar": l[3], "key": l[4], "q": l[5], "u": UNIT.get(l[0], 0)} for l in LESSONS], ensure_ascii=False))
idx = idx.replace('__UNITS__', json.dumps(UNITS, ensure_ascii=False))
open(OUT + '/index.html', 'w', encoding='utf-8').write(idx)

json.dump({
    "name": "نور الطالب", "short_name": "نور الطالب", "lang": "uz",
    "start_url": "./", "scope": "./", "display": "standalone",
    "background_color": "#f6f3ec", "theme_color": "#0f766e",
    "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
              {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
              {"src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]
}, open(OUT + '/manifest.webmanifest', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

LD = os.path.join(HERE, '..', 'listen')
LST = []
for n in LISTEN:
    L0 = [l for l in LESSONS if l[0] == n][0]
    ab = open(os.path.join(LD, 'l%d.mp3' % n), 'rb').read()
    fn = 'l%d-%s.mp3' % (n, hashlib.md5(ab).hexdigest()[:8])
    open(os.path.join(OUT, fn), 'wb').write(ab); AUD.append(fn)
    J = json.load(open(os.path.join(LD, 'l%d.json' % n), encoding='utf-8'))
    LST.append({'n': n, 'uz': L0[2], 'ar': L0[3], 'f': fn, 'm': J['m'], 'l': J['l']})
tp = open(os.path.join(HERE, 'tinglash.tpl.html'), encoding='utf-8').read().replace('__LIST__', json.dumps(LST, ensure_ascii=False))
open(OUT + '/tinglash.html', 'w', encoding='utf-8').write(tp)

files = ['./', 'index.html', 'tinglash.html', 'fel.html', 'tg.js', 'shell.js', 'shell.css', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'] + \
        ['%s.html' % l[0] for l in LESSONS] + ['feellar.html', 'sarf.html', 'sarf-idx.json', 'sarflink.js', 'tarkib.js', 'tarkib2.js', 'hdr.js', 'naskh.woff'] + AUD
sw = open(os.path.join(HERE, 'sw.tpl.js'), encoding='utf-8').read()
sw = sw.replace('__VER__', VER).replace('__FILES__', json.dumps(files))
open(OUT + '/sw.js', 'w', encoding='utf-8').write(sw)

print('ok', sorted(os.listdir(OUT)))
