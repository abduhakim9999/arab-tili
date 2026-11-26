# Луғат yo'lagi uchun aXX = har shakl (u NN/v/f/aXX_k, chetidagi jimlik olinadi) + orasida 0.6 s sukut (10-dars usuli)
import sys, glob, os, subprocess, json
H = os.path.dirname(os.path.abspath(__file__)); N = sys.argv[1]
F = json.load(open(H + '/forms1112.json', encoding='utf-8'))[N]
TR = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,'
      'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse')
T = H + '/tmpf' + N; os.makedirs(T, exist_ok=True)
run = lambda a: subprocess.run(a, check=True, capture_output=True)
run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', '0.6', T + '/s.wav'])
for i, forms in enumerate(F):
    if not forms: continue   # 26.11.2026: harf yozuvi (OQIMAYDI) — tinglashda o'qilmaydi
    fs = [H + '/u%s/v/f/a%02d_%d.mp3' % (N, i, k) for k in range(len(forms))]
    assert all(os.path.exists(f) for f in fs), fs
    parts = []
    for k, f in enumerate(fs):
        o = T + '/%02d_%d.wav' % (i, k)
        run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-af', TR, '-ar', '44100', '-ac', '1', o]); parts += [o, T + '/s.wav']
    parts = parts[:-1]
    lst = T + '/l%02d.txt' % i; open(lst, 'w').write(''.join("file '%s'\n" % p for p in parts))
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ac', '1', '-b:a', '128k', H + '/u%s/v/a%02d.mp3' % (N, i)])
print(N, len(F), 'ta yozuv')
