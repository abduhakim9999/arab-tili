/**
 * Эшитиш жадвали — Telegram гуруҳидаги аудиоларни ким эшитганини ҳисоблайди.
 * Ўрнатиш:
 *  1) Янги Google жадвал очинг → Кенгайтмалар → Apps Script → шу кодни қўйинг.
 *  2) Лойиҳа созламалари → Script Properties → BOT_TOKEN = (ботнинг токени).
 *  3) setup() функциясини бир марта ишга туширинг (рухсат беринг).
 *  4) Жойлаштириш → Янги жойлаштириш → Веб-илова: «Мен номимдан», «Ҳамма» → URL ни нусхалаб олинг.
 */
var TZ = 'Asia/Samarkand';
var MUDDAT_SOAT = 24;

function P(k) { return PropertiesService.getScriptProperties().getProperty(k); }
function key() {
  var d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'eshit:' + P('BOT_TOKEN'), Utilities.Charset.UTF_8);
  return d.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('').slice(0, 32);
}
function sh(n, head) {
  var ss = SpreadsheetApp.getActive(), s = ss.getSheetByName(n);
  if (!s) { s = ss.insertSheet(n); if (head) { s.appendRow(head); s.setFrozenRows(1); s.getRange(1, 1, 1, head.length).setFontWeight('bold'); } }
  return s;
}
function rows(n) { var v = sh(n).getDataRange().getValues(); v.shift(); return v; }
function cfg(k, v) {
  var s = sh('Созлама', ['калит', 'қиймат']), d = s.getDataRange().getValues();
  for (var i = 1; i < d.length; i++) if (d[i][0] === k) { if (v === undefined) return d[i][1]; s.getRange(i + 1, 2).setValue(v); return v; }
  if (v === undefined) return '';
  s.appendRow([k, v]); return v;
}
function now() { return new Date(); }
function fmt(d) { return Utilities.formatDate(new Date(d), TZ, 'dd.MM HH:mm'); }
function tg(m, p) {
  var r = UrlFetchApp.fetch('https://api.telegram.org/bot' + P('BOT_TOKEN') + '/' + m,
    { method: 'post', contentType: 'application/json', payload: JSON.stringify(p), muteHttpExceptions: true });
  return JSON.parse(r.getContentText());
}

function setup() {
  sh('Жадвал'); sh('Қора рўйхат', ['аудио', 'user_id', 'исм', 'сана']);
  sh('Аъзолар', ['user_id', 'исм', 'username', 'қўшилган', 'ҳисобланмасин (1)']);
  sh('Аудиолар', ['id', 'номи', 'chat_id', 'message_id', 'юборилди', 'муддат', 'ҳолат']);
  sh('Белгилар', ['аудио_id', 'user_id', 'исм', 'вақт', 'кечикди']);
  cfg('group', cfg('group') || '');
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('tekshir').timeBased().everyMinutes(15).create();
  Logger.log('Калит: ' + key());
}

function member(u) {
  if (!u || u.is_bot) return;
  var s = sh('Аъзолар'), d = s.getDataRange().getValues(), nm = [u.first_name, u.last_name].filter(String).join(' ');
  for (var i = 1; i < d.length; i++) if (String(d[i][0]) === String(u.id)) {
    if (nm && d[i][1] !== nm) s.getRange(i + 1, 2).setValue(nm);
    if (u.username && d[i][2] !== '@' + u.username) s.getRange(i + 1, 3).setValue('@' + u.username);
    return;
  }
  s.appendRow([String(u.id), nm, u.username ? '@' + u.username : '', fmt(now()), '']);
}
function members() { return rows('Аъзолар').filter(function (r) { return r[0] && String(r[4]) !== '1'; }); }

function doPost(e) {
  var q = JSON.parse(e.postData.contents || '{}'), out;
  if (q.k !== key()) return J({ ok: false, err: 'key' });
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (q.a === 'group') { cfg('group', String(q.chat)); out = { ok: true }; }
    else if (q.a === 'cfg') out = { ok: true, group: cfg('group') };
    else if (q.a === 'member') { (q.users || []).forEach(member); out = { ok: true }; }
    else if (q.a === 'post') {
      var dl = new Date(now().getTime() + MUDDAT_SOAT * 3600e3);
      sh('Аудиолар').appendRow([q.id, q.title, String(q.chat), q.msg, fmt(now()), dl.toISOString(), '']);
      jadval(); out = { ok: true, deadline: fmt(dl) };
    }
    else if (q.a === 'mark') out = mark(q);
    else if (q.a === 'rep') out = { ok: true, text: hisobot(q.id) };
    else out = { ok: false, err: 'a' };
  } finally { lock.releaseLock(); }
  return J(out);
}
function J(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function audio(id) {
  var d = rows('Аудиолар');
  for (var i = d.length - 1; i >= 0; i--) if (String(d[i][0]) === String(id)) return { row: i + 2, r: d[i] };
  return null;
}
function mark(q) {
  member(q.user);
  var a = audio(q.id); if (!a) return { ok: true, text: 'Аудио топилмади.' };
  var b = rows('Белгилар').some(function (r) { return String(r[0]) === String(q.id) && String(r[1]) === String(q.user.id); });
  if (b) return { ok: true, text: 'Сиз аввал белгилагансиз ✅' };
  var late = now() > new Date(a.r[5]);
  sh('Белгилар').appendRow([String(q.id), String(q.user.id), [q.user.first_name, q.user.last_name].filter(String).join(' '), fmt(now()), late ? 1 : '']);
  jadval();
  return { ok: true, text: late ? 'Белгиланди, лекин муддат ўтиб кетган ⏰' : 'Белгиланди ✅ Баракалла!' };
}

function heard(id) {
  var m = {};
  rows('Белгилар').forEach(function (r) { if (String(r[0]) === String(id) && String(r[4]) !== '1') m[String(r[1])] = 1; });
  return m;
}
function hisobot(id) {
  var A = rows('Аудиолар'); if (!A.length) return 'Ҳали аудио юборилмаган.';
  var a = id ? audio(id) : { r: A[A.length - 1] }; if (!a) return 'Топилмади.';
  var h = heard(a.r[0]), yes = [], no = [];
  members().forEach(function (m) { (h[String(m[0])] ? yes : no).push(m[1] + (m[2] ? ' ' + m[2] : '')); });
  return '🎧 ' + a.r[1] + '\nМуддат: ' + fmt(a.r[5]) + '\n\n✅ Эшитганлар (' + yes.length + '):\n' + (yes.join('\n') || '—') +
    '\n\n❌ Эшитмаганлар (' + no.length + '):\n' + (no.join('\n') || '—');
}

// Ҳар 15 дақиқада: муддати тугаган аудиолар бўйича қора рўйхат
function tekshir() {
  var s = sh('Аудиолар'), d = s.getDataRange().getValues(), g = cfg('group');
  for (var i = 1; i < d.length; i++) {
    if (d[i][6] || now() < new Date(d[i][5])) continue;
    var h = heard(d[i][0]), no = members().filter(function (m) { return !h[String(m[0])]; });
    no.forEach(function (m) { sh('Қора рўйхат').appendRow([d[i][1], String(m[0]), m[1], fmt(now())]); });
    s.getRange(i + 1, 7).setValue('якунланди');
    if (g) {
      tg('editMessageReplyMarkup', { chat_id: d[i][2], message_id: d[i][3], reply_markup: { inline_keyboard: [[{ text: '⏰ Муддат тугади', callback_data: 'x' }]] } });
      tg('sendMessage', { chat_id: g, text: '⏰ «' + d[i][1] + '» — муддат тугади.\n\n❌ Эшитмаганлар (' + no.length + '):\n' +
        (no.map(function (m) { return '• ' + m[1]; }).join('\n') || '— Ҳамма эшитди! 🎉') });
    }
  }
  jadval();
}

// «Жадвал» вароғи: қаторлар — аъзолар, устунлар — аудиолар
function jadval() {
  var A = rows('Аудиолар'), M = members(), B = rows('Белгилар'), s = sh('Жадвал');
  var hit = {}; B.forEach(function (r) { hit[r[0] + '|' + r[1]] = String(r[4]) === '1' ? '⏰' : '✅'; });
  var head = ['Исм', 'username'].concat(A.map(function (a) { return a[1]; })).concat(['Эшитмаган']);
  var out = [head];
  M.forEach(function (m) {
    var miss = 0, row = [m[1], m[2]];
    A.forEach(function (a) {
      var v = hit[a[0] + '|' + m[0]];
      if (!v) v = a[6] ? '❌' : '…';
      if (v === '❌' || v === '⏰') miss++;
      row.push(v);
    });
    row.push(miss); out.push(row);
  });
  s.clear(); s.getRange(1, 1, out.length, head.length).setValues(out);
  s.setFrozenRows(1); s.setFrozenColumns(1); s.getRange(1, 1, 1, head.length).setFontWeight('bold');
  if (out.length > 1 && head.length > 3) s.getRange(2, 3, out.length - 1, head.length - 3).setHorizontalAlignment('center');
}
