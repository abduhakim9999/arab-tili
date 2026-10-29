import numpy as np,subprocess
from scipy.fft import dct
x=subprocess.run(['ffmpeg','-loglevel','error','-i','in.m4a','-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
a=np.frombuffer(x,np.int16).astype(np.float32)/32768
sr=16000;win=400;hop=160;nfft=512
def mel(f):return 2595*np.log10(1+f/700)
def imel(m):return 700*(10**(m/2595)-1)
nm=26;pts=imel(np.linspace(mel(80),mel(7600),nm+2));bins=np.floor((nfft+1)*pts/sr).astype(int)
fb=np.zeros((nm,nfft//2+1))
for i in range(1,nm+1):
    for k in range(bins[i-1],bins[i]):fb[i-1,k]=(k-bins[i-1])/max(1,bins[i]-bins[i-1])
    for k in range(bins[i],bins[i+1]):fb[i-1,k]=(bins[i+1]-k)/max(1,bins[i+1]-bins[i])
def mfcc(s,t):
    y=a[int(s*sr):int(t*sr)];y=np.append(y[0],y[1:]-0.97*y[:-1])
    n=1+(len(y)-win)//hop
    fr=np.stack([y[i*hop:i*hop+win]*np.hamming(win) for i in range(n)])
    p=np.abs(np.fft.rfft(fr,nfft))**2/nfft
    m=np.log(p@fb.T+1e-10)
    c=dct(m,type=2,axis=1,norm='ortho')[:,1:13]
    return (c-c.mean(0))/ (c.std(0)+1e-6)
def dtw(A,B):
    n,m=len(A),len(B);D=np.full((n+1,m+1),np.inf);D[0,0]=0
    C=((A[:,None,:]-B[None,:,:])**2).sum(2)**0.5
    for i in range(1,n+1):
        Di=D[i];Dp=D[i-1];Ci=C[i-1]
        for j in range(1,m+1):
            Di[j]=Ci[j-1]+min(Dp[j],Di[j-1],Dp[j-1])
    return D[n,m]/(n+m)
