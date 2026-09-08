import * as T from '../vendor/three.module.min.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
export function mount(host){
 const status=host.querySelector('#spatial-status');let renderer;
 try{renderer=new T.WebGLRenderer({antialias:devicePixelRatio<2,powerPreference:'low-power'});}catch(e){status.textContent='当前设备无法开启三维画面。可在下方阅读展览说明与作品评测。';return ()=>{};}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 host.prepend(renderer.domElement);const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','死亡搁浅三维展厅。可选择第一人称或电影镜头模式，并使用 WASD、QE 与鼠标参观');
 const scene=new T.Scene();scene.background=new T.Color('#ced7d5');scene.fog=new T.Fog('#ced7d5',34,95);
 const camera=new T.PerspectiveCamera(45,1,.1,160);camera.position.set(12,8,22);
 const controls=new OrbitControls(camera,canvas);controls.target.set(0,3,-3);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=3;controls.maxDistance=48;controls.maxPolarAngle=Math.PI*.475;controls.autoRotateSpeed=.45;
 const lobby=new T.Group();scene.add(lobby);const pedestal=new T.Group();scene.add(pedestal);const hall=new T.Group();scene.add(hall);const world=new T.Group();scene.add(world);
 const mat=(color,roughness=.85,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const white=mat('#e3e4df'),concrete=mat('#a6aaa4'),dark=mat('#252e2c'),metal=mat('#78817e',.45,.65),ochre=mat('#bda569',.65,.3),suit=mat('#283c46');
 function box(parent,w,h,d,x,y,z,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 scene.add(new T.HemisphereLight('#cadde9','#323c2d',.85));const sun=new T.DirectionalLight('#ffe4bc',3.6);sun.position.set(-16,25,8);sun.castShadow=true;sun.shadow.mapSize.set(matchMedia('(max-width: 760px)').matches?1024:2048,matchMedia('(max-width: 760px)').matches?1024:2048);Object.assign(sun.shadow.camera,{left:-27,right:27,top:27,bottom:-27,near:1,far:80});sun.shadow.bias=-.0007;sun.shadow.normalBias=.035;sun.shadow.radius=3;scene.add(sun);const fill=new T.DirectionalLight('#a6cadd',.65);fill.position.set(15,9,-12);scene.add(fill);const rim=new T.DirectionalLight('#d7e5df',1.3);rim.position.set(2,16,-18);scene.add(rim);
 box(hall,65,.4,60,0,-.35,0,white);box(hall,52,15,.5,0,7,-22,white);box(hall,.5,15,46,-26,7,0,white);box(hall,.5,15,46,26,7,0,white);
 // Upper gallery, long horizontal balcony, clerestory and roof ribs.
 box(hall,50,.45,5,0,7.7,-18.5,concrete);box(hall,50,.18,.16,0,8.9,-16,metal);
 for(let x=-24;x<=24;x+=6){box(hall,.22,1.15,.22,x,8.3,-16,metal);box(hall,.5,15,.5,x,7,-21.3,white);box(hall,.28,.45,43,x,15,-1,white);}
 for(let x of [-21,21])for(let z of [-12,10])box(hall,.8,15,.8,x,7,z,white);
 const glass=new T.MeshPhysicalMaterial({color:'#e7f4f1',transparent:true,opacity:.16,roughness:.1,side:T.DoubleSide});box(hall,48,.08,38,0,15,0,glass);
 for(let x of [-17,17]){box(hall,4,.25,1.3,x,.7,9,dark);box(hall,.2,.7,1,x-1.4,.25,9,metal);box(hall,.2,.7,1,x+1.4,.25,9,metal);}
 function label(text,x,y,z,size=1.5){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#253a34';ctx.font='500 64px sans-serif';ctx.textAlign='center';ctx.fillText(text,512,140);const tex=new T.CanvasTexture(c);const o=new T.Mesh(new T.PlaneGeometry(size*4,size),new T.MeshBasicMaterial({map:tex,transparent:true}));o.position.set(x,y,z);hall.add(o);}
 label('GAME TEMPLE',0,11.4,-21.65,2.1);label('001   /   DEATH STRANDING',0,4.8,-21.65,1.15);
 box(pedestal,25,1.2,21,0,.4,0,mat('#3f4841'));box(pedestal,25.2,.07,21.2,0,1.02,0,metal);
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
 // The lobby accession contains an original object and a raycastable portal.
 box(lobby,4,.65,5,-4,.18,-2,concrete);
 const icon=ladder.clone();icon.position.set(-4,2.65,-2);icon.rotation.set(1.15,0,-.18);lobby.add(icon);
 const portalMaterial=new T.MeshStandardMaterial({color:'#667f79',emissive:'#406d70',emissiveIntensity:.45,roughness:.38,metalness:.25});
 const portal=box(lobby,4.8,7,.14,4,3.3,-6,portalMaterial);
 for(const x of [1.5,6.5])box(lobby,.15,7.3,.5,x,3.3,-6,metal);
 box(lobby,5.15,.15,.5,4,6.95,-6,metal);
 const portalGlow=new T.PointLight('#a9dbd7',18,10,2);portalGlow.position.set(4,3,-4.5);lobby.add(portalGlow);
 function lobbyLabel(text,x,y,z,size){label(text,x,y,z,size);lobby.add(hall.children[hall.children.length-1]);}
 lobbyLabel('THE FIRST CROSSING',4,5.65,-5.89,.5);
 lobbyLabel('ENTER / 001',4,1.5,-5.89,.65);
 lobbyLabel('LADDER / CONNECTION',-4,1,-.1,.5);
 const silhouette=porter.clone();silhouette.scale.setScalar(.75);silhouette.position.set(4,2.5,-5.8);silhouette.rotation.set(0,0,0);lobby.add(silhouette);
 // A small original landscape relief behind the portal threshold.
 for(let i=0;i<7;i++){const peak=new T.Mesh(new T.ConeGeometry(.7+i%2*.25,1.1+i%3*.35,4),rockMat);peak.position.set(2+i*.62,3.5,-5.82);peak.scale.z=.12;lobby.add(peak);}
 const presets={lobby:[[12,8,22],[0,3,-3]],hall:[[25,18,30],[0,2,0]],land:[[10,5,10],[0,2.5,-3]],bridge:[[5,4,6],[1,1.9,river(1)]],porter:[[5.7,3.7,6],[3,2.7,3]]};
 const fpsPresets={lobby:[[0,1.15,13],[0,2.2,-4]],hall:[[0,1.15,13],[0,2,0]],land:[[8,height(8,9)+1.5,9],[0,2,-2]],bridge:[[4,height(4,6)+1.5,6],[1,1.9,river(1)]],porter:[[5,height(5,6)+1.5,6],[3,2.7,3]]};
 let transition=null,disposed=false,frame=0,last=0,view='lobby',room='lobby',rainEnabled=!reduced,mode='cinema',dragging=false,pointerStart=null,pointerLast=null;
 const keys=new Set(),velocity=new T.Vector3(),direction=new T.Vector3(),forward=new T.Vector3(),right=new T.Vector3(),fpsFeet=new T.Vector3();let yaw=0,pitch=0,verticalOffset=0;
 const events=new AbortController();const on=(el,type,fn)=>el.addEventListener(type,fn,{signal:events.signal});
 const motion=host.querySelector('#spatial-motion'),rb=host.querySelector('#spatial-rain'),help=host.querySelector('#spatial-help');
 const stop=()=>{keys.clear();velocity.set(0,0,0);};
 const pauseOrbit=()=>{controls.autoRotate=false;motion.setAttribute('aria-pressed','false');};
 function groundAt(x,z){return room==='land'?height(x,z):-.35;}
 function syncFirstPerson(){camera.getWorldDirection(forward);yaw=Math.atan2(-forward.x,-forward.z);pitch=Math.asin(T.MathUtils.clamp(forward.y,-1,1));fpsFeet.copy(camera.position);fpsFeet.y-=1.5;applyFirstPersonLook();}
 function applyFirstPersonLook(){const cp=Math.cos(pitch);direction.set(-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp);controls.target.copy(camera.position).add(direction);camera.lookAt(controls.target);}
 function setMode(next,spawn=true){
  if(!['fps','cinema'].includes(next))return;stop();pauseOrbit();transition=null;mode=next;controls.enabled=mode==='cinema';motion.disabled=mode==='fps';host.dataset.mode=mode;
  host.querySelectorAll('[data-control-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.controlMode===mode)));
  if(mode==='fps'){
   if(document.pointerLockElement===canvas)document.exitPointerLock?.();
   if(spawn){const [p,t]=fpsPresets[view]||fpsPresets[room];verticalOffset=0;camera.position.set(p[0],groundAt(p[0],p[2])+1.5,p[2]);controls.target.set(...t);}syncFirstPerson();
   help.textContent='第一人称 · WASD 行走 · 鼠标转头 · Q / E 下降上升 · 眼睛距脚下 1.5m · 点击画面锁定鼠标';
  }else{
   camera.getWorldDirection(forward);controls.target.copy(camera.position).addScaledVector(forward,Math.max(4,Math.min(10,camera.position.distanceTo(controls.target)||7)));controls.update();
   help.textContent='电影镜头 · W / S 推近拉远 · A / D 左右环绕 · Q / E 下降上升 · 鼠标环绕';
  }request();
 }
 function select(name){
  if(!presets[name])return;stop();pauseOrbit();view=name;
  if(name==='lobby')room='lobby';else if(name==='hall')room='hall';else if(name==='land')room='land';else if(room==='lobby')room='hall';
  lobby.visible=room==='lobby';world.visible=room!=='lobby';hall.visible=room!=='land';pedestal.visible=room==='hall';rain.visible=rainEnabled&&room!=='lobby';
  // Keep all world materials, background, fog, lights and exposure identical across the threshold.
  const [p,t]=(mode==='fps'?fpsPresets:presets)[name];if(mode==='fps')verticalOffset=0;transition={p:new T.Vector3(p[0],mode==='fps'?groundAt(p[0],p[2])+1.5:p[1],p[2]),t:new T.Vector3(...t),fps:mode==='fps'};
  host.querySelectorAll('[data-view]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.view===name));b.hidden=room==='lobby'&&!['lobby','hall'].includes(b.dataset.view)});
  const caption=host.querySelector('.spatial-label');caption.querySelector('span').textContent=room==='lobby'?'GAME TEMPLE / ATRIUM':'DEATH STRANDING';caption.querySelector('p').textContent=room==='lobby'?'001 · 一架梯子，通往另一片世界':room==='hall'?'死亡搁浅 · 常设展厅':'死亡搁浅 · 荒野';
  rb.disabled=room==='lobby';if(reduced){camera.position.copy(transition.p);controls.target.copy(transition.t);const fps=transition.fps;transition=null;if(fps)syncFirstPerson();else controls.update();}request();
 }
 host.querySelectorAll('[data-view]').forEach(b=>on(b,'click',()=>select(b.dataset.view)));
 host.querySelectorAll('[data-control-mode]').forEach(b=>on(b,'click',()=>setMode(b.dataset.controlMode)));
 on(host.querySelector('#spatial-reset'),'click',()=>select('lobby'));
 on(motion,'click',()=>{if(mode!=='cinema')return;stop();transition=null;controls.autoRotate=!controls.autoRotate;motion.setAttribute('aria-pressed',String(controls.autoRotate));request()});
 rb.setAttribute('aria-pressed',String(rainEnabled));rb.textContent='雨幕 '+(rainEnabled?'开':'关');
 on(rb,'click',()=>{rainEnabled=!rainEnabled;rain.visible=rainEnabled&&room!=='lobby';rb.setAttribute('aria-pressed',String(rainEnabled));rb.textContent='雨幕 '+(rainEnabled?'开':'关');request()});
 const raycaster=new T.Raycaster();
 function rotateFirstPerson(dx,dy){if(mode!=='fps')return;yaw-=dx*.0022;pitch=T.MathUtils.clamp(pitch-dy*.0022,-Math.PI*.47,Math.PI*.47);applyFirstPersonLook();request();}
 on(canvas,'pointerdown',e=>{stop();transition=null;pauseOrbit();pointerStart=[e.clientX,e.clientY];pointerLast=[e.clientX,e.clientY];dragging=mode==='fps';canvas.focus({preventScroll:true});});
 on(canvas,'pointermove',e=>{if(mode==='fps'&&dragging&&document.pointerLockElement!==canvas){const dx=e.movementX??e.clientX-pointerLast[0],dy=e.movementY??e.clientY-pointerLast[1];pointerLast=[e.clientX,e.clientY];rotateFirstPerson(dx,dy);}});
 on(canvas,'pointerup',e=>{dragging=false;if(!pointerStart)return;const click=Math.hypot(e.clientX-pointerStart[0],e.clientY-pointerStart[1])<=6;let entered=false;if(room==='lobby'&&click){const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);if(raycaster.intersectObjects([portal,icon],true).length){select('hall');entered=true;}}if(mode==='fps'&&click&&!entered&&canvas.requestPointerLock)canvas.requestPointerLock();pointerStart=null;pointerLast=null;});
 on(document,'mousemove',e=>{if(mode==='fps'&&document.pointerLockElement===canvas)rotateFirstPerson(e.movementX,e.movementY)});
 on(document,'pointerlockchange',()=>host.classList.toggle('is-pointer-locked',document.pointerLockElement===canvas));
 on(canvas,'wheel',()=>{if(mode==='cinema'){transition=null;stop();pauseOrbit();}});
 const accepted=['w','a','s','d','q','e'];
 on(canvas,'keydown',e=>{const key=e.key.toLowerCase();if(!accepted.includes(key))return;e.preventDefault();transition=null;pauseOrbit();keys.add(key);request();});
 on(window,'keyup',e=>keys.delete(e.key.toLowerCase()));on(canvas,'blur',()=>{if(document.pointerLockElement!==canvas)stop()});on(window,'blur',stop);
 host.querySelectorAll('[data-move]').forEach(b=>{on(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);transition=null;pauseOrbit();keys.add(b.dataset.move);request()});for(const type of ['pointerup','pointercancel','lostpointercapture'])on(b,type,()=>keys.delete(b.dataset.move));});
 function moveFirstPerson(dt){
  forward.set(-Math.sin(yaw),0,-Math.cos(yaw));right.set(-forward.z,0,forward.x);direction.set(0,0,0).addScaledVector(forward,Number(keys.has('w'))-Number(keys.has('s'))).addScaledVector(right,Number(keys.has('d'))-Number(keys.has('a')));if(direction.lengthSq()>0)direction.normalize().multiplyScalar(4.8);direction.y=(Number(keys.has('e'))-Number(keys.has('q')))*3;
  velocity.lerp(direction,1-Math.exp(-(keys.size?8:12)*dt));if(velocity.lengthSq()<.00001)velocity.set(0,0,0);fpsFeet.x=T.MathUtils.clamp(fpsFeet.x+velocity.x*dt,-23,23);fpsFeet.z=T.MathUtils.clamp(fpsFeet.z+velocity.z*dt,-20,22);verticalOffset=T.MathUtils.clamp(verticalOffset+velocity.y*dt,0,12);fpsFeet.y=groundAt(fpsFeet.x,fpsFeet.z)+verticalOffset;camera.position.set(fpsFeet.x,fpsFeet.y+1.5,fpsFeet.z);applyFirstPersonLook();return keys.size>0||velocity.lengthSq()>0;
 }
 function moveCinema(dt){
  const offset=camera.position.clone().sub(controls.target),sp=new T.Spherical().setFromVector3(offset);const active=keys.size>0;
  if(keys.has('w'))sp.radius*=Math.exp(-1.15*dt);if(keys.has('s'))sp.radius*=Math.exp(1.15*dt);if(keys.has('a'))sp.theta-=.9*dt;if(keys.has('d'))sp.theta+=.9*dt;if(keys.has('q'))sp.phi+=.72*dt;if(keys.has('e'))sp.phi-=.72*dt;
  sp.radius=T.MathUtils.clamp(sp.radius,controls.minDistance,controls.maxDistance);sp.phi=T.MathUtils.clamp(sp.phi,.12,controls.maxPolarAngle);camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(sp));return active;
 }
 function move(dt){return mode==='fps'?moveFirstPerson(dt):moveCinema(dt);}
 const captureButton=host.querySelector('#spatial-capture'),dialog=host.querySelector('#spatial-photo'),photo=dialog.querySelector('img'),download=dialog.querySelector('a[download]');let photoURL=null;
 on(dialog.querySelector('button'),'click',()=>dialog.close());
 on(captureButton,'click',async()=>{
  stop();pauseOrbit();transition=null;captureButton.disabled=true;const capturedRoom=room;
  try{
   // Render and copy synchronously: preserveDrawingBuffer is unnecessary during normal browsing.
   renderer.render(scene,camera);const snapshot=document.createElement('canvas');snapshot.width=canvas.width;snapshot.height=canvas.height;const sc=snapshot.getContext('2d');if(!sc)throw Error('canvas');sc.drawImage(canvas,0,0);
   await document.fonts.ready;if(disposed)return;
   const card=document.createElement('canvas'),w=Math.min(2400,Math.max(1200,snapshot.width)),pad=Math.round(w*.035),imageH=Math.round((w-pad*2)*snapshot.height/snapshot.width),footer=Math.round(w*.185);card.width=w;card.height=pad+imageH+footer;
   const ctx=card.getContext('2d');if(!ctx)throw Error('canvas');ctx.fillStyle='#eeeae0';ctx.fillRect(0,0,w,card.height);ctx.drawImage(snapshot,pad,pad,w-pad*2,imageH);
   const y=pad+imageH;ctx.fillStyle='#263630';ctx.font=`500 ${w*.013}px sans-serif`;ctx.fillText('GAME TEMPLE  /  游戏圣殿',pad,y+w*.038);ctx.textAlign='right';ctx.fillText('SPATIAL COLLECTION  —  001',w-pad,y+w*.038);ctx.textAlign='left';
   ctx.font=`500 ${w*.036}px sans-serif`;ctx.fillText(capturedRoom==='lobby'?'一架梯子，通往另一片世界':'荒野中的连接',pad,y+w*.087);ctx.font=`${w*.013}px sans-serif`;ctx.fillStyle='#5f6b63';ctx.fillText('DEATH STRANDING  /  死亡搁浅 · 原创空间致敬',pad,y+w*.12);
   ctx.strokeStyle='#b9c0b7';ctx.beginPath();ctx.moveTo(pad,y+w*.14);ctx.lineTo(w-pad,y+w*.14);ctx.stroke();ctx.font=`${w*.01}px monospace`;ctx.fillText(`${new Date().toISOString().slice(0,10)}  /  ${capturedRoom==='lobby'?'ATRIUM':capturedRoom==='hall'?'EXHIBITION':'WILDERNESS'}  /  v1.2.0`,pad,y+w*.163);ctx.textAlign='right';ctx.fillText('KEEP ON KEEPING ON',w-pad,y+w*.163);
   const blob=await new Promise(resolve=>card.toBlob(resolve,'image/png'));if(!blob)throw Error('export');if(disposed)return;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(blob);photo.src=photoURL;download.href=photoURL;download.download=`game-temple-${capturedRoom}-${Date.now()}.png`;dialog.showModal();
  }catch(e){status.hidden=false;status.textContent='图片生成失败，请重试。';}finally{captureButton.disabled=false;request();}
 });
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();request();}const observer=new ResizeObserver(resize);observer.observe(host);
 function request(){if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick);}
 function tick(now){frame=0;if(disposed||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(transition){camera.position.lerp(transition.p,1-Math.exp(-5*dt));controls.target.lerp(transition.t,1-Math.exp(-5*dt));if(camera.position.distanceTo(transition.p)<.015){camera.position.copy(transition.p);controls.target.copy(transition.t);const fps=transition.fps;transition=null;if(fps)syncFirstPerson();}}const moving=transition?false:move(dt);const changed=mode==='cinema'&&controls.update();if(rain.visible&&!reduced){for(let i=0;i<900;i++){let j=i*6;rainP[j+1]-=dt*3;rainP[j+4]-=dt*3;if(rainP[j+1]<1.5){rainP[j+1]+=10;rainP[j+4]+=10;}}rainGeo.attributes.position.needsUpdate=true;}renderer.render(scene,camera);if(moving||transition||controls.autoRotate||(rain.visible&&!reduced)||changed)request();}
 controls.addEventListener('change',request);on(document,'visibilitychange',()=>{if(document.hidden){stop();cancelAnimationFrame(frame);frame=0;}else{last=performance.now();request();}});on(canvas,'webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.textContent='三维画面已暂停，请刷新页面恢复。';cancelAnimationFrame(frame);frame=0;disposed=true;});
 status.hidden=true;setMode('cinema',false);select('lobby');resize();return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();events.abort();if(document.pointerLockElement===canvas)document.exitPointerLock?.();dialog.close();if(photoURL)URL.revokeObjectURL(photoURL);controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});renderer.dispose();canvas.remove();};
}
