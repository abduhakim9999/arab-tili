import sys,json
S='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad'
sys.path.insert(0,S+'/listen'); from build_t import *
def go(f,idx,key,M):
    T=[M['lugat'][i][key] for i in idx]
    try: sp,m=speech_parts(f,len(idx)); how='sil%.2f'%m
    except SystemExit: sp=dp_parts(f,T); how='dp'
    print(f,how)
    for (a,b),i,t in zip(sp,idx,T): print('  %2d %5.2f %5.2f %4.2f  %s'%(i,a,b,b-a,t))
    return sp
M6=json.load(open(S+'/listen/u06/matn.json')); M7=json.load(open(S+'/listen/u07/matn.json'))
R={}
R['A6']=go(S+'/listen/b7/A6.mp3',[9]+list(range(11,21)),'ar',M6)
R['U6']=go(S+'/listen/b7/U6.mp3',list(range(9,21)),'uz',M6)
R['A7']=go(S+'/listen/b7/A7.mp3',list(range(23)),'ar',M7)
R['U7']=go(S+'/listen/b7/U7.mp3',list(range(23)),'uz',M7)
json.dump(R,open(S+'/listen/b7/split.json','w'))
