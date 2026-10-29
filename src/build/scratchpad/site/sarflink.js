/* Dars sahifasi: fe'l tarkibi ochilganda «Сарф» jadvaliga havola qo'shadi */
(function () {
  var IDX = null, sb = document.getElementById('sb');
  if (!sb || !window.MutationObserver) return;
  function bare(s) { return String(s).replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim(); }
  function find(w) {
    var b = bare(w), c = [b];
    /* old qo'shimchalar (و، ف) va kishilik olmoshlari (ها، ه، هم …) olib tashlanib ham qidiriladi */
    [b].concat(/^[وف]/.test(b) ? [b.slice(1)] : []).forEach(function (x) {
      c.push(x);
      ['هما', 'هم', 'هن', 'ها', 'ه', 'كما', 'كم', 'كن', 'ك', 'ني', 'نا'].forEach(function (s) { if (x.length > s.length + 2 && x.slice(-s.length) == s) c.push(x.slice(0, -s.length)); });
    });
    for (var i = 0; i < c.length; i++) if (IDX[c[i]]) return IDX[c[i]];
    return null;
  }
  function add() {
    if (!IDX || sb.querySelector('.srfl')) return;
    var big = sb.querySelector('.big'); if (!big) return;
    var id = find(big.textContent); if (!id) return;
    var a = document.createElement('a');
    a.className = 'srfl'; a.href = 'sarf.html#' + id; a.textContent = '📘 Сарф: тўлиқ тусланиши ›';
    a.style.cssText = 'display:block;margin:10px 0 4px;padding:10px 12px;border-radius:12px;background:rgba(194,65,12,.10);color:#c2410c;font-weight:700;text-decoration:none;text-align:center';
    var x = sb.querySelector('button.x'); sb.insertBefore(a, x || null);
  }
  new MutationObserver(function () { if (IDX) add(); else load(); }).observe(sb, { childList: true });
  var ld = false;
  function load() { if (ld) return; ld = true; fetch('sarf-idx.json').then(function (r) { return r.json(); }).then(function (j) { IDX = j; add(); }).catch(function () {}); }
})();
