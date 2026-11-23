import sys, json, torch, librosa
from transformers import Wav2Vec2FeatureExtractor, AutoModelForCTC
from huggingface_hub import hf_hub_download
M='facebook/wav2vec2-lv-60-espeak-cv-ft'
fe=Wav2Vec2FeatureExtractor.from_pretrained(M); model=AutoModelForCTC.from_pretrained(M).eval()
vocab=json.load(open(hf_hub_download(M,'vocab.json'))); blank=model.config.pad_token_id
def lp(f):
    y,_=librosa.load(f,sr=16000)
    x=fe(y,sampling_rate=16000,return_tensors='pt').input_values
    with torch.no_grad(): return torch.log_softmax(model(x).logits[0],-1)
S='/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad/listen/'   # python3 -I ctcscore.py nomzodlar.json  — {"u12/v/f/a05_0.mp3": ["a θ aː θ u n", "a s aː s u n"]}: CTC loss (kichigi — ovozga yaqinroq)
C=json.load(open(sys.argv[1]))
for f,cands in C.items():
    L=lp(S+f if not f.startswith('/') else f); out=[]
    for c in cands:
        toks=c.split()
        miss=[t for t in toks if t not in vocab]
        if miss: out.append((c,'MISSING '+' '.join(miss))); continue
        ids=torch.tensor([vocab[t] for t in toks])
        loss=torch.nn.functional.ctc_loss(L.unsqueeze(1),ids.unsqueeze(0),torch.tensor([L.shape[0]]),torch.tensor([len(ids)]),blank=blank,reduction='sum',zero_infinity=True)
        out.append((c,round(loss.item(),1)))
    print(f); [print('   ',x) for x in out]
