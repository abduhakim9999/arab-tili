/* savol.js — dars «Машқ»ida yangi savol turlari (26.11.2026; docs/texnik/23-savollar.md).
   Sahifada `var QTUR = {kalit: {...}}` bo'lsa ishlaydi (src/build/savol-tuzatish.json → savol_tuzat.py yozadi):
     t: 'h' — «Ҳолати?»       (o — variantlar, sukut: Раф / Насб / Жар; j — to'g'ri variant matni)
        'v' — «Нима учун?»    (s — savol matni, o — variantlar, j — to'g'risi)
        's' — «Сабабчини топ» (j — ta'sir qilgan so'z kaliti, sukut: TRK dagi; variantlar — gapdagi qolgan so'zlar);
              «Жуфтини топ» ham shu tur: j — jufti (mavsuf, ma'tuf alayh…), s — savol matni
        'f' — «… ни топ»       (s — savol matni; belgilanmaydi, javob — shu kalitdagi so'zning o'zi; variantlar — gapdagi hamma so'z)
        'b' — «Бўш жойга …»    (so'z o'rni bo'sh; o — variantlar, j — to'g'risi)
        'x' — «Хатони топ»     (x — so'zning xato yozilgan shakli; javob — shu so'z; variantlar — gapdagi hamma so'z)
     iz — javobdan keyingi izoh (sukut: TRK dagi sabab); bq — qolip bosqichi 1–5 (sukut turdan: BQ).
   Dars «Эъроб»ida savollar bosqich tartibida chiqadi (26.11.2026, qolip — docs/texnik/23-savollar.md).
   Har savol qo'lda, alohida o'ylab yoziladi — bu fayl faqat ko'rsatadi va baholaydi.
   Sahifa kodidagi ilgaklar (qstart/qshow/qans/qfb/qres, saqlash/tiklash) — `savol_tuzat.py --kod` qo'yadi.
   Saqlashda turli savol [qator, so'z, tur] bo'lib yoziladi; yol.html uni data/mashq.json dagi «t» bo'yicha baholaydi. */
(function () {
  var TUR = { h: 'Ҳолати?', v: 'Нима учун?', s: 'Сабабчини топ', f: 'Топинг', b: 'Бўш жой', x: 'Хатони топ' };
  var BQ = { h: 2, f: 2, v: 3, s: 4, b: 5, x: 5 };
  var TAP = { s: 1, f: 1, x: 1 };
  var HOL = ['Раф', 'Насб', 'Жар'];
  var HN = { R: 'раф', N: 'насб', J: 'жар', Z: 'жазм' };
  function T() { return window.QTUR || {}; }
  function kk(q) { return q.l + '-' + q.w; }
  function soz(l) { return D[l][1].split('/'); }

  if (!document.getElementById('qtx-css')) {
    var st = document.createElement('style'); st.id = 'qtx-css';
    st.textContent = '.qtur{display:inline-block;font-size:12px;padding:2px 10px;border-radius:10px;border:1px solid var(--bd);color:var(--ac)}' +
      '.qsv{font-size:19px;font-weight:700;line-height:1.4;color:var(--tx);margin:6px 0 10px}' +
      '.qo.qk1{grid-template-columns:1fr}.qo.qk2{grid-template-columns:1fr 1fr}' +
      '.qo button b.qtx{font-family:inherit;font-size:16px;line-height:1.45;font-weight:500;padding:4px 2px}' +
      '.qs .qw{cursor:pointer;border-bottom:2px dashed var(--bd);border-radius:6px;padding:0 3px}' +
      '.qs .qw.ok{background:rgba(22,163,74,.2);border-bottom-color:#16a34a}.qs .qw.no{background:rgba(220,38,38,.18);border-bottom-color:#dc2626}' +
      '.qs .qbl{display:inline-block;min-width:3.2em;border-bottom:2px dashed var(--ac);border-radius:0}.qs .qbl.ok{min-width:0;border:0;color:#16a34a}';
    document.head.appendChild(st);
  }

  /* «Сабабчини топ»: bosiladigan so'zlar — gapdagi qolgan so'zlar (ta'sir qilgan so'z boshqa qatorda bo'lsa — o'sha qator ham, tepada) */
  function nomzod(k, j) {
    var p = k.split('-'), l = +p[0], w = +p[1], hl = +j.split('-')[0], out = [];
    (hl !== l ? [hl, l] : [l]).forEach(function (L) {
      soz(L).forEach(function (x, i) { if (!(L === l && i === w)) out.push(L + '-' + i); });
    });
    return out;
  }
  function ops(k, t) {
    var d = T()[k];
    if (!d || d.t !== t) return null;
    if (t === 's') {
      var j = d.j || (TRK[k] && TRK[k][0]);
      if (!j) return null;
      return nomzod(k, j).map(function (x) { return { w: get(x).v, k: x, ok: x === j }; });
    }
    if (t === 'f' || t === 'x') {
      if (t === 'x' && !d.x) return null;
      var l = +k.split('-')[0];
      return soz(l).map(function (w, i) { var x = l + '-' + i; return { w: (t === 'x' && x === k) ? d.x : get(x).v, k: x, ok: x === k }; });
    }
    return (d.o || HOL).map(function (x) { return { w: x, ok: x === d.j }; });
  }
  /* dars rejasi: qo'lda yozilgan turli savol o'sha so'zning harakat savoli o'rnini oladi (bir so'z — bitta savol) */
  function plan(Z) {
    var t = T();
    Z = Z.filter(function (q) { return !t[kk(q)]; });
    Object.keys(t).forEach(function (k) {
      var p = k.split('-'), o = ops(k, t[k].t);
      if (o) Z.push({ l: +p[0], w: +p[1], t: t[k].t, o: o, ch: null, ok: false });
    });
    /* qolip: bosqich tartibida, bosqich ichida — matn tartibida (26.11.2026) */
    return Z.sort(function (a, b) { return bq(a) - bq(b) || a.l - b.l || a.w - b.w; });
  }
  function bq(q) { var d = T()[kk(q)]; return (d && d.bq) || (q.t ? BQ[q.t] : 1) || 3; }
  /* tiklashda: saqlangan savollar to'plami hozirgi reja bilan bir xilmi (yangi savol qo'shilgan / tur o'zgargan bo'lsa — qaytadan) */
  function mos(Z) {
    var a = Z.map(function (q) { return kk(q) + (q.t || ''); }).sort().join(),
        b = plan(qpool().map(function (p) { return { l: p.l, w: p.w }; })).map(function (q) { return kk(q) + (q.t || ''); }).sort().join();
    return a === b;
  }
  function iz(q) { var k = kk(q), d = T()[k] || {}; return d.iz || (TRK[k] && TRK[k][1]) || ''; }
  function savol(q) {
    var d = T()[kk(q)] || {};
    if (d.s) return d.s;
    if (q.t === 'h') return 'Белгиланган сўз қайси ҳолатда?';
    if (q.t === 'b') return 'Бўш жойга мосини қўйинг';
    if (q.t === 'x') return 'Гапда битта сўзнинг ҳаракати хато. Ўша сўзни босинг';
    if (q.t === 's') {
      /* holat: so'z ma'lumotidan; olmoshli so'zda (M) yo'q bo'lsa — izohdagi «шунинг учун раф/насб/жар/жазм» dan */
      var hl = HN[qcase(get(kk(q)))], m = !hl && iz(q).match(/(раф|насб|жар|жазм)/);
      return 'Белгиланган сўзни ' + (hl || (m && m[1]) || 'шундай') + ' қилган сўзни гапдан босинг';
    }
    return 'Белгиланган сўз нима учун шундай?';
  }
  function qator(l, tw, cls, tap, alm) {
    var h = '';
    soz(l).forEach(function (w, j) {
      var x = info(w), k = l + '-' + j, i = tap ? tap.indexOf(k) : -1, v = alm && alm[j] != null ? alm[j] : x.v;
      h += '<span data-q="' + k + '"' + (j === tw ? ' class="qt"' : (i >= 0 ? ' class="qw" data-x="' + i + '" onclick="qans(this)"' : '')) + '>' + v + '</span>' + x.pu + ' ';
    });
    return '<div class="qs' + (cls ? ' ' + cls : '') + '">' + h + '</div>';
  }
  function show() {
    var q = QZ[qi], l = q.l, tap = TAP[q.t] ? q.o.map(function (x) { return x.k; }) : null, ctx = '', tg = '', tw = q.w, alm = null;
    if (q.t === 'f' || q.t === 'x') tw = -1;
    if (q.t === 'x') { alm = {}; alm[q.w] = T()[kk(q)].x; }
    if (q.t === 'b') { tw = -1; alm = {}; alm[q.w] = '<span class="qbl" id="qbl">\u00a0</span>'; }
    if (q.t === 's') { var hl = +tap[0].split('-')[0]; if (hl !== l) ctx = qator(hl, -1, 'qc', tap); }
    if (!tap) {
      var uz = Math.max.apply(null, q.o.map(function (x) { return /[\u0400-\u04FF]/.test(x.w) ? x.w.length : 0; }));
      tg = '<div class="qo ' + (uz > 12 ? 'qk1' : (q.o.length % 2 ? '' : 'qk2')) + '">';
      q.o.forEach(function (x, i) {   /* arabcha variant (Бўш жой, «… қўйилса») — dars harfida; kirillcha — oddiy matn */
        var ar = /[\u0600-\u06FF]/.test(x.w) && !/[\u0400-\u04FF]/.test(x.w);
        tg += '<button data-x="' + i + '" onclick="qans(this)"><b' + (ar ? '' : ' class="qtx"') + '>' + x.w + '</b></button>';
      });
      tg += '</div>';
    }
    var tr = TR[l].map(function (t) { return t[0]; }).join(' ');
    var nv = '<div class="qnv"><button onclick="qgo(-1)"' + (qi == 0 ? ' disabled' : '') + '>‹</button><span class="qhd"><span>Савол ' + (qi + 1) + ' / ' + QZ.length + '</span><span>Тўғри: ' + qsc + '</span></span><button onclick="qgo(1)">›</button></div>';
    document.getElementById('p3').innerHTML = '<div class="qbox">' + nv + '<div class="qsv">' + savol(q) + '</div>' +
      ctx + qator(l, tw, '', tap, alm) + '<div class="qtr">' + tr + '</div>' + tg +
      '<div class="qf" id="qf"></div><div class="qb hide" id="qb"><button class="pr" onclick="qgo(1)">' + (qi == QZ.length - 1 ? 'Натижа' : 'Кейинги') + '</button></div></div>';
    if (q.ch != null) fb(q);
  }
  function ans(b) {
    var q = QZ[qi];
    if (q.ch != null) return;
    var i = +b.getAttribute('data-x');
    q.ch = i; q.ok = !!(q.o[i] && q.o[i].ok); if (q.ok) qsc++;
    var s = document.querySelector('.qhd span:last-child'); if (s) s.textContent = 'Тўғри: ' + qsc;
    fb(q);
    if (q.ok) { var me = q; clearTimeout(qtm); qtm = setTimeout(function () { if (QZ[qi] === me && document.getElementById('qf')) qgo(1); }, 1500); }
  }
  function fb(q) {
    var k = kk(q), o = get(k), tj = q.o.filter(function (x) { return x.ok; })[0];
    if (q.t === 'b') { var bl = document.getElementById('qbl'); if (bl) { bl.textContent = tj.w; bl.classList.add('ok'); } }
    document.querySelectorAll(TAP[q.t] ? '.qs .qw' : '.qo button').forEach(function (x) {
      var j = +x.getAttribute('data-x');
      if (q.o[j].ok) { x.classList.add('ok'); if (q.t === 'x') x.innerHTML = o.v; } else if (j == q.ch) x.classList.add('no');
    });
    var h = '<div class="res" style="color:' + (q.ok ? '#16a34a' : '#dc2626') + '">' +
      (q.ok ? 'Тўғри!' : (q.t === 's' || q.t === 'f' ? 'Хато. Тўғриси: <span class="ar">' + tj.w + '</span>' :
        q.t === 'x' ? 'Хато. Хато сўз: <span class="ar">' + tj.w + '</span>' : 'Хато.')) +
      (q.t === 'x' && !q.ok ? '<div>Тўғриси: <span class="ar">' + o.v + '</span></div>' : '') + '</div>';
    var z = iz(q);
    if (z) h += '<div class="qam">' + arw(z) + '</div>';
    h += '<button class="qex" onclick="this.classList.toggle(\'on\');this.nextSibling.classList.toggle(\'hide\')">Изоҳ</button><div class="hide">' + irbRows(k, o, null, true) + '</div>';
    document.getElementById('qf').innerHTML = h;
    document.getElementById('qb').classList.remove('hide');
  }
  window.QTX = { plan: plan, ops: ops, mos: mos, show: show, ans: ans, fb: fb, iz: iz, savol: savol, bq: bq, TUR: TUR };
})();
