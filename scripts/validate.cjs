const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
process.chdir(path.join(__dirname,'..'));
const c=vm.createContext({}),index=fs.readFileSync('index.html','utf8');
for(const [,src] of index.matchAll(/<script src="([^"]+)"/g)){
 const code=fs.readFileSync(''+src,'utf8');new vm.Script(code,{filename:src});
 vm.runInContext(code.split('let scrollQueued=')[0],c);
}
const data=vm.runInContext('games',c);assert.equal(data.length,47);assert.equal(new Set(data.map(g=>g.id)).size,47);
assert.equal(data.filter(g=>g.personal).length,16);assert.equal(data.filter(g=>g.award).length,20);assert.equal(data.filter(g=>g.historical).length,15);
for(let y=2006;y<=2025;y++){const g=data.find(g=>g.award?.year===y);assert(g);assert.equal(g.award.program,y<2013?'VGA':y===2013?'VGX':'TGA');}
let shortest=Infinity;
for(const g of data){
 assert(g.review?.intro&&g.review?.verdict&&g.review?.media?.url,g.id+' review');
 const sections=g.review.sections||g.review.paragraphs;assert(sections.length>=4,g.id+' sections');
 assert(g.honors.length&&g.features.length>=2&&g.themes.length>=2,g.id+' taxonomy');
 assert(g.pictures?.length,g.id+' image');
 for(const p of g.pictures){assert(p.url.startsWith('assets/collection/'),g.id+' external primary');assert(fs.existsSync(''+p.url),g.id+' missing asset');assert(p.width>0&&p.height>0);assert(p.thumbUrl?.startsWith('assets/collection/thumbs/'),g.id+' missing thumbnail');assert(fs.existsSync(''+p.thumbUrl),g.id+' missing thumbnail asset');assert(p.thumbWidth<=720&&p.thumbHeight<=720,g.id+' oversized thumbnail');}
 for(const rel of g.relations)if(rel[3])assert(data.some(x=>x.id===rel[3]),g.id+' broken relation '+rel[3]);
 const html=vm.runInContext('room(games.find(g=>g.id==='+JSON.stringify(g.id)+'))',c);assert(!html.includes('undefined'),g.id+' undefined content');assert(html.includes('id="references"'));assert(html.includes('assets/collection/'+g.id+'.webp'));
 const reviewText=[g.review.intro,g.review.verdict,...(g.review.sections?g.review.sections.flatMap(s=>s.paras):[...g.review.paragraphs,g.position,g.innovation,g.unique,g.boundary])].join('');assert(reviewText.length>800,g.id+' short review');shortest=Math.min(shortest,reviewText.length);
}
for(const [honor,count] of [['Ocean 精选',16],['年度游戏',20],['历史里程碑',15]]){assert.equal(vm.runInContext('state.honor='+JSON.stringify(honor)+';games.filter(matches).length',c),count);}
vm.runInContext("state.honor='';state.query='TGA'",c);assert.equal(vm.runInContext('games.filter(matches).length',c),12);
assert(vm.runInContext('homepage()',c).includes('47 款'));assert(vm.runInContext('collection()',c).includes('47'));assert(vm.runInContext('timeline()',c).includes('2025'));assert(vm.runInContext('criteria()',c).includes('VGA'));
console.log(JSON.stringify({works:data.length,annual:20,historical:15,ocean:16,localImages:data.length,shortestReviewCharacters:shortest,status:'passed'},null,2));
