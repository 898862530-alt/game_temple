import * as T from '../vendor/three.module.min.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
export function mount(host){
 const status=host.querySelector('#spatial-status');let renderer;
 try{renderer=new T.WebGLRenderer({antialias:devicePixelRatio<2,powerPreference:'low-power'});}catch(e){status.textContent='当前设备无法开启三维画面。可在下方阅读展览说明与作品评测。';return ()=>{};}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 host.prepend(renderer.domElement);const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','死亡搁浅三维展厅，拖动或使用方向键环视，使用加减号缩放');
 const scene=new T.Scene();scene.background=new T.Color('#ced7d5');scene.fog=new T.Fog('#ced7d5',34,95);
 const camera=new T.PerspectiveCamera(45,1,.1,160);camera.position.set(25,18,30);
 const controls=new OrbitControls(camera,canvas);controls.target.set(0,2,0);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=3;controls.maxDistance=48;controls.maxPolarAngle=Math.PI*.475;controls.autoRotateSpeed=.45;
 const hall=new T.Group();scene.add(hall);const world=new T.Group();scene.add(world);
 const mat=(color,roughness=.85,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const white=mat('#e3e4df'),concrete=mat('#a6aaa4'),dark=mat('#252e2c'),metal=mat('#78817e',.45,.65),ochre=mat('#bda569',.65,.3),suit=mat('#283c46');
 function box(parent,w,h,d,x,y,z,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 scene.add(new T.HemisphereLight('#d5e8f0','#64715b',2.5));const sun=new T.DirectionalLight('#fff5df',4);sun.position.set(-12,28,14);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-27,right:27,top:27,bottom:-27,near:1,far:80});sun.shadow.bias=-.0007;scene.add(sun);
 box(hall,65,.4,60,0,-.35,0,white);box(hall,52,15,.5,0,7,-22,white);box(hall,.5,15,46,-26,7,0,white);box(hall,.5,15,46,26,7,0,white);
 // Upper gallery, long horizontal balcony, clerestory and roof ribs.
 box(hall,50,.45,5,0,7.7,-18.5,concrete);box(hall,50,.18,.16,0,8.9,-16,metal);
 for(let x=-24;x<=24;x+=6){box(hall,.22,1.15,.22,x,8.3,-16,metal);box(hall,.5,15,.5,x,7,-21.3,white);box(hall,.28,.45,43,x,15,-1,white);}
 for(let x of [-21,21])for(let z of [-12,10])box(hall,.8,15,.8,x,7,z,white);
 const glass=new T.MeshPhysicalMaterial({color:'#e7f4f1',transparent:true,opacity:.16,roughness:.1,side:T.DoubleSide});box(hall,48,.08,38,0,15,0,glass);
 for(let x of [-17,17]){box(hall,4,.25,1.3,x,.7,9,dark);box(hall,.2,.7,1,x-1.4,.25,9,metal);box(hall,.2,.7,1,x+1.4,.25,9,metal);}
 function label(text,x,y,z,size=1.5){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#253a34';ctx.font='500 64px sans-serif';ctx.textAlign='center';ctx.fillText(text,512,140);const tex=new T.CanvasTexture(c);const o=new T.Mesh(new T.PlaneGeometry(size*4,size),new T.MeshBasicMaterial({map:tex,transparent:true}));o.position.set(x,y,z);hall.add(o);}
 label('GAME TEMPLE',0,11.4,-21.65,2.1);label('001   /   DEATH STRANDING',0,4.8,-21.65,1.15);
 box(hall,25,1.2,21,0,.4,0,mat('#3f4841'));box(hall,25.2,.07,21.2,0,1.02,0,metal);
 let seed=17;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 const river=x=>1.1*Math.sin(x*.36)+.4*Math.sin(x*.9);
 function height(x,z){const r=Math.abs(z-river(x));const bank=1-Math.exp(-r*r*.4);const hills=.65+.45*Math.sin(x*.38+z*.3)+.35*Math.cos(z*.66-x*.22)+.16*Math.sin(x*1.8+z*1.7);const mountain=Math.max(0,-z-2.5)*(.3+.15*Math.sin(x*.55));return 1.1+bank*(hills+mountain);}
 const geo=new T.PlaneGeometry(24,20,150,125);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;const colors=[];const green=new T.Color();
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),y=height(x,z);pos.setY(i,y);const r=Math.abs(z-river(x));green.set(r<.75?'#4a5549':y>3.8?'#59625a':'#62734a');green.multiplyScalar(.79+random()*.3);colors.push(green.r,green.g,green.b);}geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const terrain=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:1}));terrain.receiveShadow=true;terrain.castShadow=true;world.add(terrain);
 // Winding stream, shallow and reflective.
 const waterGeo=new T.BufferGeometry(),wp=[],wi=[];for(let i=0;i<=150;i++){const x=-12+24*i/150,z=river(x);wp.push(x,1.22,z-.58,x,1.22,z+.58);if(i<150){const n=i*2;wi.push(n,n+1,n+2,n+1,n+3,n+2);}}waterGeo.setAttribute('position',new T.Float32BufferAttribute(wp,3));waterGeo.setIndex(wi);waterGeo.computeVertexNormals();const water=new T.Mesh(waterGeo,new T.MeshStandardMaterial({color:'#91b1b3',metalness:.65,roughness:.25,side:T.DoubleSide}));world.add(water);
 const rockGeo=new T.DodecahedronGeometry(1,0),rockMat=mat('#48534e');const rocks=new T.InstancedMesh(rockGeo,rockMat,330),dummy=new T.Object3D();for(let i=0;i<330;i++){const x=(random()-.5)*23.5,z=(random()-.5)*19.5;const scale=.07+random()**3*.8;dummy.position.set(x,height(x,z),z);dummy.rotation.set(random()*2,random()*6,random());dummy.scale.set(scale*1.5,scale*.7,scale);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);}rocks.castShadow=true;rocks.receiveShadow=true;world.add(rocks);
 // A ladder across the stream.
 const ladder=new T.Group();ladder.position.set(1,1.9,river(1));ladder.rotation.y=-.25;world.add(ladder);for(const x of [-.36,.36])box(ladder,.055,.07,3.8,x,0,0,metal);for(let z=-1.7;z<1.8;z+=.24)box(ladder,.78,.05,.055,0,0,z,metal);
 // A stylized porter: small human scale against the landscape.
 const porter=new T.Group();porter.position.set(3,height(3,3),3);porter.rotation.z=-.1;porter.rotation.y=-.6;world.add(porter);
 box(porter,.43,.68,.26,0,1.06,0,suit);const head=new T.Mesh(new T.SphereGeometry(.16,12,10),suit);head.position.set(0,1.57,-.04);porter.add(head);
 for(let side of [-1,1]){const leg=box(porter,.15,.69,.16,side*.13,.37,side*.1,suit);leg.rotation.x=side*.2;box(porter,.18,.12,.31,side*.13,.08,side*.1-.05,dark);const arm=box(porter,.12,.55,.14,side*.29,1.04,-.04,suit);arm.rotation.x=-.3;}
 for(let i=0;i<3;i++){box(porter,.56,.32,.4,0,1.05+i*.35,.29,i===1?ochre:metal);for(let x of [-.2,.2])box(porter,.035,.33,.42,x,1.05+i*.35,.29,dark);}
 const scan=box(porter,.045,.56,.04,-.31,1.65,.18,ochre);scan.rotation.z=-.45;for(let i=0;i<4;i++){const b=box(porter,.2,.05,.025,-.46+Math.cos(i*1.57)*.12,1.91+Math.sin(i*1.57)*.12,.18,ochre);b.rotation.z=i*1.57;}
 // A thin strand in the distance and a shelter cut into the rock.
 box(world,2.7,1.45,1.3,-7,height(-7,-6)+.35,-6,concrete);box(world,1.9,.9,.05,-7,height(-7,-6)+.2,-5.32,dark);box(world,1.8,.03,.07,-7,height(-7,-6)+.65,-5.26,new T.MeshBasicMaterial({color:'#88d2db'}));
 const rainGeo=new T.BufferGeometry();const rainP=new Float32Array(900*6);for(let i=0;i<900;i++){const x=(random()-.5)*24,y=2+random()*10,z=(random()-.5)*20;rainP.set([x,y,z,x-.025,y-.3,z],i*6);}rainGeo.setAttribute('position',new T.BufferAttribute(rainP,3));const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#d5e6e6',transparent:true,opacity:.24}));world.add(rain);rain.visible=!reduced;
 const presets={hall:[[25,18,30],[0,2,0]],land:[[10,5,10],[0,2.5,-3]],bridge:[[5,4,6],[1,1.9,river(1)]],porter:[[5.7,3.7,6],[3,2.7,3]]};let transition=null,disposed=false,frame=0,last=0;
 function select(name){const [p,t]=presets[name];hall.visible=name==='hall';scene.background.set(name==='hall'?'#ced7d5':'#9aabaa');scene.fog.color.copy(scene.background);scene.fog.near=name==='hall'?34:15;scene.fog.far=name==='hall'?95:48;transition={p:new T.Vector3(...p),t:new T.Vector3(...t)};host.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));if(reduced){camera.position.copy(transition.p);controls.target.copy(transition.t);transition=null;}request();}
 const events=new AbortController();const on=(el,type,fn)=>el.addEventListener(type,fn,{signal:events.signal});
 host.querySelectorAll('[data-view]').forEach(b=>on(b,'click',()=>select(b.dataset.view)));on(host.querySelector('#spatial-reset'),'click',()=>select('hall'));
 const motion=host.querySelector('#spatial-motion');on(motion,'click',()=>{controls.autoRotate=!controls.autoRotate;motion.setAttribute('aria-pressed',String(controls.autoRotate));request()});
 const rb=host.querySelector('#spatial-rain');rb.setAttribute('aria-pressed',String(rain.visible));rb.textContent='雨幕 '+(rain.visible?'开':'关');on(rb,'click',()=>{rain.visible=!rain.visible;rb.setAttribute('aria-pressed',String(rain.visible));rb.textContent='雨幕 '+(rain.visible?'开':'关');request()});
 on(canvas,'pointerdown',()=>{transition=null;controls.autoRotate=false;motion.setAttribute('aria-pressed','false')});on(canvas,'keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();transition=null;const offset=camera.position.clone().sub(controls.target),sp=new T.Spherical().setFromVector3(offset);if(e.key==='ArrowLeft')sp.theta-=.1;if(e.key==='ArrowRight')sp.theta+=.1;if(e.key==='ArrowUp')sp.phi=Math.max(.15,sp.phi-.08);if(e.key==='ArrowDown')sp.phi=Math.min(1.48,sp.phi+.08);if(e.key==='+'||e.key==='=')sp.radius=Math.max(3,sp.radius*.9);if(e.key==='-')sp.radius=Math.min(48,sp.radius*1.1);camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(sp));request()});
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();request();}const observer=new ResizeObserver(resize);observer.observe(host);
 function request(){if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick);}
 function tick(now){frame=0;if(disposed||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(transition){camera.position.lerp(transition.p,.07);controls.target.lerp(transition.t,.07);if(camera.position.distanceTo(transition.p)<.015){camera.position.copy(transition.p);controls.target.copy(transition.t);transition=null;}}const changed=controls.update();if(rain.visible&&!reduced){for(let i=0;i<900;i++){let j=i*6;rainP[j+1]-=dt*3;rainP[j+4]-=dt*3;if(rainP[j+1]<1.5){rainP[j+1]+=10;rainP[j+4]+=10;}}rainGeo.attributes.position.needsUpdate=true;}renderer.render(scene,camera);if(transition||controls.autoRotate||(rain.visible&&!reduced)||changed)request();}
 controls.addEventListener('change',request);on(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{last=performance.now();request();}});on(canvas,'webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.textContent='三维画面已暂停，请刷新页面恢复。';cancelAnimationFrame(frame);frame=0;disposed=true;});
 status.hidden=true;resize();return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();events.abort();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});renderer.dispose();canvas.remove();};
}
