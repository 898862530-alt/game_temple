const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
process.chdir(path.join(__dirname,'..'));
// Exercise the actual router without a browser; keep only the APIs it calls.
const elements=new Map();const element=key=>{if(!elements.has(key))elements.set(key,{innerHTML:'',dataset:{},style:{},classList:{add(){}},addEventListener(){},setAttribute(){},removeAttribute(){},querySelectorAll(){return []},scrollIntoView(){}});return elements.get(key)};
const location={hash:'#home',replace(v){this.hash=v}};
const context=vm.createContext({location,document:{querySelector:element,querySelectorAll:()=>[],getElementById:element},window:{addEventListener(){},scrollTo(){},scrollY:0,innerHeight:800},requestAnimationFrame:fn=>fn()});
const html=fs.readFileSync('index.html','utf8'),scripts=[...html.matchAll(/<script src="([^"]+)"/g)];assert.equal(scripts.length,1,'a release must have one coherent script');
vm.runInContext(fs.readFileSync(''+scripts[0][1],'utf8'),context);
const ids=vm.runInContext('games.map(g=>g.id)',context);let entries=0;
for(const id of ids){
 location.hash='#game/'+id;vm.runInContext('route()',context);
 assert(element('#screen').innerHTML.includes('id="verdict"'),id+' full review');
 const links=[...element('#screen').innerHTML.matchAll(/href="#game\/([^"/]+)(?:\/[^" ]+)?"/g)].map(x=>x[1]);
 for(const linked of links){assert(ids.includes(linked),id+' dangling link');entries++;}
 location.hash='#game/'+id+'/references';vm.runInContext('route()',context);
 location.hash='#collection';vm.runInContext('route()',context);assert(element('#gallery').innerHTML.includes('#game/'+id));
}
for(const [from,target] of [['rdr2','rdr'],['portal','half-life-2'],['sifu','sekiro'],['wukong','dark-souls']]){location.hash='#game/'+from;vm.runInContext('route()',context);assert(element('#screen').innerHTML.includes('href="#game/'+target+'"'));}
console.log(JSON.stringify({detailRoutes:ids.length,returnRoutes:ids.length,chapterRoutes:ids.length,validLinkedDestinations:entries,status:'passed'}));
