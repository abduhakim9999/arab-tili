// Telegram bot (Vercel). Env: BOT_TOKEN, ADMIN_ID
// O'rnatish: https://<loyiha>.vercel.app/api/tg?setup=1 ni bir marta oching.
const crypto = require('crypto');
const T = process.env.BOT_TOKEN, A = String(process.env.ADMIN_ID || '').trim();
const STAT = 'https://script.google.com/macros/s/AKfycbxksQz-jII6bVIWKgl63gfASBRDr4SGsScYJg0jogaulyzOoVluyGtf6pU1TIZV-ntRcA/exec';
const KEY = crypto.createHash('sha256').update('stat:' + T).digest('hex').slice(0, 32);
// Эшитиш жадвали (Apps Script веб-илова URL)
const ESH = process.env.ESH_URL || 'https://script.google.com/macros/s/AKfycbwfQAUAC3jHlqE5KHAeaqGekAkedI1UP7qECuJpzHF5lwl4fmBn_xEpj5nt8SfKiOBX/exec';
const KEY2 = crypto.createHash('sha256').update('eshit:' + T).digest('hex').slice(0, 32);
const SECRET = crypto.createHash('sha256').update(String(T)).digest('hex').slice(0, 40);

async function tg(m, p) {
  const r = await fetch('https://api.telegram.org/bot' + T + '/' + m, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
  });
  return r.json();
}

async function stat() {
  try {
    const r = await fetch(STAT + '?k=' + KEY), raw = await r.text();
    let d; try { d = JSON.parse(raw); } catch (e) {
      const msg = raw.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      return 'Статистика олинмади (' + r.status + '): ' + msg;
    }
    if (!d.ok) return 'Статистика олинмади.';
    const L = a => a.length ? a.slice(0, 40).map((x, i) => (i + 1) + '. ' + x).join('\n') + (a.length > 40 ? '\n…' : '') : '—';
    return '📊 Статистика\n\nЖами кирганлар: ' + d.total + '\nБугун: ' + d.today.length + '\nҲозир: ' + d.now.length +
      '\n\n🟢 Ҳозир ишлаётганлар:\n' + L(d.now) + '\n\n📅 Бугун кирганлар:\n' + L(d.today);
  } catch (e) { return 'Статистика олинмади: ' + e.message; }
}

async function esh(a, p) {
  if (!ESH) return { ok: false, err: 'ESH_URL йўқ' };
  try {
    const r = await fetch(ESH, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ k: KEY2, a, ...p }), redirect: 'follow' });
    return JSON.parse(await r.text());
  } catch (e) { return { ok: false, err: e.message }; }
}
const seen = new Set();
let grp = null;
async function loadGrp(force) {
  if (force || !grp || Date.now() - grp.t > 600e3) { const cf = await esh('cfg', {}); grp = { id: String(cf.group || ''), ctrl: String(cf.ctrl || ''), t: Date.now() }; }
  return grp;
}
async function seenUser(u) {
  if (!u || u.is_bot || seen.has(u.id)) return;
  seen.add(u.id); await esh('member', { users: [u] });
}

// Гуруҳдаги хабарлар
async function group(m) {
  const c = String(m.chat.id), t = (m.text || '').trim().split('@')[0];
  if (t === '/ulash' && A && String(m.from && m.from.id) === A) {
    const r = await esh('group', { chat: c });
    grp = null;
    await tg('deleteMessage', { chat_id: c, message_id: m.message_id });
    if (!r.ok) return tg('sendMessage', { chat_id: A, text: '❌ Гуруҳ уланмади: ' + (r.err || '') });
    await tg('sendMessage', { chat_id: c, text: '👋 Ассалому алайкум! Бу гуруҳда аудио дарслар юборилади.\nЭшитганингизни белгилаш учун аввал рўйхатдан ўтинг — тугмани босинг:',
      reply_markup: { inline_keyboard: [[{ text: '👋 Мен шу гуруҳдаман', callback_data: 'r' }]] } });
    return tg('sendMessage', { chat_id: A, text: '✅ Гуруҳ уланди. Энди менга аудио юборинг (изоҳига номини ёзинг, масалан «1-дарс») — гуруҳга «✅ Эшитдим» тугмаси билан жойлайман.' });
  }
  // faqat ulangan guruhdagilar a'zo hisoblanadi (bot turgan boshqa guruhlar emas)
  await loadGrp();
  if (c !== grp.id) return;
  for (const u of (m.new_chat_members || [])) await seenUser(u);
  await seenUser(m.from);
}


// ===== Бошқарув панели (тугмалар) =====
const KUNN = ['', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба', 'Якшанба'];
const FEEL_KUN = 40, FEEL_N = 5;
const CMDS = [
  ['panel', '🎛 Бошқарув панели (тугмалар)'], ['holat', 'Созламалар ва навбат'], ['hisobot', 'Ким эшитди, ким эшитмади'],
  ['fel', 'Феъл тестини ҳозир юбориш'], ['fel_k', 'Феъл тести қайси кундан (масалан: /fel_k 1)'],
  ['navbat', 'Аудиоларни навбатга йиғиш'], ['tamom', 'Навбат режимини ўчириш'],
  ['vaqt', 'Юбориш вақти (масалан: /vaqt 08:00)'], ['kunlar', 'Юбориш кунлари (масалан: /kunlar 1,2,3)'],
  ['stat', 'Сайт статистикаси'], ['help', 'Ёрдам']
].map(([command, description]) => ({ command, description }));
let menuSet = false;
async function setMenu() {
  if (menuSet || !A) return; menuSet = true;
  await tg('setMyCommands', { commands: [], scope: { type: 'default' } });
  await tg('setMyCommands', { commands: CMDS, scope: { type: 'chat', chat_id: Number(A) } });
  const g = await loadGrp();
  if (g.ctrl) await tg('setMyCommands', { commands: CMDS, scope: { type: 'chat_member', chat_id: Number(g.ctrl), user_id: Number(A) } });
}
async function holatSt() {
  const [h, md] = await Promise.all([esh('holat', {}), esh('mode', {})]);
  const tx = h.text || '', g = re => ((tx.match(re) || [])[1] || '').trim();
  const kn = g(/Кунлар: ([^\n]*)/).split(/,\s*/).map(x => KUNN.indexOf(x)).filter(x => x > 0);
  const n1 = Number(g(/кейингиси (\d+)-феълдан/)) || 1;
  return { ok: !!h.ok, err: h.err, text: tx.replace(/\n*Ўзгартириш:[^\n]*/, ''), vaqt: g(/Вақт: ([^\n]*)/), kunlar: kn, k: Math.floor((n1 - 1) / FEEL_N) + 1, navbat: md.mode === 'navbat' };
}
const B = (text, d) => ({ text, callback_data: 'p:' + d });
const ORQA = [[B('◀️ Орқага', 'h')]];
async function panelView() {
  const s = await holatSt();
  if (!s.ok) return { text: '❌ Ҳолат олинмади: ' + (s.err || ''), kb: [[B('🔄 Қайта уриниш', 'h')]] };
  const a = (s.k - 1) * FEEL_N + 1;
  return { text: '🎛 Бошқарув панели\n\n' + s.text, kb: [
    [B('🔄 Янгилаш', 'h'), B('📋 Ҳисобот', 'r')],
    [B('🔤 Феълни ҳозир юбориш', 'f')],
    [B('🔢 Феъл куни: ' + s.k + ' (' + a + '–' + (a + FEEL_N - 1) + ')', 'k')],
    [B('📥 Навбат: ' + (s.navbat ? 'ёқиқ ✅' : 'ўчиқ'), 'n')],
    [B('⏰ Вақт: ' + (s.vaqt || '—'), 't'), B('📅 Кунлар', 'd')],
    [B('📈 Статистика', 's')]
  ] };
}
async function panelCb(q) {
  const d = q.data.slice(2), c = q.message.chat.id, mid = q.message.message_id;
  let v = null, note = '';
  const show = x => tg('editMessageText', { chat_id: c, message_id: mid, text: x.text.slice(0, 4000), reply_markup: { inline_keyboard: x.kb } });
  if (d === 'h') v = await panelView();
  else if (d === 'r') { const r = await esh('rep', { id: '' }); v = { text: r.text || ('Ҳисобот олинмади: ' + (r.err || '')), kb: ORQA }; }
  else if (d === 's') v = { text: await stat(), kb: ORQA };
  else if (d === 'f') v = { text: '🔤 Феъл тести ҳозир гуруҳга юборилсинми?', kb: [[B('✅ Ҳа, юбор', 'F'), B('◀️ Йўқ', 'h')]] };
  else if (d === 'F') { const r = await esh('feel', {}); v = { text: r.ok ? '✅ ' + (r.text || 'Феъл тести гуруҳга юборилди.') : '❌ Юборилмади: ' + (r.err || ''), kb: ORQA }; }
  else if (d === 'n') { const s = await holatSt(); await esh('mode', { v: s.navbat ? '' : 'navbat' }); note = s.navbat ? 'Навбат ўчирилди' : 'Навбат ёқилди: энди аудиолар навбатга тушади'; v = await panelView(); }
  else if (d === 'k' || d.startsWith('K:')) {
    let k;
    if (d === 'k') k = (await holatSt()).k;
    else { k = Math.min(FEEL_KUN, Math.max(1, Number(d.slice(2)))); const r = await esh('set', { feel_k: String(k) }); note = r.ok ? 'Сақланди' : 'Хато: ' + (r.err || ''); }
    const a = (k - 1) * FEEL_N + 1;
    v = { text: '🔢 Феъл тести кейинги сафар ' + k + '-кундан чиқади (феъллар ' + a + '–' + (a + FEEL_N - 1) + ').\n\nТанланг:', kb: [
      [B('⏪ −5', 'K:' + (k - 5)), B('◀️ −1', 'K:' + (k - 1)), B(String(k), 'K:' + k), B('+1 ▶️', 'K:' + (k + 1)), B('+5 ⏩', 'K:' + (k + 5))],
      [B('1-кун (бошидан)', 'K:1')], ...ORQA] };
  }
  else if (d === 't' || d.startsWith('T:')) {
    if (d.startsWith('T:')) { const r = await esh('set', { vaqt: d.slice(2) }); note = r.ok ? 'Вақт: ' + d.slice(2) : 'Хато: ' + (r.err || ''); }
    const s = await holatSt(), rows = [];
    for (let h = 5; h <= 22; h += 3) rows.push([0, 1, 2].map(i => { const t = String(h + i).padStart(2, '0') + ':00'; return B((t === s.vaqt ? '✅ ' : '') + t, 'T:' + t); }));
    v = { text: '⏰ Автомат юбориш вақти: ' + (s.vaqt || '—') + '\n\nБошқа дақиқа керак бўлса, ёзинг: /vaqt 08:30', kb: [...rows, ...ORQA] };
  }
  else if (d === 'd' || d.startsWith('D:')) {
    let kn = (await holatSt()).kunlar;
    if (d.startsWith('D:')) {
      const x = Number(d.slice(2)); kn = kn.includes(x) ? kn.filter(y => y !== x) : [...kn, x].sort();
      if (!kn.length) note = 'Камида битта кун қолсин';
      else { const r = await esh('set', { kunlar: kn.join(',') }); note = r.ok ? 'Сақланди' : 'Хато: ' + (r.err || ''); }
      kn = (await holatSt()).kunlar;
    }
    const btn = i => B((kn.includes(i) ? '✅ ' : '▫️ ') + KUNN[i], 'D:' + i);
    v = { text: '📅 Юбориш кунлари — босиб белгиланг ёки олиб ташланг:', kb: [[btn(1), btn(2)], [btn(3), btn(4)], [btn(5), btn(6)], [btn(7)], ...ORQA] };
  }
  if (v) await show(v);
  return tg('answerCallbackQuery', { callback_query_id: q.id, text: note });
}

async function callback(q) {
  const d = q.data || '';
  if (d.startsWith('p:')) { if (!A || String(q.from.id) !== A) return tg('answerCallbackQuery', { callback_query_id: q.id, text: 'Фақат админ учун' }); return panelCb(q); }
  let text = '';
  if (d === 'r') { seen.delete(q.from.id); await seenUser(q.from); text = 'Рўйхатга олиндингиз ✅'; }
  else if (d === 'x') text = 'Бу аудионинг муддати тугаган.';
  else if (d.startsWith('e:')) { const r = await esh('mark', { id: d.slice(2), user: q.from }); text = r.text || 'Хатолик, қайта босинг.'; }
  return tg('answerCallbackQuery', { callback_query_id: q.id, text, show_alert: false });
}

// Админ юборган аудиони гуруҳга жойлаш
async function postAudio(m) {
  const c = String(m.chat.id), f = m.audio || m.voice || m.document || m.video;
  const cf = await esh('cfg', {});
  if (!cf.ok || !cf.group) return tg('sendMessage', { chat_id: c, text: '❌ Гуруҳ уланмаган. Ботни гуруҳга админ қилиб қўшинг ва гуруҳда /ulash деб ёзинг.' + (cf.err ? '\n(' + cf.err + ')' : '') });
  const title = (m.caption || (f && (f.title || f.file_name)) || 'Аудио').trim().split('\n')[0].replace(/\.(m4a|mp3|ogg|oga|opus|wav|aac|mp4)$/i, '').slice(0, 80);
  const id = Date.now().toString(36);
  const x = await tg('copyMessage', { chat_id: cf.group, from_chat_id: c, message_id: m.message_id });
  if (!x.ok) return tg('sendMessage', { chat_id: c, text: '❌ Юборилмади: ' + (x.description || '') });
  const r = await esh('post', { id, title, chat: cf.group, msg: x.result.message_id });
  return tg('sendMessage', { chat_id: c, reply_to_message_id: m.message_id, text: '✅ Гуруҳга юборилди: «' + title + '» + сўровнома\n⏰ Муддат: ' + (r.deadline || 'бугун 24:00') + '\n\n/hisobot — ким эшитди, ким эшитмади.' });
}

const KIND = { voice: 'овозли хабар', video_note: 'видео-доира', sticker: 'стикер', photo: 'расм',
  video: 'видео', document: 'файл', audio: 'аудио', animation: 'GIF', location: 'жойлашув', contact: 'контакт' };

async function handle(m) {
  const c = String(m.chat.id), t = (m.text || '').trim().replace(/^(\/\w+)@\w+/, '$1').replace(/^\/\w+/, x => x.toLowerCase());
  let ctrl = false;
  if (m.chat.type === 'group' || m.chat.type === 'supergroup') {
    // boshqaruv guruhi: admin buyruq va audiolarni shu yerda yozadi
    if (t.split('@')[0] === '/boshqaruv' && A && String(m.from && m.from.id) === A) {
      const r = await esh('ctrl', { chat: c }); grp = null;
      return tg('sendMessage', { chat_id: c, text: r.ok ? '✅ Бу гуруҳ энди бошқарув чати. Аудио ва буйруқларни шу ерга ёзинг (/help).' : '❌ ' + (r.err || '') });
    }
    await loadGrp();
    if (grp.ctrl && c === grp.ctrl && A && String(m.from && m.from.id) === A) ctrl = true;
    else return group(m);
  } else if (m.chat.type !== 'private') return;
  if (t === '/id') return tg('sendMessage', { chat_id: c, text: 'ID: ' + c });

  // Admin javobi
  if (A && (c === A || ctrl)) {
    if (t === '/panel') { setMenu(); const v = await panelView(); return tg('sendMessage', { chat_id: c, text: v.text, reply_markup: { inline_keyboard: v.kb } }); }
    if (t === '/stat') return tg('sendMessage', { chat_id: c, text: await stat() });
    if (t.startsWith('/hisobot')) { const r = await esh('rep', { id: t.split(' ')[1] || '' }); return tg('sendMessage', { chat_id: c, text: r.text || ('Ҳисобот олинмади: ' + (r.err || '')) }); }
    if (t === '/navbat') { await esh('mode', { v: 'navbat' }); const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: '📥 Навбат режими ёқилди. Энди аудиоларни кетма-кет юборинг (изоҳига номини ёзинг) — улар навбатга тушади.\nТугатгач: /tamom\n\n' + (h.text || '') }); }
    if (t === '/tamom') { await esh('mode', { v: '' }); const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: '✅ Навбат режими ўчирилди. Энди юборилган аудио дарҳол гуруҳга кетади.\n\n' + (h.text || '') }); }
    if (/^\/fee?l_k\b/.test(t)) {
      const v = t.split(/\s+/)[1];
      if (!v) { const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: 'Феъл тестини қайси кундан бошлаш: /fel_k 1 (1 — энг бошидан)\n\n' + (h.text || '') }); }
      const r = await esh('set', { feel_k: v });
      return tg('sendMessage', { chat_id: c, text: r.ok ? '✅ Феъл тести ' + v + '-кундан давом этади.' : '❌ ' + (r.err || '') });
    }
    if (t === '/fel' || t === '/feel') { const r = await esh('feel', {}); return tg('sendMessage', { chat_id: c, text: r.ok ? '🔤 ' + (r.text || 'Феъл тести гуруҳга юборилди.') : '❌ Юборилмади: ' + (r.err || '') }); }
    if (t === '/holat') { const h = await esh('holat', {}); return tg('sendMessage', { chat_id: c, text: h.text || ('Олинмади: ' + (h.err || '')) }); }
    if (t.startsWith('/vaqt') || t.startsWith('/kunlar')) {
      const v = t.split(/\s+/).slice(1).join(',');
      const r = await esh('set', t.startsWith('/vaqt') ? { vaqt: v } : { kunlar: v });
      return tg('sendMessage', { chat_id: c, text: r.ok ? '✅ Сақланди.\n\n' + r.text : '❌ ' + (r.err || '') });
    }
    if (!m.reply_to_message && (m.audio || m.voice || m.document || m.video)) {
      const md = await esh('mode', {});
      if (md.mode === 'navbat') {
        const kind = m.audio ? 'audio' : m.voice ? 'voice' : m.video ? 'video' : 'document', f = m[kind];
        const title = (m.caption || f.title || f.file_name || 'Аудио').trim().split('\n')[0].replace(/\.(m4a|mp3|ogg|oga|opus|wav|aac|mp4)$/i, '').slice(0, 80);
        const r = await esh('queue', { title, file_id: f.file_id, kind });
        return tg('sendMessage', { chat_id: c, reply_to_message_id: m.message_id, text: r.ok ? '📥 Навбатга қўшилди: «' + title + '» (навбатда ' + r.n + ' та)' : '❌ ' + (r.err || '') });
      }
      return postAudio(m);
    }
    if (t === '/start' || t === '/help') { await setMenu(); return tg('sendMessage', { chat_id: c, text: 'Сиз — админсиз.\n\n• /panel — 🎛 тугмали бошқарув панели (энг қулайи).\n• Кимдир ботга ёзса, хабари шу ерга 💬 белгиси билан келади.\n• Жавоб бериш учун ўша хабарга Reply қилинг (матн, овоз, расм — ҳаммаси бўлади).\n• /stat — статистика.\n• /boshqaruv — (алоҳида гуруҳда ёзилади) ўша гуруҳни бошқарув чати қилади: аудио ва буйруқлар ўша ерда.\n• Аудио юборсангиз (изоҳига номини ёзинг) — гуруҳга сўровнома билан жойланади (муддат — шу куни 24:00).\n• /hisobot — охирги аудиони ким эшитди, ким эшитмади.\n• /navbat — аудиоларни навбатга йиғиш (автомат юбориш учун), /tamom — тугатиш.\n• /holat — автомат юбориш созламалари ва навбат.\n• /fel_k 1 — феъл тестини қайси кундан бошлаш (1 — бошидан).\n• /fel — феъл тестини ҳозир юбориш (одатда аудио билан бирга ўзи чиқади).\n• /vaqt 08:00 — юбориш вақти; /kunlar 1,2,3,4,5,6 — кунлар (1 — Душанба).\n\nСинаб кўриш учун бошқа аккаунтдан ёзинг.' }); }
    const r = m.reply_to_message;
    const id = r && ((r.text || r.caption || '').match(/ID (\d+)/) || [])[1];
    if (!id) return tg('sendMessage', { chat_id: c, text: 'Жавоб бериш учун 💬 белгили хабарга Reply қилинг.' });
    const x = await tg('copyMessage', { chat_id: id, from_chat_id: c, message_id: m.message_id });
    if (x.ok) return tg('setMessageReaction', { chat_id: c, message_id: m.message_id, reaction: [{ type: 'emoji', emoji: '👍' }] });
    return tg('sendMessage', { chat_id: c, reply_to_message_id: m.message_id, text: '❌ Юборилмади: ' + (x.description || '') });
  }

  if (t === '/start') await tg('sendMessage', { chat_id: c, text: 'Ассалому алайкум! Хабарингизни ёзинг, биз жавоб берамиз.' });
  if (!A) return;

  const f = m.from || {};
  const nm = [f.first_name, f.last_name].filter(Boolean).join(' ') || '(номсиз)';
  const head = '💬 ' + nm + ' (' + (f.username ? '@' + f.username : '-') + ', ID ' + c + ')';

  if (m.text) return tg('sendMessage', { chat_id: A, text: head + '\n\n' + m.text });
  // Media: imkon bo'lsa izoh (caption) bilan bitta xabar
  const cap = head + (m.caption ? '\n\n' + m.caption : '');
  const x = await tg('copyMessage', { chat_id: A, from_chat_id: c, message_id: m.message_id, caption: cap });
  if (x.ok && !m.sticker && !m.video_note && !m.location && !m.contact) return;
  const k = Object.keys(KIND).find(key => m[key]);
  const h = await tg('sendMessage', { chat_id: A, text: head + '\n\n[' + (k ? KIND[k] : 'хабар') + ']' });
  if (!x.ok) await tg('copyMessage', { chat_id: A, from_chat_id: c, message_id: m.message_id, reply_to_message_id: h.ok ? h.result.message_id : undefined });
}

module.exports = async (req, res) => {
  if (!T) return res.status(500).send('BOT_TOKEN yo\'q');
  if (req.method === 'GET') {
    if (req.query.setup) {
      const url = 'https://' + req.headers.host + '/api/tg';
      const r = await tg('setWebhook', { url, secret_token: SECRET, drop_pending_updates: true, allowed_updates: ['message', 'callback_query', 'poll_answer'] });
      menuSet = false; await setMenu();
      return res.status(200).json({ ...r, admin: A ? 'bor' : 'ADMIN_ID qo\'yilmagan' });
    }
    return res.status(200).send('ok');
  }
  if (req.headers['x-telegram-bot-api-secret-token'] !== SECRET) return res.status(401).send('no');
  try {
    if (req.body && req.body.message) await handle(req.body.message);
    else if (req.body && req.body.callback_query) await callback(req.body.callback_query);
    else if (req.body && req.body.poll_answer) { const a = req.body.poll_answer; await esh('ans', { poll: a.poll_id, user: a.user, opt: a.option_ids }); }
  } catch (e) { console.error(e); }
  res.status(200).send('ok');
};
