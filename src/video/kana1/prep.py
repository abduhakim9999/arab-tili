#!/usr/bin/env python3
"""Grammatika videosi: ovoz bo'laklari -> narr.wav + vaqt jadvali (tl.json, tl.js); tovush effektlari -> mix.wav.
Har bo'lak ElevenLabs'da ALOHIDA yasalgan (ovoz/NAME.mp3) — kesilmaydi, faqat chet jimlik olinadi, balandlik tenglanadi.
  python3 prep.py            — narr.wav, tl.json, tl.js
  (mix.wav ni render.py join yozadi: sahifadagi window.SFX ro'yxati bo'yicha mix() chaqiriladi)"""
import subprocess, json, wave, os
import numpy as np

D = os.path.dirname(os.path.abspath(__file__))
SR = 44100
HOP = int(SR * 0.01)

# Talaffuz ro'yxati (20.11.2026, foydalanuvchi tanlovi — tovush belgisi): ovoz matnida arabcha so'z va harf nomi shunday yoziladi.
#   كَانَ -> /ˈkaːna/ (qo'shimcha bilan /ˈkaːnaniŋ/, /ˈkaːnaɡa/)   مَا -> /maː/   لَا -> /laː/   ت -> "ta"   ي -> "ya"
#   Atamalar: «moziy», «muzoriy» (oxirida «y» bilan — «mozi», «muzori» emas; foydalanuvchi, 20.11.2026).
# Bo'lak boshiga qo'shimchali shakl qo'yilmaydi (qisqa chiqadi). Tekshiruv: tekshir.py.
# Uslub (20.11.2026, foydalanuvchi): ustozdek sodda, o'xshatish va kundalik misol bilan; har gapda bitta fikr.
# 4-nusxa: «bo'ysunish» zanjiri — kaana xabariga buyuradi (nasb), o'zi esa ismiga bo'ysunadi (muannas «ta»).
TXT = {
 # 2-qism (KANA_QISM=2): p0 kirish, j1 «faqat jinsda», p8 xulosa + savol, p9 javob, a10 savol javobi (arabcha)
 'p0': "O'tgan safar /ˈkaːna/ xabariga buyurdi: \"Oxiringni o'zgartir!\" Xabar fatha oldi. Lekin hamma so'z ham fatha ololmaydi-ku?",
 'j1': "E'tibor bering: ismi ikkita yoki ko'p bo'lsa ham, /ˈkaːna/ birlikda turibdi. U ismiga faqat jinsda ergashadi, sonda emas.",
 'p8': "Xulosa: nasbning uch alomati — fatha, \"ya\" va kasra. /ˈkaːna/ ismiga faqat jinsda ergashadi. Muzoriysi — /jaˈkuːnu/, inkori — /maː/ va /laː/. Endi sinab ko'ring: \"Ikki tolib katta edi\" — xabar qanday bo'ladi?",
 'p9': "To'g'ri — \"ya\" bilan. Keyingi videoda — /ˈkaːna/ va zamirlar.",
 'a10': "كَانَ الطَّالِبَانِ كَبِيرَيْنِ.",
 'u0': "O'zbekchada \"havo chiroyli\" deymiz. Kechagi kun haqida gapirsak-chi? Oxiriga bitta so'z qo'shamiz: \"havo chiroyli edi\". Arab tilida ham shunday so'z bor. Faqat u gapning oxiriga emas, boshiga keladi. Va kelib jim turmaydi — gapning oxirini o'zgartirib ketadi. Bu so'z — /ˈkaːna/.",
 't1': "Avval u bilan tanishib olaylik. Kitoblarda uni uch so'z bilan tanitishadi: noqis moziy fe'li.",
 't2': "Fe'l — chunki fe'ldek tuslanadi: muzoriysi ham, muannasi ham bor. Moziy — chunki o'tgan zamonni bildiradi: \"edi\".",
 't3': "Noqis esa \"to'liqsiz\" degani. Oddiy fe'lga bitta so'z yetadi: \"tolib o'tirdi\" — gap tugadi. /ˈkaːna/ bilan esa \"tolib edi\" deb to'xtasak, gap chala qoladi: nima edi? Unga ikkinchi so'z — xabar ham kerak.",
 'u1a': "Keling, buni bitta gapda ko'ramiz.",
 'u1b': "\"Tolib kattadir\". Bu gapda ikki bo'lak bor: mubtado va xabar. Ikkalasi ham raf holatida — oxirlarida zamma.",
 'u2': "Endi shu gapga /ˈkaːna/ mehmondek kirib keladi — lekin o'zini uy egasidek tutadi. Avval mubtadoga qaraydi, unga tegmaydi: mubtado raf holida qolaveradi, faqat yangi nom oladi — endi u /ˈkaːnaniŋ/ ismi. Keyin xabarga yuzlanadi va buyuradi: \"Oxiringni o'zgartir!\" Xabar bo'ysunadi: zammasini qo'yib, fatha oladi. Endi u /ˈkaːnaniŋ/ xabari, holati — nasb.",
 'u3': "\"Tolib katta edi\". Demak, qoida oddiy: /ˈkaːna/ kelsa, ismi — raf, xabari — nasb.",
 'u4': "Tarjimasi ikki xil: voqea qadimda bo'lgan bo'lsa — \"edi\", yaqinda bo'lgan bo'lsa — \"bo'ldi\".",
 'u5': "Lekin bu uy egasining ham o'z kattasi bor — ismi. /ˈkaːna/ xabariga buyuradi-yu, ismiga o'zi bo'ysunadi. Ismi muannas bo'lsa — masalan, toliba — /ˈkaːna/ ham unga moslashadi: oxiriga muannaslik harfi — \"ta\" qo'shiladi. Bir nozik joyi bor: ikki sukun yo'liqib qolmasligi uchun bu \"ta\" keyingi so'zga kasra bilan bog'lanadi.",
 'u6a': "Xabar esa buyruqni har doim bajaradi — faqat har safar o'zicha. Buyruq bitta: nasb. Ijrosi uch xil. Birlikda — fatha. Ikkilikda — \"ya\" harfi.",
 'u6b': "Muannas ko'plikda esa fatha o'rniga kasra keladi.",
 'u7a': "Muzoriysi-chi? U \"bo'ladi\" deb tarjima qilinadi va xuddi shunday ishlaydi.",
 'u7b': "\"Yo'q\" demoqchi bo'lsak-chi? Juda oson: moziy oldidan /maː/, muzoriy oldidan /laː/ qo'yamiz.",
 'u8a': "Xulosa qilamiz. /ˈkaːna/ — arab tilining edisi. Xabariga buyuradi: u nasb bo'ladi. Ismiga esa o'zi ergashadi: ismi rafda qoladi, muannas bo'lsa, /ˈkaːna/ \"ta\" oladi. Endi o'zingizni sinab ko'ring. \"Dars oson edi\" demoqchimiz: bo'sh joyga qaysi biri mos?",
 'u8b': "To'g'ri — fathalisi: u /ˈkaːnaniŋ/ xabari, demak nasbda. Keyingi videoda — /ˈkaːna/ va zamirlar.",
 'a1': "اَلطَّالِبُ كَبِيرُنْ.", 'a2': "كَانَ الطَّالِبُ كَبِيرَنْ.", 'a5': "كَانَتِ الطَّالِبَةُ كَبِيرَتَنْ.",
 'a6b': "كَانَ الطَّالِبَانِ كَبِيرَيْنِ.", 'a6c': "كَانَتِ الطَّالِبَاتُ كَبِيرَاتِنْ.", 'a7a': "يَكُونُ الطَّالِبُ كَبِيرَنْ.",
 'a7b': "مَا كَانَ الطَّالِبُ كَبِيرَنْ.", 'a9': "كَانَ الدَّرْسُ سَهْلَنْ.",
}
SEQ = [
 ('S0', [('lead', 0.6), 'u0', ('gap', 1.5)]),
 ('ST', [('lead', 0.5), 't1', ('gap', 0.35), 't2', ('gap', 0.4), 't3', ('gap', 0.8)]),   # tanishuv: noqis moziy fe'li
 ('S1', [('lead', 0.3), 'u1a', ('gap', 0.3), 'a1', ('gap', 0.35), 'u1b', ('gap', 0.45)]),
 ('S2', [('lead', 0.0), 'u2', ('gap', 0.35), 'a2', ('gap', 0.45)]),
 ('S3', [('lead', 0.0), 'u3', ('gap', 0.45), 'u4', ('gap', 0.8)]),
 ('S5', [('lead', 0.5), 'u5', ('gap', 0.35), 'a5', ('gap', 0.9)]),
 ('S6', [('lead', 0.5), 'u6a', ('gap', 0.3), 'a6b', ('gap', 0.4), 'u6b', ('gap', 0.3), 'a6c', ('gap', 0.9)]),
 ('S7', [('lead', 0.5), 'u7a', ('gap', 0.3), 'a7a', ('gap', 0.5), 'u7b', ('gap', 0.3), 'a7b', ('gap', 0.9)]),
 ('S8', [('lead', 0.5), 'u8a', ('gap', 2.8), 'a9', ('gap', 0.45), 'u8b', ('gap', 2.6)]),
]
# Qadam vaqtlari (bo'lak boshidan, soniya) — tekshir.py --zich chiqishiga qarab qo'lda. Ma'nosi video.html dagi izohlarda.
CUE = {}
try: CUE = json.load(open(f'{D}/cue.json'))
except Exception: pass
TARGET = 10 ** (-21 / 20)   # faol qismning RMS darajasi


# 1-qism (asosiy video, Shorts uchun 3:00 gacha): S6 «Насб аломатлари» va S7 «Музорий ва инкор» siz;
# KANA_QISM=hammasi — eski to'liq ketma-ketlik (2-qism shu ikki sahnadan alohida video bo'ladi).
QISM = os.environ.get('KANA_QISM', '1'); SUF = '2' if QISM == '2' else ''      # 2-qism fayllari: tl2.json, tl2.js, narr2.wav, mix2.wav
if QISM == '1': SEQ = [x for x in SEQ if x[0] not in ('S6', 'S7')]
if QISM == '2':
    _s = dict(SEQ)
    SEQ = [('P0', [('lead', 1.9), 'p0', ('gap', 0.6)]),
           ('S6', _s['S6'][:-1] + [('gap', 0.5), 'j1', ('gap', 0.8)]),
           ('S7', _s['S7']),
           ('P8', [('lead', 0.5), 'p8', ('gap', 2.8), 'a10', ('gap', 0.45), 'p9', ('gap', 2.6)])]


def sub(n):                                    # qoralama subtitri: tovush belgilari o'rniga oddiy yozuv
    t = TXT[n]
    for a, b in (('/ˈkaːnaniŋ/', 'kaananing'), ('/ˈkaːna/', 'kaana'), ('/jaˈkuːnu/', 'yakuunu'), ('/maː/', 'maa'), ('/laː/', 'laa')): t = t.replace(a, b)
    return t


def load(n):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{D}/ovoz/{n}.mp3', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def rms_db(x):
    n = len(x) // HOP
    r = np.sqrt((x[:n * HOP].reshape(n, HOP) ** 2).mean(axis=1) + 1e-12)
    return 20 * np.log10(np.convolve(r, np.ones(3) / 3, mode='same') + 1e-9)


def prep(n):
    x = load(n); db = rms_db(x); act = np.where(db > db.max() - 38)[0]
    a, b = max(0, act[0] * HOP - int(0.03 * SR)), min(len(x), (act[-1] + 1) * HOP + int(0.16 * SR))
    y = x[a:b].copy(); fi, fo = int(0.008 * SR), int(0.07 * SR)
    y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    d2 = rms_db(y); on = d2 > (d2.max() - 30)
    y *= TARGET / np.sqrt((y[:len(on) * HOP].reshape(-1, HOP)[on] ** 2).mean())
    pk = np.abs(y).max()
    if pk > 0.9: y *= 0.9 / pk
    return y


def wav_write(p, x):
    with wave.open(p, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def main():
    clips = {}; t = 0.0; scenes = []; parts = []; draft = False
    for sid, items in SEQ:
        s0 = t
        for it in items:
            if isinstance(it, tuple): t += it[1]; continue
            if os.path.exists(f'{D}/ovoz/{it}.mp3'): y = prep(it); ph = False
            else: y = np.zeros(int(max(1.2, len(sub(it)) / (9.5 if it[0] == 'a' else 13.5)) * SR)); ph = True     # ovozi hali yo'q — jim joy (qoralama)
            dur = len(y) / SR
            clips[it] = {'s': round(t, 3), 'e': round(t + dur, 3), 'c': [round(t + c, 3) for c in CUE.get(it, [0])]}
            if ph: clips[it]['ph'] = 1; draft = True
            if it[0] != 'a': clips[it]['t'] = sub(it)
            parts.append((t, y)); t += dur
        scenes.append({'id': sid, 's': round(s0, 3), 'e': round(t, 3)})
    total = np.ceil(t * 30) / 30
    out = np.zeros(int(total * SR) + 1)
    for st, y in parts:
        i = int(st * SR); out[i:i + len(y)] += y
    wav_write(f'{D}/narr{SUF}.wav', out)
    tl = {'dur': round(float(total), 3), 'fps': 30, 'clips': clips, 'scenes': scenes}
    if draft: tl['draft'] = 1
    json.dump(tl, open(f'{D}/tl{SUF}.json', 'w'), indent=1)
    open(f'{D}/tl{SUF}.js', 'w').write('window.TL=' + json.dumps(tl) + ';')
    print('jami', round(float(total), 2), 's;', len(parts), "bo'lak;", ' '.join(f"{s['id']}={s['s']:.1f}" for s in scenes))


# ---- Tovush effektlari (sintez, bepul; juda past ovozda) ----
def _env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)


def _noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def _bp(x, f0, f1, q=2.2):                       # markazi f0 -> f1 ga siljiydigan rezonator
    y = np.zeros(len(x)); y1 = y2 = 0.0; n = len(x)
    for i in range(n):
        f = f0 * (f1 / f0) ** (i / n); w = 2 * np.pi * f / SR; r = 1 - w / (2 * q)
        v = (1 - r) * x[i] + 2 * r * np.cos(w) * y1 - r * r * y2
        y2 = y1; y1 = v; y[i] = v
    return y


def sfx(name):
    if name == 'whoosh':                         # sirpanib o'tish
        n = int(0.55 * SR); e = np.sin(np.pi * np.arange(n) / n) ** 2.2
        y = _bp(_noise(n, 1), 500, 3200) * e
    elif name == 'whoosh2':                      # teskari (pasayuvchi)
        n = int(0.5 * SR); e = np.sin(np.pi * np.arange(n) / n) ** 2.2
        y = _bp(_noise(n, 2), 2800, 450) * e
    elif name == 'pop':                          # yorliq chiqishi
        n = int(0.14 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * np.cumsum(880 * np.exp(-t / 0.05) + 260) / SR) * _env(n, 0.002, 0.035)
    elif name == 'thud':                         # so'z qo'nishi
        n = int(0.32 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * np.cumsum(140 * np.exp(-t / 0.06) + 62) / SR) * _env(n, 0.003, 0.09) + 0.25 * _bp(_noise(n, 3), 1800, 900) * _env(n, 0.001, 0.02)
    elif name == 'shimmer':                      # harakat o'zgarishi
        n = int(0.7 * SR); y = np.zeros(n)
        for k, f in enumerate([2093, 2637, 3136, 3951]):
            o = int(k * 0.035 * SR); m = n - o
            y[o:] += np.sin(2 * np.pi * f * np.arange(m) / SR) * _env(m, 0.004, 0.16) / (k + 1.5)
    elif name == 'chime':                        # to'g'ri javob
        n = int(1.3 * SR); y = np.zeros(n)
        for o, f in [(0, 1046.5), (0.11, 1568)]:
            i = int(o * SR); m = n - i; t = np.arange(m) / SR
            y[i:] += (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3 * f * t)) * _env(m, 0.004, 0.33)
    elif name == 'tick':                         # sanoq
        n = int(0.06 * SR); t = np.arange(n) / SR
        y = np.sin(2 * np.pi * 1700 * t) * _env(n, 0.001, 0.012)
    else: raise KeyError(name)
    return y / (np.abs(y).max() + 1e-9)


VOL = {'whoosh': 0.085, 'whoosh2': 0.08, 'pop': 0.10, 'thud': 0.20, 'shimmer': 0.05, 'chime': 0.09, 'tick': 0.06}


def mix(events):
    """events: [[nom, soniya, kuch(ixtiyoriy)], ...] -> mix.wav (narr.wav + effektlar)"""
    with wave.open(f'{D}/narr{SUF}.wav') as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32767
    cache = {}
    for ev in events:
        name, t = ev[0], ev[1]; k = ev[2] if len(ev) > 2 else 1
        if name not in cache: cache[name] = sfx(name)
        y = cache[name] * VOL[name] * k; i = int(t * SR)
        if i < 0 or i >= len(x): continue
        m = min(len(y), len(x) - i); x[i:i + m] += y[:m]
    wav_write(f'{D}/mix{SUF}.wav', x)
    return len(events)


if __name__ == '__main__':
    main()
