#!/usr/bin/env python3
"""Yo'riqnoma o'ynatkichi (qollanma.js) uchun haqiqiy ekran rasmlari va bosiladigan joylar (docs/texnik.md 20).

    python3 src/build/qollanma.py [--ish DIR] [--faqat-yig]

Repo ildizidan ishga tushiriladi (~3 daqiqa). O'zi vaqtinchalik server ochadi, ilovani Playwright (Chrome) bilan bosib chiqadi
(yorug' va tungi ko'rinishda), natijani yozadi:
    qol/<tema>-<ekran>.webp   — ekran rasmlari (tema: light | dark)
    qol/mavzu.js              — mavzular: Qollanma.qosh(kalit, { nom, keyingi, ekran: {ekran: {nishon: [x, y, w, h]}}, qadam: [...] })
Ilova ko'rinishi o'zgarsa — qayta ishga tushiriladi (rasm va koordinatalar yangilanadi). Qo'lda o'zgartirilmaydi.

Yangi mavzu: 1) ssenariy() ga kerakli ekranlar qo'shiladi — ol(nom, {nishon: selektor}); selektor oldidagi «*» — hamma mos
elementlarning umumiy to'rtburchagi; 2) MAVZU ga qadamlar yoziladi (maydonlar — qollanma.js boshidagi izohda;
«ch» — ekran rasmisiz chizma qadami: pog'onalar).
--ish DIR      — xom rasmlar va koordinatalar papkasi (sukut: /tmp/qollanma-ish; repoga kirmaydi)
--faqat-yig    — ilovani qayta bosib chiqmasdan, --ish dagi tayyor rasmlardan qayta yig'adi (faqat MAVZU matni o'zgarganda)
Kerak: pip install playwright pillow; Chrome — /usr/bin/google-chrome (boshqa joyda bo'lsa: CHROME=/yo'l).
"""
import sys, os, json, threading, http.server, socketserver, functools

W, H, EN = 390, 844, 720          # ekran o'lchami (CSS px) va saqlanadigan rasm eni
TEMALAR = ('light', 'dark')

# ---------------------------------------------------------------- mavzular (matn — kirillcha; «…» ichi o'ynatkichda ajratib ko'rsatiladi)
MAVZU = [
 ('soz', dict(nom='Сўзлар ва поғоналар', keyingi='takror', qadam=[      # «Машқ»га биринчи киришда бир марта ўзи очилади (takror.html KQO)
  dict(s='bosh', t='boshla', a='tap', go='dars', c='Аввал дарсни очинг: матнни ўқинг ва эшитинг'),
  dict(s='dars', t='tmashq', f='tabs', a='tap', go='dmashq', c='Кейин шу дарснинг «Машқ»ини ишланг'),
  dict(ch='tush', c='«Машқ» тугагач, дарс сўзлари ўзи «ўрганяпман» поғонасига тушади'),
  dict(ch='bildi', c='Ҳар куни такрорланг. Сўзни {B} кун кетма-кет тўғри топсангиз — «биламан»га кўтарилади'),
  dict(ch='must', c='{M} кундан кейин ҳам тўғри топсангиз — «мустаҳкам» бўлади'),
  dict(ch='xato', c='Хато топсангиз — «билмайман»га тушади. Тўғри топиб, яна кўтарасиз'),
  dict(s='mashq', t='go', f='band', a='look', c='Такрорлаш учун ҳар куни «Машқ» бўлимида «Бошлаш»ни босинг'),
 ])),
 ('takror', dict(nom='Такрорлаш', keyingi='lugat', qadam=[
  dict(s='bosh', t='mashq', f='nav', a='tap', go='mashq', c='«Машқ»ни босинг. Устидаги сон — бугун такрорланадиган сўзлар'),
  dict(s='mashq', t='go', f='band', a='tap', go='savol', c='«Бошлаш»ни босинг'),
  dict(s='savol', t='soz', a='look', c='Сўз чиқади. Маъносини ичингизда эслаб кўринг'),
  dict(s='savol', t='ko', a='tap', go='javob', c='«Кўрсатиш»ни босинг — маъноси очилади. Ўзингиз эслагани билан солиштиринг'),
  dict(s='javob', t='j1', f=['mano', 'j0', 'j1'], a='tap', n='ok', c='Тўғри эслаган бўлсангиз — «Билдим»'),
  dict(s='javob', t='j0', f=['mano', 'j0', 'j1'], a='tap', n='no', c='Эслай олмаган бўлсангиз — «Билмадим»'),
  dict(s='oxir', t='to', f='kart', a='tap', go='oxir2', c='Баъзан «Сўз охири?» сўралади. Тўғри ҳаракатни танланг — тўғри бўлса, яшил бўлади'),
  dict(s='xato', t=['no', 'ok'], f='kart', a='look', c='Хато бўлса: танлаганингиз — қизил, тўғриси — яшил. Пастда сабаби ёзилади'),
  dict(s='xato', t='kn', a='tap', go='tamom', c='«Кейинги»ни босиб, давом этинг'),
  dict(s='tamom', t='band', a='look', c='Ҳаммаси тугагач — «Бугунга тамом». Эртага яна шу ердан давом этасиз'),
 ])),
 ('lugat', dict(nom='Луғат', qadam=[
  dict(s='tamom', t='lugat', a='tap', go='lugat', c='«Машқ» ичидаги «Луғат»ни очинг — ҳамма сўзларингиз шу ерда'),
  dict(s='lugat', t='sonlar', a='look', c='Тепада — ҳар поғонада нечта сўз борлиги. Сонни боссангиз, фақат ўша сўзлар қолади'),
  dict(s='lugat', t='sx', f='row', a='look', c='«ўрганяпман · 1/3» — бу сўз {B} кундан 1 куни тўғри топилган'),
  dict(s='lugat', t=['ab', 'bm'], f='row', a='look', c='Ўзингиз ҳам белгилай оласиз: ✓ — аниқ биламан, 🔖 — билмайман'),
 ])),
]

# ---------------------------------------------------------------- ilovani bosib chiqish
RECT = """(q) => {
  const hammasi = q[0] === '*';
  const els = (hammasi ? [...document.querySelectorAll(q.slice(1))] : [document.querySelector(q)]).filter(e => e && e.getBoundingClientRect().width > 0);
  if (!els.length) return null;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  els.forEach(e => { const r = e.getBoundingClientRect(); x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
  return [x0 / innerWidth, y0 / innerHeight, (x1 - x0) / innerWidth, (y1 - y0) / innerHeight].map(v => Math.round(v * 1000) / 1000);
}"""
# kirish so'ralmaydi (KORISH), tasodif har safar bir xil (savollar tartibi o'zgarmasin)
BOSH = ("window.KORISH=true;(function(){var a=20261114;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);"
        "t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();")


def sahifa(br, tema):
    ctx = br.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, color_scheme=tema)
    ctx.add_init_script(BOSH)
    ctx.route('**/api/**', lambda r: r.abort())
    return ctx.new_page()


def takror_ochish(pg, U):
    pg.goto(U + 'takror.html'); pg.wait_for_selector('#go'); pg.wait_for_timeout(1200)
    if pg.query_selector('#yok'): pg.click('#yok')            # «Сўзлар бу ерга қандай тушади?» kartasi yopiladi
    pg.evaluate('scrollTo(0,0)')


def oxirgacha(pg):
    """«Сўз охири?» savoli chiqquncha: so'z kartalariga «Кўрсатиш» → «Билдим»."""
    for _ in range(80):
        if pg.query_selector('.tq-o button'): return
        if pg.query_selector('#ko'): pg.click('#ko'); pg.wait_for_timeout(120)
        j = pg.query_selector('#j1')
        if j: j.click(); pg.wait_for_timeout(180)
    raise SystemExit("«Сўз охири?» savoli chiqmadi")


def togri_variant(br, U):
    """Birinchi «Сўз охири?» savolida to'g'ri variant raqami (o'ynatkichda barmoq to'g'risini bosadi)."""
    pg = sahifa(br, 'light'); takror_ochish(pg, U); pg.click('#go'); pg.wait_for_timeout(700); oxirgacha(pg)
    pg.click('.tq-o button[data-n="0"]'); pg.wait_for_timeout(250)
    k = pg.evaluate("[...document.querySelectorAll('.tq-o button')].findIndex(b => b.classList.contains('ok'))")
    pg.context.close()
    assert k >= 0, 'to`g`ri variant topilmadi'
    return k


def ssenariy(br, U, tema, k, ish):
    pg = sahifa(br, tema); R = {}; xato = []
    pg.on('pageerror', lambda e: xato.append(str(e)[:200]))

    def ol(nom, nishon, kut=700):
        pg.wait_for_timeout(kut)
        pg.screenshot(path=os.path.join(ish, '%s-%s.png' % (tema, nom)))
        R[nom] = {n: pg.evaluate(RECT, q) for n, q in nishon.items()}
        yoq = [n for n, v in R[nom].items() if not v]
        assert not yoq, 'ekran «%s»: nishon topilmadi: %s' % (nom, yoq)

    pg.goto(U + 'yol.html'); pg.wait_for_selector('.q-nav'); pg.wait_for_timeout(1200)
    ol('bosh', {'mashq': '.q-nav a[href$="takror.html"]', 'nav': '.q-nav', 'boshla': '.y-b'})
    takror_ochish(pg, U)
    ol('mashq', {'go': '#go', 'band': '.mq-h', 'lugat': '.mq-lg'})
    pg.click('#go')
    ol('savol', {'soz': '.tq-c', 'ko': '#ko'})
    pg.click('#ko')
    ol('javob', {'mano': '.tq-m', 'j1': '#j1', 'j0': '#j0'})
    oxirgacha(pg)
    ol('oxir', {'to': '.tq-o button[data-n="%d"]' % k, 'kart': '.tq-c'})
    pg.click('.tq-o button[data-n="%d"]' % k)
    ol('oxir2', {'ok': '.tq-o button.ok', 'kart': '.tq-c'}, 250)      # to'g'ri javobdan 1 s keyin o'zi keyingisiga o'tadi
    # mashg'ulot oxirigacha; birinchi xato javob — «xato» ekrani
    for _ in range(600):
        pg.wait_for_timeout(120)
        if 'xato' not in R and pg.query_selector('.tq-o button.no'):
            ol('xato', {'ok': '.tq-o button.ok', 'no': '.tq-o button.no', 'kn': '#kn', 'kart': '.tq-c'}, 0)
        if pg.query_selector('#kn'): pg.click('#kn'); continue
        o = pg.query_selector('.tq-o button:not([disabled])')
        if o: o.click(); pg.wait_for_timeout(250); continue
        if pg.query_selector('#ko'): pg.click('#ko'); pg.wait_for_timeout(120)
        j = pg.query_selector('#j1')
        if j: j.click(); continue
        if not pg.query_selector('#ko'): break
    assert 'xato' in R, 'xato javob ekrani olinmadi (hamma savolda 1-variant to`g`ri chiqdi)'
    pg.wait_for_timeout(700); pg.evaluate('scrollTo(0,0)')
    ol('tamom', {'band': '.mq-h', 'lugat': '.mq-lg'})
    pg.click('.mq-lg'); pg.wait_for_timeout(1000); pg.evaluate('scrollTo(0,0)')
    ol('lugat', {'sonlar': '*.lg-hb', 'sx': '.lg-r .lg-s', 'ab': '.lg-r .lg-ab', 'bm': '.lg-r .lg-bm', 'row': '.lg-r'})
    # dars sahifasi (eng oxirida — takror holatiga ta'sir qilmasin): birinchi kirishdagi tur yopiladi
    pg.goto(U + '1.html'); pg.wait_for_selector('#t3'); pg.wait_for_timeout(2500)
    if pg.query_selector('.tsk'): pg.click('.tsk'); pg.wait_for_timeout(500)
    ol('dars', {'tmashq': '#t3', 'tabs': '.tabs'})
    pg.click('#t3')
    ol('dmashq', {}, 1200)
    pg.context.close()
    assert not xato, 'sahifa xatosi: %s' % xato
    return R


def bosib_chiq(ish):
    from playwright.sync_api import sync_playwright

    class Jim(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Jim, directory='.'))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    U = 'http://127.0.0.1:%d/' % srv.server_address[1]
    chrome = os.environ.get('CHROME', '/usr/bin/google-chrome')
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=chrome) if os.path.exists(chrome) else p.chromium.launch()
        k = togri_variant(br, U)
        R = {t: ssenariy(br, U, t, k, ish) for t in TEMALAR}
        br.close()
    srv.shutdown()
    if R['light'] != R['dark']: print('DIQQAT: yorug` va tungi ko`rinishda koordinatalar farq qiladi — yorug`i olindi')
    json.dump(R['light'], open(os.path.join(ish, 'rects.json'), 'w'), ensure_ascii=False, indent=1)


# ---------------------------------------------------------------- yig'ish: qol/*.webp + qol/mavzu.js
def yig(ish):
    from PIL import Image
    R = json.load(open(os.path.join(ish, 'rects.json')))
    kerak = set(); qator = ["/* src/build/qollanma.py yasaydi — qo'lda o'zgartirilmaydi (docs/texnik.md 20) */"]
    for kalit, M in MAVZU:
        ek = {}
        for q in M['qadam']:
            if 'ch' in q: continue                    # chizma qadami — ekran rasmi kerak emas
            for e in (q['s'], q.get('go')):
                if e: ek.setdefault(e, {}); kerak.add(e)
            for n in [q['t']] + ([q['f']] if 'f' in q else []):
                for x in ([n] if isinstance(n, str) else n):
                    assert R.get(q['s'], {}).get(x), 'mavzu «%s»: «%s» ekranida «%s» nishoni yo`q' % (kalit, q['s'], x)
                    ek[q['s']][x] = R[q['s']][x]
        qator.append("Qollanma.qosh('%s', %s);" % (kalit, json.dumps(dict(M, ekran=ek), ensure_ascii=False, separators=(',', ':'))))
    os.makedirs('qol', exist_ok=True)
    for f in os.listdir('qol'):
        if f.endswith('.webp'): os.remove(os.path.join('qol', f))
    jami = 0
    for t in TEMALAR:
        for e in sorted(kerak):
            im = Image.open(os.path.join(ish, '%s-%s.png' % (t, e))).convert('RGB').resize((EN, round(EN * H / W)), Image.LANCZOS)
            o = 'qol/%s-%s.webp' % (t, e); im.save(o, 'WEBP', quality=70, method=6); jami += os.path.getsize(o)
    open('qol/mavzu.js', 'w').write('\n'.join(qator) + '\n')
    print('qol/: %d rasm, %d KB; mavzular: %s' % (len(kerak) * len(TEMALAR), jami // 1024, ', '.join(k for k, _ in MAVZU)))


if __name__ == '__main__':
    a = sys.argv[1:]
    ish = a[a.index('--ish') + 1] if '--ish' in a else '/tmp/qollanma-ish'
    assert os.path.exists('takror.html'), 'repo ildizidan ishga tushiring'
    os.makedirs(ish, exist_ok=True)
    if '--faqat-yig' not in a: bosib_chiq(ish)
    yig(ish)
