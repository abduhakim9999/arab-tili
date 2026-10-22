/* Dars boshi: بِسْمِ اللَّهِ + bob + dars (ovozi bilan). window.HDR beriladi. */
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
    '.hdr .pl{background:rgba(234,88,12,.25)}' +
    '.jmb{margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(29,120,80,.08);border-left:3px solid var(--ac);font-size:15px;line-height:1.6}.jmb b{display:block;font-size:11px;letter-spacing:.08em;color:var(--ac);margin-bottom:2px}.jmb .ar{font-size:19px}';
  document.head.appendChild(st);

  var d = document.createElement('div');
  d.className = 'hdr';
  d.innerHTML = '<div class="hb hr0">' + BW.map(function (w, i) { return '<span data-w="' + i + '">' + w[0] + '</span>' }).join(' ') + '</div>' +
    '<div class="htr">Меҳрибон ва раҳмли Аллоҳнинг номи билан (бошлайман)</div>' +
    '<div class="hr" data-r="1"><b>' + H.ua + '</b><small>' + H.uu + '</small></div>' +
    '<div class="hr" data-r="2"><b>' + H.la + '</b><small>' + H.lu + '</small></div>';
  tx.parentNode.insertBefore(d, tx);

  var ha = new Audio(H.a); ha.preload = 'auto';
  var stopAt = null, chain = false, done = false, raf = 0;
  var spans = d.querySelectorAll('.hb span'), rows = [d.querySelector('.hb'), d.querySelector('[data-r="1"]'), d.querySelector('[data-r="2"]')];
  function clear() { [].forEach.call(d.querySelectorAll('.pl'), function (e) { e.classList.remove('pl') }) }
  function paint() {
    var t = ha.currentTime; clear();
    if (!ha.paused) {
      if (t < H.s[0]) { BW.forEach(function (w, i) { if (t >= w[2][0] - 0.05 && t < w[2][1] + 0.1) spans[i].classList.add('pl') }) }
      else if (t < H.s[1]) rows[1].classList.add('pl'); else rows[2].classList.add('pl');
    }
    if (stopAt !== null && t >= stopAt) { ha.pause(); stopAt = null; clear() }
    if (!ha.paused) raf = requestAnimationFrame(paint);
  }
  function setPP(on) { var b = document.getElementById('pp'); if (b) { b.textContent = on ? '⏸' : '▶'; b.classList.toggle('on', on) } var q = document.querySelector('.pbar'); if (q) q.classList.toggle('on', on) }
  ha.addEventListener('play', function () { setPP(true); cancelAnimationFrame(raf); raf = requestAnimationFrame(paint) });
  ha.addEventListener('pause', function () { clear(); if (!chain) setPP(false) });
  ha.addEventListener('ended', function () {
    clear();
    if (chain) { chain = false; done = true; if (window.au) { au.currentTime = 0; var p = au.play(); if (p && p.catch) p.catch(function () {}) } }
    else setPP(false);
  });
  function playSeg(a, b, ch) {
    if (window.au && !au.paused) au.pause();
    chain = !!ch; stopAt = b; ha.currentTime = a;
    var p = ha.play(); if (p && p.catch) p.catch(function () {});
  }
  // ▶ tugmasi: boshidan boshlansa, avval sarlavha o'qiladi
  var op = window.ppl;
  if (typeof op === 'function') {
    window.ppl = function () {
      if (!ha.paused) { chain = false; ha.pause(); setPP(false); return }
      var a = window.au;
      if (a && a.paused && a.currentTime < 0.3 && !done && !(typeof loopL !== 'undefined' && loopL >= 0)) { setPP(true); playSeg(0, null, true); return }
      return op.apply(this, arguments);
    };
  }
  if (window.au) au.addEventListener('ended', function () { done = false });

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
  rows[1].addEventListener('click', function () { playSeg(H.s[0] - 0.05, H.s[1]) });
  rows[2].addEventListener('click', function () { playSeg(H.s[1] - 0.05, null) });
})();
