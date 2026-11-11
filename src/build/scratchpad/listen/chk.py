import sys, json, os
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from build_t import *
OUT = sys.argv[1]
for N in (7, 8, 9):
    T = HERE + '/tmpv%02d' % N; F = json.load(open(HERE + '/forms789.json', encoding='utf-8'))[str(N)]
    gap = sil(T + '/g15.wav', 1.5); parts = []; t = 0; lines = []; k = 0
    for i in sorted(F, key=int):
        if not F[i]: continue
        w = T + '/ar%02d.wav' % int(i); k += 1
        lines.append('%d) %d:%02d — %s' % (k, int(t) // 60, int(t) % 60, '، '.join(F[i])))
        parts += [w, gap]; t += dur(w) + 1.5
    concat(parts, OUT + '/tekshir-%d.mp3' % N)
    open(OUT + '/tekshir-%d.txt' % N, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    print(N, k, round(t))
