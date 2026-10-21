// Telegram bot (Vercel). Env: BOT_TOKEN, ADMIN_ID
// O'rnatish: https://<loyiha>.vercel.app/api/tg?setup=1 ni bir marta oching.
const crypto = require('crypto');
const T = process.env.BOT_TOKEN, A = String(process.env.ADMIN_ID || '').trim();
const STAT = 'https://script.google.com/macros/s/AKfycbxksQz-jII6bVIWKgl63gfASBRDr4SGsScYJg0jogaulyzOoVluyGtf6pU1TIZV-ntRcA/exec';
const KEY = crypto.createHash('sha256').update('stat:' + T).digest('hex').slice(0, 32);
const SECRET = crypto.createHash('sha256').update(String(T)).digest('hex').slice(0, 40);

async function tg(m, p) {
  const r = await fetch('https://api.telegram.org/bot' + T + '/' + m, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
  });
  return r.json();
}

async function stat() {
  try {
    const d = await (await fetch(STAT + '?k=' + KEY)).json();
    if (!d.ok) return 'Статистика олинмади.';
    const L = a => a.length ? a.slice(0, 40).map((x, i) => (i + 1) + '. ' + x).join('\n') + (a.length > 40 ? '\n…' : '') : '—';
    return '📊 Статистика\n\nЖами кирганлар: ' + d.total + '\nБугун: ' + d.today.length + '\nҲозир: ' + d.now.length +
      '\n\n🟢 Ҳозир ишлаётганлар:\n' + L(d.now) + '\n\n📅 Бугун кирганлар:\n' + L(d.today);
  } catch (e) { return 'Статистика олинмади: ' + e.message; }
}

const KIND = { voice: 'овозли хабар', video_note: 'видео-доира', sticker: 'стикер', photo: 'расм',
  video: 'видео', document: 'файл', audio: 'аудио', animation: 'GIF', location: 'жойлашув', contact: 'контакт' };

async function handle(m) {
  const c = String(m.chat.id), t = (m.text || '').trim();
  if (m.chat.type !== 'private') return;
  if (t === '/id') return tg('sendMessage', { chat_id: c, text: 'ID: ' + c });

  // Admin javobi
  if (A && c === A) {
    if (t === '/stat') return tg('sendMessage', { chat_id: c, text: await stat() });
    if (t === '/start' || t === '/help') return tg('sendMessage', { chat_id: c, text: 'Сиз — админсиз.\n\n• Кимдир ботга ёзса, хабари шу ерга 💬 белгиси билан келади.\n• Жавоб бериш учун ўша хабарга Reply қилинг (матн, овоз, расм — ҳаммаси бўлади).\n• /stat — статистика.\n\nСинаб кўриш учун бошқа аккаунтдан ёзинг.' });
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
      const r = await tg('setWebhook', { url, secret_token: SECRET, drop_pending_updates: true, allowed_updates: ['message'] });
      return res.status(200).json({ ...r, admin: A ? 'bor' : 'ADMIN_ID qo\'yilmagan' });
    }
    return res.status(200).send('ok');
  }
  if (req.headers['x-telegram-bot-api-secret-token'] !== SECRET) return res.status(401).send('no');
  try { if (req.body && req.body.message) await handle(req.body.message); } catch (e) { console.error(e); }
  res.status(200).send('ok');
};
