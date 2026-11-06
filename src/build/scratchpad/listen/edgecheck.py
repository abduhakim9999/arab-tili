# har bo'lak boshida/oxirida ovoz uzilmaganini tekshiradi: chetdagi 50 ms o'rtacha baland bo'lsa — XATO
import sys,subprocess,numpy as np,glob
sr=16000
def load(f): return np.frombuffer(subprocess.run(['ffmpeg','-v','quiet','-i',f,'-ac','1','-ar',str(sr),'-f','s16le','-'],capture_output=True).stdout,np.int16).astype(float)
def db(x): return 20*np.log10(np.sqrt(np.mean(x**2))/32768+1e-9) if len(x) else -99
bad=0
for f in sorted(sys.argv[1:]):
    x=load(f); pk=db(x[np.argmax(np.abs(x))-800:np.argmax(np.abs(x))+800])
    s=db(x[:int(.05*sr)]); e=db(x[-int(.05*sr):])
    fl=(s>pk-20) or (e>pk-20)
    if fl: bad+=1; print('XATO' if fl else 'ok', f.split('/')[-1], round(s), round(e), round(pk))
print('jami',len(sys.argv)-1,'xato',bad)
