#!/usr/bin/env python3
"""Ruscha rejimda darsdan boshqa sahifalarni bosib chiqib, o'girilmay qolgan matnni topadi (14.11.2026; docs/texnik.md 12).

    python3 src/build/../ru/build.py --index --out .        # avval ru-index.js yangilanadi
    python3 src/ru/tekshir/qobiq.py . [--hammasi] [--rasm DIR] [--uz]

Sahifalar: yol.html (ro'yxat va xarita, dars/imtihon oynalari, kitob tanlash, so'z saralash, imtihon), takror.html (Луғат,
takror mashg'uloti), qoidalar.html, yana.html, sozlamalar.html, nahv.html (ikki yorliq).
--hammasi — hamma dars «tayyor» deb olinadi (imtihon oynalari ham ochiladi); ruschasi yo'q darslarning o'zbekcha ma'nosi va
mashq izohi hisobga olinmaydi (ular dars tarjimasi bilan keladi, qobiq lug'atiga emas).
--uz — o'zbekcha rejimda xato yo'qligini tekshiradi (MISS sanalmaydi).
Natija: MISS (N) — lug'atda yo'q o'zbekcha matn (lugat-qobiq.txt ga qo'shiladi), UZ LEFT — ekranda qolgan o'zbekcha harfli matn,
XATO — sahifa xatolari. Hammasi 0 bo'lishi kerak.
"""
import sys, os, json, threading, http.server, socketserver, functools, re, time
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else '.'
HAMMASI = '--hammasi' in sys.argv
UZREJ = '--uz' in sys.argv
RASM = sys.argv[sys.argv.index('--rasm') + 1] if '--rasm' in sys.argv else None
if RASM:
    os.makedirs(RASM, exist_ok=True)


class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(H, directory=ROOT))
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:%d/' % port

L = json.load(open(os.path.join(ROOT, 'data/lugat.json'), encoding='utf-8'))['s']
M = json.load(open(os.path.join(ROOT, 'data/mashq.json'), encoding='utf-8'))['s']
DS = json.load(open(os.path.join(ROOT, 'data/darslar.json'), encoding='utf-8'))['s']
HAMMA = [d['n'] for d in DS]
now = int(time.time() * 1000)
ids1 = [r['id'] for r in L if r['d'] in (1, 2) and r.get('tk')]
SEED = {
    'til': 'uz' if UZREJ else 'ru',
    'soz': json.dumps({'v': 1, 'b': {str(i): 1 for i in ids1[:8]}, 'k': {str(i): 1 for i in ids1[8:14]}, 's': {str(n): now for n in (1, 2, 3, 4)}, 'a': {}, 't': now}),
    'yol': json.dumps({'v': 1, 'd': {'1': {'b': 90, 's': 90, 'j': 10, 't': now}, '2': {'b': 60, 's': 60, 'j': 10, 't': now}}, 'e': {}}),
    'yol-kor': 'r',
    'baza-tg': '1',                    # 14.11.2026: kirgan o'quvchi — Луғат va imtihonlar kirishsiz yopiq (tg.js Kirish)
    'baza-eski': json.dumps({'v': 1, 'ar': now, 'ls': {'x': '1'}}),   # «Ўчирилган: … · яна N кун сақланади» qatori ham ko'rinsin
}
INIT = """(()=>{try{if(!sessionStorage.__seed){const S=%s;for(const k in S)localStorage.setItem(k,S[k]);sessionStorage.__seed=1}}catch(e){}})()""" % json.dumps(SEED)

UZ = '[ўқғҳЎҚҒҲ]'
SCAN = """()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const p=n.parentNode;if(!p||/^(SCRIPT|STYLE)$/.test(p.nodeName))continue;
   if(p.closest&&p.closest('[hidden]'))continue;if(n.data.indexOf('\\u2063')>=0)continue;if(/%s/.test(n.data))out.push(n.data.trim().slice(0,140))}
 document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(e=>{['aria-label','placeholder','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&/%s/.test(v))out.push('@'+a+': '+v)})});
 const dup=[];document.querySelectorAll('[role=group],.s-sg,.tabs').forEach(g=>{const t=[...g.querySelectorAll('button')].map(b=>b.textContent.replace(/\\u2063/g,'').trim()).filter(Boolean);
   if(new Set(t).size<t.length)dup.push(t.join(' | '))});
 return {left:[...new Set(out)],miss:Object.keys(window.RU_MISS||{}),dup:dup}}""" % (UZ, UZ)

# ruschasi yo'q darslarning o'z matni (ma'no, misol, mashq gapi va izohi) — qobiq lug'atiga kirmaydi
DARS_MATN = set()
if HAMMASI:
    def kal(s):
        return re.sub(r'\s+', ' ', re.sub('[؀-ۿﭐ-﷿ﹰ-﻿]+(?:[\\s،…]+[؀-ۿﭐ-﷿ﹰ-﻿]+)*', '◌', s)).strip()
    for r in L:
        for u in r.get('uz', []):
            DARS_MATN.add(kal(u))
        for x in r.get('x', []):
            if len(x) > 1:
                DARS_MATN.add(kal(x[1]))
    for q in M:
        for k in ('tr', 'sabab'):
            if q.get(k):
                DARS_MATN.add(kal(q[k]))

MISS, LEFT, ERR = {}, {}, []


def dars_matni(k):
    if not HAMMASI:
        return False
    b = re.sub(r'\d+(?:[.,]\d+)?', '#', k.strip('\u25CC '))
    return any(b in re.sub(r'\d+(?:[.,]\d+)?', '#', t) for t in DARS_MATN if len(b) > 3)


with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    cx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, service_workers='block', has_touch=True, is_mobile=True, locale='ru-RU')
    cx.add_init_script(INIT)
    cx.route(re.compile(r'^https?://(?!127\.0\.0\.1)'), lambda r: r.abort())
    if HAMMASI:
        def ri(route):
            body = open(os.path.join(ROOT, 'ru-index.js'), encoding='utf-8').read() + '\nwindow.RU_LESSONS=%s;\n' % json.dumps(HAMMA)
            route.fulfill(status=200, content_type='application/javascript', body=body)
        cx.route(re.compile(r'/ru-index\.js$'), ri)
    pg = cx.new_page()
    pg.on('dialog', lambda d: d.dismiss())
    pg.on('pageerror', lambda e: ERR.append('%s: %s' % (pg.url.rsplit('/', 1)[-1], e)))
    pg.on('console', lambda m: ERR.append('%s: %s' % (pg.url.rsplit('/', 1)[-1], m.text)) if m.type == 'error' and 'net::' not in m.text and 'Failed to load resource' not in m.text else None)
    sahifa = ['']

    def scan(nom):
        pg.wait_for_timeout(250)
        try:
            r = pg.evaluate(SCAN)
        except Exception as e:
            ERR.append('scan %s: %s' % (nom, e)); return
        for k in r['miss']:
            if not dars_matni(k):
                MISS.setdefault(k, set()).add(sahifa[0])
        for k in r['left']:
            LEFT.setdefault(k, set()).add(sahifa[0])
        for k in r['dup']:   # 14.11.2026: til tugmasida ikkala tomon «Русский» bo'lib qolgan edi — bitta guruhda bir xil yozuvli tugma xato
            e = '%s: bir xil tugmalar: %s' % (sahifa[0], k)
            if e not in ERR:
                ERR.append(e)
        if RASM:
            pg.screenshot(path=os.path.join(RASM, nom + '.png'))

    def och(f):
        sahifa[0] = f
        pg.goto(URL + f); pg.wait_for_timeout(1500)

    def bos(sel, n=0):
        return pg.evaluate("([s,n])=>{const e=document.querySelectorAll(s)[n];if(!e)return false;e.click();return true}", [sel, n])

    # ---- Йўл: ro'yxat, keyin xarita ----
    for kor in ('r', 'x'):
        pg.evaluate("k=>localStorage.setItem('yol-kor',k)", kor) if sahifa[0] else None
        och('yol.html')
        pg.evaluate("k=>localStorage.setItem('yol-kor',k)", kor); pg.reload(); pg.wait_for_timeout(1500)
        scan('yol-' + kor)
        ni = pg.evaluate("()=>[...new Set([...document.querySelectorAll('[data-i]')].map(e=>e.getAttribute('data-i')))]")
        for i in ni:
            pg.evaluate("i=>{const e=document.querySelector('[data-i=\"'+i+'\"]');e&&e.click()}", i); pg.wait_for_timeout(200)
            bos('#sb .y-ib, #sb .y-hb'); scan('yol-%s-%s' % (kor, i))
            bos('#yp')
        bos('.y-bk'); scan('yol-%s-boblar' % kor); pg.keyboard.press('Escape')
        pg.evaluate("()=>{window.Qobiq&&Qobiq.ustiga&&Qobiq.ustiga()}"); scan('yol-%s-kitob' % kor); pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    # so'zlarni saralash (1-dars) va imtihon
    och('yol.html')
    pg.evaluate("()=>{const e=document.querySelector('[data-i=\"d1\"]');e&&e.click()}"); pg.wait_for_timeout(300)
    if bos('#sb [data-sr]'):
        scan('yol-sarala')
        for k in range(3):
            bos('#app button', k)
        scan('yol-sarala2')
        bos('#tay'); scan('yol-sarala3')
    och('yol.html')
    ex = pg.evaluate("()=>[...document.querySelectorAll('[data-i^=\"b\"],[data-i^=\"k\"]')].map(e=>e.getAttribute('data-i'))")
    if ex:
        pg.evaluate("i=>{const e=document.querySelector('[data-i=\"'+i+'\"]');e&&e.click()}", ex[0]); pg.wait_for_timeout(300)
        if bos('#sb [data-ex]'):
            for k in range(40):
                pg.wait_for_timeout(150)
                if not bos('.y-o button:not([disabled])'):
                    if not bos('#bar button:not([hidden])') and not bos('#bar .y-b'):
                        break
                scan('yol-imt-%02d' % k)
            scan('yol-imt-oxiri')
    # ---- Луғат ----
    och('takror.html'); scan('takror')
    for sel in ('[data-t]', '[data-h]'):
        n = pg.evaluate("s=>document.querySelectorAll(s).length", sel)
        for k in range(n):
            bos(sel, k); scan('takror-%s%d' % (sel[6], k))
    bos('#bi'); scan('takror-yoriq'); bos('#bi')
    bos('#lr [data-id], #lr button, #lr li', 0); scan('takror-soz'); pg.keyboard.press('Escape')
    och('takror.html')
    if bos('#go'):
        for k in range(30):
            pg.wait_for_timeout(150)
            if bos('#ko'):
                scan('takror-k%02d' % k); bos('#j1') or bos('#j0')
            elif not (bos('.tq-o button:not([disabled])') or bos('#app .y-o button:not([disabled])') or bos('[data-v]:not([disabled])')):
                if not bos('#kn'):
                    break
            scan('takror-s%02d' % k)
            bos('#kn')
        scan('takror-oxiri')
    # ---- Қоидалар, Яна, Созламалар, Наҳв ----
    och('qoidalar.html'); scan('qoidalar')
    och('yana.html'); scan('yana')
    och('sozlamalar.html'); scan('sozlamalar')
    och('nahv.html'); scan('nahv')
    n = pg.evaluate("()=>document.querySelectorAll('.tabs button, [role=tab]').length")
    for k in range(n):
        bos('.tabs button, [role=tab]', k); scan('nahv-%d' % k)
    b.close()

if UZREJ:
    MISS = {}
print('MISS (%d)' % len(MISS))
for k in sorted(MISS):
    print('  %s    [%s]' % (k, ','.join(sorted(MISS[k]))))
print('UZ LEFT (%d)' % len(LEFT))
for k in sorted(LEFT)[:200]:
    print('  %s    [%s]' % (k, ','.join(sorted(LEFT[k]))))
print('XATO (%d)' % len(ERR))
for e in ERR[:40]:
    print('  ' + e)
