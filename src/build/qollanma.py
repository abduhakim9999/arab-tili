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
--ovoz-matn   — ovozi yo'q qadamlar (nom va ElevenLabs matni, JSON) — 27.11.2026
--ovoz-qosh D — D/<nom>.mp3 (ElevenLabs xom fayli) → qol/ovoz/<nom> (jimlik olinadi, balandlik tenglanadi); keyin --faqat-yig
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
       r='Сначала откройте урок: прочитайте и послушайте текст',
       v="Hammasi darsdan boshlanadi. Avval darsni oching: matnini o'qing, ovozini tinglang."),
  dict(s='dars', t='tmashq', f='tabs', a='tap', go='dmashq',
       c='Кейин шу дарснинг «Эъроб»ини ишланг',       # 26.11.2026: dars yorlig'i «Машқ» → «Эъроб»
       r='Потом выполните «Иъраб» этого урока',
       v="So'ng shu darsning «E'rob» bo'limidagi savollarni ishlang."),
  dict(ch='tush',
       c='«Эъроб»дан 80% олсангиз, дарс сўзлари ўзи «ўрганяпман» поғонасига тушади',
       r='Наберите 80% в «Иърабе» — слова урока сами попадут на ступень «учу»',
       v="«E'rob»dan sakson foiz to'plasangiz, dars so'zlari o'zi «o'rganyapman» pog'onasiga tushadi. Endi ularni yodlash vaqti."),
  dict(ch='bildi',                                 # 27.11.2026: «кетма-кет» olib tashlandi — {B} xil kun yetadi, ketma-ket shart emas (takror.js birlik)
       c='Ҳар куни «Бугунги машқ»ни ишланг. Сўзни {B} кун тўғри топсангиз — «биламан»га кўтарилади',
       r='Каждый день проходите «Упражнение на сегодня». Угадали слово в течение {Bk} — оно поднимается на «знаю»',
       v="Har kuni «Bugungi mashq»ni ishlang. So'zni uch kun to'g'ri topsangiz, u «bilaman»ga ko'tariladi. Kunlar ketma-ket bo'lishi shart emas, muhimi — uch xil kun."),
  dict(ch='must',
       c='{M} ва яна {M2} кундан кейин «Бугунги машқ»да ўзи сўралади. Тўғри топсангиз — «мустаҳкам» бўлади ва бошқа сўралмайди',
       r='Через {Mk} и ещё раз через {M2k} оно само придёт в «Упражнение на сегодня». Угадали — слово становится «прочно» и больше не спрашивается',
       v="Endi so'zni unutmaganingizni tekshiramiz: yetti kundan keyin, so'ng yana yigirma bir kundan keyin u «Bugungi mashq»da o'zi chiqadi. Ikkala safar ham eslasangiz, so'z «mustahkam» bo'ladi va boshqa so'ralmaydi."),
  dict(ch='xato',
       c='Хато топсангиз — «биламан»даги сўз «ўрганяпман»га тушади, икки чизиғи сақланади. Бошқаси бошидан бошлайди',
       r='Ошиблись — слово из «знаю» возвращается на «учу», две полоски остаются. Остальные начинают сначала',
       v="Хато qilsangiz, qo'rqmang, qilgan mehnatingiz yo'qolmaydi. «Bilaman»dagi so'z bir pog'ona pastga tushadi, lekin ikki chizig'i saqlanib qoladi. «O'rganyapman»dagi so'z esa hisobni boshidan boshlaydi."),
  dict(s='mashq', t='go', f='band', a='look',
       c='Ҳар куни «Машқ» бўлимида «Бугунги машқ»ни ишланг — керакли сўзлар ўзи шу ерга тушади',
       r='Каждый день в разделе «Упражнение» проходите «Упражнение на сегодня» — нужные слова сами попадают сюда',
       v="Demak, har kuni bitta ish: «Mashq» bo'limidagi «Bugungi mashq»ni ishlash. Kerakli so'zlarni dastur o'zi tanlab beradi."),
 ])),
 ('takror', dict(nom='Такрорлаш', nomr='Повторение', keyingi='lugat', qadam=[
  dict(s='bosh', t='mashq', f='nav', a='tap', go='mashq',
       c='«Машқ»ни босинг. Устидаги сон — бугунги машқлар',
       r='Нажмите «Упражнение». Число над ним — задания на сегодня',
       v="Pastdagi «Mashq» tugmasini bosing. Ustidagi kichik raqam bugun nechta so'z sizni kutayotganini ko'rsatadi."),
  # 27.11.2026: «Бошлаш» ustidagi ro'yxat (26.11.2026 dan — guruhlar shu tartibda keladi; takror.html tepa, GRN)
  dict(s='mashq', t='gr', f='band', a='look',
       c='Бугунги сўзлар шу тартибда келади: мустаҳкамга чиқадиганлар, «биламан» текшируви, «ўрганяпман», янги сўзлар',
       r='Слова на сегодня идут в таком порядке: переходят в «прочно», проверка «знаю», «учу», новые слова',
       v="«Boshlash» ustida bugungi so'zlar guruhlarga bo'lingan. Ular shu tartibda keladi: avval mustahkamga chiqadiganlar, keyin «bilaman» tekshiruvi, so'ng «o'rganyapman» va yangi so'zlar."),
  dict(s='mashq', t='go', f='band', a='tap', go='savol',
       c='«Бошлаш»ни босинг',
       r='Нажмите «Начать»',
       v="Tayyor bo'lsangiz, «Boshlash»ni bosing."),
  dict(s='savol', t='gr', a='look',
       c='Тепада — қайси гуруҳ кетаётгани ва ундан нечтаси бажарилгани',
       r='Сверху — какая группа идёт сейчас и сколько из неё уже сделано',
       v="Mashq paytida tepaga qarang: hozir qaysi guruh so'zlari kelayotgani va ulardan nechtasini ishlab bo'lganingiz shu yerda yozilgan."),
  dict(s='savol', t='soz', a='look',
       c='Сўз чиқади. Маъносини ичингизда эслаб кўринг',
       r='Появится слово. Вспомните про себя, что оно значит',
       v="Ekranda so'z chiqadi. Shoshilmang, ma'nosini avval ichingizda eslab ko'ring."),
  dict(s='savol', t='ko', a='tap', go='javob',
       c='«Кўрсатиш»ни босинг — маъноси очилади. Ўзингиз эслагани билан солиштиринг',
       r='Нажмите «Показать» — откроется значение. Сравните со своим ответом',
       v="Keyin «Ko'rsatish»ni bosing. Karta ag'darilib, to'g'ri ma'no ko'rinadi. O'zingiz eslagan bilan solishtiring."),
  dict(s='javob', t='j1', f=['mano', 'j0', 'j1'], a='tap', n='ok',
       c='Тўғри эслаган бўлсангиз — «Билдим»',
       r='Если вспомнили правильно — «Помню»',
       v="To'g'ri eslagan bo'lsangiz, «Bildim»ni bosing. So'z bir qadam oldinga siljiydi."),
  dict(s='javob', t='j0', f=['mano', 'j0', 'j1'], a='tap', n='no',
       c='Эслай олмаган бўлсангиз — «Билмадим»',
       r='Если не вспомнили — «Не помню»',
       v="Eslay olmagan bo'lsangiz, «Bilmadim»ni bosing. Hech gap yo'q: so'z «o'rganyapman»da qoladi va keyinroq yana so'raladi."),
  # «Сўз охири?» va xato javob qadamlari olib tashlandi (26.11.2026): «Бугунги машқ»da endi faqat so'zlar — grammatika savollari
  # dars «Эъроб»ida va «Боб якуни»da (takror.html mashq: [])
  dict(s='tamom', t='band', a='look',
       c='Ҳаммаси тугагач — «Бугунга тамом». Эртага яна шу ердан давом этасиз',
       r='Когда всё пройдено — «На сегодня всё». Завтра продолжите отсюда',
       v="Hammasi tugagach, «Bugunga tamom» chiqadi. Ertaga shu yerga qaytib, davom ettirasiz."),
 ])),
 # v — ovoz matni: generatsiyaga moslab, o'quvchiga qaratilgan jonli gap (27.11.2026, foydalanuvchi: birinchi matnni «yaxshi yozmagansan» —
# ekrandagi yozuvni qisqartirib o'qish emas, nima/nima uchun/nima bo'lishini to'liq jumlalar bilan; «shunday … moslab yozishing kerak»).
# 27.11.2026 (foydalanuvchi: «ovoz qilinmay qolgan joylari bor … o'zgartirishlar qilingan bo'lsa, ularni ham tushuntiradigan qilib»,
 # «yaxshisini topib qil»): 4 qadamdan 10 ga — zina, guruh tugmalari, tur tugmalari va qidiruv, so'z shakllari, fe'l, Биламан kuni
 ('lugat', dict(nom='Луғат', nomr='Словарь', qadam=[
  dict(s='tamom', t='lugat', a='tap', go='lugat',
       c='«Машқ» ичидаги «Луғат» — ўтган дарсларингизнинг ҳамма сўзлари шу ерда',
       r='«Словарь» в разделе «Упражнение» — здесь все слова пройденных уроков',
       v="«Mashq» bo'limidagi «Lug'at»ni oching. O'tgan darslaringizdagi hamma so'z shu yerda jamlangan."),
  dict(s='lugat', t='sonlar', a='look',
       c='Тепадаги зина — ҳар поғонада нечта сўз борлиги',
       r='Лесенка сверху — сколько слов на каждой ступени',
       v="Tepadagi zina holatingizni ko'rsatadi: har pog'onada nechta so'z turibdi."),
  dict(s='lugat', t='sx', f='row', a='look',
       c='Сариқ чизиқлар — сўз неча кун тўғри топилгани: {B} таси тўлса — «биламан». Қизғиш чизиқли сўз кўп адашилган, у энг тепада туради',
       r='Жёлтые полоски — сколько дней слово угадано: заполнятся все {B} — «знаю». Розоватые — трудное слово, оно стоит в самом верху',
       v="Har so'z tepasida uchta chiziqcha bor. So'zni to'g'ri topgan har kuningizda bittasi sariq bo'lib to'ladi, uchalasi to'lsa so'z «bilaman»ga o'tadi. Chiziqlari qizg'ish so'zda ko'p adashilgan, shuning uchun u eng tepada turadi."),
  dict(s='lugat', t='soz', f='row2', a='look',
       c='Сўз ёнида — кўплиги ва муаннаси, остида — маъноси. Сўзни боссангиз, ўқиб беради',
       r='Рядом со словом — множественное число и женский род, ниже — значение. Нажмите на слово — оно прозвучит',
       v="So'zning yonida ko'pligi va muannasi, tagida ma'nosi yozilgan. So'zni bossangiz, uni o'qib ham beradi."),
  dict(s='lugat', t=['ab', 'bm'], f='row', a='look',
       c='✓ — аниқ билган сўзингиз: {M} кундан кейин «Бугунги машқ»да текширилади. 🔖 — унутганингиз: сўз йўлни бошидан ўтади',
       r='✓ — слово, которое точно знаете: через {Mk} его проверят в «Упражнении на сегодня». 🔖 — забытое: слово пройдёт путь заново',
       v="Tepada ikki belgi bor. So'zni aniq bilsangiz, «bilaman» belgisini bosing: yetti kundan keyin u bir tekshiriladi. Unutgan bo'lsangiz, «bilmayman» belgisini bosing: so'z yo'lni boshidan o'tadi."),
  dict(s='lugat', t='fel', f=['q', 'tur'], a='tap', go='lugatf',
       c='Қидириш — арабча ёки ўзбекча. Остидаги тугмалар сўз турини ажратади: исм, феъл, ҳарф',
       r='Поиск — по-арабски или по-русски. Кнопки под ним разделяют слова по видам: имена, глаголы, частицы',
       v="Kerakli so'zni qidirishga arabcha yoki o'zbekcha yozib topasiz. Ostidagi tugmalar so'zlarni turiga ajratadi: ism, fe'l, harf."),
  dict(s='lugatf', t='row', a='look',
       c='Феълда — мозий, музорий ва масдар. Таржимаси «-моқ» шаклида',
       r='У глагола — прошедшее, настоящее время и масдар',
       v="Fe'llar uch shakli bilan yozilgan: moziy, muzoriy va masdar. Tarjimasi esa «-moq» shaklida, xuddi katta lug'atlardagidek."),
  dict(s='lugat', t='hbo', f='sonlar', a='tap', go='lugato',
       c='Поғонани боссангиз, фақат ўша сўзлар қолади. Яна боссангиз — ҳаммаси қайтади',
       r='Нажмите на ступень — останутся только её слова. Нажмите ещё раз — вернутся все',
       v="Zinaning biror pog'onasini bossangiz, faqat o'sha pog'onadagi so'zlar qoladi. Yana bir bossangiz, hammasi qaytadi."),
  dict(s='lugato', t='sg', f=['sonlar', 'sg'], a='look',
       c='«Ўрганяпман» ичида — нечта чизиғи тўлганига қараб гуруҳлар',
       r='Внутри «учу» — группы по числу заполненных полосок',
       v="«O'rganyapman» ichida so'zlar yana guruhlarga bo'linadi: nechta chizig'i to'lganiga qarab."),
  dict(s='lugatg', t='sg', t2='row', t2f=.55, f=['sg', 'row'], a='look',      # t2 — halqa ovozning 60% ida («Har so'z tepasida…») so'z qatoriga o'tadi
       c='«Биламан»да — {M} ва {M2} кунлик текширув гуруҳлари. Ҳар сўз тепасида — қачон сўралиши',
       r='В «знаю» — группы проверки через {Mk} и {M2k}. Над каждым словом — когда его спросят',
       v="«Bilaman»da esa ikki guruh bor: yetti kunlik va yigirma bir kunlik tekshiruvdagilar. Har so'z tepasida u qachon so'ralishi yozib qo'yilgan."),
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


def kirish():
    """Sayt kirish kodi (26.11.2026, docs/texnik.md 22): sahifa ko'rinsin — tg.js dagi KX xeshi «kirish-ok» ga yoziladi (kodning o'zi emas)."""
    m = re.search(r"KX = '([0-9a-f]+)'", open('tg.js', encoding='utf-8').read())
    return "try{localStorage.setItem('kirish-ok','%s')}catch(e){}" % m.group(1) if m else ''


def sahifa(br, tema, til):
    ctx = br.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2, color_scheme=tema)
    # 1-dars o'tilgan (80%+): 25.11.2026 dan dars so'zlari va savollari «Машқ»ga faqat shundan keyin tushadi — aks holda «Сўз охири?» chiqmaydi
    yk = ('ru-' if til == 'ru' else '') + 'yol'
    ctx.add_init_script(BOSH + kirish() + "try{if(!localStorage.getItem('%s'))localStorage.setItem('%s','{\"d\":{\"1\":{\"b\":90}}}')}catch(e){}" % (yk, yk) + ("try{localStorage.setItem('til','ru')}catch(e){}" if til == 'ru' else ''))
    ctx.route('**/api/**', lambda r: r.abort())
    return ctx.new_page()


def takror_ochish(pg, U):
    pg.goto(U + 'takror.html'); pg.wait_for_selector('#go'); pg.wait_for_timeout(1200)
    pg.evaluate('scrollTo(0,0)')


def bos(pg, q, kut=2500):
    """Bosadi; karta almashayotgan paytda (element «not stable» / DOMdan chiqdi) — o'tkazib yuboradi, sikl keyin qayta urinadi."""
    try: pg.click(q, timeout=kut); return True
    except Exception: return False


def ssenariy(br, U, tema, ish, til):
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
    ol('mashq', {'go': '#go', 'band': '*.mq-h', 'lugat': '.mq-lg', 'gr': '*.mq-gr'})      # 26.11.2026: bitta «Бугунги машқ» (23.11 dagi «Ўрганиш» / «Такрор» birlashdi)
    pg.click('#go')
    ol('savol', {'soz': '.tq-c', 'ko': '#ko', 'gr': '.tq-gr'})
    pg.click('#ko')
    ol('javob', {'mano': '.tq-m', 'j1': '#j1', 'j0': '#j0'})
    # mashg'ulot oxirigacha — hamma kartaga «Кўрсатиш» → «Билдим»
    for _ in range(600):
        pg.wait_for_timeout(120)
        if pg.query_selector('#ko'): bos(pg, '#ko'); pg.wait_for_timeout(120)
        if pg.query_selector('#j1'): bos(pg, '#j1'); continue
        if not pg.query_selector('#ko'): break
    pg.wait_for_timeout(700); pg.evaluate('scrollTo(0,0)')
    ol('tamom', {'band': '.mq-h', 'lugat': '.mq-lg'})
    pg.click('.mq-lg'); pg.wait_for_timeout(1000)
    # 27.11.2026: bitta so'z (سَلَامٌ — shakli yo'q) ✓ bilan «биламан» — «Биламан» ekrani uchun; ro'yxat boshida وَاحِدٌ (مؤ.) qoladi
    assert pg.evaluate("""() => { const r = [...document.querySelectorAll('.lg-r')].find(e => e.textContent.includes('سَلَام'));
        if (!r) return false; r.querySelector('.lg-ab').click(); return true; }"""), 'Луғат: سَلَامٌ topilmadi'
    pg.wait_for_timeout(3200); pg.evaluate('scrollTo(0,0)')
    ol('lugat', {'sonlar': '*.lg-hb', 'sx': '.lg-l .lg-r .lg-p', 'ab': '.lg-l .lg-r .lg-ab', 'bm': '.lg-l .lg-r .lg-bm', 'row': '.lg-l .lg-r',
                 'soz': '*.lg-l:first-of-type .lg-r:nth-child(-n+2) .lg-a', 'row2': '*.lg-l:first-of-type .lg-r:nth-child(-n+2)', 'q': '#lq', 'tur': '.lg-ch', 'fel': '.lg-ch button[data-t="f"]', 'hbo': '.lg-hb[data-h="o"]'})
    pg.click('.lg-ch button[data-t="f"]'); pg.evaluate('scrollTo(0,0)')
    ol('lugatf', {'row': '.lg-l .lg-r'})
    pg.click('.lg-ch button[data-t=""]'); pg.click('.lg-hb[data-h="o"]'); pg.evaluate('scrollTo(0,0)')
    ol('lugato', {'sonlar': '*.lg-hb', 'sg': '.lg-sg'})
    pg.click('.lg-hb[data-h="g"]'); pg.evaluate('scrollTo(0,0)')
    ol('lugatg', {'sg': '.lg-sg', 'kd': '.lg-l .lg-r .lg-kd', 'row': '.lg-l .lg-r'})
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
            R = {t: ssenariy(br, U, t, ish, til) for t in TEMALAR}
            if R['light'] != R['dark']: print('DIQQAT (%s): yorug` va tungi ko`rinishda koordinatalar farq qiladi — yorug`i olindi' % til)
            json.dump(R['light'], open(os.path.join(ish, 'rects-%s.json' % til), 'w'), ensure_ascii=False, indent=1)
        br.close()
    srv.shutdown()


# ---------------------------------------------------------------- yig'ish: qol/*.webp + qol/mavzu*.js
# 27.11.2026 (foydalanuvchi: «ovoz qilinmay qolgan joylari bor», «yaxshisini topib qil»): har qadamning o'zbekcha ovozi — Farruh
# (ElevenLabs, docs/texnik/20-yoriqnoma.md). v — ovoz matni (oddiy lotin; gap boshidagi «X…» — kirillcha), fayl nomi — matn xeshi:
# matn o'zgarsa, faqat o'sha qadam qayta yoziladi. Ruschada ovoz yo'q.
OVOZ = 'qol/ovoz'
OVOZ_KERAK, OVOZ_YOQ = set(), []


def ovoz_nomi(kalit, v):
    import hashlib
    return '%s-%s.mp3' % (kalit, hashlib.sha1(v.encode('utf-8')).hexdigest()[:8])


def uzunlik(p):
    import subprocess
    o = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout
    return round(float(o) * 1000)


def ovoz_matn():
    """Ovozi yo'q qadamlar: nom va ElevenLabs matni (JSON)."""
    yoq = []
    for kalit, M in MAVZU:
        for q in M['qadam']:
            if q.get('v') and not os.path.exists(os.path.join(OVOZ, ovoz_nomi(kalit, q['v']))): yoq.append({'nom': ovoz_nomi(kalit, q['v']), 'matn': q['v']})
    print(json.dumps(yoq, ensure_ascii=False, indent=1)); print('%d bo`lak, %d belgi' % (len(yoq), sum(len(x['matn']) for x in yoq)), file=sys.stderr)


def ovoz_qosh(papka):
    """ElevenLabs'dan olingan xom mp3 (papka/<nom>.mp3) → qol/ovoz/<nom>: chet jimlik olinadi (boshida 120 ms qoladi — birinchi tovush yutilmasin), balandlik tenglanadi, mono 64 kbit/s."""
    import subprocess
    os.makedirs(OVOZ, exist_ok=True)
    AF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,'
          'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,loudnorm=I=-17:TP=-1.5:LRA=11')
    for f in sorted(os.listdir(papka)):
        if not f.endswith('.mp3'): continue
        tmp = '/tmp/qollanma-ovoz.wav'   # ikki bosqich: bitta zanjirda (silenceremove … loudnorm) ffmpeg ba'zi faylda osilib qoldi (27.11.2026)
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', os.path.join(papka, f), '-af', AF.rsplit(',', 1)[0], tmp],
                       check=True, stdin=subprocess.DEVNULL, timeout=60)
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', tmp, '-af', 'adelay=delays=120:all=1,' + AF.rsplit(',', 1)[1], '-ac', '1', '-ar', '44100', '-b:a', '64k',
                        os.path.join(OVOZ, f)], check=True, stdin=subprocess.DEVNULL, timeout=60)
        print(f, uzunlik(os.path.join(OVOZ, f)), 'ms')


def yig(ish, til):
    from PIL import Image
    T = TIL[til]; ru = til == 'ru'
    R = json.load(open(os.path.join(ish, 'rects-%s.json' % til)))
    kerak = set(); qator = ["/* src/build/qollanma.py yasaydi — qo'lda o'zgartirilmaydi (docs/texnik.md 20) */"]
    for kalit, M in MAVZU:
        ek = {}; Q = []
        for q in M['qadam']:
            q2 = {k: v for k, v in q.items() if k not in ('r', 'v')}
            q2['c'] = q['r'] if ru else q['c']
            if not ru and q.get('v'):                 # 27.11.2026: Farruh ovozi (faqat o'zbekcha) — o: fayl, od: uzunligi (ms)
                f = ovoz_nomi(kalit, q['v']); OVOZ_KERAK.add(f)
                if os.path.exists(os.path.join(OVOZ, f)): q2['o'] = f; q2['od'] = uzunlik(os.path.join(OVOZ, f))
                else: OVOZ_YOQ.append((kalit, f, q['v']))
            Q.append(q2)
            if 'ch' in q: continue                    # chizma qadami — ekran rasmi kerak emas
            for e in (q['s'], q.get('go')):
                if e: ek.setdefault(e, {}); kerak.add(e)
            for n in [q['t']] + ([q['f']] if 'f' in q else []) + ([q['t2']] if 't2' in q else []):
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
    if not ru:
        for f in os.listdir(OVOZ) if os.path.isdir(OVOZ) else []:
            if f.endswith('.mp3') and f not in OVOZ_KERAK: os.remove(os.path.join(OVOZ, f)); print('eski ovoz o`chirildi:', f)
        if OVOZ_YOQ: print('DIQQAT: %d qadamning ovozi yo`q (o`ynatkich ovozsiz o`tadi) — --ovoz-matn' % len(OVOZ_YOQ))
    print('qol/ (%s): %d rasm, %d KB; mavzular: %s' % (til, len(kerak) * len(TEMALAR), jami // 1024, ', '.join(k for k, _ in MAVZU)))


if __name__ == '__main__':
    a = sys.argv[1:]
    ish = a[a.index('--ish') + 1] if '--ish' in a else '/tmp/qollanma-ish'
    tillar = [a[a.index('--til') + 1]] if '--til' in a else list(TIL)
    assert all(t in TIL for t in tillar), 'til: uz yoki ru'
    assert os.path.exists('takror.html'), 'repo ildizidan ishga tushiring'
    os.makedirs(ish, exist_ok=True)
    if '--ovoz-matn' in a: ovoz_matn(); sys.exit()
    if '--ovoz-qosh' in a: ovoz_qosh(a[a.index('--ovoz-qosh') + 1]); sys.exit()
    if '--faqat-yig' not in a: bosib_chiq(ish, tillar)
    for til in tillar: yig(ish, til)
