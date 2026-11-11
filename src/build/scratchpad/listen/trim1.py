# IPA kliplarida model ba'zan so'zdan keyin yana gapiradi — faqat birinchi nutq bo'lagini qoldiradi
import subprocess, re, glob, os
os.makedirs('hw2t', exist_ok=True)
for f in sorted(glob.glob('hw2/*.mp3')):
    o = 'hw2t/' + os.path.basename(f)
    e = subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=n=-40dB:d=0.3','-f','null','-'],capture_output=True,text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', e)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]
    dur = float(re.search(r'Duration: 00:00:([\d.]+)', e).group(1))
    cut = None
    for s, t in zip(st, en):
        if s > 0.3 and dur - t > 0.25: cut = s + 0.05; break
    if cut: subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-t',str(cut),o]); print(os.path.basename(f), round(dur,2), '->', round(cut,2))
    else: subprocess.run(['cp',f,o])
