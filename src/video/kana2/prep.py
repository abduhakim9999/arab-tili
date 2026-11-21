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
# Bo'lak boshiga qo'shimchali shakl qo'yilmaydi (qisqa chiqadi). Tekshiruv: tekshir.py.
# Uslub (20.11.2026, foydalanuvchi): ustozdek sodda, o'xshatish va kundalik misol bilan; har gapda bitta fikr.
TXT = {
 'u0': "Hamma o'z o'tmishini «edim» bilan eslaydi: «men kichkina edim», «men tolib edim». O'tgan safar gapga bir mehmon kirgan edi: /ˈkaːna/. Bugun uning o'ziga mehmon keladi — «men». Arabchada «men» alohida turmaydi, fe'lning etagiga yopishadi.",
 'u0b': "Lekin qarang: alif yo'q! Mehmon kelganda u qayerga ketdi?",
 'u1': "/ˈkaːna/ — bu so'zning ichida bir sir bor: alif aslida vov bo'lgan — /ˈkawana/. Vov — «illat harfi», ya'ni kasalmand harf: nozik, bosimga chidamaydi. O'zi fathali, oldida ham fatha — ikki fatha orasida qolib, alifga aylangan. Bunday fe'l «ajvaf» deyiladi: nay kabi ichi bo'sh.",
 'u2': "Endi mehmon keladi — «tu». Nun jim bo'ladi: sukun oladi. Alif ham jim. Ikki jim harf yonma-yon — tor eshikda ikki kishi to'qnashgandek: biri yo'l berishi kerak. Kasalmandi — alif chiqib ketadi. Lekin vov izsiz ketmaydi: kofga zammani esdalik qoldiradi. Zamma — kichkina vovning o'zi-ku! Mana — /ˈkuntu/.",
 'u2b': "Mehmon harakatli bo'lsa, doim shunday: «men», «sen», «biz», «siz» deganda alif yo'l beradi. «U» va «ular» deganda joyida qoladi — faqat ayollar haqidagi «ular»dan tashqari: /ˈkunna/.",
 'u3': "Bu mehmonlar sizga tanish: oddiy fe'lda ular fo'il bo'ladi — /kaˈtabtu/, «men yozdim». /ˈkaːna/ — unda esa xuddi shu zamir uning ismi bo'ladi. Zamir mabniy: qishin-yozin bitta kiyimda yuradi. Lekin o'tirgan joyi — to'r, rafning joyi; shuning uchun «raf o'rinda» deymiz. Xabar esa odatdagidek nasbda.",
 'u3b': "Ba'zan zamir parda ortida turadi: ko'rinmaydi, lekin uyda. «Ha, u katta edi».",
 'u4': "Muzoriyda vov sog'ayib, o'z joyiga qaytadi: /jaˈkuːnu/, «bo'ladi». Demak, alif chindan ham vov bo'lgan ekan. Buyruq esa qisqa bo'ladi: /kun/ — «bo'l». Bu yerda ham ikki jim harf to'qnashib, vov yana yo'l beradi. Buyruq qarshingizdagi odamga aytiladi, shuning uchun ismi — yashirin «sen». «Ey tolib, toza bo'l».",
 'u5': "/ˈkaːna/ — eski surat ramkasiga o'xshaydi: ichiga qaysi ishni qo'ysangiz, xotiraga aylanadi. «O'qiydi»ni ramkaga solsak — «o'qir edi».",
 'u5b': "Ramka ichidagi xabar — butun bir jumla. Jumlaga fatha taqib bo'lmaydi, shuning uchun «nasb o'rinda» deymiz. Bolalik suratini eslang: «biz o'ynar edik».",
 'u6': "Xulosa: /ˈkaːna/ — «edi», /jaˈkuːnu/ — «bo'ladi», /kun/ — «bo'l». Ularga ulangan zamir — /ˈkaːnaniŋ/ ismi. Endi sinab ko'ring: «Biz xursand edik» — bo'sh joyga qaysi biri mos?",
 'u6b': "To'g'ri — /ˈkunnaː/: «biz» ulangan, alif tushgan. Keyingi videoda: xabar ko'rinmasa — u qayerga yashirinadi?",
 'a0': "كُنْتُ طَالِبَنْ.", 'a3': "نَعَمْ، كَانَ كَبِيرَنْ.", 'a4': "كُنْ نَظِيفَنْ يَا طَالِبُ.",
 'a5': "كَانَ الطَّالِبُ يَدْرُسُ.", 'a5b': "كُنَّا نَلْعَبُ.", 'a6': "كُنَّا فَرِحِينَ.",
}
# Ovoz (20.11.2026, foydalanuvchi): o'zbekcha — Farruh 9TwIsobDB8LwfbmaVTlt, arabcha — Abdullah; eleven_v4; flow spQhaz1Cu81XaZmR14ig (18 bo'lak ≈ 1994 kredit)
SEQ = [
 ('S0', [('lead', 0.6), 'u0', ('gap', 0.3), 'a0', ('gap', 0.5), 'u0b', ('gap', 0.9)]),
 ('S1', [('lead', 0.2), 'u1', ('gap', 0.8)]),
 ('S2', [('lead', 0.2), 'u2', ('gap', 0.5), 'u2b', ('gap', 0.9)]),
 ('S3', [('lead', 0.2), 'u3', ('gap', 0.45), 'u3b', ('gap', 0.3), 'a3', ('gap', 0.9)]),
 ('S4', [('lead', 0.2), 'u4', ('gap', 0.3), 'a4', ('gap', 0.9)]),
 ('S5', [('lead', 0.2), 'u5', ('gap', 0.3), 'a5', ('gap', 0.45), 'u5b', ('gap', 0.3), 'a5b', ('gap', 0.9)]),
 ('S6', [('lead', 0.4), 'u6', ('gap', 2.8), 'a6', ('gap', 0.45), 'u6b', ('gap', 2.6)]),
]
# Qadam vaqtlari (bo'lak boshidan, soniya) — tekshir.py --zich chiqishiga qarab qo'lda. Ma'nosi video.html dagi izohlarda.
CUE = {}
try: CUE = json.load(open(f'{D}/cue.json'))
except Exception: pass
TARGET = 10 ** (-21 / 20)   # faol qismning RMS darajasi


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
    clips = {}; t = 0.0; scenes = []; parts = []
    for sid, items in SEQ:
        s0 = t
        for it in items:
            if isinstance(it, tuple): t += it[1]; continue
            y = prep(it); dur = len(y) / SR
            clips[it] = {'s': round(t, 3), 'e': round(t + dur, 3), 'c': [round(t + c, 3) for c in CUE.get(it, [0])]}
            parts.append((t, y)); t += dur
        scenes.append({'id': sid, 's': round(s0, 3), 'e': round(t, 3)})
    total = np.ceil(t * 30) / 30
    out = np.zeros(int(total * SR) + 1)
    for st, y in parts:
        i = int(st * SR); out[i:i + len(y)] += y
    wav_write(f'{D}/narr.wav', out)
    tl = {'dur': round(float(total), 3), 'fps': 30, 'clips': clips, 'scenes': scenes}
    json.dump(tl, open(f'{D}/tl.json', 'w'), indent=1)
    open(f'{D}/tl.js', 'w').write('window.TL=' + json.dumps(tl) + ';')
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
    with wave.open(f'{D}/narr.wav') as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64) / 32767
    cache = {}
    for ev in events:
        name, t = ev[0], ev[1]; k = ev[2] if len(ev) > 2 else 1
        if name not in cache: cache[name] = sfx(name)
        y = cache[name] * VOL[name] * k; i = int(t * SR)
        if i < 0 or i >= len(x): continue
        m = min(len(y), len(x) - i); x[i:i + m] += y[:m]
    wav_write(f'{D}/mix.wav', x)
    return len(events)


if __name__ == '__main__':
    main()
