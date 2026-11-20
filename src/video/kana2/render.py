#!/usr/bin/env python3
"""Grammatika videosi: video.html ni kadrma-kadr suratga olib MP4 yasaydi.
  python3 render.py test 12.5 30.2 ...   — shu soniyalardagi kadrlar test/ ga (to'liq o'lchamda, avval shularga qaraladi)
  python3 render.py all                  — hamma sahna (parallel), keyin ulash va ovoz qo'shish -> out.mp4
  python3 render.py stage N              — bitta sahna fayli (st/N.mp4)
  python3 render.py join                 — tayyor sahnalarni ulash + ovoz
Sahna = bitta fayl (bir xil kodlash), ulash «-c copy» bilan; ovoz — narr.wav (prep.py)."""
import sys, os, json, subprocess, time
from concurrent.futures import ThreadPoolExecutor

D = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(f'{D}/tl.json'))
FPS = 30
W, H = 1080, 1920
ENC = ['-vf', 'scale=in_color_matrix=bt601:in_range=full:out_color_matrix=bt709:out_range=tv,format=yuv420p',
       '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-r', str(FPS),
       '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709']


def stages():
    sc = {s['id']: s for s in TL['scenes']}
    b = [sc[k]['s'] for k in ('S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6')] + [TL['dur']]
    f = [round(x * FPS) for x in b]
    return [(f[i], f[i + 1]) for i in range(len(f) - 1)]


def page_open(pw):
    br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--force-color-profile=srgb', '--font-render-hinting=none'])
    pg = br.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
    pg.on('pageerror', lambda e: print('JS XATO:', e, flush=True)); pg.on('console', lambda m: m.type == 'error' and print('KONSOL:', m.text, flush=True))
    pg.goto(f'file://{D}/video.html')
    pg.wait_for_function('window.READY === true', timeout=30000)
    return br, pg


def test(ts):
    from playwright.sync_api import sync_playwright
    os.makedirs(f'{D}/test', exist_ok=True)
    with sync_playwright() as pw:
        br, pg = page_open(pw)
        for t in ts:
            pg.evaluate(f'seek({t})')
            pg.screenshot(path=f'{D}/test/t{t:07.2f}.jpg', type='jpeg', quality=92)
            print('test', t)
        br.close()


def stage(n):
    from playwright.sync_api import sync_playwright
    a, b = stages()[n]
    os.makedirs(f'{D}/st', exist_ok=True)
    tmp, out = f'{D}/st/{n}.tmp.mp4', f'{D}/st/{n}.mp4'
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-'] + ENC + [tmp],
                          stdin=subprocess.PIPE)
    t0 = time.time()
    with sync_playwright() as pw:
        br, pg = page_open(pw)
        for f in range(a, b):
            pg.evaluate(f'seek({f / FPS})')
            ff.stdin.write(pg.screenshot(type='jpeg', quality=92))
        br.close()
    ff.stdin.close()
    if ff.wait() != 0: sys.exit(f'ffmpeg xato: sahna {n}')
    os.replace(tmp, out)
    print(f'sahna {n}: {b - a} kadr, {time.time() - t0:.0f} s', flush=True)


def join():
    n = len(stages())
    with open(f'{D}/st/list.txt', 'w') as f:
        for i in range(n): f.write(f"file '{D}/st/{i}.mp4'\n")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{D}/st/list.txt', '-c', 'copy', f'{D}/st/video.mp4'], check=True)
    # tovush effektlari: sahifadagi window.SFX ro'yxati -> mix.wav (prep.mix); keyin balandlik -16 LUFS atrofiga
    from playwright.sync_api import sync_playwright
    import prep
    with sync_playwright() as pw:
        br, pg = page_open(pw); ev = pg.evaluate('window.SFX'); br.close()
    print('effektlar:', prep.mix(ev))
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f'{D}/mix.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float([l for l in r.splitlines() if l.strip().startswith('I:')][-1].split()[1])
    g = -16.0 - I
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{D}/st/video.mp4', '-i', f'{D}/mix.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                    '-af', f'volume={g:.2f}dB,alimiter=limit=0.89:level=false', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', f'{D}/out.tmp.mp4'], check=True)
    os.replace(f'{D}/out.tmp.mp4', f'{D}/out.mp4')
    print(f'out.mp4 tayyor (ovoz {I:.1f} LUFS -> {I + g:.1f})')


def main():
    m = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if m == 'test': test([float(x) for x in sys.argv[2:]])
    elif m == 'stage': stage(int(sys.argv[2]))
    elif m == 'join': join()
    else:
        ids = [int(x) for x in sys.argv[2:]] or list(range(len(stages())))
        with ThreadPoolExecutor(max_workers=min(4, os.cpu_count() or 2)) as ex:
            rc = list(ex.map(lambda i: subprocess.run([sys.executable, __file__, 'stage', str(i)]).returncode, ids))
        if any(rc): sys.exit(f'xato: {rc}')
        join()


if __name__ == '__main__':
    main()
