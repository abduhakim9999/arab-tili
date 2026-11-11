import sys, os, json, torch, librosa
from transformers import Wav2Vec2FeatureExtractor, AutoModelForCTC
from huggingface_hub import hf_hub_download
M='facebook/wav2vec2-lv-60-espeak-cv-ft'
fe=Wav2Vec2FeatureExtractor.from_pretrained(M); model=AutoModelForCTC.from_pretrained(M).eval()
voc={v:k for k,v in json.load(open(hf_hub_download(M,'vocab.json'))).items()}
blank=model.config.pad_token_id
def dec(ids):
    o=[];p=None
    for i in ids:
        if i!=p and i!=blank: o.append(voc[i])
        p=i
    return ' '.join(t for t in o if not t.startswith('<'))
out={}
for f in sys.argv[2:]:
    y,_=librosa.load(f,sr=16000)
    x=fe(y,sampling_rate=16000,return_tensors='pt').input_values
    with torch.no_grad(): ids=model(x).logits.argmax(-1)[0].tolist()
    out[os.path.basename(f)]=dec(ids)
json.dump(out,open(sys.argv[1],'w'),ensure_ascii=False,indent=0)
