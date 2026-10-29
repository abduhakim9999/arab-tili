import subprocess, re, sys, json
S='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/hdr'
A='/mnt/user-data/attachments/2421c020-61d6-568e-9f0e-0667efd069b6'
SRC={3:A+'/de6f94e8-New_tts_node.mp3',4:A+'/a1fbc604-New_tts_node_1.mp3'}
def run(*a): return subprocess.run(a,check=True,capture_output=True,text=True)
def dur(p): return float(run('ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p).stdout)
def mean(p):
    r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',p,'-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+)',r).group(1))
S0=3.2; GAP=0.18; TARGET=mean(S+'/h3_old.mp3')
out={}
for n in (3,4):
    t=S+'/n%d_trim.wav'%n
    run('ffmpeg','-v','error','-y','-i',SRC[n],'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,aformat=sample_rates=44100:channel_layouts=mono',t)
    g=TARGET-mean(t)
    nm=S+'/n%d.wav'%n
    run('ffmpeg','-v','error','-y','-i',t,'-af','volume=%.2fdB,alimiter=limit=0.95'%g,nm)
    nd=dur(nm)
    old=S+'/h%d_old.mp3'%n
    run('ffmpeg','-v','error','-y','-i',old,'-i',nm,'-filter_complex',
        '[0:a]atrim=0:%.3f,asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[a];'
        '[0:a]atrim=%.3f,asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[c];'
        '[1:a]asetpts=PTS-STARTPTS[b];'
        'anullsrc=r=44100:cl=mono,atrim=0:%.2f[s1];anullsrc=r=44100:cl=mono,atrim=0:%.2f[s2];'
        '[a][s1][b][s2][c]concat=n=5:v=0:a=1[o]'%(S0,S0,GAP,GAP),
        '-map','[o]','-ac','1','-b:a','64k',S+'/h%d.mp3'%n)
    s1=round(S0+GAP+nd,2)            # raqam qatori oxiri
    out[n]=[S0,s1,s1]; print(n,'gain %.1f dB'%g,'num %.2fs'%nd,'old %.2f new %.2f'%(dur(old),dur(S+'/h%d.mp3'%n)),'s1',s1,'topic start',round(s1+GAP,2))
json.dump(out,open(S+'/hnew.json','w'))
