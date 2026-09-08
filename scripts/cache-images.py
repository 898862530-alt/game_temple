"""Download editorial images, validate real pixels, and publish same-origin WebP assets."""
import concurrent.futures, io, json, pathlib, subprocess, urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets/collection'
DEST.mkdir(parents=True, exist_ok=True)
code = "const fs=require('fs'),vm=require('vm'),c=vm.createContext({});for(const f of ['games','awards','additions','late-awards','history','artworks','new-artworks','history-artworks','editorial']){const p=f+'.js';if(fs.existsSync(p))vm.runInContext(fs.readFileSync(p,'utf8'),c)}process.stdout.write(vm.runInContext('JSON.stringify(games.map(g=>({id:g.id,title:g.title,pictures:g.pictures||[]})))',c));"
games = json.loads(subprocess.check_output(['node', '-e', code], cwd=ROOT))
manifest_path = DEST / 'manifest.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

def cache(g):
    if g['id'] in manifest and (ROOT/manifest[g['id']][0]['url']).exists():
        return g['id'], manifest[g['id']]
    candidates = g['pictures']
    errors = []
    for p in candidates:
        try:
            request = urllib.request.Request(p['url'], headers={'User-Agent':'Mozilla/5.0', 'Referer':p.get('source','')})
            with urllib.request.urlopen(request, timeout=35) as response:
                raw = response.read(30*1024*1024)
            im = Image.open(io.BytesIO(raw)); im.load()
            w,h = im.size
            if min(w,h)<80: raise ValueError('Image too small')
            im = im.convert('RGB'); im.thumbnail((2560,2560))
            target = DEST / (g['id']+'.webp'); im.save(target,'WEBP',quality=89,method=6)
            data = {**p,'originalUrl':p['url'],'url':'assets/collection/'+target.name,'width':im.width,'height':im.height,'note':f'原始素材 {w} × {h}；本站托管，未放大'}
            return g['id'],[data]
        except Exception as e:
            errors.append(str(e)[:100])
    return g['id'], {'errors':errors}

failed = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for id,result in pool.map(cache,games):
        if isinstance(result,list):
            manifest[id]=result; print(id,'OK',result[0]['width'],result[0]['height'],flush=True)
        else:
            failed[id]=result; print(id,'FAILED',result,flush=True)
thumb_dir = DEST / 'thumbs'
thumb_dir.mkdir(exist_ok=True)
for id,pictures in manifest.items():
    if not isinstance(pictures,list) or not pictures: continue
    source = ROOT / pictures[0]['url']
    if not source.exists(): continue
    with Image.open(source) as im:
        im = im.convert('RGB'); im.thumbnail((720,720))
        target = thumb_dir / (id+'.webp'); im.save(target,'WEBP',quality=74,method=6)
        pictures[0]['thumbUrl']='assets/collection/thumbs/'+target.name
        pictures[0]['thumbWidth']=im.width; pictures[0]['thumbHeight']=im.height
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(ROOT/'local-images.js').write_text('const localPictures='+json.dumps(manifest,ensure_ascii=False)+';\ngames.forEach(g=>{if(localPictures[g.id]){g.pictures=localPictures[g.id];g.image=g.hero=g.pictures[0].url;}});\n')
print('FAILED:',json.dumps(failed,ensure_ascii=False))
