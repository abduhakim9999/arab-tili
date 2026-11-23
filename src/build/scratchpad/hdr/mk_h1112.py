import subprocess, re, json
S='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/hdr'
def run(*a): return subprocess.run(a,check=True,capture_output=True,text=True)
def dur(p): return float(run('ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p).stdout)
def mean(p):
    r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',p,'-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+)',r).group(1))
V=5.97; GAP=0.18
# h10 dars raqami qismi (5.97..) ovoz balandligi
run('ffmpeg','-v','error','-y','-i',S+'/h10.mp3','-af','atrim=%.2f'%V,S+'/_h10n.wav')
TARGET=mean(S+'/_h10n.wav')
cfg=json.load(open(S+'/hcfg.json'))
for n in (11,12):
    t=S+'/_n%d.wav'%n
    run('ffmpeg','-v','error','-y','-i',S+'/H%dar.mp3'%n,'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,aformat=sample_rates=44100:channel_layouts=mono',t)
    g=TARGET-mean(t); nm=S+'/_m%d.wav'%n
    run('ffmpeg','-v','error','-y','-i',t,'-af','volume=%.2fdB,alimiter=limit=0.95'%g,nm)
    nd=dur(nm)
    run('ffmpeg','-v','error','-y','-i',S+'/h10.mp3','-i',nm,'-filter_complex',
        '[0:a]atrim=0:%.3f,asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[a];'
        '[1:a]asetpts=PTS-STARTPTS[b];anullsrc=r=44100:cl=mono,atrim=0:%.2f[s1];anullsrc=r=44100:cl=mono,atrim=0:0.25[s2];'
        '[a][s1][b][s2]concat=n=4:v=0:a=1[o]'%(V,GAP),'-map','[o]','-ac','1','-b:a','64k',S+'/h%d.mp3'%n)
    e=round(V+GAP+nd,2); cfg[str(n)]=[3.2,V,e]
    print(n,'gain %.1f'%g,'num %.2f'%nd,'total %.2f'%dur(S+'/h%d.mp3'%n),cfg[str(n)])
json.dump(cfg,open(S+'/hcfg.json','w'))
