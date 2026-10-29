import json,base64,sys,glob,os
d='/root/.claude/projects/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/tool-results/'
for f in sorted(glob.glob(d+'mcp-Google_Drive-download_file_content-*.txt')):
    j=json.load(open(f))
    t=j['title'].replace(' ','')
    out=t if t.endswith('.pdf') else t+'.pdf'
    if j.get('mimeType')!='application/pdf': continue
    if not os.path.exists(out):
        open(out,'wb').write(base64.b64decode(j['content']));print('saved',out)
