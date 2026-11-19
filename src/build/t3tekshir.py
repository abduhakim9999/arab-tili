#!/usr/bin/env python3
"""Yangi tarkib ko'rinishi (tarkib3.js) — darslarni avtomat tekshirish (19.11.2026). docs/tarkib-korinishi.md 12.
    python3 src/build/t3tekshir.py 10 97      (repo ildizidan; raqamsiz — hamma NN.html)
O'zi localhost server ochadi (Playwright + Chrome). Har dars: Таркиб yoqiladi, har so'z va har «Қоидалар» qatori bosiladi.
XATO (chiqish kodi 1): JS xato, IRB'siz so'z, so'z oynasi ochilmaydi, QMP dagi qoida QT da yo'q, sahifada tarkib3.js yo'q.
ESLATMA (ko'rib chiqiladi): rangsiz so'z; nishonsiz mubtado / xabar / kana-inna ismi va xabari (sim ulanmagan)."""
import sys, os, re, json, glob, socket, threading, functools, http.server
from playwright.sync_api import sync_playwright

ROOT = os.getcwd()
nums = [int(a) for a in sys.argv[1:]] or sorted(int(os.path.basename(f)[:-5]) for f in glob.glob('[0-9]*.html'))

JS = r'''()=>{
  const W=T3.WD(), R=T3.RELS(), o={irbsiz:[],rangsiz:[],oynasiz:[],nishonsiz:[],qtsiz:[],soz:0};
  const tx=e=>e?(e.textContent||'').trim():'';
  for(const k in W){const w=W[k];o.soz++;
    if(!w.E||!w.E.k||!w.E.k.length){o.irbsiz.push(k+' '+tx(w.e));continue}
    if(!w.harf&&(!w.mc||w.mc=='0'||w.mc=='?')&&!/фасл|ажратиш/.test(w.role||''))o.rangsiz.push(k+' '+tx(w.e)+' ['+(w.role||'')+']');
    try{if(!T3.zt(k))o.oynasiz.push(k+' '+tx(w.e))}catch(e){o.oynasiz.push(k+' '+tx(w.e)+' '+e.message)}}
  for(const k in R){const r=R[k],w=W[k];if(!w||(r.tg&&r.tg.length))continue;
    if(/^(мубтадо|хабар)$|нинг (исми|хабари)$/.test(w.role||''))o.nishonsiz.push(k+' '+tx(w.e)+' ['+w.role+']')}
  const Q=window.QMP||{},T=window.QT||{},s=new Set();for(const g in Q)(Q[g]||[]).forEach(q=>{if(!T[q])s.add(q)});o.qtsiz=[...s];
  return o}'''
CLICK = r'''async()=>{const sl=()=>new Promise(r=>setTimeout(r,0));let n=0;
  for(const e of document.querySelectorAll('#tx .ws span[data-i]')){e.dispatchEvent(new MouseEvent('click',{bubbles:true}));if(++n%40==0)await sl()}
  for(const h of document.querySelectorAll('.nqb .nq-h')){h.click();for(const r of h.parentNode.querySelectorAll('.nq-r')){r.click();n++}}
  document.body.click();return n}'''


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass


s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
xato = 0
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for n in nums:
        if 'tarkib3.js' not in open('%d.html' % n, encoding='utf-8').read():
            print('%d: XATO — tarkib3.js ulanmagan' % n); xato += 1; continue
        pg = b.new_page(viewport={'width': 390, 'height': 844})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
        pg.goto('http://127.0.0.1:%d/%d.html' % (port, n)); pg.wait_for_timeout(1200)
        pg.evaluate('bol()'); pg.wait_for_timeout(600)
        r = pg.evaluate(JS); r['bosildi'] = pg.evaluate(CLICK); pg.wait_for_timeout(300)
        r['jsxato'] = sorted(set(errs)); pg.close()
        bad = [k for k in ('jsxato', 'irbsiz', 'oynasiz', 'qtsiz') if r[k]]
        xato += len(bad)
        print('%d: %d so\'z, %d bosildi — %s' % (n, r['soz'], r['bosildi'], 'XATO: ' + ', '.join(bad) if bad else 'xatosiz'))
        for k in bad + ['rangsiz', 'nishonsiz']:
            if r[k]: print('   %s (%d): %s' % (k, len(r[k]), ' | '.join(r[k][:12])))
    b.close()
srv.shutdown()
sys.exit(1 if xato else 0)
