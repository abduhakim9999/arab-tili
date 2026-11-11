# -*- coding: utf-8 -*-
# Луғат yo'lagi (11.11.2026 qoidasi) — 7, 8, 9-darslar:  python3 lugat2.py N
# - qo'shimcha/harf yozuvlari («...هُ», «عَلَى ...», «وَ..») tinglashda o'qilmaydi (sahifa lug'atida qoladi);
# - oxiri harakatli so'z vaqfsiz: IPA bilan generatsiya (ipa.py -> hw2/, trim1.py -> hw2t/); qolganlari hw/
# - arabcha: Hijazi ovozi (eleven_v4), haqiqiy tanvin bilan, har shakl alohida generatsiya (hw/wNNN, forms789.json), orasida 0.6 s sukut: birinchi (sNN|aNN) → fe'l shakllari (fNN_k) → jam/muannas (jNN);
#   belgi so'z («اَلْجَمْعُ») aytilmaydi;
# - o'zbekcha: muannas haqida gap yo'q; jam uchun «…; jam: …».
import os, sys, json, glob, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
N = int(sys.argv[1]); NN = '%02d' % N; S = os.path.dirname(HERE)
U = HERE + '/u' + NN + '/v'; T = HERE + '/tmpv' + NN; os.makedirs(T, exist_ok=True)
exec(open(S + '/d%s/voc%s.py' % (NN, NN), encoding='utf-8').read())
TGT = -18.0
ARF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,atempo=0.88')
UZF = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
       'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.25,areverse,atempo=0.95')
def pp(src, flt, dst):
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', flt, '-ar', str(SR), '-ac', '1', dst + '.p.wav'])
    return cut(dst + '.p.wav', dst, gain=TGT - lufs(dst + '.p.wav'))
# bosh qism — avvalgi vN.mp3 dan (bir marta saqlanadi)
J0 = json.load(open(HERE + '/v%d.json' % N)) if not os.path.exists(T + '/hdr.json') else json.load(open(T + '/hdr.json'))
if not os.path.exists(T + '/hdr.json'):
    H = [m for m in J0['m'] if m[1] == 'h']; e = [m for m in J0['m'] if m[1] != 'h'][0][2]
    cut(HERE + '/v%d.mp3' % N, T + '/hdr.wav', 0, e); json.dump({'m': H}, open(T + '/hdr.json', 'w'), ensure_ascii=False)
    J0 = {'m': H}
H = J0['m']
F1 = {8: {9: U + '/a06.mp3'}, 9: {8: U + '/a07.mp3', 19: HERE + '/u08/v/a06.mp3'}}.get(N, {})
FV = {8: {9: HERE + '/u08/v/f06_'}, 9: {19: HERE + '/u08/v/f06_'}}.get(N, {})
FJ = {9: {8: U + '/j07.mp3'}}.get(N, {})
UZ = {9: {5: U + '/n04.mp3', 25: U + '/m23.mp3', 4: U + '/n04.mp3'}}.get(N, {})
def skip(ar): return '..' in ar or '…' in ar
FORMS = json.load(open(HERE + '/forms789.json', encoding='utf-8'))[str(N)]
HW = json.load(open(HERE + '/hw_words.json', encoding='utf-8'))
s06, s1, s3 = sil(T + '/s06.wav', 0.6), sil(T + '/s1.wav', 0.6), sil(T + '/s3.wav', 1.4)
parts, M, t, LL = [T + '/hdr.wav'], [list(m) for m in H], dur(T + '/hdr.wav'), {}
def add(f, kind=None, i=0):
    global t
    d = dur(f); parts.append(f)
    if kind: M.append([i, kind, round(t, 2), round(t + d, 2)])
    t += d
for i, v in enumerate(VOC):
    ar = v[1]
    if skip(ar) or not FORMS.get(str(i)): continue
    fl = FORMS.get(str(i))
    if not fl: continue
    forms = [(lambda k: HERE + '/hw2t/w%03d.mp3' % k if os.path.exists(HERE + '/hw2t/w%03d.mp3' % k) else HERE + '/hw/w%03d.mp3' % k)(HW.index(w)) for w in fl]
    ws = []
    for k, f in enumerate(forms):
        ws.append(pp(f, ARF, T + '/a%02d_%d.wav' % (i, k)))
        if k < len(forms) - 1: ws.append(s06)
    concat(ws, T + '/ar%02d.mp3' % i); arw = cut(T + '/ar%02d.mp3' % i, T + '/ar%02d.wav' % i)
    uzs = UZ.get(i) or (U + ('/u%02d.mp3' if N == 7 else '/m%02d.mp3') % i)
    uz = pp(uzs, UZF, T + '/uz%02d.wav' % i)
    add(arw, 'ar', i); add(s1); add(uz, 'uz', i); add(s1); add(arw, 'ar2', i); add(s3)
    LL[i] = [v[1], v[2][0]]
concat(parts, HERE + '/v%d.mp3' % N)
json.dump({'m': M, 'l': LL}, open(HERE + '/v%d.json' % N, 'w'), ensure_ascii=False)
print('v%d' % N, round(t, 1), 'soz:', len(LL), 'tashlandi:', [i for i, v in enumerate(VOC) if skip(v[1])])
