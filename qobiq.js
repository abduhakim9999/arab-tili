/* ҚОБИҚ — bitta ilova (13.11.2026; docs/texnik.md 18).
   Asosiy sahifalarning hammasida bir xil: tepa tasma uslubi (.q-hd), qator kartalari (.q-rw) va pastdagi 4 tugma
   (Йўл · Такрорлаш · Қоидалар · Яна). Ishlatish: <script src="qobiq.js"> → Qobiq.nav('yol' | 'takror' | 'qoida' | 'yana').
   Mashg'ulot va imtihon paytida (body.y-ses, body.tq-ses) tugmalar yashirinadi. Dars sahifalarida qobiq yo'q — ular to'liq ekranda o'qiladi. */
(function () {
  var SN = /\/sinov-[^\/]*$/.test(location.pathname) ? 'sinov-' : '';
  var UY = SN + 'yol.html';                            /* asosiy ekran — xarita */
  function sv(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var B = [
    ['yol', 'Йўл', UY, sv('<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>')],
    ['takror', 'Такрорлаш', SN + 'takror.html', sv('<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5"/>')],
    ['qoida', 'Қоидалар', SN + 'qoidalar.html', sv('<path d="M12 6c-2-1.5-4.5-2-8-2v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2zM12 6v14"/>')],
    ['yana', 'Яна', SN + 'yana.html', sv('<circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/>')]
  ];

  var css =
    /* tepa tasma: hamma asosiy sahifada bir xil yashil tasma, oq sarlavha */
    '.q-hd{background:var(--em2,#0c5e3f);color:#fff;padding:calc(8px + env(safe-area-inset-top,0px)) 16px 12px}' +
    '.q-hr{display:flex;align-items:center;gap:10px;min-height:48px;max-width:528px;margin:0 auto}' +
    '.q-hr h1{margin:0;font-size:24px;line-height:1.15;font-weight:700}' +
    '.q-hr small{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f6dc94}' +
    '.q-hr>div{flex:1;min-width:0}' +
    '.q-or{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.14);color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '.q-or svg{width:22px;height:22px}' +
    '.q-w{max-width:560px;margin:0 auto;padding:14px 16px calc(104px + env(safe-area-inset-bottom,0px));box-sizing:border-box}' +
    '.q-h{margin:20px 4px 8px;font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--ac)}' +
    /* qator kartasi: hajmli (pastida qalin chiziq), bosilganda pastga tushadi */
    '.q-rw{display:flex;align-items:center;gap:14px;width:100%;min-height:68px;box-sizing:border-box;padding:10px 14px 13px;margin:0 0 10px;border-radius:18px;border:1.5px solid var(--bd);background:var(--cd);box-shadow:inset 0 -3px 0 var(--bd);color:var(--tx);text-decoration:none;font:inherit;font-size:16.5px;font-weight:700;text-align:left;cursor:pointer;transition:transform .06s,box-shadow .06s}' +
    '.q-rw:active{transform:translateY(2px);box-shadow:inset 0 -1px 0 var(--bd)}' +
    '.q-rw[hidden]{display:none}' +
    '.q-rw .t{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}' +
    '.q-rw small{font-size:13.5px;font-weight:400;line-height:1.35;color:var(--mu)}' +
    '.q-rw .ch{width:18px;height:18px;flex-shrink:0;color:var(--mu)}' +
    '.q-ib{width:44px;height:44px;border-radius:14px;background:var(--tint);color:var(--ac);display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '.q-ib svg{width:24px;height:24px}' +
    /* pastki tugmalar */
    '.q-nav{position:fixed;z-index:20;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));width:calc(100% - 24px);max-width:536px;height:66px;box-sizing:border-box;padding:0 4px;border-radius:24px;background:var(--cd);box-shadow:0 6px 20px rgba(0,0,0,.3);display:flex;align-items:stretch}' +
    '.q-nav a{flex:1;min-width:0;font:600 11.5px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--mu);text-decoration:none;white-space:nowrap;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;-webkit-tap-highlight-color:transparent}' +
    '.q-nav .i{position:relative;width:56px;height:32px;border-radius:16px;display:flex;align-items:center;justify-content:center;transition:background .15s}' +
    '.q-nav svg{width:24px;height:24px}' +
    '.q-nav .on{color:var(--ac);font-weight:700}' +
    '.q-nav .on .i{background:var(--tint)}' +
    '.q-nav .i b{position:absolute;right:2px;top:-3px;min-width:18px;height:18px;box-sizing:border-box;padding:0 5px;border-radius:9px;background:#c99434;color:#2B1D00;font-size:11px;font-weight:700;line-height:18px;text-align:center}' +
    '.q-nav a:focus-visible{outline:2px solid var(--ac);outline-offset:-4px;border-radius:18px}' +
    'body.y-ses .q-nav,body.tq-ses .q-nav{display:none}';
  try { var st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st); } catch (e) {}

  /* sw.js: oldin bosh sahifa ro'yxatdan o'tkazardi; endi u xaritaga o'tkazib yuboradi — shuning uchun qobiq sahifalari o'zi ro'yxatdan o'tkazadi */
  if (!SN && 'serviceWorker' in navigator) try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {}

  function J(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  /* «Такрорлаш» ustidagi son — bugungi savollar soni: takror.html yozgan xulosadan (xarita tepasidagi «такрор» bilan bir xil).
     Xulosa kechagi bo'lsa — o'sha kungi «ertaga» soni; undan eski bo'lsa — «!» (takrorlar kutmoqda, soni noma'lum). */
  function son() {
    var x = J(SN ? 'takror-sinov-xulosa' : 'takror-xulosa', null), sl = 0;
    if (!x || x.v !== 1) return '';
    if (SN) try { sl = +localStorage.getItem('takror-sinov-kun') || 0; } catch (e) {}
    var kun = Math.floor((Date.now() + sl * 864e5 - new Date().getTimezoneOffset() * 6e4) / 864e5);
    return (x.kun === kun ? x.qoldi : x.kun === kun - 1 ? x.ertaga : '!') || '';
  }
  function birXil(a, b) { return a.split('#')[0] === b.split('#')[0]; }

  var Q = window.Qobiq = {
    SN: SN, UY: UY, ustiga: null,
    /* faol — qaysi tugma yonadi. Tarix: asosiy ekrandan bo'limga — oddiy o'tish; bo'limdan bo'limga — almashtirish
       (telefonning «orqaga» tugmasi doim asosiy ekranga qaytaradi, bo'limlar tarixda yig'ilmaydi). */
    nav: function (faol) {
      var n = document.getElementById('q-nav');
      if (!n) { n = document.createElement('nav'); n.id = 'q-nav'; n.className = 'q-nav'; n.setAttribute('aria-label', 'Асосий бўлимлар'); document.body.appendChild(n); }
      var s = son();
      /* tg.js uchun: dars va ichki sahifalardan «orqaga» shu bo'limga qaytaradi */
      try { sessionStorage.setItem('qobiq-uy', B.filter(function (b) { return b[0] === faol; })[0][2]); } catch (e) {}
      n.innerHTML = B.map(function (b) {
        return '<a' + (b[0] === faol ? ' class="on" aria-current="page"' : '') + ' href="' + b[2] + '" data-q="' + b[0] + '"><span class="i">' + b[3] +
          (b[0] === 'takror' && s ? '<b>' + s + '</b>' : '') + '</span>' + b[1] + '</a>';
      }).join('');
      [].forEach.call(n.querySelectorAll('a'), function (a) {
        a.onclick = function (e) {
          var q = a.getAttribute('data-q');
          if (q === faol) { e.preventDefault(); if (Q.ustiga) Q.ustiga(); else window.scrollTo(0, 0); return; }
          if (faol === 'yol') return;                  /* asosiy ekrandan: oddiy o'tish (Telegramda tg.js o'zi almashtiradi) */
          e.preventDefault();
          if (q === 'yol' && history.length > 1 && document.referrer && birXil(a.href, document.referrer)) history.back();
          else location.replace(a.href);
        };
      });
    }
  };
})();
