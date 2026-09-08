// Exercise the real gallery against Three.js geometry with a minimal host.
// WebGL pixels still require explicit browser QA; these checks cover state and interaction.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as Three from '../assets/vendor/three.module.min.js';
let pending=null,activeRenderer,revoked=0,copies=0;
class Element {
 constructor(){this.listeners={};this.attrs={};this.dataset={};this.clientWidth=1200;this.clientHeight=750;this.width=1200;this.height=750;this.hidden=false;this.disabled=false;this.children=[];}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn)}
 fire(type,values={}){for(const fn of this.listeners[type]||[])fn({preventDefault(){},...values})}
 setAttribute(k,v){this.attrs[k]=v} querySelector(s){return this.children.find(e=>e.selector===s)}
 querySelectorAll(){return []} getBoundingClientRect(){return {left:0,top:0,width:1200,height:750}}
 focus(){} setPointerCapture(){} remove(){this.removed=true} close(){this.open=false} showModal(){this.open=true}
 getContext(){return {fillRect(){},fillText(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},drawImage(){copies++}}}
 toBlob(fn){fn({type:'image/png'})}
}
const host=new Element(),elements=new Map();
for(const id of ['#spatial-status','#spatial-motion','#spatial-rain','#spatial-reset','#spatial-capture','#spatial-photo'])elements.set(id,new Element());
const caption=new Element();caption.children=['span','p'].map(selector=>Object.assign(new Element(),{selector}));elements.set('.spatial-label',caption);
const dialog=elements.get('#spatial-photo');dialog.children=['img','a[download]','button'].map(selector=>Object.assign(new Element(),{selector}));
const buttons=['lobby','hall','land','bridge','porter'].map(view=>Object.assign(new Element(),{dataset:{view}}));
host.querySelector=s=>elements.get(s);host.querySelectorAll=s=>s==='[data-view]'?buttons:[];host.prepend=el=>host.canvas=el;
const doc=new Element();doc.createElement=()=>new Element();doc.hidden=false;doc.fonts={ready:Promise.resolve()};
class Renderer {constructor(){activeRenderer=this;this.domElement=new Element();this.shadowMap={}} setPixelRatio(){} setSize(){} render(scene,camera){this.scene=scene;this.camera=camera} dispose(){this.disposed=true}}
class Controls {constructor(camera){this.camera=camera;this.target=new Three.Vector3()}update(){this.camera.lookAt(this.target);return false}addEventListener(){}dispose(){}}
const win=new Element();
const ctx=vm.createContext({T:{...Three,WebGLRenderer:Renderer},OrbitControls:Controls,devicePixelRatio:1,matchMedia:()=>({matches:false}),document:doc,window:win,AbortController,ResizeObserver:class{observe(){}disconnect(){}},requestAnimationFrame:fn=>(pending=fn,1),cancelAnimationFrame:()=>pending=null,performance:{now:()=>0},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>revoked++},console});
const source=fs.readFileSync(new URL('../assets/spatial/gallery.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'').replace('export function mount','function mount');
vm.runInContext(source,ctx);const cleanup=ctx.mount(host);
let time=0;function frames(n=1,dt=1/60){for(let i=0;i<n;i++){time+=dt*1000;const f=pending;pending=null;f?.(time)}}
function select(name){buttons.find(b=>b.dataset.view===name).fire('click');frames(160)}
frames();const scene=activeRenderer.scene,camera=activeRenderer.camera;
const [lobby,pedestal,hall,world]=scene.children.filter(o=>o.type==='Group');assert(lobby.visible&&!world.visible,'starts at museum entrance');
select('hall');assert(!lobby.visible&&world.visible&&hall.visible&&pedestal.visible);
const materials=[];world.traverse(o=>{if(o.material)materials.push(o.material)});const materialState=materials.map(m=>JSON.stringify(m.toJSON()));const background=scene.background.getHex(),fog=[scene.fog.near,scene.fog.far,scene.fog.color.getHex()];
select('land');assert(world.visible&&!hall.visible&&!pedestal.visible);const after=[];world.traverse(o=>{if(o.material)after.push(o.material)});assert.deepEqual(after,materials);assert.deepEqual(after.map(m=>JSON.stringify(m.toJSON())),materialState);assert.equal(scene.background.getHex(),background);assert.deepEqual([scene.fog.near,scene.fog.far,scene.fog.color.getHex()],fog);
select('bridge');assert(!hall.visible,'detail view preserves outdoor state');select('hall');select('porter');assert(hall.visible,'detail view preserves exhibition state');
select('land');const start=camera.position.clone();host.canvas.fire('keydown',{key:'ArrowUp'});assert.equal(camera.position.distanceTo(start),0,'keydown must not jump');frames(1);const first=camera.position.distanceTo(start);frames(59);const distance=camera.position.distanceTo(start);assert(first<.03&&distance>4&&distance<6,'accelerates toward bounded cruising speed');
win.fire('keyup',{key:'ArrowUp'});const released=camera.position.clone();frames(1);assert(camera.position.distanceTo(released)>0,'coasts after release');frames(160);const rested=camera.position.clone();frames(30);assert(camera.position.distanceTo(rested)<.001,'friction stops camera');
select('land');host.canvas.fire('keydown',{key:'ArrowUp'});frames(30);win.fire('blur');const blurred=camera.position.clone();frames(30);assert(camera.position.distanceTo(blurred)<.001,'blur clears velocity');
select('land');host.canvas.fire('keydown',{key:'ArrowRight'});const start30=camera.position.clone();frames(30,1/30);const distance30=camera.position.distanceTo(start30);win.fire('keyup',{key:'ArrowRight'});select('land');host.canvas.fire('keydown',{key:'ArrowRight'});const start60=camera.position.clone();frames(60,1/60);assert(Math.abs(camera.position.distanceTo(start60)-distance30)<.07,'motion is stable at 30 and 60 fps');win.fire('keyup',{key:'ArrowRight'});
elements.get('#spatial-capture').fire('click');await new Promise(r=>setImmediate(r));assert(dialog.open);assert.equal(dialog.querySelector('img').src,'blob:test');assert.match(dialog.querySelector('a[download]').download,/game-temple-land-\d+\.png/);assert.equal(copies,2,'current canvas is copied before composing caption');
cleanup();assert(activeRenderer.disposed&&host.canvas.removed&&!dialog.open);assert.equal(revoked,1);
console.log(JSON.stringify({stateTransitions:'passed',materialIdentity:'passed',inertia:'passed',frameRateIndependence:'passed',captureLifecycle:'passed',webglPixels:'not tested'}));
