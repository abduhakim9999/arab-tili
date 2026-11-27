#!/usr/bin/env python3
"""Yo'riqnoma ovozidagi so'zlar vaqti (qollanma.py --ovoz-vaqt; 27.11.2026).

Har qadamning «zarb»lari (b) ovoz matnidagi so'z bilan bog'langan (masalan «uchalasi» aytilganda chiziqlar yashil bo'ladi).
O'sha so'z ovozda qachon aytilishi wav2vec2 fonema modeli bilan topiladi (bepul, src/video/*/cue.py usuli):
eshitilgan vaqtli tovushlar va matn difflib bilan moslanadi. Natija — src/build/qollanma-vaqt.json
({fayl: {so'z: ms}}); fayl (matn xeshi) o'zgarmasa qayta hisoblanmaydi.
Kerak: pip install torch transformers librosa (CPU yetadi)."""
import json, difflib, os

RN = {'ɑ': 'a', 'æ': 'a', 'ɐ': 'a', 'ʌ': 'a', 'ə': 'e', 'ɛ': 'e', 'ɜ': 'e', 'ɪ': 'i', 'ɨ': 'i', 'y': 'u', 'ʊ': 'u', 'ɯ': 'u', 'ɔ': 'o', 'ɒ': 'o', 'ø': 'o', 'œ': 'o',
      'ɡ': 'g', 'ɣ': 'g', 'ʁ': 'g', 'χ': 'x', 'ħ': 'h', 'ɦ': 'h', 'ʔ': '', 'ʕ': '', 'q': 'k', 'ɾ': 'r', 'ɹ': 'r', 'ʀ': 'r', 'j': 'y', 'ʃ': 'S', 'ʒ': 'J', 'ŋ': 'n', 'ɲ': 'n', 'ɫ': 'l',
      'β': 'v', 'w': 'v', 'ʋ': 'v', 'θ': 's', 'ð': 'z', 'ç': 'x', 'ɕ': 'S', 'ʂ': 'S', 'ʐ': 'J', 'ɸ': 'f', 'c': 'k', 'ɟ': 'g'}
KIR = {'х': 'x', 'а': 'a', 'т': 't', 'о': 'o', 'е': 'e', 'и': 'i', 'с': 's', 'з': 'z'}   # ovoz matnidagi kirillcha so'zlar («Хато»)
_M = {}


def _model():
    if not _M:
        import torch
        from transformers import Wav2Vec2FeatureExtractor, AutoModelForCTC
        from huggingface_hub import hf_hub_download
        n = 'facebook/wav2vec2-lv-60-espeak-cv-ft'
        _M.update(torch=torch, fe=Wav2Vec2FeatureExtractor.from_pretrained(n), m=AutoModelForCTC.from_pretrained(n).eval(),
                  voc={v: k for k, v in json.load(open(hf_hub_download(n, 'vocab.json'))).items()})
    return _M


def eshitilgan(yol):
    """[(soniya, belgi)] — sodda belgilarga keltirilgan."""
    import librosa
    M = _model(); y, _ = librosa.load(yol, sr=16000)
    with M['torch'].no_grad():
        ids = M['m'](M['fe'](y, sampling_rate=16000, return_tensors='pt').input_values).logits.argmax(-1)[0].tolist()
    blank = M['m'].config.pad_token_id; out = []; p = None
    for i, a in enumerate(ids):
        if a != p and a != blank and not M['voc'][a].startswith('<'):
            ph = M['voc'][a].replace('dʒ', 'J').replace('tʃ', 'C')
            for ch in ph:
                if ch in 'ːˈˌ̪̃ʰʲˤ̩̯': continue
                ch = RN.get(ch, ch)
                if ch and not (out and out[-1][1] == ch and i * 0.02 - out[-1][0] < 0.03): out.append((round(i * 0.02, 3), ch))
        p = a
    return out


def _harflar(s):
    s = ''.join(KIR.get(c, c) for c in s.lower())
    s = s.replace("o'", 'o').replace("g'", 'g').replace('sh', 'S').replace('ch', 'C').replace('ng', 'n').replace('j', 'J').replace('q', 'k').replace("'", '')
    return [c for c in s if c.isalpha()]


def vaqtlar(yol, matn, sozlar):
    """{so'z: ms} — so'z boshining ovozdagi vaqti. Usul: avval matndagi ulushi bo'yicha taxmin (sur'at bir tekis), keyin taxmin
    atrofida (±2,2 s) so'zning birinchi 8 harfiga eng o'xshash eshitilgan bo'lak qidiriladi (difflib); o'xshashlik past bo'lsa —
    taxmin. Butun matnni bir yo'la moslash takror so'zlarda adashdi (27.11.2026: «yetti kundan», «Unutgan»)."""
    r = eshitilgan(yol); e = _harflar(matn); rc = ''.join(c for _, c in r)
    bosh = r[0][0] if r else 0.0; oxir = r[-1][0] if r else 1.0; natija = {}; oldin = -1.0
    for s in sozlar:
        i0 = matn.find(s); assert i0 >= 0, 'zarb so`zi matnda yo`q: %s' % s
        m = len(_harflar(matn[:i0])); A = ''.join(_harflar(s))[:8]
        taxmin = bosh + (oxir - bosh) * m / max(1, len(e)); eng = (0.0, None)
        for j, (t, _) in enumerate(r):
            if t < taxmin - 2.2 or t > taxmin + 2.2 or t <= oldin + 0.25: continue
            k = (difflib.SequenceMatcher(None, A, rc[j:j + len(A)], autojunk=False).ratio() + (0.12 if rc[j] == A[0] else 0)
                 - 0.04 * abs(t - taxmin))   # so'z boshi bir xil bo'lsa — afzal (aks holda oldingi harfli bo'lak ham bir xil baho oladi)
            if k > eng[0]: eng = (k, t)
        t = eng[1] if eng[0] >= 0.55 else max(taxmin, oldin + 0.4)
        natija[s] = int(round(1000 * max(0.0, t - 0.05))); oldin = t
    return natija
