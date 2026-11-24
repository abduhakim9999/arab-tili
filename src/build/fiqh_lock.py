#!/usr/bin/env python3
"""Fiqh sahifalarini parol bilan shifrlash / ochish.

  python3 src/build/fiqh_lock.py yop PAROL   # src/fiqh/*.html  ->  repo ildizidagi shifrlangan *.html
  python3 src/build/fiqh_lock.py och PAROL   # repo ildizidagi shifrlangan *.html  ->  src/fiqh/*.html (tahrir uchun)

src/fiqh/ — ochiq matn, .gitignore da (repo ochiq — commit qilinmaydi).
24.11.2026: ustoz audiosi ham shifrlanadi. Ochiq mp3: src/fiqh/afN-….mp3 (dars) va src/fiqh/asl/*.mp3 (asl yozuv).
  yop: afN-….mp3 → repo ildizida afN-….bin, asl/*.mp3 → align/in/fiqh-asl/*.bin (o'zgarmagan audio qayta shifrlanmaydi);
       sahifadagi <audio id="au" src="afN-….mp3"> → data-fq="afN-….bin" + brauzerda ochuvchi skript (kalit — localStorage «fq-k»).
  och: .bin → src/fiqh/ (mp3), sahifa yana src="….mp3" ko'rinishiga qaytadi.
Parol repoga yozilmaydi (claude.ai loyihasidagi fiqh-konspekti.md da).
Brauzerda: PBKDF2-SHA256 (150 000) -> AES-GCM; to'g'ri kalit localStorage «fq-k» da.
19.11.2026 (foydalanuvchi qarori): umumiy kod qurilmada faqat birinchi marta so'raladi (har kungi so'rash olib tashlandi).
Ixtiyoriy shaxsiy PIN (4 raqam) — fiqh.html «Созламалар»da qo'yiladi; «fq-pin» = tuz:SHA-256, faqat shu qurilmada.
PIN qo'yilgan bo'lsa — fiqh yangidan ochilganda (sessionStorage «fq-u» yo'q) va 5 daqiqadan ko'p fonda turilganda so'raladi;
5 xatodan keyin 30 s kutish («fq-pf», «fq-pl»); «Унутдим» — umumiy kod kiritilsa PIN o'chadi.
"""
import base64, glob, hashlib, os, re, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

SALT = b"nur-fq-1"; IT = 150000
FILES = ["fiqh.html", "fkitob.html"] + sorted(os.path.basename(p) for p in glob.glob("src/fiqh/f[0-9]*.html"))

SHELL = """<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>ق</title>
<meta name="robots" content="noindex">
<link rel="icon" href="icon-192.png">
<script>/* 09.11.2026: fiqh alohida ilova — faqat fiqh domenida (github.io da asosiy sw.js bilan to'qnashmasin) */
function fqApp(){if(!/fiqh/.test(location.hostname))return;(function(){var h=document.head;[].forEach.call(document.querySelectorAll('link[rel=manifest],link[rel=icon],link[rel=apple-touch-icon],meta[name=theme-color]'),function(x){x.remove()});[['manifest','fiqh.webmanifest'],['icon','fiqh-icon-192.png'],['apple-touch-icon','fiqh-icon-192.png']].forEach(function(x){var l=document.createElement('link');l.rel=x[0];l.href=x[1];h.appendChild(l)});var m=document.createElement('meta');m.name='theme-color';m.content='#5E3C14';h.appendChild(m);if('serviceWorker' in navigator)navigator.serviceWorker.register('fiqh-sw.js').catch(function(){})})()}fqApp();
/* 19.11.2026: shaxsiy PIN (ixtiyoriy, faqat shu qurilmada) — fiqh.html «Созламалар» shu FQP ni ishlatadi */
var FQP=(function(){
  function hx(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return('0'+x.toString(16)).slice(-2)}).join('')}
  function h(s,p){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(s+':'+p)).then(hx)}
  function g(k){try{return localStorage.getItem(k)}catch(e){return null}}
  return{has:function(){return !!g('fq-pin')},
    check:function(p){var v=(g('fq-pin')||'').split(':');return v.length<2?Promise.resolve(false):h(v[0],p).then(function(x){return x===v[1]})},
    set:function(p){if(!/^[0-9]{4}$/.test(p))return Promise.reject(new Error('pin'));var s=hx(crypto.getRandomValues(new Uint8Array(8)));
      return h(s,p).then(function(x){localStorage.setItem('fq-pin',s+':'+x);try{sessionStorage.setItem('fq-u','1')}catch(e){}})},
    clear:function(){try{['fq-pin','fq-pf','fq-pl'].forEach(function(k){localStorage.removeItem(k)})}catch(e){}}}
})();
/* 5 daqiqadan ko'p fonda turilsa — qayta PIN (sahifa qayta yuklanadi, qobiq PIN so'raydi) */
function fqGuard(){document.addEventListener('visibilitychange',function(){if(!FQP.has())return;try{
  if(document.hidden){sessionStorage.setItem('fq-h',Date.now());return}
  var h=+sessionStorage.getItem('fq-h')||0;sessionStorage.removeItem('fq-h');
  if(h&&Date.now()-h>3e5){sessionStorage.removeItem('fq-u');document.documentElement.style.visibility='hidden';location.reload()}}catch(e){}})}
</script>
<link rel="stylesheet" href="shell.css">
<style>
@font-face{font-family:"DarsNaskh";src:url(naskh.woff) format("woff");font-display:swap}
.cv{width:150px;height:auto;border-radius:10px;box-shadow:0 8px 22px rgba(0,0,0,.28)}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;gap:18px;align-items:center;justify-content:center;background:var(--bg);color:var(--tx);font:17px/1.4 system-ui,-apple-system,sans-serif}
#f{display:none;gap:8px;padding:16px}
#f.on{display:flex}
#p{font:inherit;font-size:18px;padding:12px 14px;border:1px solid var(--bd);border-radius:14px;background:var(--cd);color:var(--tx);width:190px;text-align:center}
#f button{font:inherit;font-size:20px;width:52px;border:0;border-radius:14px;background:var(--ac);color:var(--cd);cursor:pointer}
.bk{position:fixed;top:12px;left:16px;width:40px;height:40px;border-radius:12px;background:var(--cd);border:1px solid var(--bd);color:var(--tx);text-decoration:none;font-size:22px;display:flex;align-items:center;justify-content:center}
.bad{animation:sh .35s}@keyframes sh{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
body.pin{gap:14px}body.pin .cv{width:92px}
#fh{margin:0;max-width:270px;text-align:center;font-size:14px;color:var(--mu)}
#pn{display:none;flex-direction:column;align-items:center;gap:16px}
#pn.on{display:flex}
#pm{margin:0;min-height:1.4em;text-align:center;font-size:16px;color:var(--mu)}
#pd{display:flex;gap:18px}
#pd i{width:14px;height:14px;border-radius:50%;border:2px solid var(--ac);transition:background .12s}
#pd i.on{background:var(--ac)}
#pk{display:grid;grid-template-columns:repeat(3,68px);gap:12px 22px}
#pk button{width:68px;height:68px;border-radius:50%;border:1px solid var(--bd);background:var(--cd);color:var(--tx);font:500 26px system-ui,-apple-system,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
#pk button:active{background:var(--bd)}
#pk button.lk{border:0;background:none;font-size:14px;color:var(--ac)}
</style>
</head>
<body>
<a class="bk" href="./">‹</a>
<svg class="cv" viewBox="0 0 200 280" role="img" aria-label="Мухтасарул виқоя — муқова"><rect x="0" y="0" width="200" height="280" rx="10" fill="#5E3C14"/><rect x="184" y="0" width="16" height="280" rx="6" fill="#43290C"/><rect x="14" y="14" width="160" height="252" rx="6" fill="none" stroke="#D9B46A" stroke-width="2"/><rect x="21" y="21" width="146" height="238" rx="4" fill="none" stroke="#D9B46A" stroke-width=".8" stroke-dasharray="3 3"/><g transform="translate(94 62)" fill="none" stroke="#D9B46A" stroke-width="1.6"><rect x="-15.84" y="-15.84" width="31.68" height="31.68"/><rect x="-15.84" y="-15.84" width="31.68" height="31.68" transform="rotate(45)"/><circle r="7.128"/></g><text x="94" y="126" text-anchor="middle" font-size="25" fill="#F4E6C3" font-family="DarsNaskh,Noto Naskh Arabic,serif">مُخْتَصَرُ</text><text x="94" y="158" text-anchor="middle" font-size="25" fill="#F4E6C3" font-family="DarsNaskh,Noto Naskh Arabic,serif">الْوِقَايَةِ</text><path d="M54 176 H84 M104 176 H134" stroke="#D9B46A" stroke-width="1.2"/><rect x="89" y="171" width="10" height="10" transform="rotate(45 94 176)" fill="#D9B46A"/><text x="94" y="203" text-anchor="middle" font-size="14" fill="#D9B46A" font-family="DarsNaskh,Noto Naskh Arabic,serif">النُّقَايَةُ</text><text x="94" y="228" text-anchor="middle" font-size="11" fill="#F4E6C3" font-family="DarsNaskh,Noto Naskh Arabic,serif">صَدْرُ الشَّرِيعَةِ الْمَحْبُوبِيُّ</text><g transform="translate(94 250)" fill="none" stroke="#D9B46A" stroke-width="1.6"><rect x="-5.04" y="-5.04" width="10.08" height="10.08"/><rect x="-5.04" y="-5.04" width="10.08" height="10.08" transform="rotate(45)"/><circle r="2.2680000000000002"/></g></svg>
<div id="pn"><p id="pm">PIN-кодни киритинг</p><div id="pd"><i></i><i></i><i></i><i></i></div>
<div id="pk"><button type="button" data-d="1">1</button><button type="button" data-d="2">2</button><button type="button" data-d="3">3</button><button type="button" data-d="4">4</button><button type="button" data-d="5">5</button><button type="button" data-d="6">6</button><button type="button" data-d="7">7</button><button type="button" data-d="8">8</button><button type="button" data-d="9">9</button><button type="button" class="lk" id="pu">Унутдим</button><button type="button" data-d="0">0</button><button type="button" class="lk" data-d="x" aria-label="Ўчириш">⌫</button></div></div>
<p id="fh" hidden>Умумий кодни киритинг — PIN ўчирилади</p>
<form id="f" autocomplete="on"><input id="p" type="password" autocomplete="current-password" aria-label="Парол"><button type="submit" aria-label="Кириш">→</button></form>
<script>
var D="@@DATA@@";
(function(){
  var E=new TextEncoder(),S=E.encode("@@SALT@@"),f=document.getElementById("f"),p=document.getElementById("p");
  function b64(u){var s="";for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s)}
  function ub(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})}
  function key(pw){return crypto.subtle.importKey("raw",E.encode(pw),"PBKDF2",false,["deriveBits"]).then(function(b){
    return crypto.subtle.deriveBits({name:"PBKDF2",salt:S,iterations:@@IT@@,hash:"SHA-256"},b,256)}).then(function(x){return new Uint8Array(x)})}
  function dec(raw){var d=ub(D);return crypto.subtle.importKey("raw",raw,"AES-GCM",false,["decrypt"]).then(function(k){
    return crypto.subtle.decrypt({name:"AES-GCM",iv:d.slice(0,12)},k,d.slice(12))}).then(function(t){return new TextDecoder().decode(t)})}
  function show(h){function go(){document.open();document.write(h);document.close();try{fqApp()}catch(e){}try{fqGuard()}catch(e){}}if(document.readyState==="complete")setTimeout(go,0);else addEventListener("load",function(){setTimeout(go,0)})}
  function ls(n,v){try{if(v===undefined)return localStorage.getItem(n);if(v===null)localStorage.removeItem(n);else localStorage.setItem(n,v)}catch(e){return null}}
  function ss(n,v){try{if(v===undefined)return sessionStorage.getItem(n);if(v===null)sessionStorage.removeItem(n);else sessionStorage.setItem(n,v)}catch(e){return null}}
  function shake(x){x.classList.remove("bad");void x.offsetWidth;x.classList.add("bad")}
  var pn=document.getElementById("pn"),pm=document.getElementById("pm"),pd=document.getElementById("pd"),fh=document.getElementById("fh"),fg=false,pv="",busy=false;
  function ask(){document.body.classList.remove("pin");pn.classList.remove("on");f.classList.add("on");setTimeout(function(){p.focus()},50)}
  function open(k){dec(ub(k)).then(show,function(){ls("fq-k",null);ask()})}
  /* PIN kerakmi: qo'yilgan bo'lsa — shu sessiyada ochilmagan yoki 5 daqiqadan ko'p fonda turilgan */
  function need(){if(!FQP.has())return false;var u=ss("fq-u"),h=+ss("fq-h")||0;ss("fq-h",null);if(h&&Date.now()-h>3e5)u=null;return !u}
  function wait(){return Math.max(0,(+ls("fq-pl")||0)-Date.now())}
  function dots(){for(var i=0;i<4;i++)pd.children[i].className=i<pv.length?"on":""}
  function tick(){var w=wait();if(!w){pm.textContent="PIN-кодни киритинг";return}pm.textContent="Кўп марта хато. "+Math.ceil(w/1000)+" сониядан кейин";setTimeout(tick,1000)}
  function pin(){document.body.classList.add("pin");pn.classList.add("on");pv="";dots();tick()}
  function dig(d){if(busy||wait()||!pn.classList.contains("on"))return;
    if(d==="x"){pv=pv.slice(0,-1);dots();return}
    if(pv.length>=4)return;pv+=d;dots();if(pv.length<4)return;busy=true;
    FQP.check(pv).then(function(ok){
      if(ok){ss("fq-u","1");ls("fq-pf",null);ls("fq-pl",null);open(ls("fq-k"));return}
      var n=(+ls("fq-pf")||0)+1;if(n>=5){ls("fq-pl",Date.now()+3e4);n=0}ls("fq-pf",n);shake(pd);
      setTimeout(function(){busy=false;pv="";dots();if(wait())tick();else pm.textContent="Нотўғри PIN"},400)})}
  pn.addEventListener("click",function(e){var b=e.target.closest("button[data-d]");if(b)dig(b.getAttribute("data-d"))});
  document.addEventListener("keydown",function(e){if(/^[0-9]$/.test(e.key))dig(e.key);else if(e.key==="Backspace")dig("x")});
  document.getElementById("pu").onclick=function(){fg=true;fh.hidden=false;ask()};
  var k=ls("fq-k");ls("fq-d",null);
  if(!k)ask();else if(need())pin();else open(k);
  f.onsubmit=function(ev){ev.preventDefault();var raw;key(p.value).then(function(r){raw=r;return dec(r)}).then(function(h){
    ls("fq-k",b64(raw));ss("fq-u","1");if(fg)FQP.clear();show(h)},function(){shake(f);p.select()})};
})();
</script>
</body>
</html>
"""

AUD_JS = ('<script>/*fqAudioDec 24.11.2026: shifrlangan ustoz audiosi — kalit qurilmada (fq-k). Fayl to\'liq yuklanib ochiladi: '
  'tayyor bo\'lguncha ▶ bosilsa — foiz ko\'rsatiladi, tayyor bo\'lgach o\'zi boshlanadi (telefon ruxsat bermasa — «▶ ни босинг»)*/'
  '(function(){var a=document.getElementById("au"),u=a&&a.getAttribute("data-fq"),k,want=false,ready=false,box=null,pc="";'
  'try{k=localStorage.getItem("fq-k")}catch(e){}if(!u||!k)return;'
  'function msg(t){if(!box){box=document.createElement("div");box.setAttribute("role","status");box.style.cssText="position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top));transform:translateX(-50%);z-index:101;background:var(--cd,#fff);color:var(--tx,#1e2a26);border:1px solid var(--bd,#e0dccf);border-radius:999px;padding:6px 14px;font:600 13.5px/1.3 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.15);white-space:nowrap";document.body.appendChild(box)}box.textContent=t;box.style.display=t?"block":"none"}'
  'a.addEventListener("play",function(){if(!ready){want=true;a.pause();msg("⏳ Аудио тайёрланяпти…"+pc)}else msg("")});'
  'a.addEventListener("playing",function(){msg("")});'
  'var r=Uint8Array.from(atob(k),function(c){return c.charCodeAt(0)});'
  'fetch(u).then(function(x){if(!x.ok)throw new Error(x.status);var n=+x.headers.get("content-length")||0;if(!x.body||!x.body.getReader||!n)return x.arrayBuffer();'
  'var rd=x.body.getReader(),got=0,parts=[];function step(){return rd.read().then(function(z){if(z.done){var o=new Uint8Array(got),q=0;parts.forEach(function(c){o.set(c,q);q+=c.length});return o.buffer}'
  'parts.push(z.value);got+=z.value.length;pc=" "+Math.min(99,Math.floor(got/n*100))+"%";if(want)msg("⏳ Аудио тайёрланяпти…"+pc);return step()})}return step()})'
  '.then(function(buf){return crypto.subtle.importKey("raw",r,"AES-GCM",false,["decrypt"]).then(function(key){var d=new Uint8Array(buf);return crypto.subtle.decrypt({name:"AES-GCM",iv:d.slice(0,12)},key,d.slice(12))})})'
  '.then(function(b){a.src=URL.createObjectURL(new Blob([b],{type:"audio/mpeg"}));ready=true;'
  'if(want){var p=a.play();if(p&&p.then)p.then(function(){msg("")},function(){msg("✅ Аудио тайёр — ▶ ни босинг")});else msg("")}})'
  '.catch(function(e){msg(want?"⚠️ Аудио очилмади — саҳифани янгиланг":"");console.log("fq audio",e)})})();</script>')
AUD_RE = re.compile(r'<audio id="au" src="(af\d+-[0-9a-f]+)\.mp3"')
def audio_yop(html):
    html = AUD_RE.sub(r'<audio id="au" data-fq="\1.bin"', html)
    if 'data-fq=' in html and 'fqAudioDec' not in html:
        i = html.find('</audio>', html.find('data-fq='))
        if i > -1: html = html[:i + 8] + AUD_JS + html[i + 8:]
    return html
def audio_och(html):
    html = re.sub(r'<audio id="au" data-fq="(af\d+-[0-9a-f]+)\.bin"', r'<audio id="au" src="\1.mp3"', html)
    return re.sub(r'<script>/\*fqAudioDec.*?</script>', '', html, flags=re.S)
def shifr(k, src, dst):
    if os.path.exists(dst):
        d = open(dst, "rb").read()
        try:
            if k.decrypt(d[:12], d[12:], None) == src: return False
        except Exception: pass
    iv = os.urandom(12); open(dst, "wb").write(iv + k.encrypt(iv, src, None)); return True
def ochir(k, src, dst):
    d = open(src, "rb").read(); open(dst, "wb").write(k.decrypt(d[:12], d[12:], None))
AUD_JUFT = [("src/fiqh/", "", "af[0-9]*.mp3"), ("src/fiqh/asl/", "align/in/fiqh-asl/", "*.mp3")]
def kdf(pw): return hashlib.pbkdf2_hmac("sha256", pw.encode(), SALT, IT, 32)

def yop(pw):
    k = AESGCM(kdf(pw))
    for n in FILES:
        src = audio_yop(open("src/fiqh/" + n, encoding="utf-8").read()).encode()
        iv = os.urandom(12)
        data = base64.b64encode(iv + k.encrypt(iv, src, None)).decode()
        out = SHELL.replace("@@DATA@@", data).replace("@@SALT@@", SALT.decode()).replace("@@IT@@", str(IT))
        open(n, "w", encoding="utf-8").write(out)
        print("yopildi:", n)
    for a, b, g in AUD_JUFT:
        for f in sorted(glob.glob(a + g)):
            dst = b + os.path.basename(f)[:-4] + ".bin"
            print(("yopildi: " if shifr(k, open(f, "rb").read(), dst) else "o'zgarmagan: ") + dst)

def och(pw):
    k = AESGCM(kdf(pw)); os.makedirs("src/fiqh", exist_ok=True)
    for n in ["fiqh.html", "fkitob.html"] + sorted(glob.glob("f[0-9]*.html")):
        n = os.path.basename(n)
        m = re.search(r'var D="([^"]+)"', open(n, encoding="utf-8").read())
        if not m: continue
        d = base64.b64decode(m.group(1))
        open("src/fiqh/" + n, "w", encoding="utf-8").write(audio_och(k.decrypt(d[:12], d[12:], None).decode()))
        print("ochildi:", "src/fiqh/" + n)
    for a, b, g in AUD_JUFT:
        os.makedirs(a, exist_ok=True)
        for f in sorted(glob.glob(b + g[:-4] + ".bin")):
            dst = a + os.path.basename(f)[:-4] + ".mp3"; ochir(k, f, dst); print("ochildi:", dst)

if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in ("yop", "och"):
        sys.exit(__doc__)
    (yop if sys.argv[1] == "yop" else och)(sys.argv[2])
