import numpy as np
from scipy.signal import stft
SR=8000
n=np.fromfile('new.raw',dtype=np.float32)
def mel(f, nm=24):
    def hz2m(h): return 2595*np.log10(1+h/700)
    def m2hz(m): return 700*(10**(m/2595)-1)
    pts=m2hz(np.linspace(hz2m(80),hz2m(3800),nm+2)); bins=np.floor((256+1)*pts/SR).astype(int)
    fb=np.zeros((nm,129))
    for i in range(1,nm+1):
        a,b,c=bins[i-1],bins[i],bins[i+1]
        for k in range(a,b): fb[i-1,k]=(k-a)/max(1,b-a)
        for k in range(b,c): fb[i-1,k]=(c-k)/max(1,c-b)
    return fb
FB=mel(None)
def feat(a,b):
    x=n[int(a*SR):int(b*SR)]
    f,t,Z=stft(x,SR,nperseg=256,noverlap=176)
    M=np.log(FB@(np.abs(Z)**2)+1e-6)
    M=(M-M.mean(1,keepdims=True))/(M.std(1,keepdims=True)+1e-6)
    return M.T
def dtw(A,B):
    D=np.sqrt(((A[:,None,:]-B[None,:,:])**2).sum(-1))
    n1,n2=D.shape; C=np.full((n1+1,n2+1),np.inf); C[0,0]=0
    for i in range(1,n1+1):
        for j in range(1,n2+1):
            C[i,j]=D[i-1,j-1]+min(C[i-1,j],C[i,j-1],C[i-1,j-1])
    return C[n1,n2]/(n1+n2)
S={1:(4.56,6.76),2:(7.7,12.8),3:(14.13,16.74),9:(33.44,34.49),11:(36.81,39.77),12:(40.72,42.21),14:(44.34,47.95),15:(48.94,54.02),29:(79.42,82.27),31:(86.55,90.29)}
F={k:feat(*v) for k,v in S.items()}
for a in (1,2,3):
    print(a, {b:round(dtw(F[a],F[b]),2) for b in (9,11,12,14,15,29,31)})
