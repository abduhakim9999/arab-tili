import sys,json,os,shutil
S='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad'
sys.path.insert(0,S+'/listen'); from build_t import *
R=json.load(open(S+'/listen/b7/split.json'))
def clip(src,ab,dst):
    a,b=ab; run(['ffmpeg','-v','error','-y','-ss','%.3f'%max(0,a-0.05),'-to','%.3f'%(b+0.12),'-i',src,'-c:a','libmp3lame','-b:a','128k',dst])
# 6
O=S+'/listen/u06/v'; N=S+'/listen/u06/v2'; os.makedirs(N,exist_ok=True)
old={0:0,1:1,2:2,3:3,4:4,5:9,6:10,7:5,8:6}
for n,o in old.items():
    for k in 'au': shutil.copy(O+'/%s%02d.mp3'%(k,o),N+'/%s%02d.mp3'%(k,n))
shutil.copy(O+'/a08.mp3',N+'/a10.mp3')
for ab,i in zip(R['A6'],[9]+list(range(11,21))): clip(S+'/listen/b7/A6.mp3',ab,N+'/a%02d.mp3'%i)
for ab,i in zip(R['U6'],range(9,21)): clip(S+'/listen/b7/U6.mp3',ab,N+'/u%02d.mp3'%i)
os.rename(O,S+'/listen/u06/v_eski'); os.rename(N,O)
# 7
V=S+'/listen/u07/v'; os.makedirs(V,exist_ok=True)
for ab,i in zip(R['A7'],range(23)): clip(S+'/listen/b7/A7.mp3',ab,V+'/a%02d.mp3'%i)
for ab,i in zip(R['U7'],range(23)): clip(S+'/listen/b7/U7.mp3',ab,V+'/u%02d.mp3'%i)
print(len(os.listdir(S+'/listen/u06/v')),len(os.listdir(V)))
