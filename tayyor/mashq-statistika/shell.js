/* Yangi qolip: sarlavha, pastki panel, pleyer, animatsiyalar (dars sahifasi uchun) */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var h1 = $('.w > h1'), home = $('a.home'), au = $('audio');
  if (!h1 || !$('.tabs')) return;

  /* --- sarlavha --- */
  var m = h1.textContent.match(/^\s*(\d+)-дарс:\s*(.*)$/) || [0, '', h1.textContent];
  try { if (m[1]) localStorage.setItem('oxirgi-dars', m[1]); } catch (e) {}
  var dh = document.createElement('div');
  dh.className = 'dh';
  dh.innerHTML =
    '<a href="' + (home ? home.getAttribute('href') : './') + '" aria-label="Дарслар"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a>' +
    '<div class="tt">' + (m[1] ? '<small>' + m[1] + '-дарс</small>' : '') + '<b></b></div>' +
    '<button class="q" type="button" aria-label="Ёрдам"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/></svg></button>' +
    '<div class="hpop"></div>';
  $('.tt b', dh).textContent = m[2];
  h1.parentNode.insertBefore(dh, h1);
  var qb = $('.q', dh), hp = $('.hpop', dh), hint = $('#p1 .hint');
  if (hint) hp.appendChild(hint); else qb.style.display = 'none';
  qb.addEventListener('click', function (e) { e.stopPropagation(); hp.classList.toggle('on'); qb.classList.toggle('on'); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.hpop')) { hp.classList.remove('on'); qb.classList.remove('on'); } });

  /* --- pastki panel --- */
  var IC = [
    '<path d="M5 6h14M5 10h14M5 14h10M5 18h7"/>',
    '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12.2l2.4 2.4 4.6-5"/>'
  ];
  var tabs = $('.tabs'), ind = document.createElement('div');
  ind.className = 'ind';
  tabs.insertBefore(ind, tabs.firstChild);
  for (var i = 1; i <= 3; i++) {
    var b = document.getElementById('t' + i);
    if (b) b.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[i - 1] + '</svg>');
  }
  function cur() { for (var i = 1; i <= 3; i++) { var p = document.getElementById('p' + i); if (p && !p.classList.contains('hide')) return i; } return 1; }
  function stagger() {
    if (RM) return;
    var g = document.querySelectorAll('#p2 > *');
    for (var i = 0; i < g.length && i < 14; i++) {
      g[i].style.animation = 'none'; void g[i].offsetWidth;
      g[i].style.animation = 'rise .35s ' + (i * 45) + 'ms both';
    }
  }
  function sync() {
    var n = cur();
    ind.style.transform = 'translateX(' + (n - 1) * 100 + '%)';
    document.body.classList.toggle('nop', n != 1);
    hp.classList.remove('on'); qb.classList.remove('on');
    if (n == 2) stagger();
  }
  if (typeof window.tab === 'function') {
    var _tab = window.tab;
    window.tab = function (n) { _tab(n); sync(); };
  }
  sync();


  /* lug'at: bosib turganda belgilash menyusi chiqmasin */
  (function () {
    var p2 = document.getElementById('p2');
    if (!p2) return;
    ['contextmenu', 'selectstart', 'dragstart'].forEach(function (n) { p2.addEventListener(n, function (e) { if (!(e.target && e.target.tagName === 'INPUT')) e.preventDefault(); }); });
    ['contextmenu', 'selectstart', 'dragstart'].forEach(function (n) { document.addEventListener(n, function (e) { if (!(e.target && /INPUT|TEXTAREA/.test(e.target.tagName))) e.preventDefault(); }); });

    /* lug'atda qidirish: o'zbekcha (kirill yoki lotin) va arabcha (harakatli yoki harakatsiz) */
    if (!p2.querySelector('.g')) return;
    var LAT = [["o'", 'ў'], ["g'", 'ғ'], ['sh', 'ш'], ['ch', 'ч'], ['yo', 'ё'], ['yu', 'ю'], ['ya', 'я'], ['ye', 'е'], ['ts', 'ц']],
        L1 = { a: 'а', b: 'б', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'ҳ', i: 'и', j: 'ж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'қ', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', x: 'х', y: 'й', z: 'з', c: 'с', w: 'в' };
    function arN(t) {
      return t.replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ة/g, 'ه');
    }
    function uzN(t) {
      t = t.toLowerCase().replace(/[ʻʼ’‘`´]/g, "'");
      if (/[a-z]/.test(t)) {
        LAT.forEach(function (p) { t = t.split(p[0]).join(p[1]); });
        t = t.replace(/[a-z]/g, function (c) { return L1[c] || c; }).replace(/'/g, 'ъ');
      }
      return t.replace(/э/g, 'е').replace(/ё/g, 'е');
    }
    function norm(t) { return uzN(arN(t)).replace(/\s+/g, ' '); }
    var box = document.createElement('div');
    box.className = 'lq';
    box.innerHTML = '<div class="lqb"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<input type="text" enterkeyhint="search" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Қидириш: ўзбекча ёки арабча"><button class="lqx" type="button" aria-label="Тозалаш">×</button></div><div class="lqn"></div>';
    p2.insertBefore(box, p2.firstChild);
    var inp = box.querySelector('input'), cnt = box.querySelector('.lqn'), G = null, tq = null;
    function idx() {
      G = [].map.call(p2.querySelectorAll('.g'), function (g) {
        return { g: g, t: norm(g.textContent), ex: [].map.call(g.querySelectorAll('.eb'), function (e) { return { e: e, t: norm(e.textContent) }; }) };
      });
    }
    function run() {
      if (!G) idx();
      var q = norm(inp.value.trim()), n = 0;
      box.classList.toggle('on', !!inp.value);
      G.forEach(function (x) {
        var hit = !q || x.t.indexOf(q) > -1;
        x.g.classList.toggle('lqh', !hit);
        if (hit) n++;
        x.ex.forEach(function (e) { e.e.classList.toggle('lqm', !!q && e.t.indexOf(q) > -1); });
      });
      cnt.textContent = q ? (n ? n + ' та топилди' : 'Ҳеч нарса топилмади') : '';
    }
    inp.addEventListener('input', function () { clearTimeout(tq); tq = setTimeout(run, 120); });
    box.querySelector('.lqx').addEventListener('click', function () { inp.value = ''; run(); inp.focus(); });
  })();
  /* --- pleyer --- */
  if (!au) return;
  var box = au.parentNode; box.style.display = 'none';
  var pb = document.createElement('div');
  pb.className = 'pbar';
  pb.innerHTML =
    '<button class="pb" type="button" aria-label="Ўқиш / тўхтатиш"><i class="i1"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l12 8-12 8z" fill="currentColor"/></svg></i><i class="i2"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg></i></button>' +
    '<div class="md"><div class="pq1"><div class="lb">Матнни тинглаш</div><span class="pqt">0:00</span></div>' +
    '<div class="pq2"><button class="pqs" type="button" data-d="-1" aria-label="Олдинги гап"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z" fill="currentColor"/></svg></button>' +
    '<div class="pqk"><div class="pqr"><i></i></div><b></b></div><span class="pqn"></span>' +
    '<button class="pqs" type="button" data-d="1" aria-label="Кейинги гап"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z" fill="currentColor"/></svg></button></div></div>' +
    (window.UZT ? '<button class="uzb" type="button" aria-label="Ўзбекча таржима">ЎЗ</button><button class="esh" type="button" aria-label="Эшитиш бўлимида очиш"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/></svg></button>' : '') +
    '<button class="sp" type="button" aria-label="Тезлик">1×</button>';
  document.body.appendChild(pb);
  /* 06.11.2026: ▶ — ⏮ va ⏭ o'rtasida; gap raqami tepada vaqt yonida */
  (function () { var q2 = pb.querySelector('.pq2'), nx = q2.querySelectorAll('.pqs')[1]; q2.insertBefore(pb.querySelector('.pb'), nx);
    var q1 = pb.querySelector('.pq1'); q1.insertBefore(pb.querySelector('.pqn'), q1.querySelector('.pqt')); pb.classList.add('mid'); })();
  var lb = $('.lb', pb), bar = $('.pqk i', pb), sp = $('.sp', pb), lastLn = null;
  $('.pb', pb).addEventListener('click', function () { if (typeof ppl === 'function') ppl(); });
  var tk = $('.pqk', pb), th = $('.pqk b', pb), tm = $('.pqt', pb), drag = false, dragP = 0;
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2); }
  function setP(p) { p = Math.max(0, Math.min(1, p)) * 100; bar.style.width = p + '%'; th.style.left = p + '%'; }
  function draw() {
    var d = au.duration;
    if (!d || !isFinite(d)) { tm.textContent = fmt(au.currentTime); return; }
    var t = drag ? dragP * d : au.currentTime;
    if (!drag) setP(t / d);
    tm.textContent = fmt(t) + ' / ' + fmt(d);
  }
  function pos(e) { var r = tk.getBoundingClientRect(); return (e.clientX - r.left) / r.width; }
  tk.addEventListener('pointerdown', function (e) {
    if (!au.duration) return;
    drag = true; dragP = Math.max(0, Math.min(1, pos(e)));
    tk.classList.add('dr'); setP(dragP); draw();
    try { tk.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault();
  });
  tk.addEventListener('pointermove', function (e) {
    if (!drag) return;
    dragP = Math.max(0, Math.min(1, pos(e))); setP(dragP); draw();
  });
  function endDrag() {
    if (!drag) return;
    drag = false; tk.classList.remove('dr');
    if (au.duration) au.currentTime = dragP * au.duration;
    draw();
  }
  tk.addEventListener('pointerup', endDrag);
  tk.addEventListener('pointercancel', endDrag);
  [].forEach.call(pb.querySelectorAll('.pqs'), function (b) {
    b.addEventListener('click', function () {
      if (!au.duration) return;
      var d = parseFloat(b.getAttribute('data-d')), t = au.currentTime, st = [];
      /* oldingi / keyingi gap (05.11.2026): gap boshlari TM dan; gap boshidan 1.2 s o'tgan bo'lsa ◀ shu gap boshiga */
      if (typeof TM !== 'undefined' && TM.length) {
        var seen = {}; TM.forEach(function (w) { if (!(w[0] in seen) || w[2] < seen[w[0]]) seen[w[0]] = w[2]; });
        for (var k in seen) st.push(seen[k]); st.sort(function (x, y) { return x - y; });
        var i = -1; st.forEach(function (x, j) { if (x <= t + 0.05) i = j; });
        var to = d > 0 ? st[i + 1] : (i >= 0 && t - st[i] > 1.2 ? st[i] : st[Math.max(0, i - 1)]);
        if (to == null) to = d > 0 ? au.duration - 0.1 : 0;
        if (typeof setLoop === 'function') setLoop(-1);
        au.currentTime = Math.max(0, to - 0.05);
      } else au.currentTime = Math.max(0, Math.min(au.duration - 0.1, t + d * 5));
      draw();
      if (!RM) { b.classList.add('pop'); setTimeout(function () { b.classList.remove('pop'); }, 170); }
    });
  });
  /* qulf ekrani va bildirishnomadagi pleyer (08.11.2026, Media Session): dars nomi, ▶/⏸, ⏮/⏭ — gapma-gap, surish */
  if ('mediaSession' in navigator) try {
    var MS = navigator.mediaSession, msQ = pb.querySelectorAll('.pqs');
    var msTitle = ((m[1] ? m[1] + '-дарс: ' : '') + (m[2] || '')).replace(/\s+/g, ' ').trim() || document.title;
    var msMeta = function () { try { MS.metadata = new MediaMetadata({ title: msTitle, artist: 'Араб тили', album: 'نُورُ الطَّالِبِ', artwork: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }] }); } catch (e) {} };
    var msPos = function () { try { if (au.duration && isFinite(au.duration)) MS.setPositionState({ duration: au.duration, playbackRate: au.playbackRate || 1, position: Math.max(0, Math.min(au.currentTime, au.duration)) }); } catch (e) {} };
    var msAct = function (k, f) { try { MS.setActionHandler(k, f); } catch (e) {} };
    msAct('play', function () { au.play().catch(function () {}); });
    msAct('pause', function () { au.pause(); });
    msAct('previoustrack', function () { if (msQ[0]) msQ[0].click(); });
    msAct('nexttrack', function () { if (msQ[1]) msQ[1].click(); });
    msAct('seekto', function (d) { if (d && d.seekTime != null) { au.currentTime = d.seekTime; draw(); msPos(); } });
    msAct('seekbackward', null); msAct('seekforward', null);
    ['play', 'pause', 'ended'].forEach(function (ev) { au.addEventListener(ev, function () { if (ev === 'play') msMeta(); MS.playbackState = au.paused ? 'paused' : 'playing'; msPos(); }); });
    ['loadedmetadata', 'seeked', 'ratechange'].forEach(function (ev) { au.addEventListener(ev, msPos); });
    msMeta();
  } catch (e) {}
  (function loop() { if (!au.paused) draw(); requestAnimationFrame(loop); })();
  function state() { pb.classList.toggle('on', !au.paused && !au.ended); }
  function label() {
    var w = $('#tx .ws span.pl'), ln = w ? w.closest('.ln') : null;
    if (ln !== lastLn) {
      if (lastLn) lastLn.classList.remove('cur');
      if (ln) ln.classList.add('cur');
      lastLn = ln;
      var t = '';
      if (ln) {
        var all = document.querySelectorAll('#tx .ln'), k = [].indexOf.call(all, ln);
        try { t = TR[k].map(function (x) { return x[0]; }).join(' '); } catch (e) {}
      }
      lb.textContent = t || 'Матнни тинглаш';
    }
    draw();
  }
  ['play', 'pause', 'ended'].forEach(function (ev) { au.addEventListener(ev, function () { state(); label(); }); });
  au.addEventListener('timeupdate', label);
  au.addEventListener('loadedmetadata', label);
  /* o'qilayotgan gap ekran tepasida ushlab turiladi (05.11.2026: teparoq) */
  if (typeof window.follow === 'function') {
    var fA = null;
    window.follow = function (e) {
      if (!e) return;
      var ln = e.closest('.ln') || e, r = ln.getBoundingClientRect(), wr = e.getBoundingClientRect();
      var bar = document.querySelector('.tabs'), top = bar ? bar.getBoundingClientRect().bottom + 8 : 70;
      [].forEach.call(document.querySelectorAll('.lq,.lgd.lgo'), function (x) { var q = x.getBoundingClientRect(); if (q.height && q.top <= top + 16 && q.bottom > top - 8) top = q.bottom + 8; }); /* ranglar qatori tepada tursa — uning ostiga (11.11.2026: legenda tabdan sal pastda turadi — +16, aks holda gap uning ostida qolardi) */
      var tgb = document.querySelector('.tgbar'), bot = (tgb && tgb.offsetParent ? tgb : pb).getBoundingClientRect().top - 10; if (bot < top + 120) bot = window.innerHeight - 10;
      var av = bot - top;
      var tall = r.height > av * 0.6, a1 = tall ? e.closest('.r1') : null, ar = a1 ? a1.getBoundingClientRect() : null, ref = !tall ? r : (ar && (ar.height <= av * 0.6 || wr.bottom - ar.top <= av * 0.8) ? ar : wr); /* Таркибда гап баланд — арабча матн қисми тепага, қути ости кўринади */
      if (ref.top >= top - 2 && ref.top <= top + av * 0.1 && (ref.bottom <= bot || wr.bottom <= bot)) return; /* o'qilayotgan gap ekran tepasida turadi */
      var sc = document.scrollingElement || document.documentElement;
      var from = sc.scrollTop, to = Math.max(0, Math.min(sc.scrollHeight - window.innerHeight, from + ref.top - top - 4)), t0 = 0;
      if (Math.abs(to - from) < 4) return;
      if (fA) cancelAnimationFrame(fA);
      function st(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 380), q = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; window.scrollTo(0, from + (to - from) * q); fA = p < 1 ? requestAnimationFrame(st) : null; }
      fA = requestAnimationFrame(st);
    };
  }
  /* abzasning bo'sh joyi bosilsa — o'sha gap boshidan o'qiladi (11.11.2026, foydalanuvchi) */
  (function () {
    var tx = document.getElementById('tx');
    if (!tx || typeof TM === 'undefined') return;
    tx.addEventListener('click', function (e) {
      if (e.target.closest('.ws span,.ts,[data-i],button,a,input,select,textarea,label,.sheet,.zo')) return;
      var ln = e.target.closest('.ln'); if (!ln) return;
      var sel = window.getSelection && String(window.getSelection()); if (sel) return;
      var li = [].indexOf.call(document.querySelectorAll('.ln'), ln), st = null;
      TM.forEach(function (w) { if (w[0] === li && (st === null || w[2] < st)) st = w[2]; });
      if (st === null) return;
      if (typeof setLoop === 'function') setLoop(-1);
      if ('stopAt' in window) window.stopAt = null;
      var go = function () { au.currentTime = Math.max(0, st - 0.05); };
      if (au.readyState >= 1) go(); else au.addEventListener('loadedmetadata', function f() { au.removeEventListener('loadedmetadata', f); go(); });
      if (au.paused) { var p = au.play(); if (p && p.catch) p.catch(function () {}); }
    });
  })();
  /* oxiriga yetganda boshiga qaytadi; oxirida turib ▶ bosilsa boshidan o'qiydi */
  au.addEventListener('ended', function () { setTimeout(function () { try { au.currentTime = 0; } catch (e) {} draw(); label(); }, 60); });
  au.addEventListener('play', function () { if (au.duration && au.currentTime >= au.duration - 0.3) { try { au.currentTime = 0; } catch (e) {} } });
  au.addEventListener('seeked', draw);
  au.addEventListener('durationchange', draw);
  /* tezlik (05.11.2026): 1× → 1.25× → 1.5× → 0.5× → 0.75× → 1×; barcha darslarda eslab qolinadi */
  var RT = [1, 1.25, 1.5, 0.5, 0.75], SR = 1;
  function rate() { return au.playbackRate || 1; }
  function setRate(r) {
    au.playbackRate = r; au.preservesPitch = true; au.webkitPreservesPitch = true;
    [].forEach.call(document.querySelectorAll('.spd button'), function (b) { b.classList.toggle('on', parseFloat(b.textContent) === r); });
    SR = r; try { localStorage.setItem('dars-tezlik', r); } catch (e) {}
  }
  function showRate() { sp.textContent = String(rate()) + '×'; }
  /* bosib turilsa — tezliklar ro'yxati chiqadi (05.11.2026) */
  var spm = document.createElement('div'), lpT = null, lpDone = false;
  spm.className = 'spm';
  spm.innerHTML = [0.5, 0.75, 1, 1.25, 1.5].map(function (r) { return '<button type="button" data-r="' + r + '">' + r + '×</button>'; }).join('');
  pb.appendChild(spm);
  function spmShow(on) { spm.classList.toggle('on', on); if (on) [].forEach.call(spm.children, function (b) { b.classList.toggle('on', +b.getAttribute('data-r') === rate()); }); }
  spm.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; e.stopPropagation(); setRate(+b.getAttribute('data-r')); showRate(); spmShow(false); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.spm') && !e.target.closest('.pbar .sp')) spmShow(false); });
  sp.addEventListener('pointerdown', function () { lpDone = false; clearTimeout(lpT); lpT = setTimeout(function () { lpDone = true; spmShow(true); try { navigator.vibrate && navigator.vibrate(15); } catch (e) {} }, 450); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { sp.addEventListener(ev, function () { clearTimeout(lpT); }); });
  sp.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  sp.addEventListener('click', function () {
    if (lpDone) { lpDone = false; return; }
    if (spm.classList.contains('on')) { spmShow(false); return; }
    var i = RT.indexOf(rate());
    setRate(RT[(i + 1) % RT.length]);
    showRate();
    if (!RM) { sp.classList.add('pop'); setTimeout(function () { sp.classList.remove('pop'); }, 170); }
  });
  try { SR = parseFloat(localStorage.getItem('dars-tezlik')) || 1; } catch (e) {} if (RT.indexOf(SR) < 0) SR = 1;
  setRate(SR); au.addEventListener('loadedmetadata', function () { setRate(SR); showRate(); });

  /* o'zbekcha tarjima (05.11.2026, sinov: 95-dars). «ЎЗ» yoqilsa pleyer Eshitishdagi yaxlit faylni (arabcha gap + o'zbekcha tarjima)
     o'ynaydi — bitta fayl, ekran o'chsa ham uzilmaydi. TM vaqtlari gap siljishi (o) bo'yicha shu faylga ko'chiriladi.
     Ma'lumot sahifada: window.UZT = {f: 'lNN-....mp3', o: {qator: siljish_soniya}} */
  if (window.UZT && typeof TM !== 'undefined') (function () {
    var ub = $('.uzb', pb), on = false, ORIG = au.getAttribute('src'), cur = 'a', LN = [], K = 'dars' + m[1] + '-holat';
    try { on = localStorage.getItem('dars-uz') === '1'; } catch (e) {}
    var T0 = TM.map(function (w) { return w.slice(); }), BY = {};
    T0.forEach(function (w) { var q = BY[w[0]] || (BY[w[0]] = { l: w[0], a: 1e9, b: 0 }); q.a = Math.min(q.a, w[2]); q.b = Math.max(q.b, w[4] != null ? w[4] : w[3]); });
    Object.keys(BY).forEach(function (k) { if (UZT.o[k] != null) LN.push(BY[k]); });
    LN.sort(function (x, y) { return x.a - y.a; });
    function toL(t) { var q = null; LN.forEach(function (x) { if (x.a - 0.4 <= t) q = x; }); return q ? Math.max(0, t + UZT.o[q.l]) : 0; }
    function toA(t) { var q = null; LN.forEach(function (x) { if (x.a + UZT.o[x.l] - 0.4 <= t) q = x; }); if (!q) return 0; var o = UZT.o[q.l]; return t - o <= q.b ? t - o : q.b + 0.2; }
    var HO = window.HDR && UZT.h ? { e: HDR.e, t: HDR.rows.map(function (r) { return r.t; }) } : null;
    function setTM(f) {
      /* 06.11.2026: sarlavha (bob, dars raqami) vaqtlari ham ЎЗ faylinikiga almashadi */
      if (HO) { HDR.rows.forEach(function (r, i) { r.t = f && UZT.h[i] ? UZT.h[i] : HO.t[i]; }); HDR.e = f ? UZT.h[UZT.h.length - 1][1] : HO.e; }
      TM.forEach(function (w, i) {
      /* 06.11.2026: Eshitish faylida yo'q qator (masalan 0 — sarlavha) ЎЗ rejimida belgilanmaydi — aks holda bosh qism o'qilayotganda u yonib qoladi */
      var has = UZT.o[w[0]] != null, o = f ? (has ? UZT.o[w[0]] : 1e6) : 0;
      for (var j = 2; j < w.length; j++) if (T0[i][j] != null) w[j] = T0[i][j] + o; }); }
    function swap(to, keepPlay) {
      if (to === cur) return;
      var t = au.currentTime || 0, go = keepPlay && !au.paused, nt = to === 'l' ? toL(t) : toA(t);
      if (typeof setLoop === 'function') setLoop(-1);
      try { if (typeof stopAt !== 'undefined') stopAt = null; } catch (e) {}
      cur = to; setTM(to === 'l'); au.pause(); au.src = to === 'l' ? UZT.f : ORIG; au.load();
      au.addEventListener('loadedmetadata', function () { try { if (typeof progSeek !== 'undefined') progSeek = true; au.currentTime = nt; } catch (e) {} setRate(SR); if (go) { var p = au.play(); if (p && p.catch) p.catch(function () {}); } }, { once: true });
    }
    /* joyni eslab qolish: sahifa yozgan vaqt doim asl dars audiosi vaqtida saqlansin */
    function fixAt() { if (cur !== 'l') return; try { var S = JSON.parse(localStorage.getItem(K) || '{}') || {}; S.at = Math.round(toA(au.currentTime) * 10) / 10; localStorage.setItem(K, JSON.stringify(S)); } catch (e) {} }
    ['timeupdate', 'pause'].forEach(function (ev) { au.addEventListener(ev, fixAt); });
    window.addEventListener('pagehide', fixAt);
    document.addEventListener('visibilitychange', function () { if (document.hidden) fixAt(); });
    function paint() { ub.classList.toggle('on', on); ub.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    ub.addEventListener('click', function () {
      on = !on; try { localStorage.setItem('dars-uz', on ? '1' : '0'); } catch (e) {}
      swap(on ? 'l' : 'a', true); paint();
      if (!RM) { ub.classList.add('pop'); setTimeout(function () { ub.classList.remove('pop'); }, 170); }
    });
    if (on) { if (au.readyState >= 1) setTimeout(function () { swap('l', false); }, 0); else au.addEventListener('loadedmetadata', function () { setTimeout(function () { swap('l', false); }, 0); }, { once: true }); }
    paint();
    /* 07.11.2026: ЎЗ rejimida o'zbekcha tarjima o'qilayotganda unga mos arabcha so'zlar yonadi (arabcha o'qilganda o'zbekcha yonganidek).
       UZT.w = {qator: [[o'zbekcha so'z boshlari (ЎЗ fayli vaqtida)], oxiri]}; so'z -> uning .ts bo'lagi -> data-w dagi arabcha so'zlar */
    if (UZT.w) (function () {
      var lnK = -1, wK = -2, LW = Object.keys(UZT.w).map(function (k) { return [+k, UZT.w[k][0], UZT.w[k][1]]; });
      function wrap(ln) {
        if (ln.querySelector('.uw')) return; var d = 0;
        [].forEach.call(ln.querySelectorAll('.tr'), function (tr) {
          var tw = document.createTreeWalker(tr, NodeFilter.SHOW_TEXT), ns = [], n; while ((n = tw.nextNode())) ns.push(n);
          ns.forEach(function (n) {
            var fr = document.createDocumentFragment();
            n.nodeValue.split(/(\s+)/).forEach(function (w) {
              if (!w) return; if (/^\s+$/.test(w) || d || w.charAt(0) === '(') { if (!/^\s+$/.test(w)) d = w.indexOf(')') < 0; fr.appendChild(document.createTextNode(w)); return; }
              var sp = document.createElement('span'); sp.className = 'uw'; sp.textContent = w; fr.appendChild(sp);
            });
            n.parentNode.replaceChild(fr, n);
          });
        });
      }
      function clr() { [].forEach.call(document.querySelectorAll('#tx .pu'), function (e) { e.classList.remove('pu'); }); }
      (function lp() {
        if (cur === 'l') {
          var t = au.currentTime, q = null;
          LW.forEach(function (x) { if (t >= x[1][0] - 0.1 && t <= x[2] + 0.4) q = x; });
          var ln = q && document.querySelectorAll('#tx .ln')[q[0]], k = -1;
          if (ln) { wrap(ln); q[1].forEach(function (s, j) { if (t >= s - 0.06) k = j; }); }
          var key = q ? q[0] + ':' + k : '';
          if (key !== wK) {
            wK = key; clr();
            var u = ln && k >= 0 ? ln.querySelectorAll('.uw')[k] : null, ts = u && u.closest('.ts');
            if (ts) {
              ts.classList.add('pu');
              (ts.getAttribute('data-w') || '').split(',').forEach(function (j) { var e = ln.querySelector('.ws span[data-i="' + q[0] + '-' + j + '"]'); if (e) e.classList.add('pu'); });
            }
          }
        } else if (wK !== -2) { wK = -2; clr(); }
        requestAnimationFrame(lp);
      })();
    })();
    window.UZT0 = T0;
    window.UZA = function () { return cur === 'l' ? toA(au.currentTime) : au.currentTime; };
  })();

  /* 🎧 — Eshitish bo'limida shu darsni o'qilayotgan gapdan ochish */
  if (window.UZT) (function () {
    var hb = $('.esh', pb);
    hb.addEventListener('click', function () {
      var t = window.UZA ? window.UZA() : au.currentTime, l = '';
      (window.UZT0 || TM).forEach(function (w) { if (w[2] <= t + 0.3) l = w[0]; });
      au.pause();
      location.href = (/sinov-/.test(location.pathname) ? 'sinov-tinglash.html' : 'tinglash.html') + '?d=' + m[1] + '&t=l' + (l !== '' && t > 0.5 ? '&s=' + l : '');
    });
  })();
  /* surgich o'rniga gap raqami (06.11.2026): «3 / 7 гап» */
  (function () {
    var pn = $('.pqn', pb), N = [], last = '';
    if (typeof TM !== 'undefined') { var seen = {}; TM.forEach(function (w) { if (w[0] > 0 && !seen[w[0]]) { seen[w[0]] = 1; N.push(w[0]); } }); }
    function cur() {
      if (!N.length) return '';
      var T0 = window.UZT0 || TM, t = window.UZA ? window.UZA() : au.currentTime, l = 0;
      T0.forEach(function (w) { if (w[2] <= t + 0.05) l = w[0]; });
      var k = N.indexOf(l) + 1; return (k > 0 ? k : 0) + ' / ' + N.length + ' гап';
    }
    setInterval(function () { var x = cur(); if (x !== last) { last = x; pn.textContent = x; } }, 300);
  })();
  showRate(); state(); label();
  setTimeout(showRate, 600);

  /* --- test natijasi: sanab chiqish va yulduzchalar --- */
  var p3 = document.getElementById('p3');
  if (p3 && window.MutationObserver) {
    new MutationObserver(function () {
      var el = $('.qsc', p3);
      if (!el || el.getAttribute('data-a')) return;
      var mm = el.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if (!mm) return;
      el.setAttribute('data-a', '1');
      var a = +mm[1], n = +mm[2];
      if (RM || !a) return;
      var t0 = 0, dur = Math.min(1400, 350 + a * 45);
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), v = Math.round(a * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + ' / ' + n;
        if (p < 1) requestAnimationFrame(step); else if (a / n >= 0.8) stars(el);
      }
      el.textContent = '0 / ' + n;
      requestAnimationFrame(step);
    }).observe(p3, { childList: true });
  }
  function stars(el) {
    if (!el.animate) return;
    for (var i = 0; i < 10; i++) {
      var s = document.createElement('span');
      s.className = 'qstar';
      s.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z" fill="' + (i % 3 ? '#facc15' : '#f97316') + '"/></svg>';
      el.appendChild(s);
      var ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.5, d = 70 + Math.random() * 50;
      s.animate([
        { transform: 'translate(0,0) scale(.3)', opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { transform: 'translate(' + Math.cos(ang) * d + 'px,' + Math.sin(ang) * d + 'px) scale(1) rotate(' + (Math.random() * 300 - 150) + 'deg)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      (function (s) { setTimeout(function () { s.remove(); }, 1600); })(s);
    }
  }
})();

/* --- Биринчи очилиш: интерактив тур + Ҳаракат/Таржима/Таркиб ни эслаб қолиш --- */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var bt = { h: $('#tg'), t: $('#tt'), b: $('#bl') };
  if (!bt.h || !bt.t || !bt.b || !$('.tabs')) return;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PK = 'fe-pref', TK = 'fe-tour';
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function on(b) { return b.classList.contains('on') ? 1 : 0; }

  /* 1) Сукут бўйича ҳаммаси ўчиқ; фойдаланувчи ўзгартирса, барча дарсларда шу эсда туради */
  var pref = null;
  try { pref = JSON.parse(lsGet(PK) || 'null'); } catch (e) {}
  if (!pref) pref = { h: 0, t: 0, b: 0 };
  pref.b = 0; /* Таркиб ҳар доим ўчиқ очилади, эслаб қолинмайди */
  ['h', 't', 'b'].forEach(function (k) { if (on(bt[k]) !== (pref[k] ? 1 : 0)) bt[k].click(); });
  ['h', 't', 'b'].forEach(function (k) {
    bt[k].addEventListener('click', function (e) {
      if (!e.isTrusted) return;
      lsSet(PK, JSON.stringify({ h: on(bt.h), t: on(bt.t), b: on(bt.b) }));
    });
  });

  /* 2) Тур */
  var STEPS = [
    ['#tg', 'Ҳаракат', 'Босинг — ҳарфлардаги ҳаракатлар (фатҳа, замма, касра) ёқилади ёки ўчади.'],
    ['#tt', 'Таржима', 'Ҳар гапнинг ўзбекча таржимасини кўрсатади ёки яширади.'],
    ['#bl', 'Таркиб', 'Сўзлар ранги ва гап тузилишини кўрсатади.'],
    ['.pbar', 'Овоз', 'Дарсни тинглаш: ▶ тугмаси билан бошланади ва тўхтайди; чизиқ орқали жойини суриш мумкин.'],
    ['.dh .q', 'Йўриқнома', 'Тугмалар, қўл ҳаракатлари ва Таркиб белгилари шу ерда. Бу турни ҳам шу ердан қайта очасиз.']
  ];
  var ov = null, sp, cd, si = 0;

  function target(i) {
    var el = $(STEPS[i][0]);
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return (r.width && r.height) ? el : null;
  }
  function place() {
    if (!ov) return;
    var el = target(si);
    if (!el) { go(1); return; }
    var r = el.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight, pd = 6;
    sp.style.left = (r.left - pd) + 'px'; sp.style.top = (r.top - pd) + 'px';
    sp.style.width = (r.width + pd * 2) + 'px'; sp.style.height = (r.height + pd * 2) + 'px';
    var cw = cd.offsetWidth, ch = cd.offsetHeight;
    var x = Math.min(Math.max(16, r.left + r.width / 2 - cw / 2), vw - cw - 16);
    var y = (r.bottom + pd + 12 + ch < vh) ? r.bottom + pd + 12 : Math.max(12, r.top - pd - 12 - ch);
    cd.style.left = x + 'px'; cd.style.top = y + 'px';
  }
  function show() {
    var s = STEPS[si], last = true, j;
    for (j = si + 1; j < STEPS.length; j++) if (target(j)) { last = false; break; }
    var vis = [], pos = 0;
    STEPS.forEach(function (x, k) { if (target(k)) { vis.push(k); if (k <= si) pos = vis.length; } });
    $('.tn', cd).textContent = pos + ' / ' + vis.length;
    $('.th', cd).textContent = s[1];
    $('.tp', cd).textContent = s[2];
    $('.tnx', cd).textContent = last ? 'Тайёр' : 'Кейинги';
    var el = target(si);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    place();
  }
  function go(d) {
    var n = si + d;
    while (n >= 0 && n < STEPS.length && !target(n)) n += d;
    if (n < 0) return;
    if (n >= STEPS.length) { close(); return; }
    si = n; show();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function close() {
    if (!ov) return;
    ov.remove(); ov = null;
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', place);
    lsSet(TK, '1');
  }
  function open() {
    if (ov) return;
    if (typeof window.tab === 'function') window.tab(1);
    var hp = $('.hpop'), q = $('.dh .q');
    if (hp) hp.classList.remove('on');
    if (q) q.classList.remove('on');
    ov = document.createElement('div');
    ov.className = 'tour';
    ov.innerHTML = '<div class="tsp"></div><div class="tcd" role="dialog"><div class="tn"></div><b class="th"></b><p class="tp"></p>' +
      '<div class="tb"><button type="button" class="tsk">Ўтказиб юбориш</button><button type="button" class="tnx"></button></div></div>';
    document.body.appendChild(ov);
    sp = $('.tsp', ov); cd = $('.tcd', ov);
    $('.tsk', ov).addEventListener('click', close);
    $('.tnx', ov).addEventListener('click', function () { go(1); });
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    si = -1; go(1);
  }

  /* «?» ичидан қайта очиш */
  var hp0 = $('.hpop');
  if (hp0) {
    var rb = document.createElement('button');
    rb.type = 'button'; rb.className = 'tourbtn'; rb.textContent = '🧭 Турни қайта кўриш';
    rb.addEventListener('click', function (e) { e.stopPropagation(); open(); });
    hp0.appendChild(rb);
  }
  if (!lsGet(TK)) setTimeout(open, 700);
})();

/* --- Ҳаракат/Таржима/Таркиб пастда, плеер устида --- */
(function () {
  var tg = document.getElementById('tg');
  if (!tg || !tg.parentNode) return;
  var row = tg.parentNode;
  row.classList.add('tgbar');
  document.body.classList.add('lo2');
  var tb = document.querySelector('.tabs'), w = document.querySelector('.w');
  if (tb && w && w.firstChild !== tb) w.insertBefore(tb, w.firstChild);
  var pb = document.querySelector('.pbar');
  function fit() {
    var h = pb && pb.offsetHeight ? pb.offsetHeight + 8 : 0;
    document.documentElement.style.setProperty('--pbh', h + 'px');
  }
  fit();
  window.addEventListener('resize', fit);
  if (pb && window.ResizeObserver) new ResizeObserver(fit).observe(pb);
})();


/* --- Белгиланган сўздан «Play»: сўз (ёки таржима бўлаги) босилгач, Play ўша сўздан бошланади --- */
(function () {
  if (typeof window.ppl != 'function' || typeof window.hl != 'function') return;
  var pick = null, oh = window.hl, op = window.ppl;
  window.hl = function (l, ws) {
    var r = oh.apply(this, arguments);
    pick = ws && ws.length ? [l, Math.min.apply(null, ws)] : null;
    return r;
  };
  window.ppl = function () {
    var p = pick; pick = null;
    if (p && window.au && au.paused && window.TM) {
      for (var k = 0; k < TM.length; k++) if (TM[k][0] == p[0] && TM[k][1] == p[1]) {
        if (window.loopL >= 0 && typeof setLoop == 'function') setLoop(-1);
        progSeek = true; stopAt = null; au.currentTime = Math.max(0, TM[k][2] - 0.05);
        break;
      }
    }
    return op.apply(this, arguments);
  };
  if (window.au) au.addEventListener('play', function () { pick = null });
})();

/* --- Ранглар изоҳи (легенда): одатда ёпиқ, 🎨 тугмаси билан очилади; ҳолати шу браузерда сақланади --- */
(function () {
  var lg = document.getElementById('lg');
  if (!lg || !lg.parentNode) return;
  var K = 'lgo';
  function get() { try { return localStorage.getItem(K) == '1'; } catch (e) { return false; } }
  function put(v) { try { localStorage.setItem(K, v ? '1' : '0'); } catch (e) {} }
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'lgb';
  lg.parentNode.insertBefore(b, lg);
  function draw() {
    var o = lg.classList.contains('lgo');
    b.textContent = o ? '🎨 Ранглар ▴' : '🎨 Ранглар ▾';
    b.classList.toggle('op', o);
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
    b.classList.toggle('on', lg.classList.contains('on'));
  }
  if (get()) lg.classList.add('lgo');
  b.addEventListener('click', function () {
    var o = !lg.classList.contains('lgo');
    lg.classList.toggle('lgo', o); put(o); draw();
  });
  if (window.MutationObserver) new MutationObserver(draw).observe(lg, { attributes: true, attributeFilter: ['class'] });
  draw();
})();


/* --- «?» — умумий фойдаланиш йўриқномаси: ҳар нарса алоҳида қатор --- */
(function () {
  var hp = document.querySelector('.dh .hpop'), qb = document.querySelector('.dh .q');
  if (!hp) return;
  var old = hp.querySelector('.hint'); if (old) old.remove();
  if (qb) qb.style.display = '';
  function row(k, t) { return '<li><span class="gk">' + k + '</span><span class="gt">' + t + '</span></li>'; }
  var tk = !!window.TKG;
  var h = '<div class="guide"><b class="gh">Тугмалар</b><ul>' +
    row('<i class="gb">Ҳаракат</i>', 'ҳарфлардаги ҳаракатлар ёқилади ёки ўчади') +
    row('<i class="gb">Таржима</i>', 'ҳар гапнинг ўзбекча таржимаси') +
    row('<i class="gb">Таркиб</i>', 'сўзлар ранги ва гап тузилиши') +
    (document.getElementById('lg') ? row('<i class="gb">🎨 Ранглар</i>', 'қайси ранг нимани билдиради (Таркиб ёқилганда)') : '') +
    '</ul><b class="gh">Матн билан</b><ul>' +
    row('👆', 'сўзни босинг — ▶ шу сўздан бошланади') +
    row('✋', 'босиб туринг — сўз изоҳи') +
    row('↔️', 'суринг — шу ердан давом') +
    row('🤏', 'икки бармоқ — ҳарф катта-кичик') +
    '</ul>' + (tk ? '<b class="gh">Таркиб белгилари</b><ul>' +
    row('<i class="ga">→</i>', 'стрелка боғланган сўзга қарайди (мутааллиқ)') +
    row('<i class="gc"></i>', 'чети чизиқли карта — шибҳи жумла') +
    row('<i class="gd">كَائِنٌ</i>', 'пунктир рамка — яширин (маҳзуф) сўз, айтилмайди') +
    row('<i class="gu" style="text-decoration:none;border-bottom:2px solid var(--cm);border-radius:0 0 8px 8px;padding-bottom:3px">فَرْضُ الْوُضُوءِ</i>', 'изофа — музоф рангидаги ёй; музофун илайҳ рангсиз') +
    row('<i class="gd" style="border:0"><span style="color:var(--cf)">أَنْزَلْ</span><span style="color:var(--co)">نَا</span><span style="color:var(--cb)">هُ</span></i>', 'қўшилган замир — ўз вазифаси рангида') +
    row('<i class="gs">исмийя</i>', 'гап тури: исмийя ёки феълийя') +
    '</ul>' : '') + '<a href="yoriqnoma.html" style="display:block;margin-top:10px;font-weight:700;color:var(--ac);text-decoration:none">📖 Тўлиқ йўриқнома →</a></div>';
  hp.insertAdjacentHTML('afterbegin', h);
})();

/* --- Таркиб ва Ҳаракат ҳар доим ЁПИҚ очилади (31.10.2026, фойдаланувчи қарори); керак бўлса тугма билан ёқилади.
       13.11.2026: «Созламалар» → «Ҳаракатлар» ёқилган бўлса (sozlama.harakat), дарс ҳаракат билан очилади (сукут — ўчиқ, ўзгармади) --- */
(function () {
  var har = false;
  try { har = JSON.parse(localStorage.getItem('sozlama') || '{}').harakat === true; } catch (e) {}
  if (typeof window.bol == 'function' && document.getElementById('bl') && window.bolak) window.bol();
  if (typeof window.tog == 'function' && document.getElementById('tg') && !!window.show !== har) window.tog();
})();

/* Siljitgich (06.11.2026): o'ng chetda ushlab suriladigan tutqich + bo'lim/gap yozuvi + tepada o'qilgan qism chizig'i.
   Sahifa surilganda chiqadi, 1.5 s dan keyin yashirinadi. Matn: .ln (gap), Луғат: .g (so'z). */
(function () {
  if (window.__fs) return; window.__fs = 1;
  var d = document, st = d.createElement('style');
  st.textContent = '#fsbar{position:fixed;left:0;top:0;height:3px;width:0;background:var(--ac,#2f6fd6);z-index:60;pointer-events:none;transition:width .1s}' +
    '#fsth{position:fixed;right:0;width:18px;height:52px;border-radius:9px 0 0 9px;background:var(--ac,#2f6fd6);z-index:61;opacity:0;transition:opacity .25s;touch-action:none;cursor:grab}' +
    '#fsth.on{opacity:.9}#fsth::before{content:"";position:absolute;left:-14px;right:0;top:-10px;bottom:-10px}' +
    '#fsbub{position:fixed;right:30px;z-index:61;background:#222;color:#fff;font:500 14px/1.3 system-ui,sans-serif;padding:8px 12px;border-radius:10px;white-space:nowrap;opacity:0;transition:opacity .2s;pointer-events:none}' +
    '#fsbub small{display:block;font-weight:400;font-size:11px;opacity:.75}#fsbub.on{opacity:1}';
  d.head.appendChild(st);
  var bar = d.createElement('div'), th = d.createElement('div'), bub = d.createElement('div');
  bar.id = 'fsbar'; th.id = 'fsth'; bub.id = 'fsbub';
  th.setAttribute('aria-label', 'Саҳифани суриш');
  d.body.appendChild(th); /* 06.11.2026: tepadagi chiziq olib tashlandi — yuklanish chizig'i bilan bir xil ko'rinardi */ d.body.appendChild(bub);
  var se = d.scrollingElement || d.documentElement, drag = false, hideT = null, off = 0;
  function pb() { var p = d.querySelector('.pbar'); return p && p.offsetParent !== null ? p.getBoundingClientRect().height : 0; }
  function track() { var top = 60, bot = innerHeight - pb() - 12; return [top, Math.max(top + 80, bot)]; }
  function max() { return Math.max(1, se.scrollHeight - innerHeight); }
  function label() {
    var tb = d.querySelector('.tabs button.on'), name = tb ? tb.textContent.trim() : '', sub = '';
    var pg = [].filter.call(d.querySelectorAll('#p1,#p2,#p3'), function (p) { return !p.classList.contains('hide'); })[0];
    var sel = pg && pg.id === 'p1' ? '#tx .ln' : pg && pg.id === 'p2' ? '#p2 .g' : null;
    if (sel) {
      var els = d.querySelectorAll(sel), mid = innerHeight * 0.35, k = -1;
      for (var i = 0; i < els.length; i++) if (els[i].getBoundingClientRect().top <= mid) k = i;
      if (k < 0) k = 0;
      sub = pg.id === 'p1' ? (k === 0 ? 'Сарлавҳа' : k + '-гап') : (k + 1) + '-сўз';
    }
    return (name ? name + (sub ? ' · ' + sub : '') : sub);
  }
  function upd() {
    var f = Math.min(1, Math.max(0, se.scrollTop / max())), t = track();
    var y = t[0] + f * (t[1] - t[0] - 52);
    th.style.top = y + 'px'; bub.style.top = (y + 4) + 'px';
    bub.innerHTML = (label() || '') + '<small>' + Math.round(f * 100) + '%</small>';
  }
  function show() {
    if (se.scrollHeight < innerHeight * 1.6) { th.classList.remove('on'); return; }
    th.classList.add('on'); clearTimeout(hideT);
    if (!drag) hideT = setTimeout(function () { th.classList.remove('on'); bub.classList.remove('on'); }, 1500);
  }
  addEventListener('scroll', function () { upd(); if (!drag) show(); }, { passive: true });
  addEventListener('resize', upd);
  th.addEventListener('pointerdown', function (e) {
    if (!th.classList.contains('on')) return;
    drag = true; th.setPointerCapture(e.pointerId); off = e.clientY - th.getBoundingClientRect().top;
    bub.classList.add('on'); clearTimeout(hideT); e.preventDefault();
  });
  th.addEventListener('pointermove', function (e) {
    if (!drag) return; var t = track(), y = e.clientY - off;
    var f = Math.min(1, Math.max(0, (y - t[0]) / (t[1] - t[0] - 52)));
    se.scrollTop = f * max(); upd();
  });
  function end() { if (!drag) return; drag = false; show(); setTimeout(function () { if (!drag) bub.classList.remove('on'); }, 600); }
  th.addEventListener('pointerup', end); th.addEventListener('pointercancel', end);
  upd();
})();

/* 06.11.2026: oxirgi gap pastdagi pleyer va tugmalar ostida qolmasin — .w pastki bo'shlig'i ular balandligiga qarab o'rnatiladi */
(function () {
  var w = document.querySelector('.w'); if (!w) return;
  function fix() {
    var top = innerHeight;
    [].forEach.call(document.querySelectorAll('body > *, .w *'), function (e) {
      var cs = getComputedStyle(e); if (!(cs.position === 'fixed' || (cs.position === 'sticky' && cs.bottom !== 'auto')) || cs.display === 'none' || e.id === 'fsth' || e.id === 'fsbub' || e.id === 'fsbar') return;
      var r = e.getBoundingClientRect(); if (r.height > 0 && r.height < innerHeight * 0.5 && r.bottom > innerHeight * 0.6 && r.top < top) top = r.top;
    });
    var need = Math.round(innerHeight - top + 32);
    if (need > 40) w.style.setProperty('padding-bottom', need + 'px', 'important');
  }
  addEventListener('resize', fix); addEventListener('load', fix); document.addEventListener('click', function () { setTimeout(fix, 300); });
  setTimeout(fix, 500); setTimeout(fix, 1500);
})();
/* So'z oynasi: holat yorlig'i («● раф қилинган») bosilsa — Наҳв жадвали (nahv.html#R:zamma) ochiladi (11.11.2026).
   14.11.2026 dan ruscha sahifada ham (jadval ruscha qatlam bilan; alomat ruscha matndan ham topiladi). */
document.addEventListener('click', function (e) {
  var s = e.target.closest && e.target.closest('#sb .hk span');
  if (!s) return;
  var c = (s.className.match(/(?:^|\s)c([RNJZ])(?:\s|$)/) || [])[1]; if (!c) return;
  var t = (document.querySelector('#sb .tk') || {}).textContent || '', g = '', m = t.match(/аломати[^,.;]*?(замма|фатҳа|касра|сукун)/);
  if (!m) m = t.match(/признак[^,.;]*?(дамма|фатха|касра|сукун)/);
  if (m) g = { 'замма': 'zamma', 'фатҳа': 'fatha', 'касра': 'kasra', 'сукун': 'sukun', 'дамма': 'zamma', 'фатха': 'fatha' }[m[1]];
  else if ((m = t.match(/(?:аломати|признак(?:\s+—)?)\s+([\u0648\u064A\u0627\u0646])(?![\u0600-\u06FF])/))) g = { '\u0648': 'vov', '\u064A': 'yo', '\u0627': 'alif', '\u0646': 'nun' }[m[1]];
  location.href = 'nahv.html#' + c + (g ? ':' + g : '');
});

/* --- «Билмайман» belgisi: darsning «Луғат» yorlig'ida (13.11.2026; hamma darslar; qoida — docs/texnik.md 15 «So'z bazasi») ---
   Belgi so'z bazasiga yoziladi (localStorage «soz»: b — bilmayman, k — bilaman); xaritadagi dars oxiri saralashida oldindan belgilangan turadi.
   Qator ↔ baza: sahifadagi VOC ning kitob raqami (kn) → data/lugat.json dagi id; dars raqami tg.js ning data-key («darsNN-holat») dan.
   Bazaga kirmaydigan so'zda (atoqli ot, takror yozuv) belgi chiqmaydi. lugat.json faqat «Луғат» ochilganda yuklanadi. */
(function () {
  var SN = /\/sinov-[^\/]*$/.test(location.pathname), KB = SN ? 'soz-sinov' : 'soz';
  var sc = document.querySelector('script[data-key]'), DN = sc ? +((sc.getAttribute('data-key') || '').match(/^dars(\d+)-holat$/) || [0, 0])[1] : 0;   /* faqat arab tili darslari (fiqh emas) */
  var ID = null, yuk = false, p2 = document.getElementById('p2');
  if (!DN || !p2 || typeof VOC === 'undefined') return;
  var BM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.2L5.5 21V4.5a1 1 0 0 1 1-1z"/></svg>';
  var css = document.createElement('style');
  css.textContent = '#p2 .g .bm{width:44px;height:44px;flex:none;margin:-6px -6px 0 -10px;padding:0;border:0;border-radius:12px;background:none;color:var(--mu);opacity:.45;display:flex;align-items:center;justify-content:center;cursor:pointer}' +
    '#p2 .g .bm svg{width:22px;height:22px}#p2 .g .bm[aria-pressed="true"]{color:#b3261e;opacity:1}#p2 .g .bm[aria-pressed="true"] svg{fill:currentColor}';
  document.head.appendChild(css);
  function ol() { var W; try { W = JSON.parse(localStorage.getItem(KB) || '{}') || {}; } catch (e) { W = {}; } W.v = 1; W.b = W.b || {}; W.k = W.k || {}; W.s = W.s || {}; return W; }
  function chiz() {
    if (!ID) return;
    var W = ol();
    [].forEach.call(p2.querySelectorAll('.g'), function (g, i) {
      var q = VOC[i], id = q && ID[q[0]], hd = g.querySelector('.hd'), b = hd && hd.querySelector('.bm');
      if (!id || !hd) return;
      if (!b) {
        b = document.createElement('button');
        b.className = 'bm'; b.type = 'button'; b.setAttribute('aria-label', '«Билмайман» деб белгилаш'); b.innerHTML = BM;
        b.onclick = function (e) {
          e.stopPropagation();
          var W = ol();
          if (W.b[id]) { delete W.b[id]; W.k[id] = 1; } else { W.b[id] = 1; delete W.k[id]; }
          W.t = Date.now();
          try { localStorage.setItem(KB, JSON.stringify(W)); } catch (x) {}
          b.setAttribute('aria-pressed', W.b[id] ? 'true' : 'false');
        };
        hd.appendChild(b);
      }
      b.setAttribute('aria-pressed', W.b[id] ? 'true' : 'false');
    });
  }
  function yukla() {
    if (yuk) { chiz(); return; }
    yuk = true;
    fetch(SN ? 'sinov-lugat.json' : 'data/lugat.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      ID = {}; j.s.forEach(function (r) { if (r.d === DN && r.tk) ID[r.kn] = r.id; });
      chiz();
    }).catch(function () { yuk = false; });
  }
  var gl0 = window.gl, tab0 = window.tab;
  if (typeof gl0 === 'function') window.gl = function () { gl0.apply(this, arguments); chiz(); };
  if (typeof tab0 === 'function') window.tab = function (n) { tab0.apply(this, arguments); if (n == 2) yukla(); };
  if (!p2.classList.contains('hide')) yukla();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) chiz(); });
})();

/* --- «Созламалар» → Арабча ёзув катталиги (13.11.2026; docs/texnik.md 16) ---
   Sozlama — boshlang'ich holat: o'zgartirilganda (sozlama.oqT) har darsga BIR MARTA qo'llanadi («sozlama-q» da belgilanadi),
   keyin darsning o'z «Aa» tugmasi va saqlangan o'lchami ustun. Sozlama hech o'zgartirilmagan bo'lsa — hech narsa qilinmaydi.
   («Ҳаракат» va «Таржима» sozlamasi alohida kod talab qilmaydi — yuqoridagi «fe-pref» ning o'zi.) */
(function () {
  var sc = document.querySelector('script[data-key]'), K = sc ? sc.getAttribute('data-key') || '' : '';
  if (!/-holat$/.test(K) || typeof fz !== 'function') return;
  var Z, Q;
  try { Z = JSON.parse(localStorage.getItem('sozlama') || '{}') || {}; } catch (e) { return; }
  if (!Z.oqT) return;
  try { Q = JSON.parse(localStorage.getItem('sozlama-q') || '{}') || {}; } catch (e) { Q = {}; }
  if (Q[K] >= Z.oqT) return;
  try {
    var maq = { k: 18, o: 22, K: 28 }[Z.yozuv];
    if (maq && typeof fs === 'number' && fs !== maq) fz(maq - fs);
  } catch (e) {}
  Q[K] = Z.oqT;
  try { localStorage.setItem('sozlama-q', JSON.stringify(Q)); } catch (e) {}
})();
