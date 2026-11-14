/* So'z bazasi va natijalarni serverda saqlash — telefon almashsa yo'qolmasin (13.11.2026; docs/texnik.md 17).
   Nima saqlanadi: «soz» (so'z belgilari), «takror-j» (takror jurnali), «yol» (xarita natijalari), «yol-xato», «ism» (o'zi yozgan ism {n, t} —
   14.11.2026 dan; natijalarni tozalash unga tegmaydi, yangisi ustun). Telegram ichida — Telegram akkaunti ham (server initData'ni bot tokeni
   bilan tekshirib alohida faylga yozadi; o'zgargandagina yuboriladi — «baza-tgi»). Sozlamalar va dars holati — yo'q.
   Kim: maxfiy «ko'chirish kodi» (localStorage «baza-kod», 26 belgi) — ism, telefon so'ralmaydi. Telegram ichida kod Telegram bulutida turadi:
   o'sha hisobda hamma qurilmada bir xil. Saytda/ilovada boshqa qurilmaga «Созламалар»dan kod kiritib ko'chiriladi.
   Birlashtirish: jurnal — ikkala tomondagi yozuvlar yig'indisi; belgilar — so'zma-so'z, yangisi ustun; yo'l — yangisi + eng yaxshi foizlar;
   «Натижаларни тозалаш» — r (tozalash vaqti): tozalashni ko'rmagan nusxa tashlanadi, jurnalda undan eski yozuvlar o'chadi.
   Tozalashdan oldingi nusxa 30 kun saqlanadi (telefonda «baza-eski», serverda — kod + «eski» ostida); «Қайтариш» — yangi r + rk
   (rk — jurnal chegarasi: qaytarilgan eski yozuvlar o'chmasin).
   Sahifalar: yol.html, takror.html, sozlamalar.html (window.Baza). Sinov sahifalarida ishlamaydi. */
(function () {
  if (/\/sinov-[^\/]*$/.test(location.pathname)) return;
  var API = /(^|\.)vercel\.app$/.test(location.hostname) ? '/api/soz' : 'https://nurut-tolib.vercel.app/api/soz';
  var LSs = null; try { LSs = window.localStorage; } catch (e) {}
  if (!LSs || !window.fetch) return;
  var set0 = Storage.prototype.setItem, rem0 = Storage.prototype.removeItem;      /* tg.js o'ragan bo'lishi mumkin — zanjir saqlanadi */
  var KEYS = { 'soz': 1, 'takror-j': 1, 'yol': 1, 'yol-xato': 1, 'ism': 1 }, KODRE = /^[a-z0-9]{20,64}$/;
  var ichki = false, band = false, tm = null, tingl = [];
  var JIM = !!window.BAZA_JIM;                          /* dars sahifasidagi kirish oynasi (tg.js) yuklaganda: o'zi sinxronlamaydi, faqat kirish */

  function L(k) { try { return LSs.getItem(k); } catch (e) { return null; } }
  function S(k, v) { ichki = true; try { v == null ? rem0.call(LSs, k) : set0.call(LSs, k, v); } catch (e) {} ichki = false; }
  function J(k, d) { try { var v = JSON.parse(L(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function kanon(x) {                                   /* kalitlari tartiblangan JSON — solishtirish uchun */
    if (x === null || typeof x !== 'object') return JSON.stringify(x === undefined ? null : x);
    if (Array.isArray(x)) return '[' + x.map(kanon).join(',') + ']';
    return '{' + Object.keys(x).sort().map(function (k) { return JSON.stringify(k) + ':' + kanon(x[k]); }).join(',') + '}';
  }
  function xabar(h) { tingl.forEach(function (f) { try { f(h); } catch (e) {} }); }

  /* mahalliy o'zgarishni payqash: 15 s dan keyin serverga yuboriladi */
  if (!JIM) try {
    Storage.prototype.setItem = function (k, v) { set0.call(this, k, v); if (!ichki && this === LSs && KEYS[k]) iflos(); };
    Storage.prototype.removeItem = function (k) { rem0.call(this, k); if (!ichki && this === LSs && KEYS[k]) iflos(); };
  } catch (e) {}
  function iflos() { S('baza-oz', String(Date.now())); clearTimeout(tm); tm = setTimeout(function () { sinx(); }, 15000); }

  function lokal() {
    var soz = J('soz', null), jr = J('takror-j', null);
    var rk = L('baza-rk');
    return { v: 1, r: +L('baza-r') || 0, rk: rk == null ? undefined : +rk || 0, soz: soz, yol: J('yol', null), yolT: +L('yol-t') || 0, j: (jr && jr.j) || [], xato: J('yol-xato', []) || [], ism: J('ism', null) };
  }
  function bormi(d) { return !!((d.ism && d.ism.n) || d.j.length || (d.soz && (Object.keys(d.soz.s || {}).length || Object.keys(d.soz.b || {}).length || Object.keys(d.soz.a || {}).length)) || (d.yol && (Object.keys(d.yol.d || {}).length || Object.keys(d.yol.e || {}).length)) || d.r); }

  /* n — yangisi, e — eskisi. Har so'zda bitta holat: b («билмайман») / a («аниқ биламан») / k (biladi, tekshirilmagan);
     yangisida holat bo'lsa — o'sha, bo'lmasa — eskisidagi. */
  function sozQ(n, e) {
    var o = { v: 1, b: {}, k: {}, a: {}, s: {}, t: n.t || 0 }, id, ids = {};
    for (id in (e.s || {})) o.s[id] = e.s[id];
    for (id in (n.s || {})) o.s[id] = Math.max(o.s[id] || 0, n.s[id]);
    function hol(x, i) { return (x.b || {})[i] ? 'b' : (x.a || {})[i] ? 'a' : (x.k || {})[i] ? 'k' : ''; }
    [e, n].forEach(function (x) { ['b', 'a', 'k'].forEach(function (g) { for (var i in (x[g] || {})) ids[i] = 1; }); });
    for (id in ids) o[hol(n, id) || hol(e, id)][id] = 1;
    if (!Object.keys(o.a).length) delete o.a;          /* belgi yo'q bo'lsa hujjat avvalgidek qoladi (ortiqcha qayta yozish bo'lmasin) */
    return o;
  }
  function yolQ(n, e) {
    var o = JSON.parse(JSON.stringify(n));
    ['d', 'e'].forEach(function (g) {
      o[g] = o[g] || {};
      for (var id in (e[g] || {})) { var x = e[g][id], y = o[g][id]; if (!y) o[g][id] = x; else if ((x.b || 0) > (y.b || 0)) y.b = x.b; }
    });
    return o;
  }
  function birlash(a, b) {                              /* a — mahalliy, b — serverdagi (bo'lmasa null) */
    if (!b || b.v !== 1) return a;
    var r = Math.max(a.r || 0, b.r || 0), o = { v: 1, r: r }, km = {}, j = [];
    var A = (a.r || 0) === r ? a : null, B = (b.r || 0) === r ? b : null;          /* tozalashni ko'rmagan nusxa hisobga olinmaydi */
    var fl = A && A.rk != null ? A.rk : B && B.rk != null ? B.rk : r;                /* jurnal chegarasi: odatda r; «Қайтариш»dan keyin — rk */
    if (fl < r) o.rk = fl;
    [a.j || [], b.j || []].forEach(function (js) { js.forEach(function (e) { var k = e[0] + '|' + e[1]; if (e[1] >= fl && !km[k]) { km[k] = 1; j.push(e); } }); });
    j.sort(function (x, y) { return x[1] - y[1]; });
    o.j = j;
    var sa = A && A.soz, sb = B && B.soz;
    o.soz = sa && sb ? ((sa.t || 0) >= (sb.t || 0) ? sozQ(sa, sb) : sozQ(sb, sa)) : (sa || sb || null);
    var ya = A && A.yol, yb = B && B.yol;
    if (ya && yb) { var an = (A.yolT || 0) >= (B.yolT || 0); o.yol = an ? yolQ(ya, yb) : yolQ(yb, ya); o.yolT = Math.max(A.yolT || 0, B.yolT || 0); }
    else { o.yol = ya || yb || null; o.yolT = ya ? A.yolT || 0 : yb ? B.yolT || 0 : 0; }
    var xm = {}, x = [];
    [A && A.xato, B && B.xato].forEach(function (xs) { (xs || []).forEach(function (i) { if (!xm[i]) { xm[i] = 1; x.push(i); } }); });
    o.xato = x;
    var ia = a.ism, ib = b.ism;                        /* ism: tozalash (r) unga tegmaydi; yangisi (t) ustun; «Аккаунтни ўчириш» — bo'sh ism */
    o.ism = ia && ib ? ((ia.t || 0) >= (ib.t || 0) ? ia : ib) : (ia || ib || null);
    if (!o.ism) delete o.ism;
    return o;
  }
  function teng(a, b) { return !!b && (a.r || 0) === (b.r || 0) && (a.rk == null ? -1 : a.rk) === (b.rk == null ? -1 : b.rk) && (a.j || []).length === (b.j || []).length && kanon(a.soz) === kanon(b.soz) && kanon(a.yol) === kanon(b.yol) && kanon(a.ism || null) === kanon(b.ism || null) && kanon(a.xato || []) === kanon(b.xato || []); }
  function qoy(o) {                                     /* birlashgan hujjatni telefonga yozish; o'zgardimi? */
    var e = lokal(), ozg = false;
    if (kanon(e.soz) !== kanon(o.soz)) { S('soz', o.soz ? JSON.stringify(o.soz) : null); ozg = true; }
    if (kanon(e.yol) !== kanon(o.yol)) { S('yol', o.yol ? JSON.stringify(o.yol) : null); ozg = true; }
    if (o.yol && o.yolT && +L('yol-t') !== o.yolT) S('yol-t', String(o.yolT));
    if (e.j.length !== o.j.length) { S('takror-j', o.j.length ? JSON.stringify({ v: 1, j: o.j }) : null); ozg = true; }
    if (kanon(e.xato) !== kanon(o.xato)) { S('yol-xato', o.xato.length ? JSON.stringify(o.xato) : null); ozg = true; }
    if (kanon(e.ism || null) !== kanon(o.ism || null)) { S('ism', o.ism ? JSON.stringify(o.ism) : null); ozg = true; }
    if ((e.r || 0) !== (o.r || 0)) S('baza-r', o.r ? String(o.r) : null);
    if ((e.rk == null ? -1 : e.rk) !== (o.rk == null ? -1 : o.rk)) S('baza-rk', o.rk == null ? null : String(o.rk));
    return ozg;
  }

  /* ko'chirish kodi */
  function tgW() { try { var w = window.Telegram && Telegram.WebApp; return w && w.initData && w.CloudStorage && w.isVersionAtLeast && w.isVersionAtLeast('6.9') ? w : null; } catch (e) { return null; } }
  function tgIchi() { try { return !!(window.TelegramWebviewProxy || /tgWebApp/.test(location.hash) || (JSON.parse(sessionStorage.getItem('__telegram__initParams') || '{}').tgWebAppData)); } catch (e) { return false; } }
  function yangiKod() { var a = new Uint8Array(26), s = '', al = 'abcdefghijklmnopqrstuvwxyz0123456789'; (window.crypto || window.msCrypto).getRandomValues(a); for (var i = 0; i < 26; i++) s += al[a[i] % 36]; return s; }
  function kodOl(cb) {
    var k = L('baza-kod'), urin = 0;
    if (k && !KODRE.test(k)) k = null;
    if (!tgIchi()) { cb(k); return; }
    (function kut() {                                   /* Telegram skripti yuklanishini 3 s gacha kutish */
      var w = tgW();
      if (!w) { if (++urin > 12) { cb(k); return; } setTimeout(kut, 250); return; }
      var bitdi = false, t = setTimeout(function () { if (!bitdi) { bitdi = true; cb(k); } }, 3000);
      w.CloudStorage.getItem('baza-kod', function (err, val) {
        if (bitdi) return;
        bitdi = true; clearTimeout(t);
        if (!err && val && KODRE.test(val)) { if (val !== k) S('baza-kod', val); cb(val); }     /* Telegram hisobidagi kod ustun */
        else { if (k) try { w.CloudStorage.setItem('baza-kod', k); } catch (e) {} cb(k); }
      });
    })();
  }
  function so(kod, amal, d) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ kod: kod, amal: amal, d: d }), keepalive: amal === 'yoz' && JSON.stringify(d).length < 60000 })
      .then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error((j && j.xato) || 'xato'); return j; });
  }

  function post(o) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(o) })
      .then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error((j && j.xato) || 'xato'); return j; });
  }

  /* «Telegram орқали кириш» — Telegram ilovasi tomoni (13.11.2026; docs/texnik.md 18). Sayt t.me/…?startapp=kir_<belgi> ni ochadi;
     ilova shu belgi bilan ochilganda foydalanuvchidan tasdiq so'raydi va o'z kodini serverga shu belgi ostida qo'yadi (10 daqiqa, bir marta o'qiladi).
     Tasdiqsiz hech narsa yuborilmaydi: begona havola orqali natijalarga ulanib olishning oldi olinadi. */
  function ulashSorov() {
    if (!tgIchi()) return;
    var urin = 0;
    (function kut() {
      var w = tgW();
      if (!w) { if (++urin <= 16) setTimeout(kut, 250); return; }
      var sp = ''; try { sp = (w.initDataUnsafe && w.initDataUnsafe.start_param) || ''; } catch (e) {}
      var m = /^kir_([a-z0-9]{20,40})$/.exec(sp);
      if (!m) return;
      try { if (sessionStorage.getItem('baza-ul-' + m[1])) return; sessionStorage.setItem('baza-ul-' + m[1], '1'); } catch (e) {}
      var MATN = 'Сайт шу Telegram аккаунтингиздаги натижаларга уланади. Буни ўзингиз бошлаган бўлсангизгина тасдиқланг.';
      var ayt = function (t) { try { if (w.showAlert) { w.showAlert(t); return; } } catch (e) {} try { alert(t); } catch (e) {} };
      var sora = function (f) { try { if (w.showConfirm) { w.showConfirm(MATN, f); return; } } catch (e) {} f(window.confirm(MATN)); };
      sora(function (ha) {
        if (!ha) return;
        kodOl(function (kod) {
          if (!kod) { kod = yangiKod(); S('baza-kod', kod); try { w.CloudStorage.setItem('baza-kod', kod); } catch (e) {} }
          post({ amal: 'ulash', tok: m[1], kod: kod }).then(function () { ayt('Уланди. Сайтга қайтинг.'); }, function () { ayt('Уланмади. Интернетни текширинг ва қайта уриниб кўринг.'); });
        });
      });
    })();
  }

  /* Telegram akkaunti (14.11.2026, foydalanuvchi: serverda foydalanuvchining Telegram akkaunti ham saqlansin): faqat Telegram ichida,
     initData (imzoli) yuboriladi — server bot tokeni bilan tekshiradi; id/ism/username o'zgarmagan bo'lsa qayta yuborilmaydi */
  function tgYubor(kod) {
    var w = tgW(), u = null; if (!w || !w.initData) return;
    try { u = w.initDataUnsafe && w.initDataUnsafe.user; } catch (e) {}
    if (!u || !u.id) return;
    var iz = kod.slice(0, 8) + '|' + u.id + '|' + (u.username || '') + '|' + (u.first_name || '') + '|' + (u.last_name || '');
    if (L('baza-tgi') === iz) return;
    post({ amal: 'tg', kod: kod, init: w.initData }).then(function () { S('baza-tgi', iz); }).catch(function () {});
  }

  /* sinxronlash: serverdagini olish → birlashtirish → telefonga yozish → farq bo'lsa serverga yozish */
  function sinx(cb) {
    if (band) { if (cb) cb(false); return; }
    band = true; clearTimeout(tm);
    var tugat = function (ok, ozg) { band = false; if (ok) { S('baza-t', String(Date.now())); S('baza-oz', null); } xabar({ ok: ok, ozgardi: !!ozg }); if (cb) cb(ok, !!ozg); };
    kodOl(function (kod) {
      var lo = lokal();
      if (!kod) {
        if (!bormi(lo)) { band = false; if (cb) cb(false); return; }              /* saqlaydigan narsa yo'q — kod ham, fayl ham yaratilmaydi */
        kod = yangiKod(); S('baza-kod', kod);
        var w = tgW(); if (w) try { w.CloudStorage.setItem('baza-kod', kod); } catch (e) {}
      }
      so(kod, 'ol').then(function (j) {
        var lo2 = lokal(), bir = birlash(lo2, j.d), ozg = qoy(bir);
        if (teng(bir, j.d) || !bormi(bir)) { tugat(true, ozg); tgYubor(kod); return; }
        return so(kod, 'yoz', bir).then(function () { tugat(true, ozg); tgYubor(kod); });
      }).catch(function () { tugat(false, false); });
    });
  }

  window.Baza = {
    sinx: sinx,
    kod: function () { var k = L('baza-kod'); return k && KODRE.test(k) ? k : ''; },
    vaqt: function () { return +L('baza-t') || 0; },
    kutmoqda: function () { return !!L('baza-oz'); },
    tinglash: function (f) { tingl.push(f); },
    /* boshqa qurilmadagi kodni kiritish: shu telefondagi natijalar o'sha kod ostidagilar bilan birlashadi */
    kodQoy: function (k, cb) {
      k = String(k || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!KODRE.test(k)) { cb(false); return; }
      S('baza-kod', k);
      var w = tgW(); if (w) try { w.CloudStorage.setItem('baza-kod', k); } catch (e) {}
      sinx(cb);
    },
    /* «Натижаларни тозалаш»: tozalash vaqti qo'yiladi — serverdagi va boshqa qurilmalardagi nusxa ham tozalanadi */
    tozala: function (cb) { S('baza-r', String(Date.now())); S('baza-rk', null); sinx(cb); },
    /* «Қайтариш»: sahifa eski nusxani telefonga yozib bo'lgach chaqiradi. Yangi r — boshqa qurilmalardagi (bo'sh) nusxadan ustun bo'lishi uchun;
       rk — o'sha nusxaning eski chegarasi: jurnaldagi eski yozuvlar tozalashdan oldingi bo'lsa ham saqlanadi. */
    qaytar: function (rk, cb) { S('baza-r', String(Date.now())); S('baza-rk', String(+rk || 0)); sinx(cb); },
    /* tozalashdan oldingi nusxa — serverda alohida fayl (kod + «eski»); d: {v:1, ar: vaqt, r, rk, ls: {kalit: qiymat}}. Bo'shatish: {v:1, ar:0}. */
    eskiYoz: function (d, cb) {
      var k = L('baza-kod');
      if (!k || !KODRE.test(k)) { if (cb) cb(false); return; }
      so(k + 'eski', 'yoz', d).then(function () { if (cb) cb(true); }).catch(function () { if (cb) cb(false); });
    },
    /* «Telegram орқали кириш» — sayt tomoni: belgi yasaladi (10 daqiqa), Telegram'da tasdiqlangach kod serverdan bir marta olinadi */
    ulashBoshla: function () { var t = yangiKod(); S('baza-ulash', JSON.stringify({ tok: t, t: Date.now() })); return t; },
    ulashKutmoqda: function () { var u = J('baza-ulash', null); return !!(u && u.tok && Date.now() - u.t < 10 * 60 * 1000); },
    ulashTekshir: function (cb) {
      var u = J('baza-ulash', null);
      if (!u || !u.tok || !(Date.now() - u.t < 10 * 60 * 1000)) { S('baza-ulash', null); cb(false, true); return; }     /* cb(ulandi, tugadi) */
      post({ amal: 'ulashOl', tok: u.tok }).then(function (j) {
        if (!j.kod) { cb(false, false); return; }
        S('baza-ulash', null); S('baza-tg', '1');
        window.Baza.kodQoy(j.kod, function () { cb(true, true); });
      }).catch(function () { cb(false, false); });
    },
    tgUlangan: function () { return !!L('baza-tg'); },
    /* «Аккаунтни ўчириш» (14.11.2026; do'konlar talabi, docs/texnik.md 17): serverdagi natijalar va 30 kunlik nusxa o'chadi
       (bo'sh hujjat + yangi r — boshqa qurilmalardagi nusxa ham tozalanadi). Mahalliy kalitlarni sahifa o'zi tozalaydi.
       Telegramdan tashqarida qurilma hisobdan ham chiqadi (kod va «baza-tg» o'chadi); Telegram ichida kod qoladi — hisob Telegramning o'zi. */
    ochir: function (cb) {
      clearTimeout(tm);
      var k = L('baza-kod'), r = Date.now();
      S('baza-r', String(r)); S('baza-rk', null);
      var tamom = function () {
        S('baza-oz', null); S('baza-t', null); S('baza-ulash', null); S('baza-tgi', null); S('ism', null);
        if (!tgIchi()) ['baza-kod', 'baza-tg', 'baza-r', 'baza-rk'].forEach(function (x) { S(x, null); });
        if (cb) cb(true);
      };
      if (!k || !KODRE.test(k)) { tamom(); return; }
      so(k, 'yoz', { v: 1, r: r, j: [], soz: null, yol: null, yolT: 0, xato: [], ism: { n: '', t: r } })   /* bo'sh ism — boshqa qurilmadagisi qaytib kelmasin */
        .then(function () { return so(k + 'eski', 'yoz', { v: 1, ar: 0 }); })
        .then(function () { return post({ amal: 'tgOchir', kod: k }).catch(function () {}); })
        .then(tamom, function () { if (cb) cb(false); });
    },
    eskiOl: function (cb) {
      var k = L('baza-kod');
      if (!k || !KODRE.test(k)) { cb(null); return; }
      so(k + 'eski', 'ol').then(function (j) { cb(j.d && j.d.v === 1 && j.d.ar && j.d.ls ? j.d : null); }).catch(function () { cb(null); });
    }
  };

  if (JIM) return;
  setTimeout(ulashSorov, 700);
  /* sahifa ochilganda; yashirilganda (chiqishdan oldin) — o'zgarish bo'lsa */
  setTimeout(function () {
    sinx(function (ok, ozg) {
      if (ok && ozg) { try { if (!sessionStorage.getItem('baza-r1')) { sessionStorage.setItem('baza-r1', '1'); location.reload(); } } catch (e) {} }
    });
  }, 1200);
  document.addEventListener('visibilitychange', function () { if (document.hidden && L('baza-oz')) sinx(); });
})();
