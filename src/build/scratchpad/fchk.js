
var API = 'https://script.google.com/macros/s/AKfycbwfQAUAC3jHlqE5KHAeaqGekAkedI1UP7qECuJpzHF5lwl4fmBn_xEpj5nt8SfKiOBX/exec';
var N = 5;
var A = document.getElementById('au'), APP = document.getElementById('app');
var V = [], items = [], cur = 0, res = [], K = 1, init = '', streak = 0;
function initData() {
  try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) return Telegram.WebApp.initData; } catch (e) {}
  try { var m = /(?:^|&)tgWebAppData=([^&]*)/.exec(location.hash.slice(1)); if (m) return decodeURIComponent(m[1]); } catch (e) {}
  try { return (JSON.parse(sessionStorage.getItem('__telegram__initParams') || '{}').tgWebAppData) || ''; } catch (e) { return ''; }
}
function post(p, t) {
  return new Promise(function (ok) {
    var done = false, x = setTimeout(function () { if (!done) { done = true; ok(null); } }, t || 6000);
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(p) })
      .then(function (r) { return r.json(); }).then(function (j) { if (!done) { done = true; clearTimeout(x); ok(j); } })
      .catch(function () { if (!done) { done = true; clearTimeout(x); ok(null); } });
  });
}
function vt(v) { return v.mu ? v.m + ' – ' + v.mu : v.m; }
function mn(v) { return String(v.me).replace(/\s+/g, ' ').trim(); }
function opts(i) {
  var v = V[i], right = mn(v), o = [right], seed = (i + 1) * 7919;
  for (var t = 1; o.length < 4 && t < 400; t++) { var x = V[(seed + t * 37) % V.length], m = mn(x); if (x !== v && o.indexOf(m) < 0) o.push(m); }
  var pos = (seed + t) % 4; o.splice(0, 1); o.splice(pos, 0, right);
  return { o: o, pos: pos };
}
function say(i, btn) {
  A.src = 'fq/v' + ('00' + (i + 1)).slice(-3) + '.mp3';
  if (btn) btn.classList.add('pl');
  A.onended = function () { if (btn) btn.classList.remove('pl'); };
  A.play().catch(function () { if (btn) btn.classList.remove('pl'); });
}
var SPK = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function dots() { return '<div class="dots">' + items.map(function (it, j) { var r = res[j]; return '<i class="' + (r ? (r.ok ? 'ok' : 'no') : (j === cur ? 'cur' : '')) + '"></i>'; }).join('') + '</div>'; }
function hc() { return 'Феъллар ' + ((K - 1) * N + 1) + '–' + Math.min(K * N, V.length) + ' · ' + (cur + 1) + '/' + items.length; }
// кейинги феълнинг овози олдиндан юклаб қўйилади
function preload(j) { if (items[j]) { var a = new Audio(); a.preload = 'auto'; a.src = 'fq/v' + ('00' + (items[j].i + 1)).slice(-3) + '.mp3'; } }
function show() {
  if (cur >= items.length) return finish();
  var it = items[cur], i = it.i, v = V[i], q = opts(i);
  APP.innerHTML = '<div class="fh"><b><a class="bk" href="feellar.html" aria-label="Феъллар">‹</a>🔤 Феъл тести</b><span id="hc">' + hc() + '</span></div>' + dots() +
    '<div class="card">' + (it.rep ? '<div class="tag">🔁 Такрорлаш</div>' : '') +
    '<div class="vb">' + vt(v) + '</div><button class="say" id="sy" aria-label="Эшитиш">' + SPK + '</button>' +
    '<div class="q">Маъноси қайси?</div>' + q.o.map(function (t, j) { return '<button class="op" data-j="' + j + '">' + t + '</button>'; }).join('') +
    '<div id="nx"></div></div>';
  var sy = document.getElementById('sy'); sy.onclick = function () { say(i, sy); }; say(i, sy); preload(cur + 1);
  [].forEach.call(APP.querySelectorAll('.op'), function (b) {
    b.onclick = function () {
      var j = +b.dataset.j, ok = j === q.pos;
      [].forEach.call(APP.querySelectorAll('.op'), function (x) { x.disabled = true; if (+x.dataset.j === q.pos) x.classList.add('ok'); });
      if (!ok) b.classList.add('no');
      try { Telegram.WebApp.HapticFeedback.notificationOccurred(ok ? 'success' : 'error'); } catch (e) {}
      res[cur] = { n: i + 1, ok: ok };
      document.getElementById('nx').innerHTML = '<button class="nx">' + (cur + 1 < items.length ? 'Кейинги ›' : 'Натижа') + '</button>';
      document.querySelector('.nx').onclick = function () { cur++; show(); };
      APP.querySelector('.dots').outerHTML = dots();
    };
  });
}
// «Феъллар» бўлими билан умумий: хатолар ўша ердаги «↻ Хатолар»га тушади, ишланган кун белгиланади
function saveLocal(ok, bad) {
  try {
    var M = JSON.parse(localStorage.getItem('fl200_mist') || '[]') || [];
    bad.forEach(function (r) { var i = r.n - 1; if (M.indexOf(i) < 0) M.push(i); });
    localStorage.setItem('fl200_mist', JSON.stringify(M));
    if (bad.length) localStorage.setItem('fl200_t', JSON.stringify(Date.now()));
    var D = JSON.parse(localStorage.getItem('fel_done') || '{}') || {};
    D[K] = Math.max(D[K] || 0, ok); localStorage.setItem('fel_done', JSON.stringify(D));
  } catch (e) {}
}
// Бугун шу кун тестини ким ишлади — жадвалдан
function bugun() {
  post({ a: 'app', b: 'bugun', init: init, k: K }, 15000).then(function (j) {
    var el = document.getElementById('bgn'); if (!el || !j || !j.ok) return;
    var e = function (t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); };
    el.innerHTML = '<div class="bg"><h4>👥 Бугун ишлаганлар (' + j.ha.length + ')</h4>' +
      (j.ha.map(function (x) { return '<div' + (x.men ? ' class="me"' : '') + '><span>' + e(x.n) + '</span><span>' + x.ok + ' / ' + j.jami + '</span></div>'; }).join('') || '<div class="no">—</div>') + '</div>' +
      (j.yoq.length ? '<div class="bg"><h4>⏳ Ҳали ишламаганлар (' + j.yoq.length + ')</h4>' + j.yoq.map(function (n) { return '<div class="no"><span>' + e(n) + '</span></div>'; }).join('') + '</div>' : '');
  });
}
function finish() {
  var ok = res.filter(function (r) { return r.ok; }).length, bad = res.filter(function (r) { return !r.ok; });
  APP.innerHTML = '<div class="res"><div class="big">' + ok + ' / ' + res.length + '</div><div class="st" id="st">' + (ok === res.length ? 'Баракалла! 🎉' : 'Яхши! Хатолар кейинги кунларда яна чиқади 🔁') + '</div>' +
    (bad.length ? '<div class="ml">' + bad.map(function (r) { var v = V[r.n - 1]; return '<div><span class="a">' + vt(v) + '</span><span>' + mn(v) + '</span></div>'; }).join('') + '</div>' : '') +
    '<div id="bgn"></div><button class="nx" id="cl">Ёпиш</button><button class="nx" id="fl" style="background:var(--cd);color:var(--ac);border:1.5px solid var(--bd)">📚 Барча феъллар</button><div class="note" id="sv">Сақланмоқда…</div></div>';
  document.getElementById('cl').onclick = function () { try { Telegram.WebApp.close(); } catch (e) { location.href = './'; } };
  document.getElementById('fl').onclick = function () { location.href = 'feellar.html'; };
  saveLocal(ok, bad);
  init = init || initData();
  if (!init) { document.getElementById('sv').textContent = 'Натижа фақат Telegram ичида очилганда сақланади.'; return; }
  post({ a: 'app', b: 'res', init: init, k: K, res: res }, 15000).then(function (j) {
    var sv = document.getElementById('sv');
    if (j && j.ok) { bugun(); sv.textContent = '✅ Натижа сақланди'; if (j.streak > 1) document.getElementById('st').innerHTML += '<br>🔥 ' + j.streak + ' кун кетма-кет'; }
    else sv.textContent = 'Натижа сақланмади, интернетни текширинг.';
  });
}
function start() {
  init = initData();
  var sp = ''; try { sp = Telegram.WebApp.initDataUnsafe.start_param || ''; } catch (e) {}
  if (!sp) { var m0 = /(?:^|&)tgWebAppStartParam=([^&]*)/.exec(location.hash.slice(1)); if (m0) sp = decodeURIComponent(m0[1]); }
  var m = /[?&]k=(\d+)/.exec(location.search) || /^fel_(\d+)/.exec(sp);
  K = m ? +m[1] : 1;
  var a = (K - 1) * N;
  // олдинги хатолар жадвалдан орқа фонда сўралади — тест уларни кутмайди
  var mistP = init ? post({ a: 'app', b: 'get', init: init }, 15000) : Promise.resolve(null);
  fetch('fq/verbs.json').then(function (r) { return r.json(); }).then(function (d) {
    V = d;
    for (var i = a; i < Math.min(a + N, V.length); i++) items.push({ i: i });
    show();
    mistP.then(function (j) {
      if (cur >= items.length) return;   // тест тугаб бўлган
      var add = ((j && j.mist) || []).filter(function (n) { return n - 1 < a || n - 1 >= a + N; }).slice(0, 3);
      if (!add.length) return;
      add.forEach(function (n) { items.push({ i: n - 1, rep: 1 }); });
      var h = document.getElementById('hc'); if (h) h.textContent = hc();
      var ds = APP.querySelector('.dots'); if (ds) ds.outerHTML = dots();
      var nb = APP.querySelector('.nx'); if (nb && cur + 1 < items.length) nb.textContent = 'Кейинги ›';
    });
  });
}
var started = false;
function boot() { if (started) return; started = true; start(); }
boot();
