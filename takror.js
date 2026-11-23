/* «Машқ» hisobi: javoblar jurnali, so'z holati (4 pog'ona), ikki bo'lim navbati — «Ўрганиш» va «Такрор».
   Ekransiz modul — brauzerda window.Takror, Node'da require (server reytingi ham shu faylni ishlatadi — api/_rey.js).
   Haqiqat manbasi — jurnal: [kartaId, vaqt (ms), baho (1 — bilmadi, 3 — bildi), sarflangan ms] + so'z belgilari (W.a «Биламан»,
   W.b «Билмайман» — bosilgan vaqt). Holat har safar shulardan qayta hisoblanadi (serverda ham xuddi shunday — aldab bo'lmaydi).
   Karta raqamlari data/lugat.json va data/mashq.json dagi o'zgarmas id'dan: w12a (arabcha → ma'no),
   w12u (ma'no → arabcha), w12o (ovoz → ma'no), w12s (shakllari: ko'plik / fe'l shakllari / harf turi), q5 (so'z oxiri harakati). Batafsil: docs/texnik.md 14.

   23.11.2026 (foydalanuvchi: «mashqlar juda ko'payib ketyapti»; «o'rganayotgan so'zlarga alohida mashq, takror qiladiganlarga alohida»):
   FSRS jadvali o'rniga aniq yo'l — har so'z (va har mashq savoli) bitta «birlik»:
     билмайман / ўрганяпман → «Ўрганиш»: kuniga bir marta; turli kunlarda ketma-ket BILDI (3) marta to'g'ri → «биламан»;
     «Биламан» tugmasi → darhol «биламан»;
     биламан → KUTISH (7) kundan keyin «Такрор»da 1-tekshiruv, to'g'ri bo'lsa yana KUTISH2 (21) kundan keyin 2-tekshiruv:
     to'g'ri → «мустаҳкам» (boshqa hech qayerda so'ralmaydi); jami ~1 oy (xatosiz — 1, 2, 3, 10, 31-kun);
     «Билмайман» belgisi (istalgan pog'onada) → «билмайман», yo'l boshidan.
   23.11.2026 kech (foydalanuvchi: «bitta xato hammasini ortga qaytarishi to'g'rimi?» → taklif, «ha shunday qil»; Anki/Leitner'dagi kabi
   yumshoq): xato «билмайман»ga tushirmaydi — ўрганяпманda xato → 0/3 (ўрганяпманda qoladi); биламан (yoki мустаҳкам) da xato →
   ўрганяпман 2/3 (shu kun sanalmaydi — ertasi to'g'ri bo'lsa yana биламан, tekshiruvlar yana 7 + 21). «Билмайман» — faqat o'quvchi belgisi. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Takror = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var KUN = 86400000;
  var SOZ = {
    yangi: 10,        // kuniga yangi so'z («Созламалар» → 10 / 15 / 20)
    yangiQ: 5,        // kuniga yangi mashq savoli
    bildi: 3,         // «биламан»: turli kunlarda ketma-ket shuncha to'g'ri javob
    kutish: 7,        // «биламан»dan keyin «Такрор»da 1-tekshiruvgacha kun
    kutish2: 21       // 1-tekshiruvdan keyin 2-tekshiruvgacha kun (to'g'ri → «мустаҳкам»)
  };

  /* Birlik holati (so'z yoki mashq savoli). evs — shu birlik javoblari [kartaId, t, baho], a / b — «Биламан» / «Билмайман» bosilgan
     vaqt (eski yozuvlarda 1 — eng boshida), kun — vaqt → kun raqami. Natija:
     st — 'b' билмайман | 'o' ўрганяпман | 'g' биламан | 'm' мустаҳкам; d — ketma-ket to'g'ri kunlar (0..); g — «биламан» bo'lgan vaqt;
     h — 1-tekshiruvdan o'tgan vaqt (0 — hali); m — «мустаҳкам» bo'lgan vaqt; ok / no — to'g'ri / xato javoblar soni; n — javoblar soni;
     t0 — birinchi javob vaqti; lt / lb — oxirgi javob vaqti va bahosi; bl — «Билмайман» belgisi (to'g'ri javobgacha). */
  function birlik(evs, a, b, kun, cfg) {
    cfg = cfg || SOZ;
    var x = { st: 'o', d: 0, k: null, g: 0, h: 0, m: 0, ok: 0, no: 0, n: 0, t0: 0, lt: 0, lb: 0, bl: false };
    var e = (evs || []).slice(), i;
    if (b) e.push([null, +b || 1, 'B']);
    if (a) e.push([null, +a || 1, 'A']);
    e.sort(function (p, q) { return p[1] - q[1]; });
    for (i = 0; i < e.length; i++) {
      var t = e[i][1], v = e[i][2];
      if (v === 'B') { x.d = 0; x.k = null; x.g = 0; x.h = 0; x.m = 0; x.bl = true; continue; }
      if (v === 'A') { if (!x.g && !x.m) { x.g = t; x.h = 0; x.bl = false; } continue; }
      x.n++; if (!x.t0) x.t0 = t; x.lt = t; x.lb = v;
      if (v === 1) {
        x.no++;
        if (x.g || x.m) { x.d = cfg.bildi - 1; x.k = kun(t); x.g = 0; x.h = 0; x.m = 0; }   // биламан/мустаҳкам → ўрганяпман 2/3
        else { x.d = 0; x.k = null; }                                                       // ўрганяпман → 0/3 (belgi bo'lsa — билмайман)
        continue;
      }
      x.ok++; x.bl = false;
      if (x.m) continue;
      if (x.g) {
        if (!x.h) { if (kun(t) >= kun(x.g) + cfg.kutish) x.h = t; }
        else if (kun(t) >= kun(x.h) + cfg.kutish2) x.m = t;
        continue;
      }
      var dk = kun(t); if (dk !== x.k) { x.k = dk; x.d++; }
      if (x.d >= cfg.bildi) { x.g = t; x.h = 0; }
    }
    x.st = x.m ? 'm' : x.g ? 'g' : x.bl && !x.d ? 'b' : 'o';
    return x;
  }
  /* «биламан» birlik «Такрор»da qaysi kuni so'raladi (kun raqami): 1-tekshiruv — g + kutish, 2-si — h + kutish2 */
  function muddat(x, kun, cfg) { cfg = cfg || SOZ; return x.h ? kun(x.h) + cfg.kutish2 : kun(x.g) + cfg.kutish; }
  /* jurnal kartasi → birlik kaliti: w12a / w12u / w12o / w12s → w12; q5 → q5 */
  function bKalit(id) { var m = /^(w\d+)[auos]$/.exec(id); return m ? m[1] : /^q\d+$/.test(id) ? id : null; }
  /* butun jurnal → {birlik: [javoblar]} (vaqt tartibida) */
  function guruhla(jurnal) {
    var EV = {};
    (jurnal || []).forEach(function (e) { var u = e && bKalit(e[0]); if (u && typeof e[1] === 'number') (EV[u] = EV[u] || []).push(e); });
    for (var u in EV) EV[u].sort(function (p, q) { return p[1] - q[1]; });
    return EV;
  }
  /* so'z holatlari (server reytingi uchun ham): jurnal, so'z belgilari W ({a, b}), tz (daqiqa, getTimezoneOffset kabi) → id → holat */
  function holatlar(jurnal, W, tz, ids) {
    var EV = guruhla(jurnal), A = (W && W.a) || {}, B = (W && W.b) || {}, o = {}, kun = kunF(tz);
    (ids || Object.keys(EV).filter(function (u) { return u[0] === 'w'; }).map(function (u) { return u.slice(1); }).concat(Object.keys(A), Object.keys(B)))
      .forEach(function (id) { if (!o[id]) o[id] = birlik(EV['w' + id], A[id], B[id], kun); });
    return o;
  }
  function kunF(tz) { tz = +tz || 0; return function (t) { return Math.floor((t - tz * 60000) / KUN); }; }

  /* 19.11.2026 (foydalanuvchi): ma'nosi «маъносиз» harflar (ibtido وَ, zoida بِ) ham yodlanadi — karta «Вазифаси?» (takror.html),
   «Арабчаси?» kartasi yo'q. Ruschada asl o'zbekcha ma'no `uzA` da (ru.js). */
function manosiz(n) {
  return n.m.every(function (r) { return /^\s*(\d+\.\s*)?маъносиз/i.test(((r.uzA || r.uz) || [])[0] || ''); });
}

/* 21.11.2026 (foydalanuvchi: «...га», «...ҳам» kabi ma'noga arabchasi ko'p — bilib bo'lmaydi): «Арабчаси?» kartasi faqat javobi bitta
   bo'lsa. Yo'q: harflar (`tur` harf) va biror ma'no qismi butun lug'atda boshqa so'zda ham bor so'zlar («келмоқ» — جَاءَ va أَتَى,
   muzakkar/muannas jufti ham). Ular faqat «Маъноси?» (gap bilan). Ma'no — o'zbekcha asli (ruschada `uzA`), qavs ichi hisobga olinmaydi. */
function qismlar(r) {
  var o = [];
  ((r.uzA || r.uz) || []).forEach(function (u) {
    u.replace(/\([^()]*\)/g, ' ').split(/(?:^|\s)\d+\.\s*|[;,]/).forEach(function (q) {
      q = q.toLowerCase().replace(/\.{2,}|…|[«»"!?]/g, ' ').replace(/\s+/g, ' ').trim();
      if (q && !/^маъносиз/.test(q)) o.push(q);
    });
  });
  return o;
}
function yalangA(x) { return String(x || '').replace(/[ً-ٰٟـ.\s؟?…-]/g, '').replace(/[أإآ]/g, 'ا'); }
function sinonim(lugat) {                                  /* → function(n): shu kartaning «Арабчаси?»si noaniqmi */
  var QM = {};
  lugat.forEach(function (r) { qismlar(r).forEach(function (q) { (QM[q] = QM[q] || []).push(r); }); });
  function bir(a, b) { return (a.asl || a.id) === (b.asl || b.id) || yalangA(a.ar) === yalangA(b.ar); }
  return function (n) {
    return manosiz(n) || n.m.some(function (r) {
      return r.tur === 'harf' || qismlar(r).some(function (q) { return QM[q].some(function (x) { return !bir(x, r); }); });
    });
  };
}

function yarat(o) {
    var soz = {}, k;
    for (k in SOZ) soz[k] = SOZ[k];
    for (k in (o.sozlama || {})) soz[k] = o.sozlama[k];
    var tz = o.tz != null ? o.tz : new Date().getTimezoneOffset();     // daqiqa; kun chegarasi — o'quvchi soati bo'yicha
    var faol = {}, lv = {};
    (o.faol || []).forEach(function (d) { faol[d] = 1; });
    (o.darslar || []).forEach(function (d) { if (d.lv) lv[d.n] = d.lv; });
    var ust = {};                                            // «Йўл»da xato qilingan mashq savollari (id) — faol bo'lmasa ham kiradi, yangilar ichida birinchi
    (o.ustun || []).forEach(function (id) { ust[id] = 1; });
    var usz = {};                                            // «Йўл»da xato qilingan so'zlar (lugat id) — darsi faol bo'lmasa ham kiradi, yangi so'zlar ichida birinchi
    (o.ustunSoz || []).forEach(function (id) { usz[id] = 1; });

    /* ---- kartalar ---- */
    var K = [], KM = {}, mano = {}, noaniq = sinonim(o.barcha || o.lugat);   /* barcha — «аниқ биламан»lar ham (takror.html) */
    function qoy(c) { K.push(c); KM[c.id] = c; }
    /* 19.11.2026 (foydalanuvchi: «qaysi ma'no so'ralayotgani gapdan bilinsin»): so'zning keyingi ma'nosi (`asl`) — o'z darsidagi gapi
       (lugat.json `g`) bilan alohida karta («Маъноси?», javobi bitta bo'lsa «Арабчаси?» ham; so'z sanog'iga kirmaydi — hisob() va takror.html sozlar()).
       Gapi bir xil ma'nolar (kitobda bitta misolning tarjima variantlari) yoki gapsizlari — bitta kartada, avvalgidek birga. */
    function gapM(r) { var g = r.g; return !g ? '' : g.k != null ? ((r.x || [])[g.k] || [''])[0] : g.a.join(' '); }
    function guruh(r) { return (r.asl || r.id) + '|' + gapM(r); }
    /* 22.11.2026 (foydalanuvchi: «har bitta darsda hamma lug'at»): darsdagi eski so'z — `ay` (aynan shu ma'noli yozuv id si): o'z kartasi yo'q,
       dars faol bo'lsa o'sha yozuv kartasi ochiladi (o'z darsi hali o'tilmagan bo'lsa ham) */
    var akt = {};
    o.lugat.forEach(function (r) { if (r.ay && faol[r.d]) akt[r.ay] = 1; });
    o.lugat.forEach(function (r) { if (faol[r.d] && !r.ay) { var a = guruh(r); (mano[a] = mano[a] || []).push(r); } });
    o.lugat.forEach(function (r) {
      if (r.ay) return;
      var qm = !r.tk && r.asl && r.tur !== 'atoqli' && (faol[r.d] || akt[r.id] || usz[r.id]);   // keyingi ma'no
      if (!qm && !(r.tk && (faol[r.d] || usz[r.id] || akt[r.id]))) return;
      var m = mano[guruh(r)] || [r];
      if (m[0] !== r) return;                                 // shu gap bilan oldingi kartaga qo'shilgan
      var nk = 'w' + r.id;
      var n = { id: r.id, r: r, m: m, q: qm ? 1 : 0, au: !qm && r.au && lv[r.d] ? { f: lv[r.d], s: r.au[0], e: r.au[1] } : null };
      qoy({ id: nk + 'a', tur: 'a', nk: nk, n: n, u: usz[r.id] ? 1 : 0 });
      var bitta = !noaniq(n);                                 /* «зоида жар ҳарфи → ?», «...га → ?» — noaniq (21.11.2026) */
      if (bitta) qoy({ id: nk + 'u', tur: 'u', nk: nk, n: n, old: nk + 'a' });
      if (qm) return;
      if (n.au && !manosiz(n)) qoy({ id: nk + 'o', tur: 'o', nk: nk, n: n, old: nk + (bitta ? 'u' : 'a') });
      /* shakl kartasi (13.11.2026: «Машқ» takrorga qo'shildi): ko'pligi (ism), muzore'-amr-masdari (fe'l), turi (harf).
         Qaysi so'zda nima so'ralishini sahifa aytadi (o.shakl(r) → 'j' | 'k' | 't' | ''). 23.11.2026 dan: so'zning kartalari
         «Ўрганиш»da kun sayin navbat bilan chiqadi (karta()). */
      var sh = o.shakl ? o.shakl(r) : '';
      if (sh) qoy({ id: nk + 's', tur: 's', nk: nk, n: n, old: nk + 'a', sh: sh });
    });
    o.mashq.forEach(function (q) { if (faol[q.d] || ust[q.id]) qoy({ id: 'q' + q.id, tur: 'q', nk: 'q' + q.id, s: q, u: ust[q.id] ? 1 : 0 }); });

    /* ---- birliklar: so'z (uning hamma kartalari) yoki mashq savoli ---- */
    var U = {}, UL = [];
    K.forEach(function (c) {
      var u = U[c.nk];
      if (!u) { u = U[c.nk] = { nk: c.nk, w: c.tur !== 'q', id: c.n ? c.n.id : c.s.id, n: c.n || null, k: {}, u: c.u || 0 }; UL.push(u); }
      u.k[c.tur] = c;
    });
    var bel = o.belgi || function () { return null; };       /* id → {a, b} — «Биламан» / «Билмайман» bosilgan vaqt (takror.html W) */

    /* ---- jurnal → holat ---- */
    var J = [], EV = {};
    function kun(t) { return Math.floor((t - tz * 60000) / KUN); }
    function kunBoshi(n) { return n * KUN + tz * 60000; }
    function qosh(e) {
      J.push(e);
      var u = bKalit(e[0]); if (!u) return;
      var a = EV[u] = EV[u] || [];
      if (a.length && a[a.length - 1][1] > e[1]) { a.push(e); a.sort(function (p, q) { return p[1] - q[1]; }); } else a.push(e);
    }
    (o.jurnal || []).forEach(qosh);
    function hol(nk) {                                       /* birlik holati (birlik() — yuqorida) */
      var b = nk[0] === 'w' ? bel(nk.slice(1)) : null;
      return birlik(EV[nk], b && b.a, b && b.b, kun, soz);
    }

    /* Bugungi ikki navbat. «Ўрганиш»: билмайман / ўрганяпман birliklari — bugun hali to'g'ri topilmaganlari (kuniga bir marta;
       bugun xato topilgani — oxirida yana), yangilari kunlik chegara bilan (avval «Йўл»/belgi xatolari — u). «Такрор»: биламан
       bo'lganiga KUTISH kun (1-tekshiruv) yoki 1-tekshiruvga KUTISH2 kun (2-tekshiruv) to'lganlari. Мустаҳкам — hech qayerda. */
    function holat(t) {
      var bug = kun(t), L1 = [], L2 = [], YW = [], YQ = [], T = [], yW = 0, yQ = 0, nT = 0;
      UL.forEach(function (u) {
        var x = hol(u.nk); u.x = x;
        if (x.t0 && kun(x.t0) === bug) { if (u.w) yW++; else yQ++; }
        if (x.st === 'm') return;
        if (x.st === 'g') { var q = muddat(x, kun, soz) - bug; if (q <= 0) T.push(u); else if (!nT || q < nT) nT = q; return; }
        if (!x.n) { (u.w ? YW : YQ).push(u); return; }
        if (kun(x.lt) < bug) L1.push(u);
        else if (x.lb === 1) L2.push(u);                    // bugun xato topilgan — navbat oxirida yana
      });
      var vq = function (a, b) { return a.x.lt - b.x.lt; };
      L1.sort(vq); L2.sort(vq);
      T.sort(function (a, b) { return muddat(a.x, kun, soz) - muddat(b.x, kun, soz) || a.x.g - b.x.g; });
      YW.sort(function (a, b) { return b.u - a.u; }); YQ.sort(function (a, b) { return b.u - a.u; });   // xatolar birinchi (sort barqaror)
      YW = YW.slice(0, Math.max(0, soz.yangi - yW));
      YQ = YQ.slice(0, Math.max(0, soz.yangiQ - yQ));
      return { bug: bug, L1: L1, L2: L2, YW: YW, YQ: YQ, T: T, yW: yW, yQ: yQ, nT: nT };   /* nT — keyingi «Такрор»gacha kun (0 — «биламан» so'z yo'q) */
    }

    /* birlikning bugungi kartasi: «Ўрганиш»da kun sayin almashadi (arabcha → ma'no, ma'no → arabcha, ovoz, shakl — borlari);
       xatodan keyin (d = 0) — arabcha → ma'no. «Такрор»da — ma'no → arabcha (bo'lsa), aks holda arabcha → ma'no. */
    function karta(u, rej) {
      if (!u.w) return u.k.q;
      if (rej === 't') return u.k.u || u.k.a;
      var bor = ['a', 'u', 'o', 's'].filter(function (t) { return u.k[t]; });
      return u.k[bor[u.x.d % bor.length]];
    }
    /* hozirgina javob berilgan birlik ketma-ket chiqmasin (boshqasi bo'lsa) */
    function tanla(a, oxirgi) { for (var i = 0; i < a.length; i++) if (a[i].nk !== oxirgi) return a[i]; return null; }

    function navbatO(h) { return h.L1.concat(h.YW, h.YQ, h.L2); }
    function keyingi(t, rej) {
      var h = holat(t), oxirgi = J.length ? bKalit(J[J.length - 1][0]) : null, x = null;
      if (rej === 't') x = tanla(h.T, oxirgi) || h.T[0];
      else {
        x = tanla(h.L1, oxirgi);
        if (!x) {                                           // yangilar: ikki so'zdan keyin bitta mashq savoli
          if (h.YQ.length && (!h.YW.length || (h.yQ + 1) * 2 <= h.yW)) x = h.YQ[0];
          else x = h.YW[0];
        }
        if (!x) x = tanla(h.L2, oxirgi) || h.L2[0];
      }
      if (!x) return null;
      var o2 = rej === 't' ? h.T : navbatO(h);
      return { k: karta(x, rej), u: x, yangi: !x.x.n, qoldi: o2.length };
    }

    /* «N та» — birliklar: so'zlar va savollar soni */
    function sanoq(a) { var s = 0, q = 0; a.forEach(function (u) { if (u.w) s++; else q++; }); return { soz: s, savol: q, jami: s + q }; }
    function bugun(t) {
      var h = holat(t), o_ = sanoq(navbatO(h)), t_ = sanoq(h.T);
      return { o: o_, t: t_, jami: o_.jami + t_.jami, soz: o_.soz + t_.soz, savol: o_.savol + t_.savol, nT: h.nT };
    }

    /* bugungi ish tugagan deb: ertaga nechta («Ўрганиш»da bugun to'g'ri topilganlar ertaga yana chiqadi) */
    function ertaga(t) {
      var h = holat(kunBoshi(kun(t) + 1) + KUN / 2);
      return { o: sanoq(navbatO(h)).jami, t: sanoq(h.T).jami };
    }

    function hisob() {
      var r = { jami: 0, bilgan: 0, mustahkam: 0, organilmoqda: 0 };
      UL.forEach(function (u) {
        if (!u.w || u.n.q) return;                            // keyingi ma'no kartasi so'z sanalmaydi
        r.jami++;
        var x = hol(u.nk);
        if (x.st === 'm') { r.mustahkam++; r.bilgan++; } else if (x.st === 'g') r.bilgan++; else if (x.n) r.organilmoqda++;
      });
      return r;
    }

    return {
      kartalar: K, jurnal: J, sozlama: soz,
      javob: function (id, bildi, ms, t) { var e = [id, t, bildi ? 3 : 1, Math.max(0, Math.min(60000, Math.round(ms || 0)))]; qosh(e); return e; },
      keyingi: keyingi, bugun: bugun, ertaga: ertaga, hisob: hisob,
      /* so'z holati — shu jurnal va belgilar bo'yicha (birlik() natijasi); id — lug'at id */
      soz: function (id) { var b = bel(String(id)); return birlik(EV['w' + id], b && b.a, b && b.b, kun, soz); },
      /* bosh sahifa kartasi uchun qisqa hisob (localStorage takror-xulosa) — bosh sahifa takror.js ni yuklamaydi */
      xulosa: function (t) { var b = bugun(t), h = hisob(), e = ertaga(t); return { v: 1, kun: kun(t), qoldi: b.jami, o: b.o.jami, t: b.t.jami, ertaga: e.o + e.t, bilgan: h.bilgan, must: h.mustahkam, jami: h.jami }; },
      kun: kun
    };
  }

  /* REYTING BALLI (14.11.2026, foydalanuvchi qarori; docs/texnik.md 19). Ekransiz — keyin server ham aynan shu funksiya bilan hisoblaydi.
     To'g'ri javob — 1 ball (bitta karta kuniga bir marta); so'z «биламан»ga yetsa (turli kunlarda ketma-ket BILDI marta to'g'ri, takror.html
     kunlar() bilan bir xil) — +5 (har so'zga bir marta); kuniga ko'pi bilan KUN_MAX; juda tez javob (< TEZ ms) ball bermaydi; xato — minus yo'q.
     Kun va hafta — Toshkent vaqti (UTC+5) hamma uchun bir xil; hafta dushanba 00:00 dan. */
  var REY = { TZ: 5 * 3600000, KUN_MAX: 200, TEZ: 700, BILDI: 3, YANGI: 5 };
  function tkun(t) { return Math.floor((t + REY.TZ) / 86400000); }
  function haftaBoshi(t) { var d = tkun(t); return (d - ((d + 3) % 7)) * 86400000 - REY.TZ; }   /* 01.01.1970 — payshanba */
  function ball(jurnal, dan, gacha) {
    var j = (jurnal || []).slice().sort(function (a, b) { return a[1] - b[1]; }), kb = {}, kn = {}, W = {}, jami = 0;
    gacha = gacha || Infinity;
    j.forEach(function (e) {
      var d = tkun(e[1]), ichida = e[1] >= dan && e[1] < gacha, b = 0, m = /^w(\d+)[auos]$/.exec(e[0]);
      if (m) {                                             /* so'z hisobi — ichida bo'lmasa ham yuritiladi (ketma-ketlik oldindan boshlangan bo'lishi mumkin) */
        var x = W[m[1]] = W[m[1]] || { d: 0, k: null, bor: false };
        if (e[2] === 1) { x.d = 0; x.k = null; }
        else { if (d !== x.k) { x.k = d; x.d++; } if (x.d >= REY.BILDI && !x.bor) { x.bor = true; if (ichida) b += REY.YANGI; } }
      }
      if (!ichida) return;
      if (e[2] === 3 && !(e[3] != null && e[3] > 0 && e[3] < REY.TEZ) && !kb[e[0] + '|' + d]) { kb[e[0] + '|' + d] = 1; b += 1; }
      if (!b) return;
      var q = Math.min(b, REY.KUN_MAX - (kn[d] || 0)); if (q <= 0) return;
      kn[d] = (kn[d] || 0) + q; jami += q;
    });
    return jami;
  }

  return { yarat: yarat, SOZ: SOZ, VER: 2, muddat: muddat, ball: ball, haftaBoshi: haftaBoshi, REY: REY, manosiz: manosiz, birlik: birlik, holatlar: holatlar };
});
