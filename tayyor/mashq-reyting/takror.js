/* «Такрорлаш» hisobi: FSRS (fsrs.js), javoblar jurnali, navbat, «bilgan so'zlar».
   Ekransiz modul — brauzerda window.Takror, Node'da require. Keyin server va ilova ham shu faylni ishlatadi.
   Haqiqat manbasi — jurnal: [kartaId, vaqt (ms), baho (1 — bilmadi, 3 — bildi), sarflangan ms].
   Kartalar holati har safar jurnaldan qayta hisoblanadi (serverda ham xuddi shunday — aldab bo'lmaydi).
   Karta raqamlari data/lugat.json va data/mashq.json dagi o'zgarmas id'dan: w12a (arabcha → ma'no),
   w12u (ma'no → arabcha), w12o (ovoz → ma'no), w12s (shakllari: ko'plik / fe'l shakllari / harf turi), q5 (so'z oxiri harakati). Batafsil: docs/texnik.md 14. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./fsrs.js'));
  else root.Takror = factory(root.FSRS);
})(typeof self !== 'undefined' ? self : this, function (F) {
  'use strict';
  var KUN = 86400000;
  var SOZ = {
    yangi: 10,        // kuniga yangi so'z
    yangiQ: 5,        // kuniga yangi mashq savoli
    yangiQosh: 10,    // kuniga yangi qo'shimcha karta (ma'no → arabcha, ovoz → ma'no)
    eslab: 0.9,       // FSRS: eslab qolish darajasi
    /* Chegaralar 13.11.2026 da qattiqlashdi (foydalanuvchi qarori, jahon tajribasi bo'yicha; oldin 7 va 30 edi):
       bilgan — Anki'dagi «pishgan karta» chegarasi; xatosiz borilsa 4-to'g'ri javobda, ~2 haftada yetiladi (2 kun → 11 kun → 46 kun);
       mustahkam — 5-to'g'ri javob, ~2 oy; qo'shimcha shart: ma'no → arabcha kartasi ham kamida «bilgan» (tanish va aytib berish — ikki mahorat). */
    bilgan: 21,       // «биламан»: barqarorlik (so'z esda turadigan muddat) shuncha kundan kam emas
    mustahkam: 90     // «мустаҳкам»: arabcha → ma'no kartasi shuncha kun + ma'no → arabcha kartasi «bilgan»
  };

  function yarat(o) {
    var soz = {}, k;
    for (k in SOZ) soz[k] = SOZ[k];
    for (k in (o.sozlama || {})) soz[k] = o.sozlama[k];
    var tz = o.tz != null ? o.tz : new Date().getTimezoneOffset();     // daqiqa; kun chegarasi — o'quvchi soati bo'yicha
    var f = F.fsrs(F.generatorParameters({ request_retention: soz.eslab, enable_fuzz: true }));
    var ST = F.State, faol = {}, lv = {};
    (o.faol || []).forEach(function (d) { faol[d] = 1; });
    (o.darslar || []).forEach(function (d) { if (d.lv) lv[d.n] = d.lv; });
    var ust = {};                                            // «Йўл»da xato qilingan mashq savollari (id) — faol bo'lmasa ham kiradi, yangilar ichida birinchi
    (o.ustun || []).forEach(function (id) { ust[id] = 1; });
    var usz = {};                                            // «Йўл»da xato qilingan so'zlar (lugat id) — darsi faol bo'lmasa ham kiradi, yangi so'zlar ichida birinchi
    (o.ustunSoz || []).forEach(function (id) { usz[id] = 1; });

    /* ---- kartalar ---- */
    var K = [], KM = {}, mano = {};
    function qoy(c) { K.push(c); KM[c.id] = c; }
    o.lugat.forEach(function (r) { if (faol[r.d]) { var a = r.asl || r.id; (mano[a] = mano[a] || []).push(r); } });
    o.lugat.forEach(function (r) {
      if (!r.tk || !(faol[r.d] || usz[r.id])) return;
      var nk = 'w' + r.id;
      var n = { id: r.id, r: r, m: mano[r.id] || [r], au: r.au && lv[r.d] ? { f: lv[r.d], s: r.au[0], e: r.au[1] } : null };
      qoy({ id: nk + 'a', tur: 'a', nk: nk, n: n, u: usz[r.id] ? 1 : 0 });
      qoy({ id: nk + 'u', tur: 'u', nk: nk, n: n, old: nk + 'a' });
      if (n.au) qoy({ id: nk + 'o', tur: 'o', nk: nk, n: n, old: nk + 'u' });
      /* shakl kartasi (13.11.2026: «Машқ» takrorga qo'shildi): ko'pligi (ism), muzore'-amr-masdari (fe'l), turi (harf).
         Qaysi so'zda nima so'ralishini sahifa aytadi (o.shakl(r) → 'j' | 'k' | 't' | ''). Ma'no kartasi kamida bir marta kun o'tib
         to'g'ri takrorlangach chiqadi (qo'shimcha kartalar qatorida, kuniga yangiQosh tadan). */
      var sh = o.shakl ? o.shakl(r) : '';
      if (sh) qoy({ id: nk + 's', tur: 's', nk: nk, n: n, old: nk + 'a', sh: sh });
    });
    o.mashq.forEach(function (q) { if (faol[q.d] || ust[q.id]) qoy({ id: 'q' + q.id, tur: 'q', nk: 'q' + q.id, s: q, u: ust[q.id] ? 1 : 0 }); });

    /* ---- jurnal → holat ---- */
    var J = [], S = {};
    function kun(t) { return Math.floor((t - tz * 60000) / KUN); }
    function kunBoshi(n) { return n * KUN + tz * 60000; }
    function qosh(e) {
      var id = e[0], t = e[1], g = e[2];
      J.push(e);
      if (!KM[id]) return;                                   // bu darslar to'plamida yo'q karta — jurnalda qoladi
      var s = S[id];
      if (!s) s = S[id] = { c: F.createEmptyCard(new Date(t)), n: 0, rv: 0, k0: kun(t), kx: 0 };
      var avval = s.c.state;
      s.c = f.next(s.c, new Date(t), g === 1 ? F.Rating.Again : F.Rating.Good).card;
      s.n++;
      if (g !== 1 && avval === ST.Review) s.rv++;           // kun o'tib qilingan to'g'ri takror
      s.kx = kun(t);
    }
    (o.jurnal || []).forEach(qosh);

    function dueSort(a, b) { return (+S[a.id].c.due) - (+S[b.id].c.due); }

    /* bugungi navbat bo'laklari */
    function holat(t) {
      var bug = kun(t), nota = {}, yA = 0, yQ = 0, yX = 0, id, s, c;
      for (id in S) {
        s = S[id]; c = KM[id];
        if (s.kx === bug && !nota[c.nk]) nota[c.nk] = id;    // bu so'zning bugun ko'rilgan kartasi
        if (s.k0 === bug) { if (c.tur === 'a') yA++; else if (c.tur === 'q') yQ++; else yX++; }
      }
      var L1 = [], L2 = [], R = [], rn = {};
      for (id in S) {
        s = S[id]; c = KM[id];
        var st = s.c.state, due = +s.c.due;
        if (st === ST.Learning || st === ST.Relearning) {
          if (kun(due) > bug) continue;
          if (due <= t) L1.push(c); else L2.push(c);          // L2: qadam vaqti hali kelmagan — navbat bo'shasa ko'rsatiladi
        } else if (st === ST.Review && kun(due) <= bug) {
          if (nota[c.nk] && nota[c.nk] !== id) continue;      // shu so'zning boshqa kartasi bugun ko'rildi — ertaga
          R.push(c);
        }
      }
      L1.sort(dueSort); L2.sort(dueSort); R.sort(dueSort);
      R = R.filter(function (x) { if (rn[x.nk]) return false; rn[x.nk] = 1; return true; });   // bir so'zdan kuniga bitta karta
      var YA = [], YQ = [], YX = [];
      K.forEach(function (x) {
        if (S[x.id]) return;
        if (x.tur === 'a') YA.push(x);
        else if (x.tur === 'q') YQ.push(x);
        else if (S[x.old] && S[x.old].rv >= 1 && !nota[x.nk] && !rn[x.nk]) YX.push(x);
      });
      YQ.sort(function (a, b) { return b.u - a.u; });            // xatolar birinchi (sort barqaror)
      YA.sort(function (a, b) { return b.u - a.u; });
      YA = YA.slice(0, Math.max(0, soz.yangi - yA));
      YQ = YQ.slice(0, Math.max(0, soz.yangiQ - yQ));
      YX = YX.slice(0, Math.max(0, soz.yangiQosh - yX));
      return { bug: bug, L1: L1, L2: L2, R: R, YA: YA, YQ: YQ, YX: YX, yA: yA, yQ: yQ };
    }

    /* hozirgina javob berilgan karta ketma-ket chiqmasin (boshqa karta bo'lsa) */
    function tanla(a, oxirgi) { for (var i = 0; i < a.length; i++) if (a[i].id !== oxirgi) return a[i]; return null; }

    function keyingi(t) {
      var h = holat(t), oxirgi = J.length ? J[J.length - 1][0] : null;
      var x = tanla(h.L1, oxirgi) || tanla(h.R, oxirgi);
      if (!x) {
        // yangilar: ikki so'zdan keyin bitta mashq savoli; oxirida qo'shimcha kartalar
        if (h.YQ.length && (!h.YA.length || (h.yQ + 1) * 2 <= h.yA)) x = h.YQ[0];
        else x = h.YA[0] || h.YX[0];
      }
      if (!x) x = tanla(h.L2, oxirgi) || h.L1[0] || h.L2[0];
      if (!x) return null;
      return { k: x, yangi: !S[x.id], qoldi: h.L1.length + h.L2.length + h.R.length + h.YA.length + h.YQ.length + h.YX.length };
    }

    /* 14.11.2026: «Такрорлаш · N» — kartalar emas, so'zlar (bir so'zning bir necha kartasi bitta) va savollar soni */
    function sanoq(a) { var u = {}, s = 0, q = 0; a.forEach(function (x) { if (u[x.nk]) return; u[x.nk] = 1; if (x.tur === 'q') q++; else s++; }); return { soz: s, savol: q, jami: s + q }; }
    function bugun(t) {
      var h = holat(t), n = sanoq(h.L1.concat(h.L2, h.R, h.YA, h.YQ, h.YX));
      return { takror: h.L1.length + h.L2.length + h.R.length, yangi: h.YA.length + h.YQ.length + h.YX.length, soz: n.soz, savol: n.savol, jami: n.jami };
    }

    /* bugungi ish tugagan deb: ertaga nechta karta chiqadi */
    function ertaga(t) {
      var h = holat(kunBoshi(kun(t) + 1) + KUN / 2);
      return sanoq(h.L1.concat(h.L2, h.R, h.YA, h.YQ, h.YX)).jami;
    }

    function hisob() {
      var r = { jami: 0, bilgan: 0, mustahkam: 0, organilmoqda: 0 };
      K.forEach(function (x) {
        if (x.tur !== 'a') return;
        r.jami++;
        var s = S[x.id];
        if (!s) return;
        if (s.c.state === ST.Review && s.c.stability >= soz.bilgan) {
          r.bilgan++;
          var u = S[x.nk + 'u'];                               // ikki tomonlama: ma'no → arabcha ham bilinsa
          if (s.c.stability >= soz.mustahkam && u && u.c.state === ST.Review && u.c.stability >= soz.bilgan) r.mustahkam++;
        } else r.organilmoqda++;
      });
      return r;
    }

    return {
      kartalar: K, jurnal: J, sozlama: soz,
      javob: function (id, bildi, ms, t) { var e = [id, t, bildi ? 3 : 1, Math.max(0, Math.min(60000, Math.round(ms || 0)))]; qosh(e); return e; },
      keyingi: keyingi, bugun: bugun, ertaga: ertaga, hisob: hisob,
      karta: function (id) { return S[id] ? S[id].c : null; },
      /* bosh sahifa kartasi uchun qisqa hisob (localStorage takror-xulosa) — bosh sahifa takror.js ni yuklamaydi */
      xulosa: function (t) { var b = bugun(t), h = hisob(); return { v: 1, kun: kun(t), qoldi: b.jami, ertaga: ertaga(t), bilgan: h.bilgan, jami: h.jami }; },
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

  return { yarat: yarat, SOZ: SOZ, VER: 1, ball: ball, haftaBoshi: haftaBoshi, REY: REY };
});
