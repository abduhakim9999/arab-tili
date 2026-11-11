import sys, threading, http.server, socketserver, functools, os, json, hashlib
from playwright.sync_api import sync_playwright
ROOT=sys.argv[1]
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),functools.partial(H,directory=ROOT)); port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
SIG="""(sel)=>{const r={};document.querySelectorAll(sel+' *').forEach(e=>{const k=e.tagName+'.'+(typeof e.className==='string'?e.className:'');r[k]=(r[k]||0)+1});
 const ar=[];const w=document.createTreeWalker(document.querySelector(sel),NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const m=n.data.match(/[\\u0600-\\u06FF]+/g);if(m)ar.push(...m)}
 return {tags:r,arabic:ar.sort().join(' ')}}"""
EARLY="""()=>{window.__early=null;document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=w.nextNode()){const p=n.parentNode;if(/^(SCRIPT|STYLE)$/.test(p.nodeName))continue;if(/[ўқғҳЎҚҒҲ]/.test(n.data))out.push(n.data.trim().slice(0,60))}window.__early=out},0)})}"""
res={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for page in sys.argv[2:]:
        cx=b.new_context(viewport={'width':390,'height':844},service_workers='block',has_touch=True,is_mobile=True)
        pg=cx.new_page(); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.add_init_script("("+EARLY+")()")
        pg.goto('http://127.0.0.1:%d/%s'%(port,page)); pg.wait_for_timeout(2500)
        R={'early_uz':pg.evaluate("()=>window.__early")}
        pg.evaluate("()=>{const s=document.querySelector('.tsk');if(s&&s.offsetParent)s.click()}"); pg.wait_for_timeout(300)
        R['mavzu']=pg.evaluate("()=>getComputedStyle(document.querySelector('#tx>.ln'),'::before').content")
        R['plain']=pg.evaluate(SIG,'#tx')
        pg.evaluate("()=>bol()"); pg.wait_for_timeout(600)
        R['tarkib']=pg.evaluate(SIG,'#tx'); R['tkx']=pg.evaluate("()=>document.querySelectorAll('#tx .tkx').length")
        n=pg.evaluate("()=>document.querySelectorAll('.ws span[data-i]').length"); win=[]
        for i in range(n):
            pg.evaluate("(i)=>{op(document.querySelectorAll('.ws span[data-i]')[i])}",i); pg.wait_for_timeout(30)
            win.append(pg.evaluate(SIG,'#sb'))
        R['win']=win
        pg.evaluate("()=>{document.getElementById('sh').classList.remove('on');bol();tab(2)}"); pg.wait_for_timeout(300)
        R['voc']=pg.evaluate(SIG,'#p2')
        # qidiruv
        q='ҳамд' if page[0].isdigit() else 'хвала'
        pg.fill('#p2 .lq input',q); pg.wait_for_timeout(500)
        R['search']=pg.evaluate("()=>document.querySelector('#p2 .lqn').textContent")
        pg.evaluate("()=>tab(3)"); pg.wait_for_timeout(400)
        R['quiz']=pg.evaluate("()=>QZ.map(q=>q.l+'-'+q.w).sort().join(',')")
        # bismillah so'zi: bosib turish
        R['hdr']=pg.evaluate("""async()=>{const h=document.querySelector('.hts');if(!h)return 'no .hts';tab(1);const box=h.parentNode;const sp=[...box.querySelectorAll('span')].filter(e=>/[\\u0600-\\u06FF]/.test(e.textContent)&&!e.children.length);
          const out=[];for(const e of sp.slice(0,4)){e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));await new Promise(r=>setTimeout(r,800));e.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));
            const sh=document.getElementById('sh');out.push(sh.classList.contains('on')?document.getElementById('sb').innerText.replace(/\\n+/g,' | ').slice(0,420):'-');sh.classList.remove('on')}return out}""")
        R['miss']=pg.evaluate("()=>window.RU_MISS||null"); R['errs']=errs
        res[page]=R; cx.close()
    b.close()
a,bb=[res[k] for k in sys.argv[2:4]]
def h(x): return hashlib.md5(json.dumps(x,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:8]
for k in ['plain','tarkib','voc']:
    print(k,'tags same:',a[k]['tags']==bb[k]['tags'],'| arabic same:',a[k]['arabic']==bb[k]['arabic'])
    if a[k]['tags']!=bb[k]['tags']:
        d={t:(a[k]['tags'].get(t,0),bb[k]['tags'].get(t,0)) for t in set(a[k]['tags'])|set(bb[k]['tags']) if a[k]['tags'].get(t,0)!=bb[k]['tags'].get(t,0)}; print('   diff',d)
bad=[i for i,(x,y) in enumerate(zip(a['win'],bb['win'])) if x['tags']!=y['tags'] or x['arabic']!=y['arabic']]
print('word windows:',len(a['win']),'different:',bad)
for k in ['tkx','quiz','search','mavzu','errs']: print(k,'|',a[k],'|',bb[k])
print('EARLY ru:',bb['early_uz'])
print('MISS ru:',bb['miss'])
print('HDR ru:',[x[-200:] for x in bb['hdr']])
