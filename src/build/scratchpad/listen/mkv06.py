# -*- coding: utf-8 -*-
# 6-dars Луғат yo'lagi: v6.mp3 (arabcha so'z — Mehdi VO, vaqfsiz; o'zbekcha ma'no — SARHAD, sekin/jarang; yana arabcha)
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
S = os.path.dirname(HERE); T = HERE + '/tmp06'; U = HERE + '/u06'
exec(open(S + '/d06/voc06.py', encoding='utf-8').read())
TGT = -18.0
# arabcha: whisper (align/out/wv06.whisper.json) tartibi + jimliklar bo'yicha 16 bo'lak -> 11 so'z
CH = [(0, 1.72), (2.54, 4.24), (5.17, 5.77), (6.20, 6.68), (7.38, 7.95), (8.54, 9.32), (10.08, 10.69), (11.26, 12.04),
      (12.89, 13.58), (14.11, 14.98), (15.86, 16.46), (16.95, 17.62), (18.45, 19.23), (19.79, 20.71), (21.59, 22.10), (22.85, dur(U + '/arV.mp3'))]
GR = [[0], [1], [2], [3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14], [15]]
AR = [(CH[g[0]][0], CH[g[-1]][1]) for g in GR]
UT = ['Olti; oltita.', 'Oltinchi.', 'Bu, muannas uchun.', 'U, muannas uchun.', 'Opa; singil.', 'Vrach, shifokor.', 'Vrach ayol.',
      'Talaba, tolib.', 'Talaba qiz, toliba.', 'Nada, ayol ismi.', 'Huda, ayol ismi.']
assert len(AR) == len(UT) == len(VOC)
UZF = ('atempo=0.9,highpass=f=90,equalizer=f=220:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=3,equalizer=f=6000:t=q:w=1:g=1.5,'
       'acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90')
UP = dp_parts(U + '/uV.mp3', UT)
JP = [4, 5, 6, 7, 8]
JT = ['Opa, singil; jami: opalar, singillar.', 'Vrach, shifokor; jami: vrachlar.', 'Vrach ayol; jami: vrach ayollar.', 'Talaba; jami: talabalar.', 'Talaba qiz; jami: talaba qizlar.']
JU = dp_parts(U + '/uJ.mp3', JT)
g_v = TGT - lufs(U + '/arV.mp3')
s1, s3 = sil(T + '/s1.wav', 0.6), sil(T + '/s3.wav', 1.4)
items = [(T + '/hh.wav', 'h', 0), (s1, None, 0)]
for i in range(len(VOC)):
    a, b = AR[i]; ar = cut(U + '/arV.mp3', T + '/v%02d.wav' % i, max(0, a - 0.05), b + 0.1, g_v)
    a, b = UP[i]; raw = cut(U + '/uV.mp3', T + '/mr%02d.wav' % i, max(0, a - 0.05), b + 0.08)
    run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', UZF, '-ar', str(SR), '-ac', '1', T + '/mp%02d.wav' % i])
    u = cut(T + '/mp%02d.wav' % i, T + '/m%02d.wav' % i, gain=TGT - lufs(T + '/mp%02d.wav' % i))
    if i in JP:  # 31.10: ko'plik (jami) ham aytiladi — uJ.mp3
        a, b = JU[JP.index(i)]; raw = cut(U + '/uJ.mp3', T + '/jr%02d.wav' % i, max(0, a - 0.05), b + 0.08)
        run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', UZF, '-ar', str(SR), '-ac', '1', T + '/jp%02d.wav' % i])
        u = cut(T + '/jp%02d.wav' % i, T + '/m%02d.wav' % i, gain=TGT - lufs(T + '/jp%02d.wav' % i))
    items += [(ar, 'ar', i), (s1, None, 0), (u, 'uz', i), (s1, None, 0), (ar, 'ar2', i), (s3, None, 0)]
parts, M, t = [], [], 0.0
for f, kind, idx in items:
    d = dur(f); parts.append(f)
    if kind: M.append([idx, kind, round(t, 2), round(t + d, 2)])
    t += d
concat(parts, HERE + '/v6.mp3')
json.dump({'m': M, 'l': {i: [v[1], v[2][0]] for i, v in enumerate(VOC)}}, open(HERE + '/v6.json', 'w'), ensure_ascii=False)
print('v6', round(t, 1), len(M))
