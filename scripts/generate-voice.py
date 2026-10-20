"""Generate Pip's shipped voice clips. Requires sherpa-onnx, soundfile, FFmpeg,
and the public-domain LJ Speech Piper model from the official sherpa-onnx release.
Set PIP_MODEL_DIR to its extracted directory. No credentials are required.
"""
import os,re,json,hashlib,subprocess,tempfile,pathlib
import sherpa_onnx,soundfile as sf
root=pathlib.Path(__file__).resolve().parents[1]
model=pathlib.Path(os.environ['PIP_MODEL_DIR'])
source=(root/'src/main.js').read_text()
words=['Apple','Butterfly','Cat','Dog','Elephant','Fox','Giraffe','House','Ice cream','Jellyfish','Kite','Lion','Moon','Nest','Owl','Penguin','Queen','Rainbow','Sun','Tree','Umbrella','Violin','Whale','X-ray','Yo-yo','Zebra']
phrases=list(json.loads((root/'src/episode-lines.json').read_text()).values())
for i,word in enumerate(words):
 L=chr(65+i)
 phrases += [L,f'Hey, explorer! This is {L}. {L} is for {word.lower()}. Let’s say {L} together!', f'{L}, {L}, {L}! {L} is for {word}! Wiggle to the left. Wiggle to the right. {L}, {L}, {L}! You got it right!',f'{L}. {L} is for {word}',f'{L}. {word}']
phrases += re.findall(r'(?:text|win):\s*"([^"]+)"',source)
phrases += re.findall(r'speak\(\s*"([^"]+)"',source)
phrases += re.findall(r"speak\(\s*'([^']+)'",source)
phrases+=['Boing! Hello, explorer! I am Pip. Ready to wiggle your way through the alphabet?']
def key(s):return re.sub('[^a-z0-9]','',s.lower())
items={key(p):p for p in phrases}
out=root/'public/audio';out.mkdir(parents=True,exist_ok=True)
config=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=str(model/'en_US-ljspeech-medium.onnx'),tokens=str(model/'tokens.txt'),data_dir=str(model/'espeak-ng-data'),noise_scale=.5,noise_scale_w=.6),num_threads=2),max_num_sentences=2)
tts=sherpa_onnx.OfflineTts(config)
manifest={}
for i,(k,text) in enumerate(items.items()):
 name=hashlib.sha256(k.encode()).hexdigest()[:16]+'.mp3';path=out/name
 if not path.exists():
  audio=tts.generate(text,sid=0,speed=1.03)
  wav='/tmp/pip-generation.wav';sf.write(wav,audio.samples,audio.sample_rate)
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',wav,'-af','asetrate=22050*1.12,aresample=24000,atempo=0.94,alimiter=limit=0.9','-codec:a','libmp3lame','-b:a','56k',str(path)],check=True)
 manifest[k]='/audio/'+name
 if i%15==0:print(f'{i+1}/{len(items)} clips ready',flush=True)
(root/'src/voice-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'COMPLETE: {len(manifest)} custom Pip clips',flush=True)
