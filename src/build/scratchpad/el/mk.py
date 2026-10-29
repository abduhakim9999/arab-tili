import subprocess,re,os,sys,shutil
S='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad'
R='/home/claude/arab-tili/align/out'
def sil(f,n):
    o=subprocess.run(['ffmpeg','-hide_banner','-i',f,'-af','silencedetect=n=-40dB:d=0.8','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',o)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',o)]
    return list(zip(st,en))
def dur(f): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
bad=[]
for d in range(1,41):
    src=S+'/el/d01-chozik.mp3' if d==1 else R+'/ev%02d.mp3'%d
    a,b=(d-1)*5+1,d*5
    subprocess.run(['ffmpeg','-y','-v','error','-i',src,'-c','copy','-map_metadata','-1','-metadata','title=Феъллар %d–%d'%(a,b),'-id3v2_version','3',S+'/fq/d%02d.mp3'%d],check=True)
    L=dur(src); s=[x for x in sil(src,0) if x[1]<L-0.05]
    if len(s)!=4: bad.append((d,len(s))); continue
    edges=[0]+[e for _,e in s]; ends=[st for st,_ in s]+[L]
    for i in range(5):
        t0=max(0,edges[i]-0.12); t1=min(L,ends[i]+0.35)
        subprocess.run(['ffmpeg','-y','-v','error','-i',src,'-ss','%.3f'%t0,'-to','%.3f'%t1,'-ac','1','-b:a','96k',S+'/fq/v%03d.mp3'%(a+i)],check=True)
print('bad',bad)
