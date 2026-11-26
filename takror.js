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
    yangiQ: 5,        // kuniga yangi mashq savoli. Yangi SO'Z chegarasi yo'q (26.11.2026, foydalanuvchi: «konkretniy bo'laversin» — dars 80% bo'lgan
                      // kuni uning hamma yangi so'zi «Машқ»ga tushadi; avvalgi 10 / 15 / 20 va «Яна N та сўз» olib tashlandi)
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
    var bel = o.belgi || function () { return null; };   /* id → {a, b} — «Биламан» / «Билмайман» bosilgan vaqt (takror.html W) */

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
       bugun xato topilgani — oxirida yana), yangilari — hammasi, chegarasiz (26.11.2026; avval «Йўл»/belgi xatolari — u). «Такрор»: биламан
       bo'lganiga KUTISH kun (1-tekshiruv) yoki 1-tekshiruvga KUTISH2 kun (2-tekshiruv) to'lganlari. Мустаҳкам — hech qayerda. */
    function holat(t) {
      var bug = kun(t), L1 = [], L2 = [], YW = [], YQ = [], T = [], yW = 0, yQ = 0, nT = 0;
      UL.forEach(function (u) {
        var x = hol(u.nk); u.x = x;
        /* bugun birinchi marta so'ralgan = bugungi yangi (savol chegarasi va «2 so'zga 1 savol» uchun). 26.11.2026: «Биламан» deb oldin belgilangan so'z (7 kunlik
           tekshiruvda birinchi marta so'raladi) yangi sanalmaydi — aks holda kartadagi «Янги сўзлар» soni mashq ichida kamayib qolardi */
        var bA = u.w ? bel(u.nk.slice(1)) : null;
        u.yb = !!(x.t0 && kun(x.t0) === bug && !(bA && bA.a && +bA.a < x.t0));   /* bugungi yangi — «Янги сўзлар» guruhida qoladi (guruhi()) */
        if (u.yb) { if (u.w) yW++; else yQ++; }
        if (x.st === 'm') return;
        if (x.st === 'g') { var q = muddat(x, kun, soz) - bug; if (q <= 0) T.push(u); else if (!nT || q < nT) nT = q; return; }
        if (!x.n) { (u.w ? YW : YQ).push(u); return; }
        if (kun(x.lt) < bug) L1.push(u);
        else if (x.lb === 1) L2.push(u);                    // bugun xato topilgan — navbat oxirida yana
      });
      var vq = function (a, b) { return a.x.lt - b.x.lt; };
      L1.sort(vq); L2.sort(vq);
      /* 26.11.2026 (foydalanuvchi: «birinchi … mustahkamga chiqadigan so'zlar, keyin bilaman, oxiri o'rganyapman»): 2-tekshiruv (x.h —
         to'g'ri topilsa мустаҳкам) 1-tekshiruvdan (7 kunlik) oldin */
      T.sort(function (a, b) { return (b.x.h ? 1 : 0) - (a.x.h ? 1 : 0) || muddat(a.x, kun, soz) - muddat(b.x, kun, soz) || a.x.g - b.x.g; });
      YW.sort(function (a, b) { return b.u - a.u; }); YQ.sort(function (a, b) { return b.u - a.u; });   // xatolar birinchi (sort barqaror)
      /* yangi so'zlarga kunlik chegara yo'q (26.11.2026): darsi o'tilganlarning hammasi bugun — eng oxirida (L1 → YW → L2) */
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
      return { k: karta(x, rej), u: x, yangi: !x.x.n && rej !== 't', qoldi: o2.length, gr: guruhi(x, rej) };   /* «янги» belgisi — «Биламан» tekshiruvida emas (26.11.2026) */
    }

    /* «N та» — birliklar: so'zlar va savollar soni */
    function sanoq(a) { var s = 0, q = 0; a.forEach(function (u) { if (u.w) s++; else q++; }); return { soz: s, savol: q, jami: s + q }; }
    /* «Бугунги машқ» guruhlari (26.11.2026): m — мустаҳкамга чиқади (2-tekshiruv), g — биламан текшируви (7 kunlik), o — ўрганяпман
       (avval ko'rilgan, bugun xato topilgani ham), y — янги сўзлар. Navbat ham shu tartibda (T — m oldin; L1 → YW → L2) */
    /* 26.11.2026 (foydalanuvchi skrinshoti: tepada «5 / 20», guruhda «8 / 20»): bugun birinchi ko'rilgan so'z «Билмадим»dan keyin ham (L2 —
       oxirida yana) «Янги сўзлар»da qoladi — guruh sanog'i ham tepadagidek faqat tugagan so'zni sanaydi (avval xato topilgani 'o'ga o'tib,
       «Янги»dan bajarilgandek chiqib ketardi) */
    function guruhi(u, rej) { return rej === 't' ? (u.x.h ? 'm' : 'g') : u.x.n && !u.yb ? 'o' : 'y'; }
    function bugun(t) {
      var h = holat(t), o_ = sanoq(navbatO(h)), t_ = sanoq(h.T), gr = { m: 0, g: 0, o: h.L1.length, y: h.YW.length + h.YQ.length };
      h.L2.forEach(function (u) { gr[u.yb ? 'y' : 'o']++; });
      h.T.forEach(function (u) { gr[u.x.h ? 'm' : 'g']++; });
      return { o: o_, t: t_, jami: o_.jami + t_.jami, soz: o_.soz + t_.soz, savol: o_.savol + t_.savol, nT: h.nT, gr: gr };
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

  /* REYTING BALLI (14.11.2026, foydalanuvchi qarori; docs/texnik.md 19). Ekransiz — server ham aynan shu funksiyalar bilan hisoblaydi (api/_rey.js).
     Kun va hafta — Toshkent vaqti (UTC+5) hamma uchun bir xil; hafta dushanba 00:00 dan.

     ESKI QOIDA (YANGI gacha bo'lgan haftalar, ballEski): to'g'ri javob — 1 ball (bitta karta kuniga bir marta); so'z «биламан»ga yetsa
     (turli kunlarda ketma-ket BILDI marta to'g'ri) — +5 (har so'zga bir marta); kuniga ko'pi bilan KUN_MAX (200); < TEZ ms javob — ball yo'q.

     YANGI QOIDA (26.11.2026, foydalanuvchi: «ball qancha ko'p foydalansa, shu ilovadan shug'ullansa, o'sha odam olishi kerak»; kunlik
     chegara — «1» (olib tashlash), ballar 10 baravar, kunlik seriya — «ha qil»; 30.11.2026 dushanbadan — hafta o'rtasida aralashmasin):
     - to'g'ri javob — B (10): «Машқ» kartalari (w…, q…), dars ichidagi «Машқ» (xd<dars>:<savol>), Сарф (xs<savol>),
       «Қўшимча такрор» (x + karta id — daraja va takror kuniga ta'sir qilmaydi, bKalit ularni tanimaydi; 26.11.2026 da olib tashlandi, eski yozuvlar hisoblanaveradi); bitta kalit kuniga bir marta;
       < TEZ ms javob va xato — ball yo'q, minus yo'q;
     - so'z «биламан»ga yetsa — BILAN (50), har so'zga bir marta (eskisidagi kabi hisob);
     - dars «Машқ»i birinchi marta 80% dan o'tsa — OTDI (100): yozuv xo<dars>, darsga bir marta (opt.otgan berilsa — faqat haqiqatan
       o'tilgan dars, serverda yol.d[n].b >= 80);
     - «Эшитиш» (tinglash.html va dars audiosi): har 5 daqiqa tinglash — yozuv xe, ESH (10), kuniga ko'pi bilan ESH_MAX (20 ta = 200 ball);
     - umumiy kunlik chegara YO'Q;
     - kunlik seriya: kunida kamida SER (200) ball yig'ilgan kun — +SER_B (50); ketma-ket shunday kunlar — «🔥 N кун» (seriya()).
     Yozuvlar takror jurnalida (takror-j; baza.js bilan serverga — birlashtirish, tozalash, ruscha profil avvalgidek). */
  var REY = { TZ: 5 * 3600000, KUN_MAX: 200, TEZ: 700, BILDI: 3, YANGI: 5,
    DAN: 1795978800000,                                    /* 30.11.2026 00:00 (Toshkent) — yangi qoida shu haftadan */
    B: 10, BILAN: 50, OTDI: 100, ESH: 10, ESH_MAX: 20, SER: 200, SER_B: 50 };
  function tkun(t) { return Math.floor((t + REY.TZ) / 86400000); }
  function haftaBoshi(t) { var d = tkun(t); return (d - ((d + 3) % 7)) * 86400000 - REY.TZ; }   /* 01.01.1970 — payshanba */
  function saralangan(jurnal) {
    return (jurnal || []).filter(function (e) { return e && typeof e[0] === 'string' && typeof e[1] === 'number'; }).sort(function (a, b) { return a[1] - b[1]; });
  }
  function ballEski(jurnal, dan, gacha) {
    var j = saralangan(jurnal), kb = {}, kn = {}, W = {}, jami = 0;
    gacha = gacha || Infinity;
    j.forEach(function (e) {
      if (e[0].charAt(0) === 'x') return;                  /* yangi qoida yozuvlari — eski haftalarga kirmaydi */
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
  /* yangi qoida: har kun (Toshkent kun raqami) → ball (DAN dan boshlab; seriya bonusisiz). opt.otgan(n) — dars o'tilganmi (ixtiyoriy);
     opt.dan — DAN o'rniga (faqat ko'rish/sinov sahifalarida «+10» va seriyani hozirdan ko'rsatish uchun; reyting — doim DAN) */
  function boshi(opt) { return opt && opt.dan != null ? opt.dan : REY.DAN; }
  function kunBallari(jurnal, opt) {
    var j = saralangan(jurnal), kb = {}, W = {}, xo = {}, ec = {}, K = {}, otg = opt && opt.otgan, dan = boshi(opt);
    j.forEach(function (e) {
      var k = e[0], t = e[1], d = tkun(t), b = 0, m = /^w(\d+)[auos]$/.exec(k);
      if (m) {
        var x = W[m[1]] = W[m[1]] || { d: 0, k: null, bor: false };
        if (e[2] === 1) { x.d = 0; x.k = null; }
        else { if (d !== x.k) { x.k = d; x.d++; } if (x.d >= REY.BILDI && !x.bor) { x.bor = true; b += REY.BILAN; } }
      }
      if (k.slice(0, 2) === 'xo') {                         /* dars birinchi marta o'tildi */
        var n = k.slice(2);
        if (!xo[n]) { xo[n] = 1; if (!otg || otg(n)) b += REY.OTDI; }
      } else if (k === 'xe') {                              /* 5 daqiqa tinglash */
        if ((ec[d] || 0) < REY.ESH_MAX) { ec[d] = (ec[d] || 0) + 1; b += REY.ESH; }
      } else if (e[2] === 3 && !(e[3] != null && e[3] > 0 && e[3] < REY.TEZ) && !kb[k + '|' + d]) { kb[k + '|' + d] = 1; b += REY.B; }
      if (b && t >= dan) K[d] = (K[d] || 0) + b;
    });
    return K;
  }
  function yangiBall(K, dan, gacha) {
    var jami = 0, d0 = tkun(Math.max(dan, REY.DAN)), d1 = gacha === Infinity ? Infinity : tkun(gacha - 1);
    for (var d in K) { d = +d; if (d < d0 || d > d1) continue; jami += K[d] + (K[d] >= REY.SER ? REY.SER_B : 0); }
    return jami;
  }
  /* hafta (yoki istalgan oraliq) bali: DAN dan oldingi qismi — eski qoida, keyingisi — yangi */
  function ball(jurnal, dan, gacha, opt) {
    dan = dan || 0; gacha = gacha || Infinity;
    var jami = 0;
    if (dan < REY.DAN) jami += ballEski(jurnal, dan, Math.min(gacha, REY.DAN));
    if (gacha > REY.DAN) jami += yangiBall(kunBallari(jurnal, opt && opt.otgan ? { otgan: opt.otgan } : null), dan, gacha);
    return jami;
  }
  /* bugungi ball (seriya bonusisiz) va seriya: kamida SER ball yig'ilgan ketma-ket kunlar; bugun hali SER ga yetmagan bo'lsa — kechagacha.
     → { bugun, seriya, chegara } (DAN dan oldin — ikkalasi 0) */
  function kunlik(jurnal, t, opt) {
    var K = kunBallari(jurnal, opt), d = tkun(t || Date.now()), bug = K[d] || 0, n = 0, i = bug >= REY.SER ? d : d - 1, d0 = tkun(boshi(opt));
    while (i >= d0 && (K[i] || 0) >= REY.SER) { n++; i--; }
    return { bugun: bug, seriya: n, chegara: REY.SER };
  }

  return { yarat: yarat, SOZ: SOZ, VER: 2, muddat: muddat, ball: ball, kunlik: kunlik, haftaBoshi: haftaBoshi, REY: REY, manosiz: manosiz, birlik: birlik, holatlar: holatlar };
});
