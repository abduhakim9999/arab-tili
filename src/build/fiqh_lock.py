#!/usr/bin/env python3
"""Fiqh sahifalarini parol bilan shifrlash / ochish.

  python3 src/build/fiqh_lock.py yop PAROL   # src/fiqh/*.html  ->  repo ildizidagi shifrlangan *.html
  python3 src/build/fiqh_lock.py och PAROL   # repo ildizidagi shifrlangan *.html  ->  src/fiqh/*.html (tahrir uchun)

src/fiqh/ — ochiq matn, .gitignore da (repo ochiq — commit qilinmaydi).
Parol repoga yozilmaydi (claude.ai loyihasidagi fiqh-konspekti.md da).
Brauzerda: PBKDF2-SHA256 (150 000) -> AES-GCM; to'g'ri kalit localStorage «fq-k» da, faqat shu kun (Toshkent vaqti, «fq-d») — har kuni bir marta parol so'raladi.
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
</script>
<link rel="stylesheet" href="shell.css">
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);color:var(--tx);font:17px/1.4 system-ui,-apple-system,sans-serif}
#f{display:none;gap:8px;padding:16px}
#f.on{display:flex}
#p{font:inherit;font-size:18px;padding:12px 14px;border:1px solid var(--bd);border-radius:14px;background:var(--cd);color:var(--tx);width:190px;text-align:center}
#f button{font:inherit;font-size:20px;width:52px;border:0;border-radius:14px;background:var(--ac);color:var(--cd);cursor:pointer}
.bk{position:fixed;top:12px;left:16px;width:40px;height:40px;border-radius:12px;background:var(--cd);border:1px solid var(--bd);color:var(--tx);text-decoration:none;font-size:22px;display:flex;align-items:center;justify-content:center}
.bad{animation:sh .35s}@keyframes sh{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
</style>
</head>
<body>
<a class="bk" href="./">‹</a>
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
  function show(h){function go(){document.open();document.write(h);document.close();try{fqApp()}catch(e){}}if(document.readyState==="complete")setTimeout(go,0);else addEventListener("load",function(){setTimeout(go,0)})}
  function ask(){f.classList.add("on");setTimeout(function(){p.focus()},50)}
  var T=new Date(Date.now()+18e6).toISOString().slice(0,10),k=null;try{if(localStorage.getItem("fq-d")===T)k=localStorage.getItem("fq-k");else localStorage.removeItem("fq-k")}catch(e){}
  if(k)dec(ub(k)).then(show,function(){try{localStorage.removeItem("fq-k")}catch(e){}ask()});else ask();
  f.onsubmit=function(ev){ev.preventDefault();var raw;key(p.value).then(function(r){raw=r;return dec(r)}).then(function(h){
    try{localStorage.setItem("fq-k",b64(raw));localStorage.setItem("fq-d",T)}catch(e){}show(h)},function(){f.classList.remove("bad");void f.offsetWidth;f.classList.add("bad");p.select()})};
})();
</script>
</body>
</html>
"""

def kdf(pw): return hashlib.pbkdf2_hmac("sha256", pw.encode(), SALT, IT, 32)

def yop(pw):
    k = AESGCM(kdf(pw))
    for n in FILES:
        src = open("src/fiqh/" + n, "rb").read()
        iv = os.urandom(12)
        data = base64.b64encode(iv + k.encrypt(iv, src, None)).decode()
        out = SHELL.replace("@@DATA@@", data).replace("@@SALT@@", SALT.decode()).replace("@@IT@@", str(IT))
        open(n, "w", encoding="utf-8").write(out)
        print("yopildi:", n)

def och(pw):
    k = AESGCM(kdf(pw)); os.makedirs("src/fiqh", exist_ok=True)
    for n in ["fiqh.html", "fkitob.html"] + sorted(glob.glob("f[0-9]*.html")):
        n = os.path.basename(n)
        m = re.search(r'var D="([^"]+)"', open(n, encoding="utf-8").read())
        if not m: continue
        d = base64.b64decode(m.group(1))
        open("src/fiqh/" + n, "wb").write(k.decrypt(d[:12], d[12:], None))
        print("ochildi:", "src/fiqh/" + n)

if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in ("yop", "och"):
        sys.exit(__doc__)
    (yop if sys.argv[1] == "yop" else och)(sys.argv[2])
