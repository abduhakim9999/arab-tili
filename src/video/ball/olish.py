#!/usr/bin/env python3
"""«Баллар ва рейтинг» videosi uchun haqiqiy ekran rasmlari va bosiladigan joylar (docs/ball-video.md 5).

    python3 src/video/ball/olish.py        (repo ildizidan)

O'zi vaqtinchalik server ochadi, ilovani Playwright (Chrome) bilan bosib chiqadi va yozadi:
    src/video/ball/ekran/NOM.jpg   — 390×844 ekran, 3 baravar zichlikda
    src/video/ball/ekran.js        — window.EK = {NOM: {nishon: [x, y, w, h]}}  (CSS px, ekran ichida)
Soat 02.12.2026 19:00 (Toshkent) ga qo'yiladi — yangi ball qoidasi (30.11.2026 dan) hamma sahifada ishlaydi.
Holat (jurnal) sun'iy: 'xs…' kalitli to'g'ri javoblar — ball beradi, so'z darajalariga tegmaydi.
Ilova ko'rinishi o'zgarsa — qayta ishga tushiriladi.
"""
import os, json, datetime, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'ekran'); os.makedirs(OUT, exist_ok=True)
W, H, DPR = 390, 844, 3
T0 = datetime.datetime(2026, 12, 2, 14, 0, 0, tzinfo=datetime.timezone.utc)        # 02.12.2026 19:00 Toshkent (chorshanba)
MS = int(T0.timestamp() * 1000)
KUN = 86400000
RECT = """(q) => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect();
  return r.width ? [r.left, r.top, r.width, r.height].map(v => Math.round(v * 10) / 10) : null; }"""


def jurnal(bugun, kecha=0):
    """bugun / kecha — shu kunlardagi to'g'ri javoblar soni (har biri 10 ball)."""
    j = [['xsk%d' % i, MS - KUN - 3600000 + i * 9000, 3, 1500] for i in range(kecha)]
    j += [['xsb%d' % i, MS - 3600000 + i * 9000, 3, 1500] for i in range(bugun)]
    return json.dumps({'v': 1, 'j': j})


def bosh(j=None, xulosa=None):
    s = "window.KORISH=true;try{localStorage.setItem('kirish-ok','eed39e36');"
    if j: s += "if(!localStorage.getItem('takror-j'))localStorage.setItem('takror-j',%s);" % json.dumps(j)
    if xulosa: s += "if(!localStorage.getItem('takror-xulosa'))localStorage.setItem('takror-xulosa',%s);" % json.dumps(json.dumps(xulosa))
    # ilovaning o'zi uchiradigan «+10» rasmga tushmasin — videoda alohida chiziladi (aynan shu ko'rinishda)
    s += "}catch(e){};document.addEventListener('DOMContentLoaded',function(){var c=document.createElement('style');c.textContent='.ball-uch{display:none!important}';document.head.appendChild(c)});"
    return s


def main():
    class Jim(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Jim, directory=os.path.join(D, '..', '..', '..')))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    U = 'http://127.0.0.1:%d/' % srv.server_address[1]
    EK, xato = {}, []
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'))

        def sahifa(j=None, xulosa=None, h=H):
            ctx = br.new_context(viewport={'width': W, 'height': h}, device_scale_factor=DPR, color_scheme='light', service_workers='block')
            ctx.add_init_script(bosh(j, xulosa)); ctx.route('**/api/**', lambda r: r.abort())
            pg = ctx.new_page(); pg.clock.install(time=T0)
            pg.on('pageerror', lambda e: xato.append(str(e)[:160]))
            return pg

        def ol(pg, nom, nishon, kut=700):
            pg.wait_for_timeout(kut)
            pg.screenshot(path=os.path.join(OUT, nom + '.jpg'), type='jpeg', quality=92)
            EK[nom] = {n: pg.evaluate(RECT, q) for n, q in nishon.items()}
            EK[nom]['_h'] = pg.viewport_size['height']
            yoq = [n for n, v in EK[nom].items() if not v and n != '_h']
            assert not yoq, '%s: nishon topilmadi: %s' % (nom, yoq)
            print('ekran', nom, flush=True)

        # ---- «Рейтинг»: bu hafta 280 ball (kecha 30, bugun 200 + seriya 50)
        pg = sahifa(jurnal(20, 3), {'bilgan': 46, 'must': 0, 'jami': 60})
        pg.goto(U + 'reyting.html'); pg.wait_for_selector('.r-r'); pg.wait_for_timeout(1500)
        pg.evaluate("(()=>{const n=document.getElementById('nm'); if(n) n.style.display='none';})()")      # «Намуна…» izohi faqat ko'rish manzilida chiqadi
        ol(pg, 'rey', {'seg': '.r-sg', 'hafta': '.r-sg button[data-t="h"]', 'sozlar': '.r-sg button[data-t="w"]', 'vq': '#vq',
                       'bir': '.r-r.p1', 'ls': '#ls', 'men': '.r-me', 'nav': '.q-nav'})
        pg.click('.r-sg button[data-t="w"]'); pg.wait_for_timeout(900)
        pg.evaluate("(()=>{const n=document.getElementById('nm'); if(n) n.style.display='none';})()")
        ol(pg, 'reys', {'seg': '.r-sg', 'sozlar': '.r-sg button[data-t="w"]', 's2': '#s2', 'men': '.r-me'})
        pg.context.close()

        # ---- «Машқ» bosh ko'rinishi: bugun 150 va 200 ball
        for nom, n in (('mq150', 15), ('mq200', 20)):
            pg = sahifa(jurnal(n))
            pg.goto(U + 'takror.html'); pg.wait_for_selector('#go'); pg.wait_for_timeout(1500); pg.evaluate('scrollTo(0,0)')
            ol(pg, nom, {'sr': '.mq-sr', 'band': '.mq-h', 'go': '#go', 'nav': '.q-nav', 'navrey': '.q-nav a[href$="reyting.html"]'})
            pg.context.close()

        # ---- «Машқ» kartasi: savol → javob → keyingi karta (past ekran, 390×600: karta va tugma yonma-yon — videoda yirik ko'rinadi)
        pg = sahifa(jurnal(4), h=600)
        pg.goto(U + 'takror.html'); pg.wait_for_selector('#go'); pg.wait_for_timeout(1200)
        pg.click('#go')
        ol(pg, 'karta1', {'kart': '.tq-c', 'ko': '#ko'}, 900)
        pg.click('#ko')
        ol(pg, 'karta2', {'kart': '.tq-c', 'mano': '.tq-m', 'j1': '#j1', 'j0': '#j0'}, 900)
        pg.click('#j1')
        ol(pg, 'karta3', {'kart': '.tq-c'}, 1500)                                   # «+10» uchib bo'lgach
        pg.context.close()

        # ---- dars «Эъроб»i (26.11.2026 gacha «Машқ»): savol → to'g'ri javob → natija. Savol turlari (savol.js): turli savolda to'g'ri variant — o.ok
        TOGRI = "(()=>{const q=QZ[qi];return q.t?q.o.findIndex(x=>x.ok):q.o.findIndex(x=>x.w==get(q.l+'-'+q.w).v)})()"
        pg = sahifa()
        pg.goto(U + '1.html'); pg.wait_for_selector('#t3'); pg.wait_for_timeout(2500)
        if pg.query_selector('.tsk'): pg.click('.tsk'); pg.wait_for_timeout(500)
        pg.click('#t3'); pg.wait_for_selector('#p3 [data-x]'); pg.evaluate('scrollTo(0,0)')
        for _ in range(40):                                                         # birinchi savol — oddiy harakat savoli bo'lsin (videoda eng tushunarlisi)
            if not pg.evaluate('!!QZ[0].t'): break
            pg.evaluate('qstart()'); pg.wait_for_timeout(150)
        assert not pg.evaluate('!!QZ[0].t'), 'birinchi savol harakat savoli chiqmadi'
        k = pg.evaluate(TOGRI)
        ol(pg, 'dq1', {'box': '.qbox', 'qo': '.qo', 'ok': '.qo button[data-x="%d"]' % k}, 1000)
        pg.click('.qo button[data-x="%d"]' % k)
        ol(pg, 'dq2', {'box': '.qbox', 'qo': '.qo', 'ok': '.qo button.ok'}, 300)
        jami = pg.evaluate('QZ.length')
        for i in range(1, jami):
            pg.wait_for_timeout(1200)
            if pg.evaluate('qi') < i: pg.click('#qb .pr')                           # to'g'ri javobdan keyin o'zi o'tmagan bo'lsa — «Кейинги»
            pg.wait_for_function('qi === %d && QZ[qi].ch == null' % i, timeout=5000)
            pg.wait_for_timeout(900)                                                # 0,7 s dan tez javob ball bermaydi
            pg.click('#p3 [data-x="%d"]' % pg.evaluate(TOGRI))
        pg.wait_for_timeout(1300)
        if not pg.query_selector('.qsc'): pg.click('#qb .pr')
        pg.wait_for_selector('.qsc'); pg.evaluate('scrollTo(0,0)')
        assert pg.evaluate('qsc') == jami, 'dars savollari: %s / %s' % (pg.evaluate('qsc'), jami)
        ol(pg, 'dres', {'box': '.qbox', 'sc': '.qsc', 'q80': '.q80'}, 1500)          # «+100» uchib bo'lgach
        pg.context.close()

        # ---- «Эшитиш»
        pg = sahifa()
        pg.goto(U + 'tinglash.html?d=1'); pg.wait_for_timeout(2500)
        ol(pg, 'esh', {}, 300)
        pg.context.close()
        br.close()
    assert not xato, 'sahifa xatosi: %s' % xato[:5]
    open(os.path.join(D, 'ekran.js'), 'w').write('window.EK=' + json.dumps(EK, ensure_ascii=False) + ';')
    print('tayyor:', len(EK), 'ekran')


if __name__ == '__main__':
    main()
