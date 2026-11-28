/* Telegram Mini App ulanishi + natijalarni Telegram bulutida saqlash */
(function () {
  var me = document.currentScript;
  /* TIL PROFILI (21.11.2026, foydalanuvchi: «ruschaga o'tkazganda reyting, hammasi o'z boshqa bo'lishi kerak — boshqa odamga aylangandek»;
     docs/texnik.md 12): ruscha rejimda natija kalitlari alohida — «ru-» oldi bilan (ruscha o'quvchi noldan boshlaydi, o'zbekchadagilar joyida qoladi).
     Sahifa kodi o'zgarmaydi: localStorage/sessionStorage chaqiruvlari shu yerda o'raladi (tg.js hamma sahifada birinchi yuklanadi).
     Umumiy qoladi: akkaunt (baza-kod, baza-tg, ism), til, sozlamalar, yo'riqnoma belgilari. Profil: ruN.html — ruscha, N.html — o'zbekcha,
     boshqa sahifalar — «til» bo'yicha. Ko'rish sahifasida (korish-shim.js, «korish:<nom>:» oldi) ham ishlaydi. Serverga — baza.js (hujjatda «ru»). */
  try {
    var PK = { 'soz': 1, 'takror-j': 1, 'takror-xulosa': 1, 'takror-mashgulot': 1, 'takror-qosh': 1, 'yol': 1, 'yol-t': 1, 'yol-xato': 1, 'yol-kitob': 1, 'yol-xulosa': 1,
      'reyting-kesh2': 1, 'oxirgi-dars': 1, 'baza-eski': 1, 'baza-r': 1, 'baza-rk': 1, 'takror-zina': 1 };   /* takror-zina — «Машқ» zinasi oxirgi sonlari (26.11.2026) */
    var PRE = /^dars\d+-holat(-t)?$/, KOR = /^(korish:[^:]*:)?([\s\S]*)$/;
    var pRU = false, pth = location.pathname;
    if (/(^|[\/-])ru\d+\.html$/.test(pth)) pRU = true;
    else if (!/(^|[\/-])\d+\.html$/.test(pth)) pRU = window.localStorage.getItem('til') === 'ru';
    var g0 = Storage.prototype.getItem, ps0 = Storage.prototype.setItem, pr0 = Storage.prototype.removeItem, pJoriy = pRU;
    var fiz = function (k) {                            /* mantiqiy kalit → joriy profildagi haqiqiy kalit */
      if (!pJoriy || typeof k !== 'string') return k;
      var m = KOR.exec(k), l = m[2];
      return PK[l] === 1 || PRE.test(l) ? (m[1] || '') + 'ru-' + l : k;
    };
    Storage.prototype.getItem = function (k) { return g0.call(this, fiz(k)); };
    Storage.prototype.setItem = function (k, v) { return ps0.call(this, fiz(k), v); };
    Storage.prototype.removeItem = function (k) { return pr0.call(this, fiz(k)); };
    window.Profil = {
      til: pRU ? 'ru' : 'uz',
      p: function () { return pJoriy ? 'ru-' : ''; },   /* joriy profil oldi (baza.js) */
      fiz: function (k) { return fiz(k); },
      kalitmi: function (k) { return PK[k] === 1 || PRE.test(k); },
      /* fn ni boshqa profilda bajarish («Аккаунтни ўчириш» ikkala profilni tozalaydi) */
      bilan: function (til, fn) { var e = pJoriy; pJoriy = til === 'ru'; try { return fn(); } finally { pJoriy = e; } },
      /* haqiqiy kalit bilan (o'ramsiz) — baza.js ikkala profilni bir hujjatga yig'adi */
      xom: { ol: function (st, k) { return g0.call(st, k); }, yoz: function (st, k, v) { return ps0.call(st, k, v); }, ochir: function (st, k) { return pr0.call(st, k); } }
    };
  } catch (e) {}
  /* ko'rinish: «Созламалар» → Кўриниш (yorug / tungi; avto — telefon sozlamasi). docs/texnik.md 16 */
  try { var _k = JSON.parse(localStorage.getItem('sozlama') || '{}').kor; if (_k === 'yorug' || _k === 'tungi') document.documentElement.setAttribute('data-theme', _k === 'tungi' ? 'dark' : 'light'); } catch (e) {}
  /* KIRISH KODI (26.11.2026, foydalanuvchi: «hozircha hamma ishlatmasligi uchun kodli qilib qo'yamiz», «oddiy bitta parolli, 4 xonali»,
     «butun sayt yopiladi»; 26.11.2026: «kodi bir marta teriladigan bo'lsin, har kuni so'raydigan emas»; docs/texnik/22-kirish-kodi.md). Ikkala tilda, Telegramda ham.
     Kod to'g'ri bo'lsa — shu qurilmada doimiy ochiq («kirish-ok» = KX); faqat kod almashsa (yoki brauzer tozalansa) — yana bir marta so'raladi
     (eski «KX:kun» yozuvi ham qabul qilinib, «KX» ga o'tkaziladi). Kodning o'zi yozilmaydi — faqat KX; almashtirish: `node src/build/kirish-kod.js 1234`.
     5 xatodan keyin 30 s kutish. Bu «eshik qulfi»: tekshiruv brauzerda (repo ochiq) — haqiqiy himoya pullik versiyada, server bilan. */
  try {
    (function () {
      var KX = 'eed39e36', H = document.documentElement;
      function xesh(s) { var h = 0x811c9dc5; s = 'nurut-tolib:' + s; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
      function G(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
      function S(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
      function ochiq() { var o = G('kirish-ok'); if (o === KX) return true; if (o && o.indexOf(KX + ':') === 0) { S('kirish-ok', KX); return true; } return false; }
      var ru = window.Profil ? Profil.til === 'ru' : G('til') === 'ru';
      var T = ru ? { b: 'Код доступа', s: 'Введите 4-значный код', x: 'Неверный код', k: 'Слишком много попыток. Через ', kk: ' с', o: 'Удалить' }
        : { b: 'Кириш коди', s: '4 хонали кодни киритинг', x: 'Нотўғри код', k: 'Кўп марта хато. ', kk: ' сониядан кейин', o: 'Ўчириш' };
      var st = null, d = null, v = '', band = false;
      function css() {
        if (st) return;
        st = document.createElement('style');
        st.textContent = 'html.kq-yopiq{overflow:hidden}html.kq-yopiq body{visibility:hidden}' +
          '.kq{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;' +
          'padding:calc(20px + env(safe-area-inset-top)) 20px calc(20px + env(safe-area-inset-bottom));box-sizing:border-box;overflow-y:auto;' +
          'background:#fbf8f1;color:#1f2a24;font:17px/1.4 system-ui,-apple-system,sans-serif;-webkit-user-select:none;user-select:none}' +
          '.kq-i{width:76px;height:76px;border-radius:18px;box-shadow:0 6px 18px rgba(0,0,0,.18)}' +
          '.kq-b{font-size:20px;font-weight:700}.kq-m{margin:0;min-height:1.4em;text-align:center;font-size:15px;color:#6b6f66}' +
          '.kq-d{display:flex;gap:18px;margin:2px 0 10px}.kq-d i{width:14px;height:14px;border-radius:50%;border:2px solid #167a4f;transition:background .12s}' +
          '.kq-d i.on{background:#167a4f}.kq-d.bad{animation:kqsh .35s}@keyframes kqsh{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}' +
          '.kq-k{display:grid;grid-template-columns:repeat(3,68px);gap:12px 22px}' +
          '.kq-k button{width:68px;height:68px;padding:0;border-radius:50%;border:1px solid #e3dccb;background:#fff;color:inherit;' +
          'font:500 26px system-ui,-apple-system,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
          '.kq-k button:active{background:#e3dccb}.kq-k button.kq-x{border:0;background:none;font-size:24px}' +
          'html[data-theme="dark"] .kq{background:#06281d;color:#f1e9d4}html[data-theme="dark"] .kq-m{color:#a6b7a8}' +
          'html[data-theme="dark"] .kq-d i{border-color:#dcb460}html[data-theme="dark"] .kq-d i.on{background:#dcb460}' +
          'html[data-theme="dark"] .kq-k button{background:#0c3527;border-color:#1b4a38}html[data-theme="dark"] .kq-k button.kq-x{background:none}' +
          '@media (prefers-color-scheme:dark){html:not([data-theme="light"]) .kq{background:#06281d;color:#f1e9d4}html:not([data-theme="light"]) .kq-m{color:#a6b7a8}' +
          'html:not([data-theme="light"]) .kq-d i{border-color:#dcb460}html:not([data-theme="light"]) .kq-d i.on{background:#dcb460}' +
          'html:not([data-theme="light"]) .kq-k button{background:#0c3527;border-color:#1b4a38}html:not([data-theme="light"]) .kq-k button.kq-x{background:none}}' +
          '@media (max-height:540px){.kq-i{display:none}.kq-k{gap:8px 18px}.kq-k button{width:56px;height:56px;font-size:22px}}';
        (document.head || H).appendChild(st);
      }
      function kutish() { var t = +(G('kirish-kut') || 0) - Date.now(); return t > 0 ? t : 0; }
      function yoz(t) { var m = d && d.querySelector('.kq-m'); if (m) m.textContent = t; }
      function nuqta() { if (!d) return; var n = d.querySelectorAll('.kq-d i'); for (var i = 0; i < n.length; i++) n[i].className = i < v.length ? 'on' : ''; }
      function sana() { var w = kutish(); if (!d) return; if (!w) { yoz(T.s); return; } yoz(T.k + Math.ceil(w / 1000) + T.kk); setTimeout(sana, 1000); }
      function silkit() { var b = d.querySelector('.kq-d'); b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); }
      function ochil() {
        band = false; v = ''; H.classList.remove('kq-yopiq');
        if (d && d.parentNode) d.parentNode.removeChild(d);
        d = null; document.removeEventListener('keydown', tug, true);
      }
      function tekshir() {
        band = true;
        if (xesh(v) === KX) { S('kirish-ok', KX); S('kirish-xato', null); S('kirish-kut', null); nuqta(); setTimeout(ochil, 150); return; }
        var n = +(G('kirish-xato') || 0) + 1;
        if (n >= 5) { S('kirish-kut', String(Date.now() + 30000)); n = 0; }
        S('kirish-xato', String(n)); silkit();
        setTimeout(function () { band = false; v = ''; nuqta(); if (kutish()) sana(); else yoz(T.x); }, 400);
      }
      function bos(x) {
        if (band || !d) return;
        if (x === 'x') { v = v.slice(0, -1); nuqta(); return; }
        if (kutish() || v.length >= 4) return;
        v += x; nuqta(); if (v.length === 4) tekshir();
      }
      function tug(e) {
        if (!d) return;
        if (/^[0-9]$/.test(e.key)) bos(e.key); else if (e.key === 'Backspace') bos('x'); else return;
        e.preventDefault(); e.stopPropagation();
      }
      function yop() {
        if (d || ochiq()) return;
        css(); H.classList.add('kq-yopiq');
        d = document.createElement('div'); d.className = 'kq'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', T.b);
        var h = '<img class="kq-i" src="icon-192.png" alt="" onerror="this.remove()"><b class="kq-b">' + T.b + '</b><p class="kq-m">' + T.s + '</p>' +
          '<div class="kq-d"><i></i><i></i><i></i><i></i></div><div class="kq-k">';
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'x'].forEach(function (k) {
          h += k === '' ? '<span></span>' : k === 'x' ? '<button type="button" class="kq-x" data-k="x" aria-label="' + T.o + '">⌫</button>' : '<button type="button" data-k="' + k + '">' + k + '</button>';
        });
        d.innerHTML = h + '</div>';
        d.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button[data-k]'); if (b) bos(b.getAttribute('data-k')); });
        H.appendChild(d);                       /* body hali yo'q bo'lishi mumkin — <html> ga; body yopiq (ko'rinmaydi) */
        document.addEventListener('keydown', tug, true);
        if (kutish()) sana();
      }
      document.addEventListener('visibilitychange', function () { if (!document.hidden) yop(); });
      yop();
    })();
  } catch (e) {}
  /* «Офлайн сақлаш» o'chirilgan bo'lsa — saqlangan dars ovozlari (sw.js keshi) har sahifa ochilganda tozalanadi: telefonda yig'ilib qolmaydi */
  try { if (JSON.parse(localStorage.getItem('sozlama') || '{}').oflayn === false && window.caches) caches.delete('arab-tili-audio'); } catch (e) {}
  /* «baza-vt» (14.11.2026, foydalanuvchi: kerakli hamma narsa akkaunt orqali saqlansin): serverga ham ketadigan sozlama va dars holati
     kalitlarining o'zgargan vaqti (baza.js birlashtirishda yangisini tanlaydi; ro'yxat — baza.js GEN bilan bir xil) va «baza-oz» (yuborilmagan
     o'zgarish bor). Hamma sahifada — baza.js yo'q sahifada (dars, Сарф, Феъллар) ham. baza.js serverdan yozganda (BAZA_ICHKI) belgilanmaydi. */
  try {
    var GEN = /^(dars\d+-holat|sarf-holat|fl200_(best|mist|t)|sozlama|sozlama-q|til|dars-uz|dars-tezlik|izoh-til|tinglash-(opt|mode|dars)|fe-pref|fe-tour|takror-qol|reyting-qol|oxirgi-dars)$/;
    var s0 = Storage.prototype.setItem, r0 = Storage.prototype.removeItem;
    var belgi = function (st, k) {
      if (window.BAZA_ICHKI || !GEN.test(k)) return;
      try { var m = JSON.parse(st.getItem('baza-vt') || '{}'), t = Date.now(); m[window.Profil ? Profil.fiz(k) : k] = t;   /* ruscha profilda — «ru-…» (baza.js) */ s0.call(st, 'baza-vt', JSON.stringify(m)); if (!st.getItem('baza-oz')) s0.call(st, 'baza-oz', String(t)); } catch (e) {}
    };
    Storage.prototype.setItem = function (k, v) { if (this !== window.localStorage) return s0.call(this, k, v); var o = this.getItem(k); s0.call(this, k, v); if (o !== String(v)) belgi(this, k); };
    Storage.prototype.removeItem = function (k) { if (this !== window.localStorage) return r0.call(this, k); var o = this.getItem(k); r0.call(this, k); if (o !== null) belgi(this, k); };
  } catch (e) {}
  var KEY = me.getAttribute('data-key') || '';
  var HOME = me.getAttribute('data-home') || '';
  /* ҚОБИҚ (13.11.2026): bosh sahifaga qaytadigan sahifalar (darslar, Сарф, Наҳв, йўриқнома…) oxirgi ochilgan bo'limga qaytadi —
     qobiq.js uni sessionStorage «qobiq-uy» ga yozadi (yol.html / takror.html / qoidalar.html / yana.html). Yozuv bo'lmasa — bosh sahifa
     (u xaritaga o'tkazadi). Ikkala tilda bir xil (14.11.2026). */
  var UY = '';
  try { UY = sessionStorage.getItem('qobiq-uy') || ''; } catch (e) {}
  if (!/^[a-z-]+\.html$/.test(UY)) UY = '';
  function uyMi(p) { return /\/(index\.html)?$/.test(p); }   /* sayt ildizi (bosh sahifa) */
  if (UY && uyMi(new URL(HOME || 'x', location.href).pathname)) HOME = UY;
  var TK = KEY + '-t', W = null, tm = null, last = 0, BLOCK = false;
  var CK = window.Profil ? Profil.fiz(KEY) : KEY;     /* Telegram bulutidagi nom: ruscha profilda «ru-…» (localStorage kalitlari Profil orqali o'zi) */
  var LT0 = 0; try { LT0 = +(localStorage.getItem(TK) || 0); } catch (e) {}

  /* bosilganda darhol belgi: sahifa yuklanayotganini ko'rsatadi */
  try {
    var css = document.createElement('style');
    css.textContent = 'html.go body{pointer-events:none}' +
      'html.go::before{content:"";position:fixed;z-index:99;left:0;top:0;height:3px;width:100%;background:#0f7a4f;transform-origin:left;animation:gobar 1.4s cubic-bezier(.2,.8,.2,1) forwards}' +
      'html.go::after{content:"";position:fixed;inset:0;z-index:98;background:rgba(0,0,0,.05)}' +
      '@keyframes gobar{from{transform:scaleX(.08)}to{transform:scaleX(.9)}}';
    (document.head || document.documentElement).appendChild(css);
  } catch (e) {}
  /* qulf ko'pi bilan 5 s (06.11.2026): sahifa kelmasa (sekin internet) — ekran qotib qolmasin */
  var goT = null;
  function goOff() { clearTimeout(goT); document.documentElement.classList.remove('go'); }
  function goOn() { document.documentElement.classList.add('go'); clearTimeout(goT); goT = setTimeout(goOff, 5000); }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) goOff(); });
  function inTg() {
    if (W) return true;
    if (window.TelegramWebviewProxy || /tgWebApp/.test(location.hash)) return true;
    /* 11.11.2026: telegram-web-app.js Telegramdan tashqarida ham bu kalitga «{}» yozadi —
       ilovada (PWA) havolalar location.replace bo'lib, telefon «orqaga» tugmasi ilovani yopardi. */
    try {
      var p = JSON.parse(sessionStorage.getItem('__telegram__initParams') || '{}');
      return !!(p && (p.tgWebAppData || p.tgWebAppVersion));
    } catch (e) { return false; }
  }
  /* KIRISH (14.11.2026, foydalanuvchi qarori; docs/texnik.md 17). Kech (foydalanuvchi: «kerakli hamma narsa akkaunt orqali saqlansin, boshqa
     telefonda ham ochilsin»): Telegramdan tashqarida **kirishsiz faqat 1-darsni o'qish va eshitish**; natija yaratadigan hammasi — Telegram orqali
     kirgandan keyin. Telegram ichida, sinov va ko'rish (github.io /tayyor/) sahifalarida so'ralmaydi. Kirish — baza.js (ulashBoshla / ulashTekshir).
       N-dars (N≠1), takror.html (Луғат), sarf.html, feellar.html, tinglash.html (1-darsdan boshqa) — sahifa ochilganda;
       1-dars — «Луғат» / «Машқ» yorlig'i bosilganda (oynani yopsa bo'ladi); yol.html — so'z saralash va imtihon boshlanganda (Kirish.oyna). */
  var Kirish = window.Kirish = (function () {
    function G(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function kerak() { return !(inTg() || G('baza-tg') || window.KORISH || /\/sinov-[^\/]*$/.test(location.pathname)); }
    var TG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.4 3.6 2.9 10.7c-1 .4-1 1.1-.2 1.4l4.7 1.5 1.8 5.6c.2.6.4.8.9.8s.6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.8zM9.8 14.3l8.2-5.2c.4-.2.7-.1.4.2l-6.9 6.3-.3 3.2z"/></svg>';
    var d = null, xbEl, kt = null;
    function xb(t) { if (xbEl) xbEl.textContent = t; }
    function yop() { clearInterval(kt); if (d && d.parentNode) d.parentNode.removeChild(d); d = null; document.documentElement.style.overflow = ''; }
    function tek() {
      if (document.hidden || !d || !window.Baza || !Baza.ulashKutmoqda()) return;
      Baza.ulashTekshir(function (ok, tugadi) {
        if (ok) { clearInterval(kt); xb('Уланди ✓'); setTimeout(yop, 800); }
        else if (tugadi) { clearInterval(kt); xb('Вақт тугади. Қайта босинг.'); }
      });
    }
    function kut() { clearInterval(kt); kt = setInterval(tek, 3000); }
    var css = false;
    function oyna(yopsa) {           /* yopsa — «Ёпиш» tugmasi (1-dars yorliqlari, xarita); aks holda — «Бош саҳифага қайтиш» */
      if (d || !document.body) return;
      if (!css) { css = true; var st = document.createElement('style');
      st.textContent = '#kr-d{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;background:rgba(8,20,14,.62);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
        '.kr-k{width:100%;max-width:400px;box-sizing:border-box;padding:26px 20px 14px;border-radius:24px;background:#fff;color:#1b1f1d;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.35);font-family:inherit}' +
        '.kr-ib{width:64px;height:64px;margin:0 auto;border-radius:50%;background:#e3f4fd;color:#2AABEE;display:flex;align-items:center;justify-content:center}.kr-ib svg{width:34px;height:34px}' +
        '.kr-k h2{margin:14px 0 8px;font-size:21px;line-height:1.3}.kr-k p{margin:0 0 18px;font-size:15px;line-height:1.5;color:#5a635f}' +
        '.kr-tg{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:54px;border:0;border-radius:16px;background:#2AABEE;color:#fff;font-size:17px;font-weight:700;font-family:inherit;cursor:pointer}.kr-tg svg{width:24px;height:24px}' +
        '.kr-x{margin:10px 0 0;min-height:1.4em;font-size:14px;line-height:1.4;color:#0f7a4f}.kr-uy{display:inline-block;margin-top:4px;padding:10px;color:#5a635f;font-size:15px}' +
        '@media (prefers-color-scheme:dark){html:not([data-theme="light"]) .kr-k{background:#1e2522;color:#e8ecea}html:not([data-theme="light"]) .kr-k p,html:not([data-theme="light"]) .kr-uy{color:#a9b3ae}html:not([data-theme="light"]) .kr-ib{background:#16384a}html:not([data-theme="light"]) .kr-x{color:#6fd3a3}}' +
        'html[data-theme="dark"] .kr-k{background:#1e2522;color:#e8ecea}html[data-theme="dark"] .kr-k p,html[data-theme="dark"] .kr-uy{color:#a9b3ae}html[data-theme="dark"] .kr-ib{background:#16384a}html[data-theme="dark"] .kr-x{color:#6fd3a3}';
      document.head.appendChild(st); }
      d = document.createElement('div');
      d.id = 'kr-d'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'kr-h');
      d.innerHTML = '<div class="kr-k"><div class="kr-ib">' + TG + '</div><h2 id="kr-h">Давом этиш учун киринг</h2>' +
        /* 14.11.2026 (foydalanuvchi): ortiqcha gap yo'q — sarlavha va tugma */
        '<button class="kr-tg" id="kr-b">' + TG + 'Telegram орқали кириш</button><p class="kr-x" id="kr-x" role="status"></p>' +
        (yopsa ? '<button class="kr-uy" id="kr-y" style="border:0;background:none;font:inherit;cursor:pointer">Ёпиш</button>' : '<a class="kr-uy" href="' + (HOME || 'yol.html') + '">Бош саҳифага қайтиш</a>') + '</div>';
      document.body.appendChild(d);
      document.documentElement.style.overflow = 'hidden';
      xbEl = d.querySelector('#kr-x');
      if (yopsa) d.querySelector('#kr-y').onclick = yop;
      d.querySelector('#kr-b').onclick = function () {
        var B = window.Baza;
        if (!B || !B.ulashBoshla) { xb('Бир оз кутиб, қайта босинг…'); return; }
        var tok = B.ulashBoshla();
        try { window.open('https://t.me/Arabtilihivar_bot/darslar?startapp=kir_' + tok, '_blank'); } catch (e) {}
        xb('Telegram очилди. У ерда тасдиқланг ва шу саҳифага қайтинг.');
        kut();
      };
      /* baza.js yo'q sahifada «jim» yuklanadi: o'zi sinxronlamaydi, faqat kirish uchun */
      var yuk = function () { if (window.Baza && Baza.ulashKutmoqda()) { xb('Telegram\'да тасдиқлашингиз кутилмоқда…'); kut(); } };
      if (window.Baza) yuk();
      else { window.BAZA_JIM = 1; var sc = document.createElement('script'); sc.src = 'baza.js'; sc.onload = yuk; sc.onerror = function () { xb('Интернетни текширинг.'); }; document.head.appendChild(sc); }
    }
    document.addEventListener('visibilitychange', tek);
    return { kerak: kerak, oyna: oyna };
  })();
  (function () {
    if (!Kirish.kerak()) return;
    var m = /^dars(\d+)-holat$/.exec(KEY), dars1 = !!m && +m[1] === 1, nom = (location.pathname.match(/([a-z]+)\.html$/) || [])[1] || '';
    var avto = (m && !dars1) || /^(takror|sarf|feellar)$/.test(nom) || (nom === 'tinglash' && !/[?&]d=0*1(&|$)/.test(location.search));
    function boshla() {
      if (avto) { Kirish.oyna(false); return; }
      if (dars1 && typeof window.tab === 'function') {      /* 1-dars: Матн ochiq, «Луғат» (t2) va «Машқ» (t3) — kirgach */
        var t0 = window.tab;
        window.tab = function (n) { if ((n === 2 || n === 3) && Kirish.kerak()) { Kirish.oyna(true); return; } return t0.apply(this, arguments); };
        if (document.querySelector('#t2.on,#t3.on')) t0(1);
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boshla); else boshla();
  })();
  /* sahifalar orasida o'tish: Telegramda tarix yig'ilmasin */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || ev.defaultPrevented || a.target || a.hasAttribute('download') || a.origin !== location.origin ||
        /^(#|javascript:)/.test(a.getAttribute('href')) || a.pathname === location.pathname) return;
    goOn();
    var href = a.href;
    if (UY && uyMi(a.pathname) && !uyMi(location.pathname)) href = new URL(UY, location.href).href;   /* bosh sahifa havolasi → oxirgi bo'lim */
    if (inTg()) { ev.preventDefault(); location.replace(href); return; }
    /* ilova/brauzer: kelgan sahifaga («‹») qaytishda — tarixda orqaga (tarix aylanib qolmasin) */
    if (history.length > 1 && document.referrer && href.split('#')[0] === document.referrer.split('#')[0]) {
      ev.preventDefault(); history.go(GU ? -2 : -1);   /* oyna uchun qo'shilgan holat bo'lsa — uni ham o'tib */
    } else if (href !== a.href) { ev.preventDefault(); location.replace(href); }
  });
  window.addEventListener('pageshow', goOff);

  /* yangi versiya yuklanib bo'lishi bilan sahifa bir marta o'zi yangilanadi */
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      /* 06.11.2026: o'xshamasa o'zi qayta urinadi — internet qaytganda, ilovaga qaytganda, audio to'xtaganda;
         audio o'ynayotganda yoki yozish maydonida turganda yangilanmaydi (eshitish bo'linmasin) */
      var upd = false, rlAt = 0;
      var busy = function () {
        var a = document.querySelectorAll('audio'), i;
        for (i = 0; i < a.length; i++) if (!a[i].paused && !a[i].ended) return true;
        var f = document.activeElement; return !!(f && /^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName));
      };
      /* 10.11.2026: audio sabab o'zi yangilana olmasa — tepada «Янгилаш» tugmasi (bosilsa darhol, bosilmasa audio to'xtaganda o'zi) */
      var bar = null;
      var showBar = function () {
        if (bar || !document.body) return;
        bar = document.createElement('button'); bar.type = 'button'; bar.className = 'upd-bar';
        bar.textContent = '\u21bb Янги версия тайёр \u00b7 Янгилаш';
        bar.style.cssText = 'position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);' +
          'z-index:2147483000;border:0;border-radius:999px;padding:10px 18px;background:#167a4f;color:#fff;' +
          'font:600 15px/1.2 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.25);white-space:nowrap;cursor:pointer';
        bar.addEventListener('click', function () { rlAt = Date.now(); goOn(); location.reload(); });
        document.body.appendChild(bar);
      };
      var rel = function () {
        if (!upd || document.hidden || !navigator.onLine) return;
        if (busy()) { showBar(); return; }
        if (Date.now() - rlAt < 10000) return;
        rlAt = Date.now(); goOn(); location.reload();
      };
      /* 10.11.2026: yangi versiyani ilovaga qaytganda va ochiq turganda (10 daqiqada bir) so'rash —
         brauzer o'zi faqat sahifa qayta ochilganda tekshiradi (orqa fondan qaytganda emas) */
      var chkAt = Date.now();
      var check = function () {
        if (upd || document.hidden || !navigator.onLine || Date.now() - chkAt < 60000) return;
        chkAt = Date.now();
        navigator.serviceWorker.getRegistration().then(function (r) { if (r) return r.update(); }).catch(function () {});
      };
      /* 25.11.2026 (foydalanuvchi: «ochganda eski versiyasi ko'rinib qolyapti, keyin yana qayta olyapti»): yangi versiya ilova endi
         ochilganda yoki orqa fondan qaytganda (12 s ichida, hali hech narsa bosilmagan) topilsa — eski sahifa ustida «Янги версия
         юкланмоқда… N%» pardasi, tayyor bo'lishi bilan darhol yangilanadi. 25 s da tugamasa yoki o'rnatish buzilsa — parda yo'qoladi,
         eski versiyada davom etadi (keyin avvalgidek). Ishlatib turgan paytda topilsa — avvalgidek, pardasiz. Foiz — sw.js install xabari. */
      var ochAt = Date.now(), tegdi = false, parda = null, pT = 0;
      ['pointerdown', 'touchstart', 'keydown'].forEach(function (t) { document.addEventListener(t, function () { if (!parda) tegdi = true; }, true); });
      document.addEventListener('visibilitychange', function () { if (!document.hidden) { ochAt = Date.now(); tegdi = false; } });
      var pardaYop = function () { clearTimeout(pT); if (parda) { try { parda.remove(); } catch (x) {} parda = null; } };
      var pardaOch = function () {
        if (parda || upd || tegdi || document.hidden || busy() || Date.now() - ochAt > 12000 || !document.body) return;
        var ru = window.Profil && Profil.til === 'ru', bs = getComputedStyle(document.body), fon = bs.backgroundColor;
        if (!fon || /rgba\(0, 0, 0, 0\)|transparent/.test(fon)) fon = matchMedia('(prefers-color-scheme: dark)').matches ? '#15171a' : '#fbf8f1';
        parda = document.createElement('div'); parda.className = 'upd-parda';
        parda.style.cssText = 'position:fixed;inset:0;z-index:2147483001;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
          'gap:14px;background:' + fon + ';color:' + bs.color + ';font:600 16px/1.3 system-ui,-apple-system,sans-serif;text-align:center;padding:24px';
        var sp = document.createElement('div');
        sp.style.cssText = 'width:38px;height:38px;border-radius:50%;border:4px solid rgba(22,122,79,.2);border-top-color:#167a4f';
        var tx = document.createElement('div'); tx.textContent = ru ? 'Загружается новая версия…' : 'Янги версия юкланмоқда…';
        var n = document.createElement('div'); n.className = 'upd-n'; n.style.cssText = 'font-size:14px;opacity:.7;min-height:18px';
        parda.appendChild(sp); parda.appendChild(tx); parda.appendChild(n);
        document.body.appendChild(parda);
        try { sp.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 900, iterations: Infinity }); } catch (x) {}
        pT = setTimeout(pardaYop, 25000);
      };
      var kuzat = function (w) {
        if (!w || w === navigator.serviceWorker.controller) return;
        pardaOch();
        w.addEventListener('statechange', function () { if (w.state === 'redundant') pardaYop(); });
      };
      navigator.serviceWorker.getRegistration().then(function (r) {
        if (!r) return;
        kuzat(r.installing || r.waiting);
        r.addEventListener('updatefound', function () { kuzat(r.installing); });
      }).catch(function () {});
      navigator.serviceWorker.addEventListener('message', function (ev) {
        var d = ev.data || {};
        if (d.t !== 'upd' || !parda || !d.n) return;
        var el = parda.querySelector('.upd-n'); if (el) el.textContent = Math.min(100, Math.round(d.k * 100 / d.n)) + '%';
      });
      try { navigator.serviceWorker.startMessages(); } catch (x) {}
      navigator.serviceWorker.addEventListener('controllerchange', function () { upd = true; rel(); });
      window.addEventListener('online', function () { rel(); check(); });
      window.addEventListener('focus', check);
      document.addEventListener('visibilitychange', function () { setTimeout(rel, 300); setTimeout(check, 500); });
      setInterval(check, 600000);
      try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.onEvent) Telegram.WebApp.onEvent('activated', check); } catch (e2) {}
      document.addEventListener('pause', function () { setTimeout(rel, 800); }, true);
      document.addEventListener('ended', function () { setTimeout(rel, 800); }, true);
      setInterval(rel, 15000);
    }
  } catch (e) {}

  /* mahalliy yozuvlarga vaqt belgisi */
  if (KEY) {
    try {
      var orig = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (BLOCK && this === window.localStorage && k === KEY) return;
        orig.call(this, k, v);
        if (this === window.localStorage && k === KEY) {
          orig.call(this, TK, String(Date.now()));
          if (W) { clearTimeout(tm); tm = setTimeout(up, 4000); }
        }
      };
    } catch (e) {}
  }

  function up() {
    if (!W || !KEY) return;
    var now = Date.now();
    if (now - last < 8000) { clearTimeout(tm); tm = setTimeout(up, 8000); return; }
    last = now;
    try {
      var p = JSON.stringify({ t: +(localStorage.getItem(TK) || now), v: localStorage.getItem(KEY) || '' });
      if (p.length < 4000) W.CloudStorage.setItem(CK, p);
    } catch (e) {}
  }

  function pull() {
    W.CloudStorage.getItem(CK, function (err, val) {
      if (err || !val) return;
      try {
        var c = JSON.parse(val), lt = LT0;
        if (c.v && c.t > lt + 1000) {
          localStorage.setItem(KEY, c.v);
          localStorage.setItem(TK, String(c.t));
          if (!sessionStorage.getItem(CK + '-r')) { sessionStorage.setItem(CK + '-r', '1'); BLOCK = true; location.reload(); }
        }
      } catch (e) {}
    });
  }


  /* «Орқага» avval ochiq oynani yopadi (18.11.2026, foydalanuvchi: oyna ichida «орқага» bosilsa darsdan chiqib ketardi).
     Telegram «‹» (Androidda telefon tugmasi ham shu) va chap chetdan surish — orqa(); brauzer/ilovada telefon tugmasi — tarix: oyna ochilganda
     (bosishdan keyin — Chrome bosishsiz qo'shilgan holatni o'tkazib yuboradi) bitta {orqa:1} holat qo'shiladi, oyna yopilsa olib tashlanadi.
     Yo'riqnoma o'ynatkichi (.qs) tarixni o'zi boshqaradi. Majburiy kirish oynasi ro'yxatda yo'q (yopilsa, kirishsiz o'tib ketardi).
     Yangi oyna qo'shilsa — shu ro'yxatga (tepadagi oyna birinchi). docs/texnik.md 1. */
  var ESC = function () { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); };
  var OYNA = [
    ['.qs', function () { if (window.Qollanma) Qollanma.yop(); }, 1],
    ['#vo', function (e) { e.querySelector('.vo-x').click(); }],                                     /* yo'riqnoma videosi (Vid.och, shu faylning oxirida) */
    ['.tour', function (e) { var x = e.querySelector('.tx'); if (x) x.click(); else e.remove(); }],   /* dars turi */
    ['#sh.on', function (e) { e.classList.remove('on'); }],                                              /* dars: so'z / izoh oynasi */
    ['#yp', ESC],                                                                                         /* yol.html: dars, imtihon, kitob oynasi */
    ['#bd.on', ESC],                                                                                      /* yol.html: boblar ro'yxati */
    ['.hpop.on', function (e) { e.classList.remove('on'); var q = document.querySelector('.dh .q'); if (q) q.classList.remove('on'); }],
    ['.spm.on', function (e) { e.classList.remove('on'); }],                                             /* pleyer tezligi */
    ['#tqd', function (e) { e.click(); }],                                                                /* takror.html: oldingi kartani ko'rish → «Давом этиш» */
    ['body.tq-ses #yop, body.tq-ses #mq0', function (e) { e.click(); }]                                  /* takror.html: mashg'ulot (✕ kabi yopiladi, «Машқ» qoladi; javoblar har kartada saqlangan). 26.11.2026 */
  ];
  function ochiqOyna(hammasi) {
    for (var i = 0; i < OYNA.length; i++) {
      if (OYNA[i][2] && !hammasi) continue;
      var e = document.querySelector(OYNA[i][0]);
      if (e && e.getClientRects().length) return { e: e, yop: OYNA[i][1] };
    }
    return null;
  }
  var GU = false, TASH = 0;                    /* GU — tarixda oyna holati bor; TASH — o'zimiz qilgan history.back() (popstate e'tiborsiz) */
  function tekshir() {
    var o = ochiqOyna(false);
    if (o && !GU) { try { history.pushState({ orqa: 1 }, ''); GU = true; } catch (e) {} }
    else if (!o && GU && history.state && history.state.orqa) { GU = false; TASH++; history.back(); }
    if (W && !HOME) try { if (ochiqOyna(true)) W.BackButton.show(); else W.BackButton.hide(); } catch (e) {}   /* bosh sahifada «‹» faqat oyna ochiqda */
  }
  ['click', 'pointerup', 'touchend', 'keyup'].forEach(function (t) {
    document.addEventListener(t, function () { setTimeout(tekshir, 0); setTimeout(tekshir, 450); }, true);
  });
  addEventListener('popstate', function () {
    if (TASH) { TASH--; return; }
    if (!GU || (history.state && history.state.orqa)) return;   /* ustidagi boshqa holat (yo'riqnoma) olindi — bizniki joyida */
    GU = false;
    var o = ochiqOyna(false); if (o) o.yop(o.e);
    setTimeout(tekshir, 0);
  });
  function orqa() {
    var o = ochiqOyna(true);
    if (o) { o.yop(o.e); setTimeout(tekshir, 0); return; }
    if (!HOME) { tekshir(); return; }
    document.documentElement.classList.add('go'); location.replace(HOME);
  }

  /* iPhone'dagidek: ekranning chap chetidan o'ngga surib bosh sahifaga qaytish */
  if (HOME) (function () {
    var x0 = 0, y0 = 0, t0 = 0, on = false, lock = 0, dx = 0, b, sh;
    function set(v, anim) {
      b.style.transition = anim ? 'transform .22s ease-out' : 'none';
      b.style.transform = v ? 'translateX(' + v + 'px)' : '';
      sh.style.transition = b.style.transition;
      sh.style.opacity = v ? String(Math.max(0, .35 - v / innerWidth * .35)) : '0';
    }
    document.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      if (e.touches.length > 1 || t.clientX > 28) return;
      b = document.body;
      if (!sh) { sh = document.createElement('div'); sh.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:2147483646'; document.documentElement.appendChild(sh); }
      x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); on = true; lock = 0; dx = 0;
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!on) return;
      var t = e.touches[0], mx = t.clientX - x0, my = t.clientY - y0;
      if (!lock) { if (Math.abs(mx) < 8 && Math.abs(my) < 8) return; lock = Math.abs(mx) > Math.abs(my) && mx > 0 ? 1 : 2; }
      if (lock !== 1) { on = false; return; }
      e.preventDefault(); dx = Math.max(0, mx); set(dx);
    }, { passive: false });
    function end() {
      if (!on) return; on = false;
      if (lock !== 1) return;
      var v = dx / Math.max(1, Date.now() - t0);
      if (dx > innerWidth * .33 || (v > .5 && dx > 40)) {
        if (ochiqOyna(true)) { set(0, true); orqa(); return; }   /* oyna ochiq — sahifa joyida, oyna yopiladi */
        set(innerWidth, true);
        document.documentElement.classList.add('go');
        setTimeout(function () { location.replace(HOME); }, 180);
      } else set(0, true);
    }
    document.addEventListener('touchend', end);
    document.addEventListener('touchcancel', end);
    addEventListener('pageshow', function () { if (b) set(0); });
  })();

  function start() {
    var w = window.Telegram && Telegram.WebApp;
    if (!w || !w.initData) return;          /* oddiy brauzer */
    W = w;
    try { w.ready(); w.expand(); } catch (e) {}
    if (w.BackButton) {
      try {
        if (HOME) { w.BackButton.show(); w.BackButton.onClick(orqa); }
        else { w.BackButton.hide(); w.BackButton.onClick(orqa); }   /* bosh sahifa: Telegram o'zi yopadi; oyna ochiqda «‹» uni yopadi (tekshir) */
      } catch (e) {}
    }
    if (KEY && w.CloudStorage && w.isVersionAtLeast && w.isVersionAtLeast('6.9')) {
      pull();
      document.addEventListener('visibilitychange', function () { if (document.hidden) { last = 0; up(); } });
    }
    document.documentElement.classList.add('in-tg');
    document.dispatchEvent(new Event('tgready'));
  }

  /* statistika: kim kirgan va hozir kim ishlayapti (Google Sheets'ga) */
  var STAT_URL = 'https://script.google.com/macros/s/AKfycbxksQz-jII6bVIWKgl63gfASBRDr4SGsScYJg0jogaulyzOoVluyGtf6pU1TIZV-ntRcA/exec';
  /* Telegram foydalanuvchisi: skript yuklanmasa ham manzildagi tgWebAppData'dan olinadi */
  function tgUser() {
    try {
      var h = location.hash.slice(1), q = '';
      var m = /(?:^|&)tgWebAppData=([^&]*)/.exec(h);
      if (m) q = decodeURIComponent(m[1]);
      else { var ip = JSON.parse(sessionStorage.getItem('__telegram__initParams') || '{}'); q = ip.tgWebAppData || ''; }
      var um = /(?:^|&)user=([^&]*)/.exec(q);
      return um ? JSON.parse(decodeURIComponent(um[1])) : null;
    } catch (e) { return null; }
  }
  /* brauzer ID: localStorage + cookie (biri o'chsa ham ikkinchisidan tiklanadi) */
  function webId() {
    var r = '';
    try { r = localStorage.getItem('stat-id') || ''; } catch (e) {}
    if (!r) { var c = /(?:^|; )statid=([a-z0-9]+)/.exec(document.cookie); if (c) r = c[1]; }
    if (!r) r = 'web' + Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem('stat-id', r); } catch (e) {}
    try { document.cookie = 'statid=' + r + '; max-age=63072000; path=/; SameSite=Lax'; } catch (e) {}
    return r;
  }
  function stat(t) {
    if (!STAT_URL) return;
    /* avtomatik brauzer (Claude sinovi, bot) va kompyuterdagi nusxa statistikaga yozilmaydi (05.11.2026) */
    if (navigator.webdriver || /Headless|bot|crawl|spider|Lighthouse/i.test(navigator.userAgent) || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname)) return;
    try {
      var u = (W && W.initDataUnsafe && W.initDataUnsafe.user) || tgUser(), d;
      if (u) {
        d = { id: 'tg' + u.id, fn: u.first_name || '', ln: u.last_name || '', un: u.username || '' };
        try { localStorage.setItem('stat-tg', JSON.stringify(d)); } catch (e) {}
      } else {
        var o = null; try { o = JSON.parse(localStorage.getItem('stat-tg') || 'null'); } catch (e) {}
        if (o && o.id) d = o;                       /* shu qurilmada oldin Telegram orqali kirgan */
        else d = { id: webId(), fn: '', ln: '', un: '' };
      }
      d.t = t; d.p = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
      fetch(STAT_URL, { method: 'POST', mode: 'no-cors', keepalive: true, body: JSON.stringify(d) }).catch(function () {});
    } catch (e) {}
  }
  function statStart() {
    stat('open');
    setInterval(function () { if (!document.hidden) stat('ping'); }, 60000);
  }

  var sc = document.createElement('script');
  sc.src = 'https://telegram.org/js/telegram-web-app.js';
  sc.onload = function () { start(); statStart(); };
  sc.onerror = statStart;
  document.head.appendChild(sc);
})();

/* Audio yuklanishi — haqqoniy holat (12.11.2026; avvalgisi pleyer buferi foizini ko'rsatardi va qotib qolardi).
   Audio o'ynashni kutib qolsa: SW dan so'raladi (message 'aud') — fayl telefondami, yuklanyaptimi, necha foiz.
   • yuklanyapti      → «⬇️ Аудио юкланяпти… N%» (N — faylning haqiqiy yuklangan qismi)
   • telefonda tayyor → pleyer o'zi qayta ulanadi va o'sha joydan davom etadi (heal) — chiqib-kirish shart emas
   • yuklanmadi / internet yo'q → sababi yoziladi + «Юклаш» tugmasi (bosilsa qayta yuklaydi) */
(function () {
  var box = null, txt = null, btn = null, t = null, cur = null, poll = null, since = 0, heals = 0, lastHeal = 0, tried = false, shownAt = 0;
  function el() {
    if (box) return box;
    box = document.createElement('div');
    box.setAttribute('role', 'status');
    box.style.cssText = 'position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top));transform:translateX(-50%);z-index:100;' +
      'background:var(--cd,#fff);color:var(--tx,#1e2a26);border:1px solid var(--bd,#e0dccf);border-radius:999px;padding:6px 8px 6px 14px;' +
      'font:600 13.5px/1.3 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.15);display:none;white-space:nowrap;' +
      'align-items:center;gap:10px;max-width:calc(100vw - 24px)';
    txt = document.createElement('span'); txt.style.cssText = 'overflow:hidden;text-overflow:ellipsis;padding-right:6px';
    btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Юклаш';
    btn.style.cssText = 'display:none;border:0;border-radius:999px;padding:6px 14px;font:700 13.5px/1.2 system-ui,-apple-system,sans-serif;' +
      'background:var(--ac,#0f7a4f);color:#fff;cursor:pointer';
    btn.addEventListener('click', function (e) { e.stopPropagation(); if (cur) { tried = false; heals = 0; since = Date.now(); set('⬇️ Аудио юкланяпти…', false); ask(cur, true, function (s) { if (!s) heal(cur, true); }); } });
    box.appendChild(txt); box.appendChild(btn);
    (document.body || document.documentElement).appendChild(box);
    return box;
  }
  function set(text, withBtn) { el(); txt.textContent = text; btn.style.display = withBtn ? 'block' : 'none'; box.style.display = 'flex'; if (!shownAt) shownAt = Date.now(); }
  function hide() { clearTimeout(t); t = null; clearInterval(poll); poll = null; cur = null; shownAt = 0; if (box) box.style.display = 'none'; }
  function src(a) { return String(a.currentSrc || a.src || '').split('#')[0].split('?')[0]; }
  /* SW dan holat: cb({cached, loading, got, total}) yoki cb(null) — SW yo'q / javob bermadi */
  function ask(a, start, cb) {
    var c = navigator.serviceWorker && navigator.serviceWorker.controller, done = false;
    function fin(v) { if (!done) { done = true; cb(v); } }
    if (!c || !/\.mp3$/i.test(src(a))) return fin(null);
    try {
      var ch = new MessageChannel();
      ch.port1.onmessage = function (e) { fin(e.data || null); };
      c.postMessage({ t: 'aud', url: src(a), start: !!start }, [ch.port2]);
      setTimeout(function () { fin(null); }, 1500);
    } catch (e) { fin(null); }
  }
  /* pleyerni qayta ulash: joy, tezlik saqlanadi; o'ynayotgan bo'lsa davom etadi */
  function heal(a, force) {
    var now = Date.now();
    if (!force && (heals >= 4 || now - lastHeal < 4000)) return;
    heals++; lastHeal = now;
    var at = a.currentTime || 0, rate = a.playbackRate || 1, want = !a.paused || force || now - playAt < 4000;
    function back() {
      a.removeEventListener('loadedmetadata', back);
      try { if ('progSeek' in window) window.progSeek = true; if (at > 0.05) a.currentTime = at; a.playbackRate = rate; } catch (e) {}
      if (want) { var p = a.play(); if (p && p.catch) p.catch(function () {}); }
    }
    a.addEventListener('loadedmetadata', back);
    /* manzilga «?h=…» qo'shiladi: shunchaki load() qilinsa Chrome o'z xotirasidagi eski bo'laklarni (va ularning manbasini)
       qayta ishlatadi — qotish takrorlanadi. Yangi manzil — yangi ulanish. SW va server «?…» ni hisobga olmaydi. */
    try { var u = src(a); if (/\.mp3$/i.test(u)) a.src = u + '?h=' + now.toString(36); else a.load(); } catch (e) {}
    cur = a; since = now; if (!poll) poll = setInterval(tick, 700);
  }
  function tick() {
    var a = cur; if (!a) return;
    var wait = Date.now() - since;
    if (!navigator.onLine) { ask(a, false, function (s) { if (cur !== a) return; if (s && s.cached) heal(a); else set('📵 Интернет йўқ', true); }); return; }
    ask(a, !tried, function (s) {
      if (cur !== a) return;
      tried = true;
      if (!s) { /* SW yo'q (birinchi kirish): foizsiz; uzoq qotsa — qayta ulanadi, bo'lmasa tugma */
        if (wait > 6000 && heals < 2) heal(a);
        set(wait > 15000 ? '⚠️ Аудио юкланмади' : '⏳ Аудио юкланяпти…', wait > 15000); return;
      }
      if (s.cached) { set('⏳ Аудио очиляпти…', false); if (wait > 1200) heal(a); return; }
      if (s.loading) {
        var p = s.total ? Math.min(99, Math.floor(s.got / s.total * 100)) : -1;
        set('⬇️ Аудио юкланяпти…' + (p >= 0 ? ' ' + p + '%' : ''), false); return;
      }
      set('⚠️ Аудио юкланмади', true);
    });
  }
  function wait(ev) {
    var a = ev.target; if (!a || !/^(AUDIO|VIDEO)$/.test(a.tagName)) return;
    if (a.paused && ev.type != 'waiting') return;
    if (ev.type == 'stalled' && a.readyState >= 3) return; /* yetarli yuklangan bo'lsa «stalled» da yozuv chiqmasin */
    if (cur === a) return;
    cur = a; clearTimeout(t); since = Date.now(); heals = 0; tried = false; t0 = a.currentTime;
    t = setTimeout(function () { if (cur === a) { tick(); clearInterval(poll); poll = setInterval(tick, 700); } }, 500);
  }
  var t0 = 0, playAt = 0, errAt = 0;
  document.addEventListener('play', function (ev) { if (ev.target && /^(AUDIO|VIDEO)$/.test(ev.target.tagName)) playAt = Date.now(); }, true);
  function done(ev) {
    if (cur && cur !== ev.target) return;
    var now = Date.now();
    if (ev.type === 'emptied' && now - lastHeal < 3000) return;   /* o'zimiz qayta ulayapmiz */
    if (ev.type === 'pause' && now - errAt < 1500) return;        /* xatodan keyin brauzer o'zi to'xtatdi — foydalanuvchi emas */
    hide();
  }
  /* pleyer xato bersa (ulanish uzildi, javob mos kelmadi): foydalanuvchi o'ynatmoqchi bo'lgan bo'lsa — o'zi qayta ulanadi */
  function fail(ev) {
    var a = ev.target; if (!a || !/^(AUDIO|VIDEO)$/.test(a.tagName)) return;
    var now = Date.now(), want = !a.paused || cur === a || now - playAt < 4000;
    if (!want) return;
    errAt = now;
    if (cur !== a) { cur = a; since = now; heals = 0; tried = false; t0 = a.currentTime; }
    if (heals < 3 && navigator.onLine) { set('⏳ Аудио очиляпти…', false); heals++; lastHeal = 0; heal(a, true); }
    else { clearInterval(poll); poll = setInterval(tick, 700); tick(); }
  }
  document.addEventListener('waiting', wait, true);
  document.addEventListener('stalled', wait, true);
  ['playing', 'canplaythrough', 'pause', 'ended', 'emptied'].forEach(function (n) { document.addEventListener(n, done, true); });
  document.addEventListener('error', fail, true);
  /* audio vaqti oldinga yursa — yozuv yopiladi */
  document.addEventListener('timeupdate', function (ev) {
    var a = ev.target; if (cur !== a) return;
    if (!a.paused && !a.seeking && a.currentTime > t0 + 0.3 && a.readyState >= 3) hide(); else if (a.seeking || a.currentTime < t0) t0 = a.currentTime;
  }, true);
  window.addEventListener('online', function () { if (cur) { tried = false; tick(); } });
})();

/* BALL (26.11.2026, foydalanuvchi: «qancha ko'p foydalansa, shuncha ball»; qoida — takror.js REY, docs/texnik.md 19). takror.js'ni
   yuklamaydigan sahifalar (dars, Сарф, Эшитиш) javobni shu yerdan takror jurnaliga yozadi; ball serverda va «Рейтинг»da jurnaldan
   hisoblanadi. Shu yerda: yozish (o'qib-qo'shib-yozish — boshqa sahifa yozganini o'chirmaydi), ball ko'rinishi, tinglash vaqti.
   28.11.2026 (foydalanuvchi: «qilinsin va necha kun qolganini bilinib tursin … nima qancha ball berishi yo'riqnomalar bo'lishi kerak. Va ball
   olganda odam ekranda rag'batlanadigan, ball berilganini ko'rsatadigan bir motion … chiqadigan bo'lsin»):
   - savol (xd…, xs…) — kunning birinchi javobi; birinchi marta 10, keyingi kunlarda 3 (TAK; takror.js kunHisob bilan bir xil — olsa);
   - ko'rinish: uch() — tanga aylanib, uchqunlar sochilib «+10» / «+3» ko'tariladi; katta() — bonus (dars +100, bob +200, kitob +500,
     🔥 olov +50): o'rtada medal, nurlar, sanaladigan son, konfetti (bosilsa yopiladi, navbat bilan); toast() — tepada «Сўз «Биламан»га
     чиқди +50» (ketma-ket bo'lsa son qo'shiladi, ekranni to'smaydi); Telegram'da tebranish; prefers-reduced-motion — harakatsiz;
   - olov(): bugun seriya sharti bajarilganda bir marta «Бугунги олов ёнди!» (takror.js kunlik; yuklanmagan bo'lsa — o'zi yuklaydi);
   - qoida(): «Баллар» oynasi — nimaga qancha ball; yangi qoidagacha necha kun qolgani (qoldi()); [data-bq] bosilsa ochiladi. */
(function () {
  var DAN = 1795978800000, TZ = 5 * 3600000, TEZ = 700, B = 10, TAK = 3, ESH = 300000, ESH_MAX = 20;   /* takror.js REY bilan bir xil */
  var SN = /\/sinov-[^\/]*$/.test(location.pathname), KJ = SN ? 'takror-sinov-j' : 'takror-j', KE = SN ? 'ball-sinov-eshit' : 'ball-eshit',
    KO = SN ? 'ball-sinov-olov' : 'ball-olov';
  var LS = null; try { LS = window.localStorage; } catch (e) {}
  function L(k) { try { return LS ? LS.getItem(k) : null; } catch (e) { return null; } }
  function S(k, v) { try { if (LS) LS.setItem(k, v); } catch (e) {} }
  function kun(t) { return Math.floor((t + TZ) / 864e5); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ol() { try { return (JSON.parse(LS.getItem(KJ) || '{}') || {}).j || []; } catch (e) { return []; } }
  function qosh(e) {
    if (!LS) return;
    try { var j = ol(); j.push(e); LS.setItem(KJ, JSON.stringify({ v: 1, j: j })); if (!LS.getItem('baza-oz')) LS.setItem('baza-oz', String(Date.now())); } catch (x) {}
  }
  /* yangi qoida kuchga kirganmi (30.11.2026); ko'rish va sinov manzillarida — hozirdan («+10» ko'rinsin) */
  function faol() { return Date.now() >= DAN || !/(^|\.)nurut-tolib\.vercel\.app$/.test(location.hostname); }
  /* yangi qoidagacha necha kun (Toshkent kuni bilan; 0 — kuchda) */
  function qoldi() { var t = Date.now(); return t >= DAN ? 0 : Math.max(1, kun(DAN) - kun(t)); }
  function tezmi(ms) { return ms > 0 && ms < TEZ; }
  function savolmi(k) { return /^x[ds]/.test(k); }
  /* shu TO'G'RI javob qancha ball beradi (takror.js kunHisob bilan bir xil; j — yangi yozuvdan oldingi jurnal):
     savol — bugun bu savolga javob berilgan bo'lsa 0, ilgari ball bergan bo'lsa TAK, aks holda B; boshqasi — bugun hali ball bermagan bo'lsa B */
  function olsa(j, k, ms, t) {
    if (tezmi(ms)) return 0;
    var d = kun(t || Date.now()), x = (j || []).filter(function (e) { return e && e[0] === k && typeof e[1] === 'number'; }).sort(function (a, b) { return a[1] - b[1]; }), i;
    if (!savolmi(k)) { for (i = 0; i < x.length; i++) if (x[i][2] === 3 && kun(x[i][1]) === d && !tezmi(x[i][3])) return 0; return B; }
    var kd = {}, st = false;
    for (i = 0; i < x.length; i++) { var dd = kun(x[i][1]); if (kd[dd]) continue; kd[dd] = 1; if (dd === d) return 0; if (x[i][2] === 3 && !tezmi(x[i][3])) st = true; }
    return st ? TAK : B;
  }
  var XY = null, XT = 0;                               /* oxirgi bosilgan joy — «+10» o'sha yerdan chiqadi */
  document.addEventListener('pointerdown', function (e) { XY = [e.clientX, e.clientY]; XT = Date.now(); }, true);
  function kam() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function hapt(k) { try { var h = window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback; if (h) { if (k) h.notificationOccurred('success'); else h.impactOccurred('light'); } } catch (e) {} }
  var TANGA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11.2" fill="#f2a900"/><circle cx="12" cy="12" r="9" fill="#ffd34d" stroke="#e39600" stroke-width="1.1"/>' +
    '<path d="M12 6.4l1.65 3.35 3.7.54-2.68 2.6.63 3.68L12 14.85l-3.3 1.72.63-3.68-2.68-2.6 3.7-.54z" fill="#e08c00"/></svg>';
  var IKON = {
    dars: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.6 6.15.9-4.45 4.33 1.05 6.12L12 16.86 6.5 19.75l1.05-6.12L3.1 9.3l6.15-.9z" fill="#fff" stroke="#b86e00" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    bob: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2.5h4l1 4.5-3 1zM17 2.5h-4l-1 4.5 3 1z" fill="#2f8f5b"/><circle cx="12" cy="14.5" r="7" fill="#fff" stroke="#b86e00" stroke-width="1.3"/>' +
      '<path d="M12 10.6l1.2 2.45 2.7.4-1.95 1.9.46 2.68L12 16.76l-2.41 1.27.46-2.68-1.95-1.9 2.7-.4z" fill="#e08c00"/></svg>',
    kitob: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v5.5a5 5 0 0 1-10 0z" fill="#fff" stroke="#b86e00" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<path d="M7 5H4.2v1.6A3.4 3.4 0 0 0 7.3 10M17 5h2.8v1.6a3.4 3.4 0 0 1-3.1 3.4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M12 13.5v3.3M8.2 20.5h7.6l-.9-3.7H9.1z" fill="#fff" stroke="#b86e00" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    soz: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l6.5 7h-4v8.5h-5V11h-4z" fill="#fff" stroke="#b86e00" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    olov: '<span class="bt-e">🔥</span>'
  };
  var RANG = ['#f6c343', '#ef8a3a', '#3fb27f', '#5b9cf0', '#e75d7c', '#a678e8', '#ffd966'];
  function css() {
    if (document.getElementById('ball-css')) return;
    var s = document.createElement('style'); s.id = 'ball-css';
    var F = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', ZM = 'radial-gradient(circle at 34% 28%,#fff6c2,#f9c935 46%,#dc9a08)';
    s.textContent =
      /* kichik: tanga + «+10» */
      '.bu{position:fixed;z-index:2147483000;pointer-events:none;width:0;height:0}' +
      '.bu-p{position:absolute;left:0;top:0;display:flex;align-items:center;gap:5px;padding:4px 12px 4px 4px;border-radius:999px;background:linear-gradient(180deg,#fffbe8,#ffe7a0);' +
      'box-shadow:0 6px 18px rgba(170,110,0,.32),0 0 0 1.5px rgba(226,154,0,.6);font:800 19px/1 ' + F + ';color:#9a5600;white-space:nowrap;transform:translate(-50%,-50%);animation:buP 1.35s cubic-bezier(.2,.8,.3,1) forwards}' +
      '.bu-t .bu-p{background:linear-gradient(180deg,#f0fbf5,#c9eedb);color:#11683f;box-shadow:0 6px 18px rgba(17,104,63,.25),0 0 0 1.5px rgba(47,160,100,.55)}' +
      '.bu-c{width:27px;height:27px;display:block;animation:buC .75s ease-out}.bu-c svg{display:block;width:100%;height:100%}' +
      '.bu-r{position:absolute;left:-30px;top:-30px;width:60px;height:60px;box-sizing:border-box;border-radius:50%;border:3px solid #ffc83d;opacity:0;animation:buR .6s ease-out forwards}' +
      '.bu-s{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:2px;background:#ffc23a;opacity:0;animation:buS .7s ease-out forwards}.bu-s:nth-of-type(odd){background:#ff8f3f;border-radius:50%}' +
      '.bu-t .bu-r{border-color:#4cc38a}.bu-t .bu-s{background:#4cc38a}' +
      '@keyframes buP{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}15%{opacity:1;transform:translate(-50%,-62%) scale(1.2)}27%{transform:translate(-50%,-66%) scale(1)}72%{opacity:1;transform:translate(-50%,-160%) scale(1)}100%{opacity:0;transform:translate(-50%,-220%) scale(.92)}}' +
      '@keyframes buC{from{transform:rotateY(0)}to{transform:rotateY(720deg)}}' +
      '@keyframes buR{0%{opacity:.95;transform:scale(.2)}100%{opacity:0;transform:scale(1.7)}}' +
      '@keyframes buS{0%{opacity:1;transform:rotate(var(--a)) translateY(0) scale(.4)}65%{opacity:1}100%{opacity:0;transform:rotate(var(--a)) translateY(-48px) scale(1)}}' +
      /* katta: bonus */
      '.bt{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;' +
      'background:radial-gradient(circle at 50% 46%,rgba(255,210,90,.30),rgba(0,0,0,.5) 72%);animation:btF .3s ease-out}.bt.ket{animation:btK .35s ease-in forwards}' +
      '.bt-w{position:relative;display:flex;justify-content:center}' +
      '.bt-nur{position:absolute;left:50%;top:0;width:380px;height:380px;margin:-190px 0 0 -190px;border-radius:50%;pointer-events:none;' +
      'background:repeating-conic-gradient(rgba(255,206,70,.6) 0 9deg,transparent 9deg 30deg);-webkit-mask:radial-gradient(circle,#000 22%,transparent 66%);mask:radial-gradient(circle,#000 22%,transparent 66%);animation:btN 7s linear infinite}' +
      '.bt-k{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:224px;max-width:80vw;margin-top:44px;padding:52px 28px 22px;box-sizing:border-box;border-radius:28px;' +
      'background:linear-gradient(180deg,#fffdf4,#fff0c4);box-shadow:0 22px 50px rgba(0,0,0,.35),0 0 0 2px rgba(238,176,36,.65);text-align:center;color:#5a3900;font-family:' + F + ';animation:btP .6s cubic-bezier(.2,1.45,.4,1)}' +
      '.bt-m{position:absolute;left:50%;top:-44px;width:88px;height:88px;margin-left:-44px;border-radius:50%;background:' + ZM + ';box-shadow:0 8px 20px rgba(196,124,0,.45),inset 0 -4px 0 rgba(0,0,0,.12),0 0 0 4px #fffaf0;' +
      'display:flex;align-items:center;justify-content:center;animation:btM .85s cubic-bezier(.2,1.3,.4,1)}.bt-m svg{width:52px;height:52px;filter:drop-shadow(0 2px 1px rgba(150,90,0,.3))}' +
      '.bt-e{font-size:46px;line-height:1}' +
      '.bt-n{font-size:46px;line-height:1.05;font-weight:900;color:#e38700;letter-spacing:.01em;font-variant-numeric:tabular-nums;text-shadow:0 2px 0 #fff,0 5px 14px rgba(227,135,0,.35)}' +
      '.bt-t{font-size:17.5px;line-height:1.3;font-weight:800}.bt-s{font-size:13.5px;line-height:1.35;color:#87652a}' +
      '.bt-q{position:absolute;top:-18px;width:9px;height:14px;border-radius:2px;opacity:0;pointer-events:none;animation:btQ var(--d) cubic-bezier(.25,.6,.45,1) var(--k) forwards}.bt-q:nth-of-type(3n){border-radius:50%;width:10px;height:10px}' +
      '@keyframes btF{from{opacity:0}}@keyframes btK{to{opacity:0}}' +
      '@keyframes btP{0%{opacity:0;transform:scale(.5) translateY(30px)}100%{opacity:1;transform:none}}' +
      '@keyframes btN{to{transform:rotate(360deg)}}' +
      '@keyframes btM{0%{transform:scale(0) rotate(-35deg)}60%{transform:scale(1.15) rotate(8deg)}100%{transform:none}}' +
      '@keyframes btQ{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:.85;transform:translate(var(--x),108vh) rotate(var(--r))}}' +
      /* toast: so'z «Биламан»ga chiqdi */
      '.bk{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top,0px));z-index:2147483001;pointer-events:none;display:flex;align-items:center;gap:10px;max-width:92vw;padding:7px 16px 7px 7px;box-sizing:border-box;border-radius:999px;' +
      'background:linear-gradient(180deg,#fffbef,#ffe8a6);box-shadow:0 10px 28px rgba(0,0,0,.22),0 0 0 1.5px rgba(230,160,20,.6);color:#5a3900;font:700 14.5px/1.25 ' + F + ';white-space:nowrap;' +
      'transform:translate(-50%,-150%);opacity:0;transition:transform .45s cubic-bezier(.2,1.35,.4,1),opacity .25s}.bk.on{transform:translate(-50%,0);opacity:1}.bk.ket{transform:translate(-50%,-60%);opacity:0}' +
      '.bk-m{flex:none;width:36px;height:36px;border-radius:50%;background:' + ZM + ';display:flex;align-items:center;justify-content:center;box-shadow:inset 0 -2px 0 rgba(0,0,0,.12)}.bk-m svg{width:22px;height:22px}' +
      '.bk span{overflow:hidden;text-overflow:ellipsis}.bk b{flex:none;font-size:18px;font-weight:900;color:#e38700;font-variant-numeric:tabular-nums}.bk b.zarb{animation:bkZ .4s ease-out}' +
      '@keyframes bkZ{50%{transform:scale(1.35)}}' +
      '@media (prefers-reduced-motion:reduce){.bu-p{animation:buPR 1.35s linear forwards}.bu-c,.bt-k,.bt-m,.bk b.zarb{animation:none}.bu-r,.bu-s,.bt-nur,.bt-q{display:none}.bk{transition:opacity .2s}' +
      '@keyframes buPR{0%,70%{opacity:1}100%{opacity:0}}}';
    (document.head || document.documentElement).appendChild(s);
  }
  /* kichik ball: tanga aylanadi, uchqunlar sochiladi, «+10» (takror — yashil «+3») ko'tariladi; el — tugma (bo'lmasa oxirgi bosilgan joy) */
  function uch(n, el) {
    if (!n || !faol() || !document.body) return;
    css();
    var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null, x, y, i;
    if (r && r.width) { x = r.left + r.width / 2; y = r.top + 6; }
    else if (XY && Date.now() - XT < 2500) { x = XY[0]; y = XY[1] - 16; }
    else { x = innerWidth / 2; y = innerHeight * 0.45; }
    var d = document.createElement('div'), h = '<i class="bu-r"></i>';
    for (i = 0; i < 8; i++) h += '<i class="bu-s" style="--a:' + (i * 45 + 22) + 'deg;animation-delay:' + (i % 2 ? 40 : 0) + 'ms"></i>';
    d.className = 'bu' + (n < B ? ' bu-t' : ''); d.setAttribute('aria-hidden', 'true');
    d.innerHTML = h + '<span class="bu-p"><span class="bu-c">' + TANGA + '</span>+' + n + '</span>';
    d.style.left = Math.max(48, Math.min(innerWidth - 48, x)) + 'px'; d.style.top = Math.max(56, y) + 'px';
    document.body.appendChild(d); hapt(0);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 1450);
  }
  /* katta bonus — o'rtada medal (o.i: dars | bob | kitob | olov), nurlar, son 0 dan sanaladi, konfetti; o.t — sarlavha, o.s — ostidagi yozuv.
     Bir nechtasi bo'lsa — navbat bilan; bosilsa yoki 2,6 s dan keyin yopiladi */
  var NAV = [], BAND = false;
  function katta(n, o) {
    if (!n || !faol() || !document.body) return;
    NAV.push([n, o || {}]); if (!BAND) keyingi();
  }
  function keyingi() {
    var x = NAV.shift(); if (!x) { BAND = false; return; }
    BAND = true; css();
    var n = x[0], o = x[1], km = kam(), d = document.createElement('div'), i, h = '';
    if (!km) for (i = 0; i < 28; i++) h += '<i class="bt-q" style="left:' + Math.round(3 + Math.random() * 94) + '%;--x:' + Math.round(Math.random() * 120 - 60) + 'px;--r:' + Math.round(Math.random() * 1080 - 540) +
      'deg;--d:' + (1.1 + Math.random() * 0.9).toFixed(2) + 's;--k:' + (Math.random() * 0.35).toFixed(2) + 's;background:' + RANG[i % RANG.length] + '"></i>';
    d.className = 'bt'; d.setAttribute('role', 'status'); d.setAttribute('aria-live', 'polite');
    d.innerHTML = h + '<div class="bt-w"><div class="bt-nur"></div><div class="bt-k"><div class="bt-m">' + (IKON[o.i] || IKON.dars) + '</div><b class="bt-n">+' + (km ? n : 0) + '</b>' +
      '<span class="bt-t">' + esc(o.t || '') + '</span>' + (o.s ? '<small class="bt-s">' + esc(o.s) + '</small>' : '') + '</div></div>';
    document.body.appendChild(d); hapt(1);
    if (!km) {
      var nb = d.querySelector('.bt-n'), t0 = 0;
      var f = function (ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 700); nb.textContent = '+' + Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); };
      setTimeout(function () { requestAnimationFrame(f); }, 200);
    }
    var tm, yop = function () {
      if (d.classList.contains('ket')) return; clearTimeout(tm); d.classList.add('ket');
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); keyingi(); }, 340);
    };
    d.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); yop(); });
    tm = setTimeout(yop, 2600);
  }
  /* toast — tepada, ekranni to'smaydi (so'z «Биламан»ga chiqdi +50); ko'rinib turganda yana kelsa — son qo'shiladi */
  var BK = null, BKt = 0, BKn = 0, BKc = 0;
  function toast(n, o) {
    if (!n || !faol() || !document.body) return;
    css(); o = o || {};
    if (BK && BK.parentNode && !BK.classList.contains('ket')) {
      BKn += n; BKc++; var b = BK.querySelector('b'); b.textContent = '+' + BKn;
      if (o.i === 'soz') BK.querySelector('span+span').textContent = BKc + ' та сўз «Биламан»га чиқди'; b.classList.remove('zarb'); void b.offsetWidth; b.classList.add('zarb');
    } else {
      BKn = n; BKc = 1; BK = document.createElement('div'); BK.className = 'bk'; BK.setAttribute('role', 'status'); BK.setAttribute('aria-live', 'polite');
      BK.innerHTML = '<span class="bk-m">' + (IKON[o.i] || IKON.soz) + '</span><span>' + esc(o.t || '') + '</span><b>+' + n + '</b>';
      document.body.appendChild(BK);
      var bk = BK; requestAnimationFrame(function () { requestAnimationFrame(function () { bk.classList.add('on'); }); });
    }
    hapt(0); clearTimeout(BKt);
    var bk2 = BK; BKt = setTimeout(function () { bk2.classList.add('ket'); setTimeout(function () { if (bk2.parentNode) bk2.parentNode.removeChild(bk2); }, 400); }, 2000);
  }
  /* takror.js kerak bo'lsa (olov sharti) — bir marta yuklanadi */
  var TQ = null;
  function takrorOl(cb) {
    if (window.Takror && Takror.kunlik) return cb(Takror);
    if (TQ) { TQ.push(cb); return; }
    TQ = [cb];
    var s = document.createElement('script'); s.src = (SN ? 'sinov-' : '') + 'takror.js';
    s.onload = function () { var q = TQ || []; TQ = null; if (window.Takror && Takror.kunlik) q.forEach(function (f) { try { f(Takror); } catch (e) {} }); };
    s.onerror = function () { TQ = null; };
    (document.head || document.documentElement).appendChild(s);
  }
  /* 🔥 bugun olov yondimi (takror.js kunlik().ok) — kuniga bir marta katta tabrik; j — jurnal (takror.html o'z xotirasidagisini beradi) */
  function olov(j) {
    if (!faol() || !LS) return;
    takrorOl(function (T) {
      var t = Date.now(), d = String(kun(t));
      if (L(KO) === d) return;
      var k = T.kunlik(j || ol(), t, t >= DAN ? null : { dan: 0 });
      if (!k.ok) return;
      S(KO, d);
      setTimeout(function () { katta(T.REY.SER_B, { i: 'olov', t: 'Бугунги олов ёнди!', s: k.seriya > 1 ? '🔥 ' + k.seriya + ' кун кетма-кет' : 'Эртага ҳам ёқинг' }); }, 650);
    });
  }
  /* javob: [kalit, vaqt, 3 | 1, ms]; → berilgan ball (ko'rsatish uchun) */
  function yoz(k, ok, ms, el) {
    var t = Date.now(), b = ok ? olsa(ol(), k, ms, t) : 0;
    qosh([k, t, ok ? 3 : 1, Math.max(0, Math.min(60000, Math.round(ms || 0)))]);
    if (b) { uch(b, el); olov(); }
    return b;
  }
  /* bir martalik bonus (xo<dars> — dars, xy<kalit> — bob/kitob imtihoni birinchi marta o'tildi): jurnalda bo'lsa — yozilmaydi.
     o — katta tabrik matni ({ i, t, s }; bo'lmasa — kichik «+N») */
  function bonus(k, n, el, o) {
    var j = ol();
    for (var i = 0; i < j.length; i++) if (j[i] && j[i][0] === k) return 0;
    qosh([k, Date.now(), 0]);
    if (o) katta(n, o); else uch(n, el);
    olov();
    return n;
  }
  /* «Эшитиш»: audio haqiqatan o'ynayotgan vaqt (soat bo'yicha, tezlik ta'sir qilmaydi) yig'iladi; har 5 daqiqa — xe yozuvi, kuniga ESH_MAX ta */
  function eshit(a) {
    if (!a || a.__ball || !LS) return;
    a.__ball = 1;
    var oxir = 0;
    setInterval(function () {
      var t = Date.now(), ijro = !a.paused && !a.ended && a.readyState >= 3;
      if (ijro && oxir) {
        var s = null; try { s = JSON.parse(LS.getItem(KE) || 'null'); } catch (e) {}
        if (!s || s.k !== kun(t)) s = { k: kun(t), s: 0, n: 0 };
        s.s += Math.min(t - oxir, 70000);
        if (s.s >= ESH) { s.s -= ESH; if (s.n < ESH_MAX) { s.n++; qosh(['xe', t, 0]); olov(); } }
        try { LS.setItem(KE, JSON.stringify(s)); } catch (e) {}
      }
      oxir = ijro ? t : 0;
    }, 5000);
  }
  /* «Баллар» oynasi — nimaga qancha ball (28.11.2026); yangi qoidagacha — necha kun qolgani. [data-bq] bosilsa ochiladi */
  var QR = [
    ['Жавоблар'],
    ['✓', 'Янги савол — биринчи марта тўғри', '«Эъроб», «Боб якуни», «Китоб якуни», Сарф', '+10'],
    ['↻', 'Такрор — аввал топилган савол', 'Кейинги кунларда, кунига бир марта', '+3', 't'],
    ['▦', '«Машқ»даги тўғри жавоб', 'Сўз вақти келганда чиқади', '+10'],
    ['Бонуслар'],
    ['⬆', 'Сўз «Биламан»га чиқса', '', '+50'],
    ['★', 'Дарс биринчи марта 80%', '', '+100'],
    ['🏅', '«Боб якуни» биринчи марта 80%', '', '+200'],
    ['🏆', '«Китоб якуни» биринчи марта 80%', '', '+500'],
    ['Эшитиш ва олов'],
    ['🎧', 'Ҳар 5 дақиқа тинглаш', 'Кунига 200 баллгача', '+10'],
    ['🔥', 'Кунлик олов', 'Кунига 200 балл, камида 100 таси жавоблардан', '+50']
  ];
  var QE = ['Хато ёки жуда тез (0,7 сониядан тез) жавоб — 0 балл, минус йўқ.', 'Савол кунига бир марта ҳисобланади. Хато топилган куни қайта ечилса — балл йўқ, эртасига бор.',
    '«Ҳафта» рейтинги ҳар душанба 00:00 да янгиланади.'];
  function qcss() {
    if (document.getElementById('bq-css')) return;
    var s = document.createElement('style'); s.id = 'bq-css';
    s.textContent = '.bq{position:fixed;inset:0;z-index:190;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;opacity:0;transition:opacity .25s}.bq.on{opacity:1}' +
      '.bq-v{width:100%;max-width:520px;max-height:88%;overflow-y:auto;overscroll-behavior:contain;background:var(--cd,#fff);color:var(--tx,#1d2b24);border-radius:22px 22px 0 0;' +
      'padding:0 16px calc(18px + env(safe-area-inset-bottom,0px));box-sizing:border-box;transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.8,.3,1);font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '.bq.on .bq-v{transform:none}.bq-tut{height:18px;display:flex;align-items:center;justify-content:center}.bq-tut::before{content:"";width:40px;height:4px;border-radius:2px;background:var(--bd,#d9dfdb)}' +
      '.bq-hd{display:flex;align-items:center;justify-content:space-between;padding:2px 0 8px}.bq-hd b{font-size:19px}' +
      '.bq-x{width:36px;height:36px;border:0;border-radius:50%;background:color-mix(in srgb,var(--mu,#6b7a72) 14%,transparent);color:var(--tx,#1d2b24);font-size:17px;line-height:36px;padding:0;cursor:pointer}' +
      '.bq-yn{display:flex;gap:12px;align-items:center;margin:0 0 10px;padding:12px 14px;border-radius:16px;background:color-mix(in srgb,#f6dc94 34%,var(--cd,#fff));border:1px solid #e9c66a}' +
      '.bq-yn i{flex:none;font-style:normal;font-size:26px}.bq-yn b{display:block;font-size:15.5px}.bq-yn small{display:block;font-size:13px;color:var(--mu,#6b7a72)}' +
      '.bq-k{flex:none;min-width:46px;padding:6px 8px;border-radius:12px;background:#e38700;color:#fff;text-align:center;font-weight:900;font-size:20px;line-height:1}.bq-k small{display:block;margin-top:2px;font-size:10.5px;font-weight:700;color:#fff3d6}' +
      '.bq-h{margin:12px 2px 4px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu,#6b7a72)}' +
      '.bq-r{display:flex;align-items:center;gap:12px;padding:8px 2px;border-top:1px solid color-mix(in srgb,var(--bd,#d9dfdb) 70%,transparent)}.bq-h+.bq-r{border-top:0}' +
      '.bq-r>i{flex:none;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:17px;font-weight:800;background:color-mix(in srgb,#f2b330 18%,transparent);color:#b86e00}' +
      '.bq-r>span{flex:1;min-width:0}.bq-r b{display:block;font-size:15px;font-weight:650}.bq-r small{display:block;font-size:12.5px;line-height:1.35;color:var(--mu,#6b7a72)}' +
      '.bq-r>em{flex:none;font-style:normal;font-weight:900;font-size:16px;color:#d07c00;font-variant-numeric:tabular-nums}.bq-r.t>em{color:#1f8a55}.bq-r.t>i{background:color-mix(in srgb,#2fa064 16%,transparent);color:#1f8a55}' +
      '.bq-e{margin:12px 0 0;padding:10px 12px 10px 28px;border-radius:14px;background:color-mix(in srgb,var(--mu,#6b7a72) 8%,transparent);font-size:13px;line-height:1.45;color:var(--mu,#6b7a72)}.bq-e li+li{margin-top:4px}' +
      '.bq-vd{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:12px;height:46px;border:1px solid var(--bd,#d9dfdb);border-radius:14px;background:none;color:var(--ac,#0c7a50);font:inherit;font-weight:700;font-size:15px;cursor:pointer}';
    (document.head || document.documentElement).appendChild(s);
  }
  function qoida() {
    if (!document.body || document.getElementById('bq-o')) return;
    qcss();
    var q = qoldi(), h = '<div class="bq-v" role="dialog" aria-modal="true" aria-label="Баллар"><div class="bq-tut"></div><div class="bq-hd"><b>Нимага қанча балл</b><button class="bq-x" aria-label="Ёпиш">✕</button></div>';
    if (q) h += '<div class="bq-yn"><span class="bq-k">' + q + '<small>кун</small></span><span><b>Янги баллар ' + (q > 1 ? q + ' кундан кейин' : 'эртадан') + '</b>' +
      '<small>Душанба, 30 ноябрдан. Ҳозирча: тўғри жавоб — 1 балл, кунига 200 гача.</small></span></div>';
    QR.forEach(function (r) {
      if (r.length === 1) { h += '<div class="bq-h">' + r[0] + '</div>'; return; }
      h += '<div class="bq-r' + (r[4] ? ' ' + r[4] : '') + '"><i aria-hidden="true">' + r[0] + '</i><span><b>' + r[1] + '</b>' + (r[2] ? '<small>' + r[2] + '</small>' : '') + '</span><em>' + r[3] + '</em></div>';
    });
    h += '<ul class="bq-e">' + QE.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    if (window.Vid && Vid.bor && Vid.bor('ball')) h += '<button class="bq-vd" type="button" data-vid="ball">▶ Видео: Баллар ва рейтинг</button>';
    var d = document.createElement('div'); d.className = 'bq'; d.id = 'bq-o'; d.innerHTML = h + '</div>';
    var yop = function () { if (!d.id) return; d.id = ''; d.classList.remove('on'); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 300); };
    d.querySelector('.bq-x').onclick = yop;
    d.onclick = function (e) { if (e.target === d) yop(); };
    document.body.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-bq]'); if (b) { e.preventDefault(); qoida(); } });
  document.addEventListener('keydown', function (e) { var d = document.getElementById('bq-o'); if (d && e.key === 'Escape') d.querySelector('.bq-x').click(); });
  window.Ball = { yoz: yoz, bonus: bonus, eshit: eshit, uch: uch, katta: katta, toast: toast, olov: olov, olsa: olsa, faol: faol, qoldi: qoldi, qoida: qoida, B: B, TAK: TAK, DAN: DAN };
})();

/* VIDEO YO'RIQNOMA (26.11.2026; foydalanuvchi: «har bir joyda o'zini ko'rsatadigan videosi bo'lgani yaxshimi yo hammasini bir joyda?» → Claude:
   ikkalasi — har bo'limda o'z videosi (sarlavha yonidagi ⓘ, birinchi kirishda bir marta o'zi ochiladi), hammasi «Йўриқнома»da ham ro'yxat;
   «yaxshi variantni o'ylab, o'shani qil»). Pastdan chiqadigan oyna — 23.11.2026 dagi «Сўз йўли» oynasi (takror.html dan shu yerga ko'chdi):
   bo'sh joy, ✕, tepadagi chiziqni pastga surish, Escape yoki «Орқага» (OYNA «#vo») yopadi. Fayl nomlari faqat shu yerda (Vid.R).
   q — qoralama: asosiy saytda (nurut-tolib.vercel.app) ko'rinmaydi, faqat ko'rish/sinov manzillarida — ovozli nusxa qo'yilgach q olib tashlanadi.
   kq — «ko'rdi» belgisi: yo'q — hali ochilmagan, '1' — ochilgan, '2' — oxirigacha ko'rilgan (ⓘ yonidagi sariq nuqta .vd-nq yo'qoladi).
   Videolar hozircha faqat o'zbekcha (ruscha profilda — yo'q). Reja — docs/yoriqnoma-video-reja.md; texnika — docs/texnik.md 20. */
(function () {
  var SN = /\/sinov-[^\/]*$/.test(location.pathname);
  var R = {
    soz: { mp4: 'vsoz-569cf07b.mp4', p: 'vsoz-70670812.jpg', nom: 'Сўз йўли', iz: 'Сўз 4 поғонадан қандай ўтади', v: '1:50' },
    ball: { mp4: 'vball-9ab751b3.mp4', p: 'vball-1864be68.jpg', nom: 'Баллар ва рейтинг', iz: 'Нимага қанча балл, 🔥 олов, «Рейтинг»', v: '1:44',   /* Farruh ovozi bilan (26.11.2026); foydalanuvchi eshitib «hammasini joyla» dedi — q olib tashlandi */
      kq: SN ? 'reyting-sinov-qol' : 'reyting-qol' }
  };
  var LS = null; try { LS = window.localStorage; } catch (e) {}
  function L(k) { try { return LS ? LS.getItem(k) : null; } catch (e) { return null; } }
  function S(k, v) { try { if (LS) LS.setItem(k, v); } catch (e) {} }
  function bor(k) {
    var x = R[k];
    if (!x || (window.Profil ? Profil.til : 'uz') === 'ru') return false;
    return !x.q || !/(^|\.)nurut-tolib\.vercel\.app$/.test(location.hostname);
  }
  function korgan(k) { var x = R[k]; return !x || !x.kq || L(x.kq) === '2'; }
  function tamom(k) {
    var x = R[k]; if (x && x.kq && L(x.kq) !== '2') S(x.kq, '2');
    [].forEach.call(document.querySelectorAll('.vd-nq[data-vid="' + k + '"]'), function (n) { n.remove(); });
  }
  function css() {
    if (document.getElementById('vo-css')) return;
    var s = document.createElement('style'); s.id = 'vo-css';
    s.textContent = '.vo{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center;opacity:0;transition:opacity .25s}' +
      '.vo.on{opacity:1}' +
      '.vo-v{width:100%;max-width:520px;height:84%;display:flex;flex-direction:column;background:#0b2a1f;color:#f4eeda;border-radius:22px 22px 0 0;padding:0 14px calc(14px + env(safe-area-inset-bottom,0px));box-sizing:border-box;transform:translateY(100%);transition:transform .3s cubic-bezier(.2,.8,.2,1)}' +
      '.vo.on .vo-v{transform:none}' +
      '.vo-tut{flex-shrink:0;height:20px;display:flex;align-items:center;justify-content:center;touch-action:none;cursor:grab}' +
      '.vo-tut::before{content:"";width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,.35)}' +
      '.vo-hd{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 0 10px 2px}' +
      '.vo-hd b{font-size:17px}' +
      '.vo-x{width:38px;height:38px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:18px;line-height:38px;padding:0}' +
      '.vo video{flex:1;min-height:0;width:100%;border-radius:16px;background:#000;object-fit:contain}' +
      '.vd-nq{position:absolute;top:4px;right:3px;width:8px;height:8px;border-radius:50%;background:#f2c14e;box-shadow:0 0 0 2px var(--em2,#0c5e3f)}';
    (document.head || document.documentElement).appendChild(s);
  }
  /* o.avto — o'zi ochilganda video o'zi boshlanmaydi (▶ bosiladi); o.tamom — oxirigacha ko'rilganda (sahifaning o'z belgisi uchun) */
  function och(k, o) {
    o = o || {};
    var x = R[k];
    if (!x || !bor(k) || document.getElementById('vo') || !document.body) return false;
    css();
    if (x.kq && !L(x.kq)) S(x.kq, '1');
    var d = document.createElement('div'); d.className = 'vo'; d.id = 'vo';
    d.innerHTML = '<div class="vo-v" role="dialog" aria-modal="true" aria-label="' + x.nom + '"><div class="vo-tut"></div><div class="vo-hd"><b>' + x.nom + '</b><button class="vo-x" aria-label="Ёпиш">✕</button></div>' +
      '<video src="' + x.mp4 + '" poster="' + x.p + '" controls playsinline preload="metadata"' + (o.avto ? '' : ' autoplay') + ' title="' + x.nom + '"></video></div>';
    var v = d.querySelector('video'), ic = d.querySelector('.vo-v'), tu = d.querySelector('.vo-tut'), bitdi = false;
    var tug = function () { if (bitdi) return; bitdi = true; tamom(k); if (o.tamom) o.tamom(); };
    var yop = function () {
      if (!d.id) return; d.id = ''; try { v.pause(); } catch (e) {}
      d.classList.remove('on'); setTimeout(function () { d.remove(); }, 300);
    };
    v.addEventListener('ended', tug);
    v.addEventListener('timeupdate', function () { if (v.duration && v.currentTime >= v.duration - 1.5) tug(); });
    d.querySelector('.vo-x').onclick = yop;
    d.onclick = function (e) { if (e.target === d) yop(); };
    var y0 = null, dy = 0;                              /* tepadagi chiziqni pastga surish — yopadi */
    tu.addEventListener('pointerdown', function (e) { y0 = e.clientY; dy = 0; ic.style.transition = 'none'; try { tu.setPointerCapture(e.pointerId); } catch (x) {} });
    tu.addEventListener('pointermove', function (e) { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); ic.style.transform = 'translateY(' + dy + 'px)'; });
    var qo = function () { if (y0 === null) return; y0 = null; ic.style.transition = ''; if (dy > 80) { ic.style.transform = 'translateY(100%)'; yop(); } else ic.style.transform = ''; };
    tu.addEventListener('pointerup', qo); tu.addEventListener('pointercancel', qo);
    document.body.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
    return true;
  }
  /* birinchi kirishda bir marta (kirish kodi / kirish oynasi / yo'riqnoma ochiq bo'lsa va avtomat brauzerda — yo'q) */
  function birMarta(k, kut) {
    var x = R[k];
    if (!x || !x.kq || L(x.kq) || !bor(k) || navigator.webdriver) return;
    setTimeout(function () {
      if (L(x.kq) || document.documentElement.classList.contains('kq-yopiq') || document.getElementById('kr-d') || document.querySelector('.qs') || document.getElementById('vo')) return;
      och(k, { avto: true });
    }, kut || 700);
  }
  /* [data-vid] bosilsa — o'sha video (ⓘ, «🔥 N кун», «Йўриқнома» ro'yxati) */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-vid]');
    if (b && !b.classList.contains('vd-nq') && och(b.getAttribute('data-vid'))) e.preventDefault();
  });
  document.addEventListener('keydown', function (e) { var d = document.getElementById('vo'); if (d && e.key === 'Escape') d.querySelector('.vo-x').click(); });
  window.Vid = { R: R, bor: bor, och: och, korgan: korgan, birMarta: birMarta, css: css };
})();
