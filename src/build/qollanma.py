#!/usr/bin/env python3
"""Yo'riqnoma o'ynatkichi (qollanma.js) uchun haqiqiy ekran rasmlari va bosiladigan joylar (docs/texnik.md 20).

    python3 src/build/qollanma.py [--til uz|ru] [--ish DIR] [--faqat-yig]

Repo ildizidan ishga tushiriladi (bir til ~3,5 daqiqa, ikkalasi ~7). O'zi vaqtinchalik server ochadi, ilovani Playwright (Chrome)
bilan bosib chiqadi (yorug' va tungi ko'rinishda; ruschasi — `til` = ru rejimida), natijani yozadi:
    qol/<tema>-<ekran>.webp, qol/mavzu.js          — o'zbekcha (tema: light | dark)
    qol/ru-<tema>-<ekran>.webp, qol/mavzu-ru.js    — ruscha (15.11.2026)
mavzu fayli: Qollanma.qosh(kalit, { nom, keyingi, ekran: {ekran: {nishon: [x, y, w, h]}}, qadam: [...] }).
Ilova ko'rinishi o'zgarsa — qayta ishga tushiriladi (rasm va koordinatalar yangilanadi). Qo'lda o'zgartirilmaydi.

Yangi mavzu: 1) ssenariy() ga kerakli ekranlar qo'shiladi — ol(nom, {nishon: selektor}); selektor oldidagi «*» — hamma mos
elementlarning umumiy to'rtburchagi; 2) MAVZU ga qadamlar yoziladi (maydonlar — qollanma.js boshidagi izohda;
«ch» — ekran rasmisiz chizma qadami: pog'onalar). Har qadamda c — o'zbekcha izoh, r — ruscha; mavzuda nom / nomr.
--til         — faqat bitta til (sukut: ikkalasi)
--ish DIR     — xom rasmlar va koordinatalar papkasi (sukut: /tmp/qollanma-ish; repoga kirmaydi)
--faqat-yig   — ilovani qayta bosib chiqmasdan, --ish dagi tayyor rasmlardan qayta yig'adi (faqat MAVZU matni o'zgarganda)
Kerak: pip install playwright pillow; Chrome — /usr/bin/google-chrome (boshqa joyda bo'lsa: CHROME=/yo'l).
"""
import sys, os, re, json, threading, http.server, socketserver, functools

W, H, EN = 390, 844, 720          # ekran o'lchami (CSS px) va saqlanadigan rasm eni
TEMALAR = ('light', 'dark')
TIL = {                           # oldi qo'shimcha (rasm nomi), mavzu fayli, 1-dars sahifasi
    'uz': dict(pref='', mavzu='mavzu.js', dars='1.html'),
    'ru': dict(pref='ru-', mavzu='mavzu-ru.js', dars='ru1.html'),
}

# ---------------------------------------------------------------- mavzular (matn — kirillcha; «…» ichi o'ynatkichda ajratib ko'rsatiladi)
# {B} / {M} — kunlar soni (BILDI / MUST), {Bk} / {Mk} — son + «кун» / «дня|дней» (qollanma.js TX.kunlar)
MAVZU = [
 ('soz', dict(nom='Сўзлар ва поғоналар', nomr='Слова и ступени', keyingi='takror', qadam=[      # «Машқ»ga birinchi kirishda bir marta o'zi ochiladi (takror.html KQO)
  dict(s='bosh', t='boshla', a='tap', go='dars',
       c='Аввал дарсни очинг: матнни ўқинг ва эшитинг',
       r='Сначала откройте урок: прочитайте и послушайте текст'),
  dict(s='dars', t='tmashq', f='tabs', a='tap', go='dmashq',
       c='Кейин шу дарснинг «Машқ»ини ишланг',
       r='Потом выполните «Упражнение» этого урока'),
  dict(ch='tush',
       c='«Машқ» тугагач, дарс сўзлари ўзи «ўрганяпман» поғонасига тушади',
       r='Когда «Упражнение» закончено, слова урока сами попадают на ступень «учу»'),
  dict(ch='bildi',
       c='Ҳар куни «Ўрганиш»ни ишланг. Сўзни {B} кун кетма-кет тўғри топсангиз — «биламан»га кўтарилади',
       r='Каждый день проходите «Изучение». Угадали слово {Bk} подряд — оно поднимается на «знаю»'),
  dict(ch='must',
       c='{M} кундан кейин ва яна {M2} кундан кейин «Такрор»да тўғри топсангиз — «мустаҳкам» бўлади ва бошқа сўралмайди',
       r='Угадали его в «Повторении» через {Mk} и ещё раз через {M2k} — слово становится «прочно» и больше не спрашивается'),
  dict(ch='xato',
       c='Хато топсангиз — «биламан» сўз «ўрганяпман» 2/3 га тушади, бошқаси 0/3 дан бошлайди',
       r='Ошиблись — слово из «знаю» возвращается на «учу» 2/3, остальные начинают с 0/3'),
  dict(s='mashq', t='go', f='band', a='look',
       c='Ҳар куни «Машқ» бўлимида «Ўрганиш»ни, вақти келганда «Такрор»ни ишланг',
       r='Каждый день в разделе «Упражнение» проходите «Изучение», а когда придёт время — «Повторение»'),
 ])),
 ('takror', dict(nom='Такрорлаш', nomr='Повторение', keyingi='lugat', qadam=[
  dict(s='bosh', t='mashq', f='nav', a='tap', go='mashq',
       c='«Машқ»ни босинг. Устидаги сон — бугунги машқлар',
       r='Нажмите «Упражнение». Число над ним — задания на сегодня'),
  dict(s='mashq', t='go', f='band', a='tap', go='savol',
       c='«Ўрганиш»даги «Бошлаш»ни босинг',
       r='Нажмите «Начать» в «Изучении»'),
  dict(s='savol', t='soz', a='look',
       c='Сўз чиқади. Маъносини ичингизда эслаб кўринг',
       r='Появится слово. Вспомните про себя, что оно значит'),
  dict(s='savol', t='ko', a='tap', go='javob',
       c='«Кўрсатиш»ни босинг — маъноси очилади. Ўзингиз эслагани билан солиштиринг',
       r='Нажмите «Показать» — откроется значение. Сравните со своим ответом'),
  dict(s='javob', t='j1', f=['mano', 'j0', 'j1'], a='tap', n='ok',
       c='Тўғри эслаган бўлсангиз — «Билдим»',
       r='Если вспомнили правильно — «Помню»'),
  dict(s='javob', t='j0', f=['mano', 'j0', 'j1'], a='tap', n='no',
       c='Эслай олмаган бўлсангиз — «Билмадим»',
       r='Если не вспомнили — «Не помню»'),
  dict(s='oxir', t='to', f='kart', a='tap', go='oxir2',
       c='Баъзан «Сўз охири?» сўралади. Тўғри ҳаракатни танланг — тўғри бўлса, яшил бўлади',
       r='Иногда спрашивается «Окончание слова?». Выберите правильную огласовку — если верно, станет зелёной'),
  dict(s='xato', t=['no', 'ok'], f='kart', a='look',
       c='Хато бўлса: танлаганингиз — қизил, тўғриси — яшил. Пастда сабаби ёзилади',
       r='Если ошиблись: ваш ответ — красный, правильный — зелёный. Ниже написано почему'),
  dict(s='xato', t='kn', a='tap', go='tamom',
       c='«Кейинги»ни босиб, давом этинг',
       r='Нажмите «Далее» и продолжайте'),
  dict(s='tamom', t='band', a='look',
       c='Ҳаммаси тугагач — «Бугунга тамом». Эртага яна шу ердан давом этасиз',
       r='Когда всё пройдено — «На сегодня всё». Завтра продолжите отсюда'),
 ])),
 ('lugat', dict(nom='Луғат', nomr='Словарь', qadam=[
  dict(s='tamom', t='lugat', a='tap', go='lugat',
       c='«Машқ» ичидаги «Луғат»ни очинг — ҳамма сўзларингиз шу ерда',
       r='Откройте «Словарь» в разделе «Упражнение» — там все ваши слова'),
  dict(s='lugat', t='sonlar', a='look',
       c='Тепада — ҳар поғонада нечта сўз борлиги. Сонни боссангиз, фақат ўша сўзлар қолади',
       r='Сверху — сколько слов на каждой ступени. Нажмите на число — останутся только эти слова'),
  dict(s='lugat', t='sx', f='row', a='look',
       c='Сариқ чизиқлар — сўз неча кун тўғри топилгани: {B} таси тўлса — «биламан». Қизғиш чизиқлар — кўп хато қилинган сўз',
       r='Жёлтые полоски — сколько дней слово угадано: заполнятся все {B} — «знаю». Розоватые — трудное слово, много ошибок'),   # 23.11.2026: «· 1/3» va «қийин» qatordan olib tashlandi
  dict(s='lugat', t=['ab', 'bm'], f='row', a='look',
       c='Ўзингиз ҳам белгилай оласиз: ✓ — биламан ({M} кундан кейин «Такрор»да сўралади), 🔖 — билмайман',
       r='Можно отметить и самому: ✓ — знаю (спросим в «Повторении» через {Mk}), 🔖 — не знаю'),
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


def sahifa(br, tema, til):
    ctx = br.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, color_scheme=tema)
    ctx.add_init_script(BOSH + ("try{localStorage.setItem('til','ru')}catch(e){}" if til == 'ru' else ''))
    ctx.route('**/api/**', lambda r: r.abort())
    return ctx.new_page()


def takror_ochish(pg, U):
    pg.goto(U + 'takror.html'); pg.wait_for_selector('#go'); pg.wait_for_timeout(1200)
    pg.evaluate('scrollTo(0,0)')


def oxirgacha(pg):
    """«Сўз охири?» savoli chiqquncha: so'z kartalariga «Кўрсатиш» → «Билдим»."""
    for _ in range(80):
        if pg.query_selector('.tq-o button'): return
        if pg.query_selector('#ko'): pg.click('#ko'); pg.wait_for_timeout(120)
        j = pg.query_selector('#j1')
        if j: j.click(); pg.wait_for_timeout(180)
    raise SystemExit("«Сўз охири?» savoli chiqmadi")


def togri_variant(br, U, til):
    """Birinchi «Сўз охири?» savolida to'g'ri variant raqami (o'ynatkichda barmoq to'g'risini bosadi)."""
    pg = sahifa(br, 'light', til); takror_ochish(pg, U); pg.click('#go'); pg.wait_for_timeout(700); oxirgacha(pg)
    pg.click('.tq-o button[data-n="0"]'); pg.wait_for_timeout(250)
    k = pg.evaluate("[...document.querySelectorAll('.tq-o button')].findIndex(b => b.classList.contains('ok'))")
    pg.context.close()
    assert k >= 0, 'to`g`ri variant topilmadi'
    return k


def ssenariy(br, U, tema, k, ish, til):
    pg = sahifa(br, tema, til); R = {}; xato = []; pref = TIL[til]['pref']
    pg.on('pageerror', lambda e: xato.append(str(e)[:200]))

    def ol(nom, nishon, kut=700):
        pg.wait_for_timeout(kut)
        pg.screenshot(path=os.path.join(ish, '%s%s-%s.png' % (pref, tema, nom)))
        R[nom] = {n: pg.evaluate(RECT, q) for n, q in nishon.items()}
        yoq = [n for n, v in R[nom].items() if not v]
        assert not yoq, '%s: ekran «%s»: nishon topilmadi: %s' % (til, nom, yoq)

    pg.goto(U + 'yol.html'); pg.wait_for_selector('.q-nav'); pg.wait_for_timeout(1200)
    ol('bosh', {'mashq': '.q-nav a[href$="takror.html"]', 'nav': '.q-nav', 'boshla': '.y-b'})
    takror_ochish(pg, U)
    ol('mashq', {'go': '#go', 'band': '*.mq-h', 'lugat': '.mq-lg'})      # 23.11.2026: ikki bo'lim — «Ўрганиш» va «Такрор»
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
    pg.goto(U + TIL[til]['dars']); pg.wait_for_selector('#t3'); pg.wait_for_timeout(2500)
    if pg.query_selector('.tsk'): pg.click('.tsk'); pg.wait_for_timeout(500)
    ol('dars', {'tmashq': '#t3', 'tabs': '.tabs'})
    pg.click('#t3')
    ol('dmashq', {}, 1200)
    pg.context.close()
    assert not xato, '%s: sahifa xatosi: %s' % (til, xato)
    return R


def bosib_chiq(ish, tillar):
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
        for til in tillar:
            k = togri_variant(br, U, til)
            R = {t: ssenariy(br, U, t, k, ish, til) for t in TEMALAR}
            if R['light'] != R['dark']: print('DIQQAT (%s): yorug` va tungi ko`rinishda koordinatalar farq qiladi — yorug`i olindi' % til)
            json.dump(R['light'], open(os.path.join(ish, 'rects-%s.json' % til), 'w'), ensure_ascii=False, indent=1)
        br.close()
    srv.shutdown()


# ---------------------------------------------------------------- yig'ish: qol/*.webp + qol/mavzu*.js
def yig(ish, til):
    from PIL import Image
    T = TIL[til]; ru = til == 'ru'
    R = json.load(open(os.path.join(ish, 'rects-%s.json' % til)))
    kerak = set(); qator = ["/* src/build/qollanma.py yasaydi — qo'lda o'zgartirilmaydi (docs/texnik.md 20) */"]
    for kalit, M in MAVZU:
        ek = {}; Q = []
        for q in M['qadam']:
            q2 = {k: v for k, v in q.items() if k != 'r'}
            q2['c'] = q['r'] if ru else q['c']
            Q.append(q2)
            if 'ch' in q: continue                    # chizma qadami — ekran rasmi kerak emas
            for e in (q['s'], q.get('go')):
                if e: ek.setdefault(e, {}); kerak.add(e)
            for n in [q['t']] + ([q['f']] if 'f' in q else []):
                for x in ([n] if isinstance(n, str) else n):
                    assert R.get(q['s'], {}).get(x), '%s: mavzu «%s»: «%s» ekranida «%s» nishoni yo`q' % (til, kalit, q['s'], x)
                    ek[q['s']][x] = R[q['s']][x]
        M2 = {k: v for k, v in M.items() if k not in ('nomr', 'qadam')}
        M2.update(nom=M['nomr'] if ru else M['nom'], qadam=Q, ekran=ek)
        qator.append("Qollanma.qosh('%s', %s);" % (kalit, json.dumps(M2, ensure_ascii=False, separators=(',', ':'))))
    os.makedirs('qol', exist_ok=True)
    eski = re.compile(r'^ru-(light|dark)-.*\.webp$') if ru else re.compile(r'^(light|dark)-.*\.webp$')
    for f in os.listdir('qol'):
        if eski.match(f): os.remove(os.path.join('qol', f))
    jami = 0
    for t in TEMALAR:
        for e in sorted(kerak):
            im = Image.open(os.path.join(ish, '%s%s-%s.png' % (T['pref'], t, e))).convert('RGB').resize((EN, round(EN * H / W)), Image.LANCZOS)
            o = 'qol/%s%s-%s.webp' % (T['pref'], t, e); im.save(o, 'WEBP', quality=70, method=6); jami += os.path.getsize(o)
    open('qol/' + T['mavzu'], 'w').write('\n'.join(qator) + '\n')
    print('qol/ (%s): %d rasm, %d KB; mavzular: %s' % (til, len(kerak) * len(TEMALAR), jami // 1024, ', '.join(k for k, _ in MAVZU)))


if __name__ == '__main__':
    a = sys.argv[1:]
    ish = a[a.index('--ish') + 1] if '--ish' in a else '/tmp/qollanma-ish'
    tillar = [a[a.index('--til') + 1]] if '--til' in a else list(TIL)
    assert all(t in TIL for t in tillar), 'til: uz yoki ru'
    assert os.path.exists('takror.html'), 'repo ildizidan ishga tushiring'
    os.makedirs(ish, exist_ok=True)
    if '--faqat-yig' not in a: bosib_chiq(ish, tillar)
    for til in tillar: yig(ish, til)
