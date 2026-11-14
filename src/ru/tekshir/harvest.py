import sys, json, threading, http.server, socketserver, functools, os, re, time
from playwright.sync_api import sync_playwright
ROOT=sys.argv[1]; PAGE=sys.argv[2]; SHOT=sys.argv[3]; os.makedirs(SHOT,exist_ok=True)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),functools.partial(H,directory=ROOT)); port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
UZ="[ўқғҳЎҚҒҲ]"
SCAN="""()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const p=n.parentNode;if(!p||/^(SCRIPT|STYLE)$/.test(p.nodeName))continue;if(/%s/.test(n.data))out.push(n.data.trim().slice(0,120))}
 document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(e=>{['aria-label','placeholder','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&/%s/.test(v))out.push('@'+a+': '+v)})});
 return [...new Set(out)]}""" % (UZ,UZ)
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    cx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,service_workers='block',has_touch=True,is_mobile=True,locale='ru-RU')
    cx.add_init_script("try{localStorage.setItem('baza-tg','1')}catch(e){}")   # 14.11.2026: kirgan o'quvchi — 1-dars Луғат/Машқ kirishsiz yopiq (tg.js Kirish)
    pg=cx.new_page()
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERROR '+str(e)))
    pg.goto('http://127.0.0.1:%d/%s'%(port,PAGE)); pg.wait_for_timeout(2500)
    def shot(n): pg.screenshot(path=os.path.join(SHOT,n+'.png'))
    tour=[]
    for k in range(12):
        t=pg.evaluate("()=>{const n=document.querySelector('.tnx');if(!n||!n.offsetParent)return null;const box=n.closest('div').parentNode;const r=box.innerText;n.click();return r}")
        if t is None: break
        tour.append(t.replace('\n',' | ')); pg.wait_for_timeout(350)
        if k==0: pg.screenshot(path=os.path.join(SHOT,'00-tur.png'))
    print('TOUR:',tour)
    shot('01-matn')
    pg.evaluate("()=>{const q=document.querySelector('.dh .q');if(q)q.click()}"); pg.wait_for_timeout(400); shot('01b-yordam')
    pg.evaluate("()=>{const q=document.querySelector('.dh .q');if(q)q.click()}"); pg.wait_for_timeout(200)
    nb=pg.evaluate("()=>document.querySelectorAll('.hd0 [onclick], .hrow span, .hw span').length")
    hb=pg.evaluate("()=>{const r=[];document.querySelectorAll('[onclick]').forEach(e=>{const o=e.getAttribute('onclick');if(/^h[A-Za-z]*\\(|hop\\(|hdr/i.test(o))r.push(o)});return r.slice(0,8)}")
    print('HDR onclick:',hb)
    if '--dh' in sys.argv:
        print('HEADER:',pg.evaluate("()=>{const d=document.querySelector('.dh');return d?d.outerHTML.replace(/<svg[\\s\\S]*?<\\/svg>/g,'<svg/>').slice(0,3000):'-'}"))
    n=pg.evaluate("()=>document.querySelectorAll('.ws span[data-i]').length")
    for i in range(n):
        pg.evaluate("(i)=>{op(document.querySelectorAll('.ws span[data-i]')[i])}",i); pg.wait_for_timeout(60)
        if i in (0,3,9,13):
            shot('02-soz-%02d'%i)
            pg.evaluate("()=>document.querySelectorAll('#sb .qmb').forEach(b=>{if(!b.classList.contains('on'))b.click()})"); pg.wait_for_timeout(80)
            pg.evaluate("()=>{const s=document.getElementById('sb');s.scrollTop=0}")
            pg.screenshot(path=os.path.join(SHOT,'03-soz-%02d-ochiq.png'%i),full_page=False)
    pg.evaluate("()=>document.getElementById('sh').classList.remove('on')")
    pg.evaluate("()=>bol()"); pg.wait_for_timeout(500); shot('04-tarkib')
    pg.evaluate("()=>window.scrollTo(0,600)"); pg.wait_for_timeout(200); shot('05-tarkib-b')
    for i in range(n):
        pg.evaluate("(i)=>{op(document.querySelectorAll('.ws span[data-i]')[i])}",i); pg.wait_for_timeout(40)
    shot('06-tarkib-soz')
    pg.evaluate("()=>document.getElementById('sh').classList.remove('on')")
    pg.evaluate("()=>{bol();tog()}"); pg.wait_for_timeout(300); pg.evaluate("()=>window.scrollTo(0,0)"); shot('07-harakat')
    pg.evaluate("()=>tab(2)"); pg.wait_for_timeout(300); shot('08-lugat')
    pg.evaluate("()=>window.scrollTo(0,1500)"); pg.wait_for_timeout(200); shot('09-lugat-b')
    pg.evaluate("()=>{window.scrollTo(0,0);tab(3)}"); pg.wait_for_timeout(400); shot('10-mashq')
    for k in range(40):
        st=pg.evaluate("""()=>{const o=document.querySelectorAll('#p3 .qo button');if(!o.length)return 'end';
            if(typeof QZ!=='undefined'&&QZ[qi]&&QZ[qi].ch==null){o[%d%%o.length].click();return 'ans'}return 'next'}""" % k)
        if st=='end': break
        pg.wait_for_timeout(250)
        if k in (0,1): 
            pg.evaluate("()=>document.querySelectorAll('#p3 .qex').forEach(b=>b.click())"); pg.wait_for_timeout(100); shot('11-mashq-javob-%d'%k)
        pg.wait_for_timeout(1200)
        pg.evaluate("()=>{if(document.querySelectorAll('#p3 .qo button').length&&QZ[qi]&&QZ[qi].ch!=null)qgo(1)}"); pg.wait_for_timeout(150)
    shot('12-natija')
    for extra in sys.argv[4:]:
        if extra.startswith('--js='):
            pg.evaluate(extra[5:]); pg.wait_for_timeout(500); shot('20-extra-%d'%sys.argv.index(extra))
    miss=pg.evaluate("()=>window.RU_MISS||{}")
    left=pg.evaluate(SCAN)
    b.close()
print('ERRORS:',errs[:8])
print('MISS (%d):'%len(miss))
for k,v in sorted(miss.items()): print('  ',v,'|',k)
print('UZ LEFT (%d):'%len(left))
for x in left: print('  ',x)
