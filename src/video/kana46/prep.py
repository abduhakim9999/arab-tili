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

# kana46 — 46-dars videosi: «كَانَ нинг исми ва хабари (1)» (reja — docs/kana-video-reja.md 1-bo'lim, 1-qator).
# Matn oddiy lotinchada; «|» — ekrandagi qadam joyi (qoralamada vaqti matn uzunligiga qarab taxmin qilinadi,
# haqiqiy ovozdan keyin cue.json ga aniq vaqtlar yoziladi — tekshir.py --zich). ElevenLabs matni: python3 prep.py matn
# Ovoz (foydalanuvchi qarori, 21.11.2026): hamma o'zbekcha bo'lak bitta ovozda — Farruh; u* (kana1 dagi Davronbek) faqat qoralamada turibdi,
# ovoz bosqichida u* ham Farruhda qayta yoziladi (matni TXT da). a* — Abdullah (tayyor), b* — Abdullah (yangi).
# u5 ning boshidagi ikki gap («uy egasining ham o'z kattasi bor…») kesiladi (CUT) — endi bu fikrni k3b aytadi; fayl o'zi butun turadi.
import re
IPA = {'kaananing': '/ˈkaːnaniŋ/', 'kaanadan': '/ˈkaːnadan/', 'kaanaga': '/ˈkaːnaɡa/', 'kaana': '/ˈkaːna/', 'maa': '/maː/',
       'jamiylun': '/dʒaˈmiːlun/', 'jamiylan': '/dʒaˈmiːlan/'}      # jamiylun/jamiylan — yangi so'z: ovozdan oldin bitta sinov bo'lagi
TXT = {
 # S1 kirish — kirish videosidagi «Охири ўзгарди — нега?» savoli
 'k1': "O'tgan videoda kaana gap boshiga keldi-yu, |«jamiylun» — |«jamiylan» bo'lib qoldi. |Nega?",
 # S2 oddiy gap (tayyor)
 'u1a': "Keling, buni bitta gapda ko'ramiz.",
 'u1b': "«Tolib kattadir». |Bu gapda ikki bo'lak bor: |mubtado |va xabar. |Ikkalasi ham raf holatida — |oxirlarida zamma.",
 # S3 qoida — avval atamalar bilan, kitobdagidek (foydalanuvchi, 21.11.2026: talaba avval tarkibda qanday aytilishini bilsin), keyin sodda tushuntirish
 'k3t': "Kaana — mubtado va xabarning oldiga kirib keladi. |Mubtadoni o'zining ismi qilib oladi: |u raf qilinadi. |Xabarni o'zining xabari qilib oladi: |u nasb qilinadi.",
 # S3b sodda tushuntirish: kaana ikkalasiga ham hukm qiladi (ko'pchilik — basraliklar fikri: ismni ham kaana raf qiladi; kelishilgan 21.11.2026)
 'k3a': "Sodda qilib aytsak, |kaana ikkalasiga ham hukm qiladi. |Mubtadoga: |«Raf bo'l!» |Mubtado jilmayadi: «Men allaqachon rafman». |Oxiri o'zgarmaydi. |Xabarga esa: |«Oxiringni o'zgartir!» |Xabar bo'ysunadi: |zammani qo'yib, |fatha oladi.",
 'k3b': "Lekin ism ham jim qolmaydi: |kerak bo'lsa, kaananing o'zini o'zgartirib qo'yadi. |Qanday qilib? |Birozdan keyin ko'ramiz.",
 # S4 tarjima. «Alloh haqida — doimo» (k4, b4) bu videodan olindi — «Qiyinroq daraja» videosiga (foydalanuvchi, 21.11.2026). Tayyor u3 («Demak, qoida oddiy…») olib tashlandi — qoida endi S3 da aytiladi
 'u4': "Tarjimasi ikki xil: |voqea qadimda bo'lgan bo'lsa — |«edi», |yaqinda bo'lgan bo'lsa — |«bo'ldi».",
 # S5 ismi muannas (tayyor, boshi kesilgan)
 'u5': "Ismi muannas bo'lsa — |masalan, toliba — |kaana ham unga moslashadi: |oxiriga muannaslik harfi — |«ta» qo'shiladi. |Bir nozik joyi bor: |ikki sukun yo'liqib qolmasligi uchun |bu «ta» keyingi so'zga |kasra bilan bog'lanadi.",
 # S6 nasb alomatlari (tayyor) + faqat jinsda (yangi)
 'u6a': "Xabar esa buyruqni har doim bajaradi — |faqat har safar o'zicha. |Buyruq bitta: nasb. |Ijrosi uch xil. |Birlikda — |fatha. |Ikkilikda — |«ya» harfi.",
 'u6b': "Muannas ko'plikda esa |fatha o'rniga |kasra keladi.",
 'k6': "E'tibor bering: |ismi ikkita |yoki ko'p bo'lsa ham, |kaana birlikda turibdi. |U ismiga faqat jinsda moslashadi, |sonda emas.",
 # S7 aqlsiz ko'plik (yangi)
 'k7': "Aqlsiz narsalar ko'pligida esa |xabar oldingi darslardagidek |muannas birlikda keladi, |faqat endi nasbda.",
 # S8 inkor (yangi; arabchasi tayyor — a7b)
 'k8': "Inkor uchun |kaana oldidan |«maa» qo'yamiz: |«bo'lmadi, |emas edi».",
 # S9 xulosa, savol, keyingi video (yangi)
 'k9a': "Xulosa: |kaana kelsa, |ismi raf, |xabari nasb. |Ismi muannas bo'lsa, |kaana «ta» oladi. |Endi sinab ko'ring: |«Ikki toliba katta edi». |Qaysi biri mos?",
 'k9b': "To'g'ri, |«ya» bilan: |ikkilikda nasb alomati shu. |Keyingi video: |qirq yettinchi dars.",
 # arabcha (Abdullah; vaqfsiz — tanvin ovoz matnida «نْ» bilan, ekranda to'g'ri yozuv)
 'a1': "اَلطَّالِبُ كَبِيرُنْ.", 'a2': "كَانَ الطَّالِبُ كَبِيرَنْ.", 'a5': "كَانَتِ الطَّالِبَةُ كَبِيرَتَنْ.",
 'a6b': "كَانَ الطَّالِبَانِ كَبِيرَيْنِ.", 'a6c': "كَانَتِ الطَّالِبَاتُ كَبِيرَاتِنْ.", 'a7b': "مَا كَانَ الطَّالِبُ كَبِيرَنْ.",
 'b7': "كَانَ الثِّيرَانُ كَبِيرَتَنْ.", 'b9': "كَانَتِ الطَّالِبَتَانِ كَبِيرَتَيْنِ.",
}
SEQ = [
 ('S1', [('lead', 0.35), 'k1', ('gap', 0.45)]),                      # muqovasiz: birinchi kadrdan savol (Shorts — birinchi soniya)
 ('S2', [('lead', 0.25), 'u1a', ('gap', 0.3), 'a1', ('gap', 0.35), 'u1b', ('gap', 0.4)]),
 ('S3', [('lead', 0.0), 'k3t', ('gap', 0.4)]),
 ('S3b', [('lead', 0.0), 'k3a', ('gap', 0.5), 'k3b', ('gap', 0.35), 'a2', ('gap', 0.5)]),
 ('S4', [('lead', 0.3), 'u4', ('gap', 0.6)]),
 ('S5', [('lead', 0.45), 'u5', ('gap', 0.3), 'a5', ('gap', 0.7)]),
 ('S6', [('lead', 0.45), 'u6a', ('gap', 0.3), 'a6b', ('gap', 0.35), 'u6b', ('gap', 0.3), 'a6c', ('gap', 0.45), 'k6', ('gap', 0.6)]),
 ('S7', [('lead', 0.45), 'k7', ('gap', 0.3), 'b7', ('gap', 0.6)]),
 ('S8', [('lead', 0.45), 'k8', ('gap', 0.3), 'a7b', ('gap', 0.7)]),
 ('S9', [('lead', 0.45), 'k9a', ('gap', 2.3), 'b9', ('gap', 0.4), 'k9b', ('gap', 2.0)]),
]
CUT = {}                                 # tayyor bo'lakning boshidan kesiladigan qism (soniya, chet jimlik olingandan keyin); cue.json dagi vaqtlar kesilgandan keyingi
ARDUR = {'b7': 2.3, 'b9': 3.1}   # ovozi hali yo'q arabcha bo'laklarning taxminiy uzunligi (qoralamada jim, yozuv ekranda)
SUR = 13.8                             # Farruh ovozining o'rtacha sur'ati (belgi/soniya; kana0 bo'laklaridan) — yakuniy uzunlik taxmini uchun
AR = lambda n: n[0] in 'ab'
CUE = {}
try: CUE = json.load(open(f'{D}/cue.json'))
except Exception: pass
TARGET = 10 ** (-21 / 20)   # faol qismning RMS darajasi


DRAFT = set()


def toza(t): return t.replace('|', '')


def eleven(t): return re.sub(r"\b(" + '|'.join(IPA) + r")\b", lambda m: IPA[m.group(1).lower()], toza(t), flags=re.I)


def load(n):
    p = f'{D}/ovoz/{n}.mp3'
    if not os.path.exists(p):
        DRAFT.add(n); p = f'{D}/qoralama/{n}.wav'
        if not os.path.exists(p): return None
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def rms_db(x):
    n = len(x) // HOP
    r = np.sqrt((x[:n * HOP].reshape(n, HOP) ** 2).mean(axis=1) + 1e-12)
    return 20 * np.log10(np.convolve(r, np.ones(3) / 3, mode='same') + 1e-9)


def prep(n):
    x = load(n)
    if x is None: return np.zeros(int((ARDUR[n] if AR(n) else len(toza(TXT[n])) / SUR) * SR))   # ovoz yo'q — taxminiy uzunlikdagi jimlik
    db = rms_db(x); act = np.where(db > db.max() - 38)[0]
    a, b = max(0, act[0] * HOP - int(0.03 * SR)), min(len(x), (act[-1] + 1) * HOP + int(0.16 * SR))
    y = x[a:b].copy(); fi, fo = int(0.008 * SR), int(0.07 * SR)
    y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    d2 = rms_db(y); on = d2 > (d2.max() - 30)
    y *= TARGET / np.sqrt((y[:len(on) * HOP].reshape(-1, HOP)[on] ** 2).mean())
    pk = np.abs(y).max()
    if pk > 0.9: y *= 0.9 / pk
    if n in CUT:
        y = y[int(CUT[n] * SR):].copy(); y[:fi] *= np.linspace(0, 1, fi)
    return y


def wav_write(p, x):
    with wave.open(p, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def qadam(n, dur):
    """«|» belgilaridan qadam vaqtlari (matn uzunligiga mutanosib) — cue.json da bo'lmasa."""
    parts = TXT[n].split('|'); tot = sum(len(p) for p in parts); acc = 0; out = [0]
    for p in parts[:-1]:
        acc += len(p); out.append(round(dur * acc / tot, 2))
    return out


def main():
    clips = {}; t = 0.0; scenes = []; parts = []; subs = []
    for sid, items in SEQ:
        s0 = t
        for it in items:
            if isinstance(it, tuple): t += it[1]; continue
            y = prep(it); dur = len(y) / SR
            cs = CUE.get(it) or (qadam(it, dur) if not AR(it) else [0])
            clips[it] = {'s': round(t, 3), 'e': round(t + dur, 3), 'c': [round(t + c, 3) for c in cs]}
            if it in DRAFT and not AR(it):                                      # subtitr — faqat ovozi hali yo'q o'zbekcha bo'laklarga (gap bo'yicha)
                gs = [g.strip() for g in re.split(r'(?<=[.?!])\s+', toza(TXT[it]).replace('qirq yettinchi dars', '47-dars')) if g.strip()]; tot = sum(len(g) for g in gs); acc = 0
                for g in gs:
                    subs.append([round(t + dur * acc / tot, 2), round(t + dur * (acc + len(g)) / tot, 2), g]); acc += len(g)
            if it in DRAFT and AR(it): subs.append([round(t, 2), round(t + dur, 2), '(арабчаси ҳақиқий овозда ўқилади)'])
            parts.append((t, y)); t += dur
        scenes.append({'id': sid, 's': round(s0, 3), 'e': round(t, 3)})
    total = np.ceil(t * 30) / 30
    out = np.zeros(int(total * SR) + 1)
    for st, y in parts:
        i = int(st * SR); out[i:i + len(y)] += y
    wav_write(f'{D}/narr.wav', out)
    tl = {'dur': round(float(total), 3), 'fps': 30, 'clips': clips, 'scenes': scenes, 'draft': sorted(DRAFT), 'subs': subs if DRAFT else []}
    json.dump(tl, open(f'{D}/tl.json', 'w'), indent=1, ensure_ascii=False)
    open(f'{D}/tl.js', 'w').write('window.TL=' + json.dumps(tl, ensure_ascii=False) + ';')
    est = float(total) + sum(len(toza(TXT[n])) / SUR - (clips[n]['e'] - clips[n]['s']) for n in clips if not AR(n))      # hamma o'zbekcha bo'lak Farruhda yoziladi
    print(f"haqiqiy ovoz bilan taxminan {int(est // 60)}:{est % 60:04.1f} (chegara 3:00)")
    print('jami', round(float(total), 2), 's;', len(parts), "bo'lak;", ' '.join(f"{s['id']}={s['s']:.1f}" for s in scenes), '| qoralama:', ' '.join(sorted(DRAFT)) or "yo'q")


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


# Haqiqiy tovush effektlari (ElevenLabs Sound Effects v3; foydalanuvchi, 21.11.2026: «Eleven bilan qil») — sfx/NAME.mp3 bo'lsa shu olinadi,
# bo'lmasa pastdagi sintez. Har biri: faol qismi kesib olinadi (THR dB dan baland joy), uzunligi MAXLEN bilan cheklanadi, chetlari so'ndiriladi.
SFXREAL = {  # nom: (bo'sag'a dB, eng ko'p uzunlik s, kirish so'nishi s, chiqish so'nishi s)
 'whoosh': (-24, 0.75, 0.06, 0.18), 'whoosh2': (-24, 0.75, 0.06, 0.18), 'pop': (-35, 0.25, 0.002, 0.06), 'thud': (-35, 0.40, 0.002, 0.10),
 'shimmer': (-35, 0.90, 0.004, 0.25), 'chime': (-40, 1.40, 0.004, 0.35), 'tick': (-35, 0.15, 0.001, 0.04)}


def sfx_real(name):
    p = f'{D}/sfx/{name}.mp3'
    if name not in SFXREAL or not os.path.exists(p): return None
    thr, mx, fi, fo = SFXREAL[name]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-af', 'highpass=f=120', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64); h = int(SR * .005); n = len(x) // h
    e = np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(axis=1) + 1e-12); act = np.where(20 * np.log10(e / e.max()) > thr)[0]
    a = max(0, act[0] * h - int(.008 * SR)); b = min(len(x), (act[-1] + 1) * h + int(fo * SR), a + int(mx * SR))
    y = x[a:b].copy(); i, o = max(1, int(fi * SR)), max(1, int(fo * SR))
    y[:i] *= np.linspace(0, 1, i); y[-o:] *= np.linspace(1, 0, o)
    return y / (np.abs(y).max() + 1e-9)


def _lvl(y):                                     # eng baland 30 ms lik bo'lakning RMS darajasi
    w = int(SR * .03); c = np.cumsum(np.concatenate([[0], y ** 2]))
    return np.sqrt(((c[w:] - c[:-w]) / w).max()) if len(y) > w else np.sqrt((y ** 2).mean())


def sfx(name):
    r = sfx_real(name)
    if r is not None: return r * (_lvl(sfx_synth(name)) / (_lvl(r) + 1e-9))    # balandligi avvalgi (sintez) effektniki bilan teng
    return sfx_synth(name)


def sfx_synth(name):
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
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'matn':
        for k, v in TXT.items():
            if not os.path.exists(f'{D}/ovoz/{k}.mp3'): print(k, len(eleven(v)), eleven(v), sep='\t')
    else: main()
