#!/usr/bin/env python3
"""Ruscha dars sahifasida yangi tarkib ko'rinishi (tarkib3.js) — tarjimasi yo'q matnni topish (23.11.2026).
    python3 src/ru/tekshir/t3ru.py . ru11.html [rasmlar papkasi]      (repo ildizidan)
Таркиб yoqiladi; har so'z bosiladi, so'z oynasi ochiladi; har «Қоидалар» qutisi ochilib, har qoida va «Батафсил»
bosiladi; belgilar qatori, to'liq ro'yxati va ⓘ ochiladi. Natija: MISS (lug'atda topilmagan — `window.RU_MISS`,
yig'ilib boradi), UZ LEFT (har bosqichda ekranda qolgan o'zbekcha harfli matn), JS xatolar. Hammasi 0 bo'lishi kerak.
harvest.py eski ko'rinishga yozilgan — tarkib3 bosqichlarini bu fayl qo'shadi (ikkalasi ham ishga tushiriladi)."""
import sys, os, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright

ROOT, PAGE = sys.argv[1], sys.argv[2]
SHOT = sys.argv[3] if len(sys.argv) > 3 else None
if SHOT: os.makedirs(SHOT, exist_ok=True)


class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass


srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(H, directory=ROOT))
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
UZ = "[ўқғҳЎҚҒҲ]"
SCAN = """()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const p=n.parentNode;if(!p||/^(SCRIPT|STYLE)$/.test(p.nodeName))continue;
  if(!p.offsetParent&&getComputedStyle(p).position!=='fixed')continue;
  if(/%s/.test(n.data)&&n.data.indexOf('\\u2063')<0)out.push(n.data.trim().slice(0,140))}
 document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(e=>{['aria-label','placeholder','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&/%s/.test(v))out.push('@'+a+': '+v)})});
 return [...new Set(out)]}""" % (UZ, UZ)
left, errs = set(), []


def sc(pg):
    pg.wait_for_timeout(120)
    for x in pg.evaluate(SCAN): left.add(x)


with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    cx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, service_workers='block',
                       has_touch=True, is_mobile=True, locale='ru-RU')
    cx.add_init_script("try{localStorage.setItem('baza-tg','1');localStorage.setItem('fe-tour','1')}catch(e){}")
    pg = cx.new_page()
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)[:200]))
    pg.goto('http://127.0.0.1:%d/%s' % (port, PAGE)); pg.wait_for_timeout(2500)
    pg.evaluate('bol()'); pg.wait_for_timeout(700); sc(pg)
    if SHOT: pg.screenshot(path=os.path.join(SHOT, 't3-00.png'))
    keys = pg.evaluate('()=>Object.keys(T3.WD())')
    for i, k in enumerate(keys):
        pg.evaluate("(k)=>{const w=T3.WD()[k];w.e.dispatchEvent(new MouseEvent('click',{bubbles:true}))}", k)
        sc(pg)
        if SHOT and i in (0, 3, 8):
            pg.evaluate("(k)=>T3.WD()[k].e.scrollIntoView({block:'center'})", k); pg.wait_for_timeout(150)
            pg.screenshot(path=os.path.join(SHOT, 't3-soz-%02d.png' % i))
        try:
            pg.evaluate('(k)=>T3.zt(k)', k); sc(pg)
        except Exception as e:
            errs.append('zt %s: %s' % (k, str(e)[:120]))
        pg.evaluate("()=>{const s=document.getElementById('sh');if(s)s.classList.remove('on')}")
        pg.evaluate('()=>document.body.click()')
    n = pg.evaluate("()=>document.querySelectorAll('.nqb .nq-h').length")
    for j in range(n):
        pg.evaluate("(j)=>{const h=document.querySelectorAll('.nqb .nq-h')[j];h.scrollIntoView({block:'center'});h.click()}", j)
        sc(pg)
        m = pg.evaluate("(j)=>document.querySelectorAll('.nqb')[j].querySelectorAll('.nq-r').length", j)
        for r in range(m):
            pg.evaluate("([j,r])=>{const x=document.querySelectorAll('.nqb')[j].querySelectorAll('.nq-r')[r];x.click();"
                        "x.querySelectorAll('.nq-more').forEach(e=>e.click())}", [j, r])
            sc(pg)
            if SHOT and j == 0 and r == 0: pg.screenshot(path=os.path.join(SHOT, 't3-qoida.png'))
    pg.evaluate('()=>document.body.click()')
    for sel in ('.lg-z', '.lg', '.t3-i', '.t3i'):
        if pg.evaluate("(s)=>{const e=document.querySelector(s);if(e){e.click();return 1}}", sel):
            sc(pg)
            if SHOT: pg.screenshot(path=os.path.join(SHOT, 't3-%s.png' % sel.strip('.')))
            pg.evaluate("()=>document.querySelectorAll('.t3sh .x, .hd .x').forEach(x=>x.click())")
    cs = pg.evaluate("()=>{const b=document.querySelector('.lg-z');if(!b)return[];b.click();"
                     "const r=[...document.querySelectorAll('.t3sh .r[data-c]:not(.off)')].map(e=>e.getAttribute('data-c'));"
                     "document.querySelectorAll('.t3sh .x').forEach(x=>x.click());return r}")
    for c in cs:
        pg.evaluate("(c)=>{document.querySelector('.lg-z').click();const r=document.querySelector('.t3sh .r[data-c=\"'+c+'\"]');if(r)r.click()}", c)
        sc(pg)
    if SHOT and cs: pg.screenshot(path=os.path.join(SHOT, 't3-lgt.png'))
    miss = pg.evaluate('()=>window.RU_MISS||{}')
    b.close()
srv.shutdown()
print('ERRORS (%d):' % len(errs))
for x in errs[:10]: print('  ', x)
print('MISS (%d):' % len(miss))
for k, v in sorted(miss.items()): print('  ', v, '|', k)
print('UZ LEFT (%d):' % len(left))
for x in sorted(left): print('  ', x)
