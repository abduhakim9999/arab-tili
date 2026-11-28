/* Dars boshi: بِسْمِ اللَّهِ, keyin qatorlar (yangi ваҳданинг 1-darsida ваҳда, dars raqami, mavzu). window.HDR = {s0: bismillah oxiri, e: sarlavha oxiri, rows: [{a, u, t: [bosh, oxir] yoki null}]} */
(function () {
  var H = window.HDR, tx = document.getElementById('tx');
  if (!H || !tx) return;
  var NA = 'эъробдан унга ўрин йўқ';
  var BW = [
    ['بِسْمِ', 'номи билан', [0.18, 0.5], [['بِ', 'жар ҳарфи, касрага мабний, ' + NA],
      ['اسْمِ', 'музоф бўлиб мажрур, بِ сабаб жар қилинган, аломати зоҳирий касра'],
      ['', 'жар ва мажрур шибҳи жумла бўлиб, маҳзуф أَبْتَدِئُ («бошлайман») феълига мутааллиқ', 'n'],
      ['', 'бисмиллаҳда اسْم нинг ҳамзаси ёзувда ҳам тушади: بِسْمِ', 'n']]],
    ['اللَّهِ', 'Аллоҳ(нинг)', [0.52, 1.02], [['اللَّهِ', 'лафзи жалола бўлиб музофун илайҳ, жар қилинган, аломати зоҳирий касра, ўзи мавсуф']]],
    ['الرَّحْمَٰنِ', 'Меҳрибон', [1.06, 1.88], [['اَلرَّحْمَٰنِ', '1чи сифат, жар қилинган, аломати зоҳирий касра'], ['', 'اللَّهِ нинг сифати', 'n']]],
    ['الرَّحِيمِ', 'раҳмли', [1.9, 2.55], [['اَلرَّحِيمِ', '2чи сифат, жар қилинган, аломати зоҳирий касра'], ['', 'اللَّهِ нинг сифати', 'n']]]
  ];
  var JM = '«بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ» — маҳзуф феъл (أَبْتَدِئُ) билан бирга ибтидоий жумла, ' + NA + '.';

  var st = document.createElement('style');
  st.textContent = '.hdr{background:var(--cd);border:1px solid var(--bd);border-radius:14px;padding:12px 12px 10px;margin-bottom:10px;text-align:center}' +
    '.hdr .hb{direction:rtl;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-size:calc(var(--fs,22px) + 4px);line-height:1.9}' +
    '.hdr .hb span{padding:0 3px;border-radius:8px;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    '.hdr .htr{font-size:14px;color:var(--mu);margin:-2px 0 8px}' +
    '.hdr .hr{border-top:1px dashed var(--bd);padding:6px 0 2px;cursor:pointer;border-radius:8px}' +
    '.hdr .hr b{display:block;direction:rtl;font-family:"DarsNaskh","Noto Naskh Arabic",serif;font-weight:700;font-size:var(--fs,22px);color:var(--ac);line-height:1.7}' +
    '.hdr .hr small{display:block;font-size:13px;color:var(--mu)}' +
    '.hdr .pl{background:var(--plw,rgba(234,88,12,.25))}.hdr .hr.pl{box-shadow:inset 0 0 0 1.5px var(--hl,#c99434)}' +
    '.hdr.hidetr .hts:not(.rev){filter:blur(5px);cursor:pointer;-webkit-user-select:none;user-select:none}' +
    '.jmb{margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(29,120,80,.08);border-left:3px solid var(--ac);font-size:15px;line-height:1.6}.jmb b{display:block;font-size:11px;letter-spacing:.08em;color:var(--ac);margin-bottom:2px}.jmb .ar{font-size:19px}';
  document.head.appendChild(st);

  var d = document.createElement('div');
  d.className = 'hdr';
  d.innerHTML = '<div class="hb hr0">' + BW.map(function (w, i) { return '<span data-w="' + i + '">' + w[0] + '</span>' }).join(' ') + '</div>' +
    '<div class="htr hts">Меҳрибон ва раҳмли Аллоҳнинг номи билан (бошлайман)</div>' +
    H.rows.map(function (r, i) { return '<div class="hr" data-r="' + (i + 1) + '"><b>' + r.a + '</b><small class="hts">' + r.u + '</small></div>' }).join('');
  tx.parentNode.insertBefore(d, tx);
  /* tarjima yashirilganda sarlavha tarjimalari ham yashirinadi, bosilganda ochiladi */
  function syncTr() { d.classList.toggle('hidetr', tx.classList.contains('hidetr')); if (!tx.classList.contains('hidetr')) [].forEach.call(d.querySelectorAll('.hts.rev'), function (e) { e.classList.remove('rev') }) }
  syncTr(); if (window.MutationObserver) new MutationObserver(syncTr).observe(tx, { attributes: true, attributeFilter: ['class'] });
  [].forEach.call(d.querySelectorAll('.hts'), function (e) { e.addEventListener('click', function (ev) { if (d.classList.contains('hidetr') && !e.classList.contains('rev')) { ev.stopPropagation(); e.classList.add('rev') } }, true) });

  // sarlavha asosiy audioning boshida turadi (0 … H.e soniya)
  var A = window.au, raf = 0, fol = null;
  var spans = d.querySelectorAll('.hb span'), hb = d.querySelector('.hb'), rws = d.querySelectorAll('.hr[data-r]');
  function clear() { [].forEach.call(d.querySelectorAll('.pl'), function (e) { e.classList.remove('pl') }) }
  function paint() {
    var t = A.currentTime; clear();
    if (!A.paused && t < H.e) {
      var cur = null;
      if (t < H.s0) { cur = hb; BW.forEach(function (w, i) { if (t >= w[2][0] - 0.05 && t < w[2][1] + 0.1) spans[i].classList.add('pl') }) }
      else H.rows.forEach(function (r, i) { if (r.t && t >= r.t[0] && t < r.t[1] + 0.05) cur = rws[i] });
      if (cur && cur !== hb) cur.classList.add('pl');
      // ekran o'qilayotgan qismga ergashadi
      if (cur && fol !== cur) { fol = cur; try { if (typeof follow === 'function') follow(cur) } catch (e) {} }
    } else fol = null;
    if (!A.paused) raf = requestAnimationFrame(paint);
  }
  if (A) {
    A.addEventListener('play', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint) });
    A.addEventListener('pause', clear);
  }
  function playSeg(a, b) {
    if (!A) return;
    try { if (typeof loopL !== 'undefined' && loopL >= 0 && typeof setLoop === 'function') setLoop(-1) } catch (e) {}
    A.currentTime = Math.max(0, a); window.stopAt = b;
    var p = A.play(); if (p && p.catch) p.catch(function () {});
  }
  // bosish — eshitish; bosib turish — tarkib
  function sheet(i) {
    var w = BW[i], tl = window.tline || function (l) { return '<div class="tl">' + (l[0] ? '<span class="ar">' + l[0] + '</span> — ' : '↳ ') + l[1] + '</div>' };
    var h = '<div class="big">' + w[0] + '</div><div style="text-align:center;color:var(--mu);margin:-6px 0 10px">' + w[1] + '</div>' +
      '<div class="tk"><i>📘 Таркиб</i>' + w[3].map(tl).join('') +
      '<div class="jmb"><b>ЖУМЛА</b>' + JM.replace(/[؀-ۿ]+(?:[\s،]+[؀-ۿ]+)*/g, function (m) { return '<bdi class="ar">' + m + '</bdi>' }) + '</div>' +
      '<div class="jt">Жумлатун хабарийя.</div></div>' +
      '<button class="x" onclick="document.getElementById(\'sh\').classList.remove(\'on\')">Ёпиш</button>';
    var sb = document.getElementById('sb'), sh = document.getElementById('sh');
    if (sb && sh) { sb.innerHTML = h; sh.classList.add('on') }
  }
  [].forEach.call(spans, function (sp) {
    var i = +sp.getAttribute('data-w'), tm = 0, lp = false;
    sp.addEventListener('pointerdown', function () { lp = false; tm = setTimeout(function () { lp = true; sheet(i) }, 450) });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (e) { sp.addEventListener(e, function () { clearTimeout(tm) }) });
    sp.addEventListener('contextmenu', function (e) { e.preventDefault() });
    sp.addEventListener('click', function (e) { e.stopPropagation(); if (lp) return; playSeg(BW[i][2][0] - 0.05, BW[i][2][1] + 0.08) });
  });
  H.rows.forEach(function (r, i) { if (r.t) rws[i].addEventListener('click', function () { playSeg(r.t[0] - 0.05, r.t[1]) }); else rws[i].style.cursor = 'default' });
})();
