import * as T from '../vendor/three.module.min.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
export function mount(host){
 const status=host.querySelector('#spatial-status');let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch(e){status.textContent='当前设备无法开启三维画面。可在下方阅读展览说明与作品评测。';return ()=>{};}
 const compact=matchMedia('(max-width: 900px), (pointer: coarse)').matches;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.35:1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 host.prepend(renderer.domElement);const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','游戏圣殿三维展馆。可选择第一人称或电影镜头模式，并使用 WASD、QE 与鼠标参观');
 const scene=new T.Scene();scene.background=new T.Color('#aebfc2');scene.fog=new T.Fog('#aebfc2',34,95);
 const camera=new T.PerspectiveCamera(45,1,.1,220);camera.position.set(12,8,22);
 const controls=new OrbitControls(camera,canvas);controls.target.set(0,3,-3);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=3;controls.maxDistance=32;controls.maxPolarAngle=Math.PI-.12;controls.autoRotateSpeed=.45;
 const lobby=new T.Group();scene.add(lobby);const pedestal=new T.Group();scene.add(pedestal);const hall=new T.Group();scene.add(hall);const world=new T.Group();scene.add(world);
 const mat=(color,roughness=.85,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const white=mat('#d6d8d4'),concrete=mat('#a6aaa4'),dark=mat('#252e2c'),metal=mat('#78817e',.45,.65),ochre=mat('#bda569',.65,.3),suit=mat('#283c46');
 function box(parent,w,h,d,x,y,z,m){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 const ambient=new T.HemisphereLight('#cadde9','#26302e',.48);scene.add(ambient);const sun=new T.DirectionalLight('#dce8e8',3.1);sun.position.set(-18,16,-12);sun.castShadow=true;sun.shadow.mapSize.set(matchMedia('(max-width: 760px)').matches?1024:2048,matchMedia('(max-width: 760px)').matches?1024:2048);Object.assign(sun.shadow.camera,{left:-27,right:27,top:27,bottom:-27,near:1,far:80});sun.shadow.bias=-.0007;sun.shadow.normalBias=.035;sun.shadow.radius=3;scene.add(sun);const fill=new T.DirectionalLight('#9cbccc',.32);fill.position.set(15,9,-12);scene.add(fill);const rim=new T.DirectionalLight('#e8d8b4',1.1);rim.position.set(2,16,-18);scene.add(rim);
 const galleryLights=new T.Group();scene.add(galleryLights);
 for(const [x,z] of [[-9,5],[8,7],[-6,-9]]){const light=new T.SpotLight('#fff4e7',180,50,1.1,1,1.6);light.position.set(x,13,z);light.target.position.set(x*.3,1.5,z*.25);galleryLights.add(light,light.target);}
 const backdrop=new T.Group();scene.add(backdrop);backdrop.visible=false;
 const distantTexture=new T.TextureLoader().load(new URL('../collection/death-stranding.webp',import.meta.url).href,()=>{if(!disposed)request();},undefined,()=>{if(!disposed){status.hidden=false;status.textContent='远景图片加载失败，仍可继续参观或刷新重试。';}});
 distantTexture.colorSpace=T.SRGBColorSpace;distantTexture.wrapS=T.MirroredRepeatWrapping;distantTexture.repeat.set(4,.54);distantTexture.offset.y=.46;
 const distant=new T.Mesh(new T.CylinderGeometry(90,90,85,96,1,true),new T.MeshBasicMaterial({map:distantTexture,side:T.BackSide,fog:true}));distant.position.y=25;backdrop.add(distant);
 // Outdoor terrain continuation is constructed after the exhibition terrain below.
 function lightRoom(next){const outdoor=next==='land';galleryLights.visible=!outdoor;backdrop.visible=outdoor;ambient.intensity=outdoor?.85:.95;ambient.color.set(outdoor?'#cadde9':'#f0ebe2');ambient.groundColor.set(outdoor?'#26302e':'#72736a');sun.intensity=outdoor?2.4:.5;sun.color.set(outdoor?'#dce8e8':'#fff0dd');fill.intensity=outdoor?.45:.48;rim.intensity=outdoor?.8:.28;renderer.toneMappingExposure=outdoor?.95:1;scene.background=new T.Color(outdoor?'#aebfc2':'#c3c6c0');scene.fog=new T.Fog(outdoor?'#aebfc2':'#c3c6c0',outdoor?28:55,outdoor?95:130);}
 box(hall,65,.4,60,0,-.35,0,white);box(hall,52,15,.5,0,7,-22,white);box(hall,.5,15,46,-26,7,0,white);box(hall,.5,15,46,26,7,0,white);
 // Upper gallery, long horizontal balcony, clerestory and roof ribs.
 box(hall,50,.45,5,0,7.7,-18.5,concrete);box(hall,50,.18,.16,0,8.9,-16,metal);
 for(let x=-24;x<=24;x+=6){box(hall,.22,1.15,.22,x,8.3,-16,metal);box(hall,.5,15,.5,x,7,-21.3,white);box(hall,.28,.45,43,x,15,-1,white);}
 for(let x of [-21,21])for(let z of [-12,10])box(hall,.8,15,.8,x,7,z,white);
 const glass=new T.MeshPhysicalMaterial({color:'#e7f4f1',transparent:true,opacity:.16,roughness:.1,side:T.DoubleSide});box(hall,48,.08,38,0,15,0,glass);
 for(let x of [-17,17]){box(hall,4,.25,1.3,x,.7,9,dark);box(hall,.2,.7,1,x-1.4,.25,9,metal);box(hall,.2,.7,1,x+1.4,.25,9,metal);}
 function label(text,x,y,z,size=1.5){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#253a34';ctx.font='500 64px sans-serif';ctx.textAlign='center';ctx.fillText(text,512,140,960);const tex=new T.CanvasTexture(c);const o=new T.Mesh(new T.PlaneGeometry(size*4,size),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));o.position.set(x,y,z);o.userData.signText=text;hall.add(o);return o;}
 // Signage is mounted on the room side of the balcony and wall columns.
 // Opaque backing preserves normal depth occlusion without letters intersecting ribs.
 box(hall,10.2,2.5,.12,0,11.4,-15.72,white);
 box(hall,7.2,1.5,.12,0,4.8,-20.86,white);
 label('GAME TEMPLE',0,11.4,-15.64,2.1);const roomSign=label('PERMANENT COLLECTION',0,4.8,-20.78,1.15);
 box(pedestal,25,1.2,21,0,.4,0,mat('#3f4841'));box(pedestal,25.2,.07,21.2,0,1.02,0,metal);
 let seed=17;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 const river=x=>1.1*Math.sin(x*.36)+.4*Math.sin(x*.9);
 function height(x,z){const r=Math.abs(z-river(x));const bank=1-Math.exp(-r*r*.4);const hills=.65+.45*Math.sin(x*.38+z*.3)+.35*Math.cos(z*.66-x*.22)+.16*Math.sin(x*1.8+z*1.7);const mountain=Math.max(0,-z-2.5)*(.3+.15*Math.sin(x*.55));return 1.1+bank*(hills+mountain);}
 const geo=new T.PlaneGeometry(24,20,100,84);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;const colors=[];const green=new T.Color();
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),y=height(x,z);pos.setY(i,y);const r=Math.abs(z-river(x));green.set(r<.75?'#4a5549':y>3.8?'#59625a':'#62734a');green.multiplyScalar(.79+random()*.3);colors.push(green.r,green.g,green.b);}geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const terrain=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:1}));terrain.receiveShadow=true;terrain.castShadow=true;world.add(terrain);
 // Rectangular rings share every original boundary vertex (100 x 84 segments).
 // Only the outdoor group receives this extension; the exhibition remains a diorama.
 function outerHeight(x,z){
  const bx=T.MathUtils.clamp(x,-12,12),bz=T.MathUtils.clamp(z,-10,10);
  const distance=Math.hypot(x-bx,z-bz),blend=T.MathUtils.smoothstep(distance,0,22);
  const bank=1-Math.exp(-Math.pow(Math.max(0,Math.abs(z-river(x))-3.5),2)*.4);
  const hills=1.1+bank*(1.1+.5*Math.sin(x*.11+z*.09)+.35*Math.cos(z*.16-x*.08));
  return T.MathUtils.lerp(height(x,z),hills,blend);
 }
 const edge=[];
 for(let i=0;i<100;i++)edge.push([-12+i*.24,-10]);
 for(let i=0;i<84;i++)edge.push([12,-10+i*20/84]);
 for(let i=0;i<100;i++)edge.push([12-i*.24,10]);
 for(let i=0;i<84;i++)edge.push([-12,10-i*20/84]);
 const op=[],oc=[],oi=[],rings=16,n=edge.length;
 for(let k=0;k<=rings;k++){
  const scale=1+9*Math.pow(k/rings,1.6);
  for(const [bx,bz] of edge){const x=bx*scale,z=bz*scale,y=outerHeight(x,z);op.push(x,y,z);
   green.set(Math.abs(z-river(x))<.75?'#4a5549':y>3.8?'#59625a':'#62734a');
   green.multiplyScalar(.91+.08*Math.sin(x*1.7+z*2.3));oc.push(green.r,green.g,green.b);
  }
  if(k<rings)for(let j=0;j<n;j++){const a=k*n+j,b=k*n+(j+1)%n,c=a+n,d=b+n;oi.push(a,b,c,b,d,c);}
 }
 const outerGeo=new T.BufferGeometry();outerGeo.setAttribute('position',new T.Float32BufferAttribute(op,3));outerGeo.setAttribute('color',new T.Float32BufferAttribute(oc,3));outerGeo.setIndex(oi);outerGeo.computeVertexNormals();
 const outerTerrain=new T.Mesh(outerGeo,new T.MeshStandardMaterial({vertexColors:true,roughness:1,side:T.DoubleSide}));outerTerrain.receiveShadow=true;backdrop.add(outerTerrain);
 // Continue both stream ends through the outer terrain, using the same river function.
 const streamPos=[],streamIndices=[];
 for(const side of [-1,1]){const offset=streamPos.length/3;
  for(let i=0;i<=176;i++){const x=side*(12+i*.5),z=river(x);streamPos.push(x,1.22,z-.58,x,1.22,z+.58);if(i<176){const a=offset+i*2;streamIndices.push(a,a+1,a+2,a+1,a+3,a+2);}}
 }
 const streamGeo=new T.BufferGeometry();streamGeo.setAttribute('position',new T.Float32BufferAttribute(streamPos,3));streamGeo.setIndex(streamIndices);streamGeo.computeVertexNormals();
 // Winding stream, shallow and reflective.
 const waterGeo=new T.BufferGeometry(),wp=[],wi=[];for(let i=0;i<=150;i++){const x=-12+24*i/150,z=river(x);wp.push(x,1.22,z-.58,x,1.22,z+.58);if(i<150){const n=i*2;wi.push(n,n+1,n+2,n+1,n+3,n+2);}}waterGeo.setAttribute('position',new T.Float32BufferAttribute(wp,3));waterGeo.setIndex(wi);waterGeo.computeVertexNormals();const water=new T.Mesh(waterGeo,new T.MeshStandardMaterial({color:'#91b1b3',metalness:.65,roughness:.25,side:T.DoubleSide}));world.add(water);const outerWater=new T.Mesh(streamGeo,water.material);backdrop.add(outerWater);
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
 const rainGeo=new T.BufferGeometry();const rainP=new Float32Array(900*6);for(let i=0;i<900;i++){const x=(random()-.5)*24,y=2+random()*10,z=(random()-.5)*20;rainP.set([x,y,z,x-.025,y-.3,z],i*6);}rainGeo.setAttribute('position',new T.BufferAttribute(rainP,3));const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#d5e6e6',transparent:true,opacity:.24,depthWrite:false}));world.add(rain);rain.visible=!reduced;
 // Three separate thresholds; signs sit above the exhibits and never inside relief geometry.
 const exhibits={
  death:{number:'001',title:'死亡搁浅',en:'DEATH STRANDING',view:'hall',color:'#65847b',quote:'KEEP ON KEEPING ON',caption:'荒野中的连接'},
  spider:{number:'002',title:'漫威蜘蛛侠',en:'MARVEL’S SPIDER-MAN',view:'spider',color:'#9f3e43',quote:'BE GREATER',caption:'城市之间，纵身一跃'},
  west:{number:'003',title:'荒野大镖客 2',en:'RED DEAD REDEMPTION 2',view:'west',color:'#947344',quote:'A WORLD THAT REMEMBERS',caption:'山谷里的最后一束光'}
 };
 let activeExhibit='death';const portals=[];
 function lobbyLabel(text,x,y,z,size){const sign=label(text,x,y,z,size);lobby.add(sign);return sign;}
 for(const [key,info] of Object.entries(exhibits)){
  const x={death:-14,spider:0,west:14}[key];
  const portal=box(lobby,6.4,6.8,.24,x,3.25,-8,mat(info.color,.7,.1));portal.userData.view=info.view;portals.push(portal);
  for(const side of [-1,1])box(lobby,.16,7,.45,x+side*3.35,3.25,-8,metal);
  box(lobby,6.9,.16,.45,x,6.78,-8,metal);
  box(lobby,7.2,1.4,.18,x,8,-7.9,white);
  lobbyLabel(info.en,x,8,-7.78,1.6);lobbyLabel('ENTER / '+info.number,x,1.5,-7.84,.85);
  // Photographic portal panel reuses the museum's locally hosted, version-matched collection.
  const texture=new T.TextureLoader().load(new URL('../collection/'+({death:'death-stranding',spider:'spider-man',west:'rdr2'}[key])+'.webp',import.meta.url).href,()=>{if(!disposed)request();});texture.colorSpace=T.SRGBColorSpace;
  const panel=new T.Mesh(new T.PlaneGeometry(5.8,3.2625),new T.MeshBasicMaterial({map:texture}));panel.position.set(x,4.3,-7.85);panel.userData.view=info.view;lobby.add(panel);portals.push(panel);
  box(lobby,3.8,.65,3,x,.175,-2.5,concrete);
  if(key==='death'){const icon=ladder.clone();icon.position.set(x,1.85,-2.5);icon.rotation.set(.9,0,-.18);lobby.add(icon);}
  if(key==='spider'){const curve=new T.CatmullRomCurve3([new T.Vector3(x-1.3,2.7,-2.5),new T.Vector3(x,1.2,-2.5),new T.Vector3(x+1.3,2.7,-2.5)]);lobby.add(new T.Mesh(new T.TubeGeometry(curve,24,.055,6,false),mat('#dce5e5')));}
  if(key==='west'){const hat=new T.Group();hat.position.set(x,.6,-2.5);const brim=new T.Mesh(new T.CylinderGeometry(.95,.95,.08,32),mat('#72563b'));brim.position.y=.08;hat.add(brim);const crown=new T.Mesh(new T.CylinderGeometry(.44,.5,.5,24),mat('#72563b'));crown.position.y=.36;hat.add(crown);lobby.add(hat);}
 }
 const themed={};
 function buildTheme(key){
  if(themed[key])return themed[key];const group=new T.Group();group.name=key+'-exhibition';scene.add(group);themed[key]=group;
  if(key==='spider'){
   const stone=mat('#7d817e'),brick=mat('#85534b'),roof=mat('#303c45'),red=mat('#b43d43'),blue=mat('#283e59');
   box(group,24,.22,20,0,1.2,0,roof);
   // Staggered Manhattan blocks, a clear central street and a foreground rooftop.
   for(const [x,z,w,d,h] of [[-8,-6,4,4,6],[-2,-7,4,3,8],[5,-7,5,4,5],[9,-1,3,5,7],[-9,1,3,5,4],[-5,5,5,4,2.5],[3,4,5,5,3.5]]){
    box(group,w,h,d,x,1.31+h/2,z,((x+z)%2)?brick:stone);box(group,w+.14,.16,d+.14,x,1.39+h,z,roof);
    const windows=[];for(let yy=2;yy<h+.5;yy+=1.2)for(let xx=-w/2+.55;xx<w/2;xx+=.9)windows.push([x+xx,yy+.6,z+d/2+.022]);
    const panes=new T.InstancedMesh(new T.BoxGeometry(.42,.63,.025),mat('#9dabad',.4,.25),windows.length);const transform=new T.Object3D();windows.forEach((v,i)=>{transform.position.set(...v);transform.updateMatrix();panes.setMatrixAt(i,transform.matrix)});group.add(panes);
   }
   for(let z=-8;z<=8;z+=2)box(group,.14,.012,.85,0,1.322,z,mat('#dac79e'));
   // Rooftop water tank, deliberately grounded on four legs.
   for(const x of [-.6,.6])for(const z of [-.6,.6])box(group,.1,.8,.1,-2+x,9.7,-7+z,metal);
   const tank=new T.Mesh(new T.CylinderGeometry(.9,.9,1.4,20),mat('#76614e'));tank.position.set(-2,10.7,-7);tank.castShadow=true;group.add(tank);
   const lid=new T.Mesh(new T.ConeGeometry(1,.45,20),roof);lid.position.set(-2,11.625,-7);group.add(lid);
   const arc=new T.CatmullRomCurve3([new T.Vector3(-8,8,-5),new T.Vector3(-3,6,0),new T.Vector3(1,7,2),new T.Vector3(5,10,-3)]);
   const web=new T.Mesh(new T.TubeGeometry(arc,48,.025,5,false),mat('#e1e9e7'));group.add(web);
   const hero=new T.Group();hero.position.set(1,6.3,2);hero.rotation.z=-.6;group.add(hero);
   const body=new T.Mesh(new T.CapsuleGeometry(.22,.55,5,10),red);body.position.y=.6;hero.add(body);
   const head=new T.Mesh(new T.SphereGeometry(.19,16,12),red);head.position.y=1.2;hero.add(head);
   for(const side of [-1,1]){const arm=box(hero,.12,.7,.13,side*.3,.93,0,red);arm.rotation.z=side*-.65;const leg=box(hero,.16,.85,.17,side*.18,-.05,0,blue);leg.rotation.z=side*.45;}
  }else{
   const grass=mat('#85835a'),bark=mat('#665043'),pine=mat('#465849'),canvasMat=mat('#baab85'),wood=mat('#75573d');
   const ground=new T.PlaneGeometry(24,20,64,52);ground.rotateX(-Math.PI/2);const p=ground.attributes.position;
   for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,1.35+.12*Math.sin(x*.5)*Math.cos(z*.5)+Math.max(0,-z-2)*(.38+.16*Math.cos(x*.45)));}ground.computeVertexNormals();const meadow=new T.Mesh(ground,grass);meadow.receiveShadow=true;group.add(meadow);
   function wy(x,z){return 1.35+.12*Math.sin(x*.5)*Math.cos(z*.5)+Math.max(0,-z-2)*(.38+.16*Math.cos(x*.45));}
   for(let i=0;i<24;i++){const x=-11+(i*7.13)%22,z=-8+(i*3.17)%6,h=1.8+i%4*.5;box(group,.16,h,.16,x,wy(x,z)+h/2,z,bark);for(let k=0;k<2;k++){const crown=new T.Mesh(new T.ConeGeometry(.75-k*.16,h*.72,7),pine);crown.position.set(x,wy(x,z)+h*.65+k*.5,z);crown.castShadow=true;group.add(crown);}}
   // Camp tent with a true triangular profile, raised bedroll and wagon.
   const tentGeo=new T.BufferGeometry();tentGeo.setAttribute('position',new T.Float32BufferAttribute([-5,1.5,2,-3.5,3.1,2,-5,1.5,5,-3.5,3.1,2,-3.5,3.1,5,-5,1.5,5,-3.5,3.1,2,-2,1.5,2,-3.5,3.1,5,-2,1.5,2,-2,1.5,5,-3.5,3.1,5],3));tentGeo.computeVertexNormals();const tent=new T.Mesh(tentGeo,new T.MeshStandardMaterial({color:'#baab85',side:T.DoubleSide,roughness:1}));tent.castShadow=true;group.add(tent);box(group,.12,1.8,.12,-3.5,2.2,2,wood);box(group,1.1,.14,2,-3.5,1.6,3.6,mat('#6c7367'));
   const wagon=new T.Group();wagon.position.set(4,2.05,3);group.add(wagon);box(wagon,2,.28,3.5,0,.3,0,wood);box(wagon,2,.65,.12,0,.75,1.7,wood);for(const x of [-.94,.94])box(wagon,.12,.65,3.5,x,.75,0,wood);
   for(const x of [-1.14,1.14])for(const z of [-1.15,1.15]){const wheel=new T.Mesh(new T.TorusGeometry(.58,.075,6,18),wood);wheel.rotation.y=Math.PI/2;wheel.position.set(x,.1,z);wagon.add(wheel);for(let a=0;a<Math.PI;a+=Math.PI/4){const spoke=box(wagon,.06,1.05,.06,x,.1,z,wood);spoke.rotation.x=a;}}
   const embers=new T.Mesh(new T.CylinderGeometry(.4,.48,.09,12),mat('#965d36'));embers.position.set(0,wy(0,3)+.05,3);group.add(embers);
   for(let i=0;i<10;i++){const rock=new T.Mesh(rockGeo,rockMat);rock.scale.set(.2,.13,.18);rock.position.set(Math.cos(i*.628)*.65,wy(0,3)+.13,3+Math.sin(i*.628)*.65);group.add(rock);}
   for(const z of [-.8,.8]){const log=new T.Mesh(new T.CylinderGeometry(.18,.18,2.3,10),bark);log.rotation.z=Math.PI/2;log.position.set(0,wy(0,3)+.18,3+z*1.5);group.add(log);}
  }
  group.visible=false;return group;
 }
 const presets={lobby:[[0,7,24],[0,3.8,-5]],spider:[[17,11,21],[0,4,0]],west:[[16,10,21],[0,2.5,0]],hall:[[16,9,20],[0,2.1,0]],land:[[10,5.2,9],[0,2.2,-2]],bridge:[[5,4,6],[1,1.9,river(1)]],porter:[[5.7,3.7,6],[3,2.7,3]]};
 const fpsPresets={spider:[[0,1.35,16],[0,4,0]],west:[[0,1.35,16],[0,2.5,0]],lobby:[[0,1.15,13],[0,2.2,-4]],hall:[[0,1.15,16],[0,2,0]],land:[[8,height(8,9)+1.5,9],[0,2,-2]],bridge:[[4,height(4,6)+1.5,6],[1,1.9,river(1)]],porter:[[5,height(5,6)+1.5,6],[3,2.7,3]]};
 let transition=null,disposed=false,frame=0,last=0,view='lobby',room='lobby',rainEnabled=!reduced,mode='cinema',dragging=false,pointerStart=null,pointerLast=null;
 const keys=new Set(),velocity=new T.Vector3(),direction=new T.Vector3(),forward=new T.Vector3(),right=new T.Vector3(),fpsFeet=new T.Vector3();let yaw=0,pitch=0,verticalOffset=0;
 const events=new AbortController();const on=(el,type,fn)=>el.addEventListener(type,fn,{signal:events.signal});
 const motion=host.querySelector('#spatial-motion'),rb=host.querySelector('#spatial-rain'),help=host.querySelector('#spatial-help');
 const stop=()=>{keys.clear();velocity.set(0,0,0);};
 const pauseOrbit=()=>{controls.autoRotate=false;motion.setAttribute('aria-pressed','false');};
 function groundAt(x,z){return room==='land'?height(x,z):-.15;}
 let collisionBoxes=[];const safety=.32;
 function cacheCollisions(){scene.updateMatrixWorld(true);collisionBoxes=[];
  const roots=[hall,lobby,pedestal,world,...Object.values(themed)].filter(g=>g.visible);
  for(const root of roots)root.traverse(o=>{if(!o.isMesh||o.material?.transparent||o.geometry?.type!=='BoxGeometry')return;const b=new T.Box3().setFromObject(o),size=b.getSize(new T.Vector3());if(size.y<.3||size.x>45||size.z>45)return;collisionBoxes.push(b);});
 }
 function avoidSolids(){for(let pass=0;pass<3;pass++)for(const b of collisionBoxes){const p=camera.position;if(p.y<b.min.y-safety||p.y>b.max.y+safety||p.x<=b.min.x-safety||p.x>=b.max.x+safety||p.z<=b.min.z-safety||p.z>=b.max.z+safety)continue;
  const edges=[{axis:'x',value:b.min.x-safety},{axis:'x',value:b.max.x+safety},{axis:'z',value:b.min.z-safety},{axis:'z',value:b.max.z+safety}];edges.sort((a,c)=>Math.abs(p[a.axis]-a.value)-Math.abs(p[c.axis]-c.value));p[edges[0].axis]=edges[0].value;
 }}
 function constrainCamera(){
  camera.position.x=T.MathUtils.clamp(camera.position.x,room==='land'?-11.5:-23,room==='land'?11.5:23);
  camera.position.z=T.MathUtils.clamp(camera.position.z,room==='land'?-9.5:-20,room==='land'?9.5:22);
  const floor=groundAt(camera.position.x,camera.position.z);camera.position.y=T.MathUtils.clamp(camera.position.y,floor,14);
  if(room==='hall'&&Math.abs(camera.position.x)<12.6&&Math.abs(camera.position.z)<10.6&&camera.position.y<5.8){const dx=12.6-Math.abs(camera.position.x),dz=10.6-Math.abs(camera.position.z);if(dx<dz)camera.position.x=Math.sign(camera.position.x||1)*12.6;else camera.position.z=Math.sign(camera.position.z||1)*10.6;}
  avoidSolids();
 }
 function clampCinema(){if(mode!=='cinema')return;constrainCamera();camera.lookAt(controls.target);}
 function syncFirstPerson(){camera.getWorldDirection(forward);yaw=Math.atan2(-forward.x,-forward.z);pitch=Math.asin(T.MathUtils.clamp(forward.y,-1,1));fpsFeet.copy(camera.position);fpsFeet.y-=1.5;applyFirstPersonLook();}
 function applyFirstPersonLook(){const cp=Math.cos(pitch);direction.set(-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp);controls.target.copy(camera.position).add(direction);camera.lookAt(controls.target);}
 function setMode(next,spawn=true){
  if(!['fps','cinema'].includes(next))return;stop();pauseOrbit();transition=null;mode=next;controls.enabled=mode==='cinema';motion.disabled=mode==='fps';host.dataset.mode=mode;
  host.querySelectorAll('[data-control-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.controlMode===mode)));
  if(mode==='fps'){
   if(document.pointerLockElement===canvas)document.exitPointerLock?.();
   if(spawn){const [p,t]=fpsPresets[view]||fpsPresets[room];verticalOffset=0;camera.position.set(p[0],groundAt(p[0],p[2])+1.5,p[2]);controls.target.set(...t);}syncFirstPerson();
   help.textContent=compact?'第一人称 · 拖动画面转头 · 按住方向按钮行走':'第一人称 · WASD 行走 · 鼠标转头 · Q / E 下降上升 · 眼睛距脚下 1.5m · 点击画面锁定鼠标';
  }else{
   controls.target.set(...presets[view][1]);clampCinema();controls.update();
   help.textContent=compact?'电影镜头 · 单指环绕 · 双指缩放 · 按住方向按钮移动':'电影镜头 · W / S 推近拉远 · A / D 左右环绕 · Q / E 下降上升 · 鼠标环绕';
  }request();
 }
 function select(name){
  if(!presets[name]||(room==='lobby'&&!['lobby','hall','spider','west'].includes(name)))return;
  stop();pauseOrbit();if(document.pointerLockElement===canvas)document.exitPointerLock?.();dragging=false;pointerStart=null;
  const previousRoom=room;const damping=controls.enableDamping;controls.enableDamping=false;controls.update();controls.enableDamping=damping;view=name;
  if(['lobby','hall','land','spider','west'].includes(name))room=name;
  if(room==='hall'||room==='land')activeExhibit='death';else if(room!=='lobby')activeExhibit=room;
  if(room==='spider'||room==='west')buildTheme(room);
  renderer.shadowMap.needsUpdate=true;lobby.visible=room==='lobby';world.visible=room==='hall'||room==='land';hall.visible=room!=='land';pedestal.visible=room!=='lobby'&&room!=='land';rain.visible=rainEnabled&&room==='land';
  for(const [key,group] of Object.entries(themed))group.visible=room===key;
  lightRoom(room);cacheCollisions();
  const [p,t]=(mode==='fps'?fpsPresets:presets)[name];focalInput.value=compact?'24':'35';camera.setFocalLength(Number(focalInput.value));host.querySelector('#spatial-focal-value').textContent=focalInput.value+' mm';updateFocus(new T.Vector3(...p).distanceTo(new T.Vector3(...t)));if(mode==='fps')verticalOffset=0;transition={p:new T.Vector3(p[0],mode==='fps'?groundAt(p[0],p[2])+1.5:p[1],p[2]),t:new T.Vector3(...t),fps:mode==='fps'};
  host.querySelectorAll('[data-view]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.view===name));b.hidden=(['land','bridge','porter'].includes(b.dataset.view)&&!['hall','land'].includes(room))||(room==='hall'&&['bridge','porter'].includes(b.dataset.view))});
  const info=exhibits[activeExhibit],caption=host.querySelector('.spatial-label');caption.querySelector('span').textContent=room==='lobby'?'GAME TEMPLE / ATRIUM':info.en;caption.querySelector('p').textContent=room==='lobby'?'三件物品，三个世界':info.title+(room==='land'?' · 荒野':' · 常设展厅');
  const note=host.parentElement?.querySelector('.spatial-notes');if(note){const data={death:['在抵达之前，先感受距离。','苔原、货物与一座梯桥：把连接放回人与荒野的尺度。','death-stranding'],spider:['把城市，变成身体的延伸。','纽约屋顶、水塔与悬空的蛛丝轨迹，将摆荡的高度、弧线与速度凝结成一座城市模型。','spider-man'],west:['在时代远去之前，停留片刻。','松林、山谷、篷车与营地，留住旅途中那些未被任务定义的时刻。','rdr2']}[activeExhibit];note.querySelector('.eyebrow').textContent=info.en;note.querySelector('h2').textContent=data[0];note.querySelector('.exhibit-description').textContent=data[1];note.querySelector('a').href='#game/'+data[2];note.querySelector('aside span').textContent='展览档案 / '+info.number;}
  rb.disabled=room!=='land';if(reduced||previousRoom!==room){camera.position.copy(transition.p);controls.target.copy(transition.t);const fps=transition.fps;transition=null;if(fps)syncFirstPerson();else controls.update();constrainCamera();}request();
 }
 host.querySelectorAll('[data-view]').forEach(b=>on(b,'click',()=>select(b.dataset.view)));
 host.querySelectorAll('[data-control-mode]').forEach(b=>on(b,'click',()=>setMode(b.dataset.controlMode)));
 on(host.querySelector('#spatial-reset'),'click',()=>select('lobby'));
 on(host.querySelector('#spatial-home-view'),'click',()=>select(room));
 on(motion,'click',()=>{if(mode!=='cinema')return;stop();transition=null;controls.autoRotate=!controls.autoRotate;motion.setAttribute('aria-pressed',String(controls.autoRotate));request()});
 rb.setAttribute('aria-pressed',String(rainEnabled));rb.textContent='雨幕 '+(rainEnabled?'开':'关');
 on(rb,'click',()=>{rainEnabled=!rainEnabled;rain.visible=rainEnabled&&room==='land';rb.setAttribute('aria-pressed',String(rainEnabled));rb.textContent='雨幕 '+(rainEnabled?'开':'关');request()});

 const dofButton=host.querySelector('#spatial-dof'),apertureInput=host.querySelector('#spatial-aperture'),focusInput=host.querySelector('#spatial-focus'),pickButton=host.querySelector('#spatial-focus-pick'),focalInput=host.querySelector('#spatial-focal'),aaButton=host.querySelector('#spatial-aa'),ssrButton=host.querySelector('#spatial-ssr');
 let dofEnabled=false,pickFocus=false,post=null,aaEnabled=true,ssrEnabled=!compact;
 function syncSSR(){ssrButton.setAttribute('aria-pressed',String(ssrEnabled));ssrButton.textContent='屏幕空间反射 '+(ssrEnabled?'开':'关');}syncSSR();
 function makePost(){
  if(post)return;
  const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:true,samples:aaEnabled&&!compact?4:0});target.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
  const reflected=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:false});
  const blurred=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:false});
  const uniforms={colorMap:{value:target.texture},depthMap:{value:target.depthTexture},resolution:{value:new T.Vector2(1,1)},nearClip:{value:camera.near},farClip:{value:camera.far},focusDistance:{value:18},fStop:{value:5.6},focalLength:{value:35},sensorWidth:{value:36},projection:{value:camera.projectionMatrix},inverseProjection:{value:camera.projectionMatrixInverse},cameraWorld:{value:camera.matrixWorld},outdoor:{value:0},aa:{value:1}};
  const vertexShader='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
  const shader=fragmentShader=>new T.ShaderMaterial({uniforms,depthTest:false,depthWrite:false,vertexShader,fragmentShader});
  const depthCode=`varying vec2 vUv;uniform sampler2D colorMap,depthMap;uniform vec2 resolution;uniform float nearClip,farClip;float depthAt(vec2 uv){float d=texture2D(depthMap,uv).x;return nearClip*farClip/(farClip-d*(farClip-nearClip));}`;
  // Ray march in view space, project each sample, and compare against visible depth.
  // Only the horizontal stream / polished gallery floor receive SSR; misses retain the base material.
  const reflectionMaterial=shader(depthCode+`
   uniform mat4 projection,inverseProjection,cameraWorld;uniform float outdoor;
   vec3 viewAt(vec2 uv){vec4 p=inverseProjection*vec4(uv*2.-1.,texture2D(depthMap,uv).x*2.-1.,1.);return p.xyz/p.w;}
   void main(){vec3 base=texture2D(colorMap,vUv).rgb;vec3 p=viewAt(vUv);vec3 worldP=(cameraWorld*vec4(p,1.)).xyz;
    bool water=abs(worldP.y-1.22)<.025;bool floorSurface=outdoor<.5&&abs(worldP.y+.15)<.025;
    vec3 normal=normalize(cross(dFdx(p),dFdy(p)));if((water||floorSurface)&&depthAt(vUv)<farClip*.98){if(dot(normal,-p)<0.)normal=-normal;vec3 ray=reflect(normalize(p),normal);vec3 origin=p+normal*.06;float previous=-1.;
     for(int i=1;i<=40;i++){float travel=float(i)*.35;vec3 q=origin+ray*travel;if(q.z>=-nearClip)break;vec4 clip=projection*vec4(q,1.);vec2 uv=clip.xy/clip.w*.5+.5;if(any(lessThan(uv,vec2(.002)))||any(greaterThan(uv,vec2(.998))))break;float z=depthAt(uv);float gap=-q.z-z;
      if(previous<0.&&gap>=0.&&gap<.65&&travel>.6&&z<farClip*.98){float edge=smoothstep(0.,.12,min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y)));float fresnel=.08+.65*pow(1.-max(dot(normal,normalize(-p)),0.),5.);base=mix(base,texture2D(colorMap,uv).rgb,edge*(1.-travel/15.)*(water?fresnel:.16));break;}previous=gap;
     }
    }gl_FragColor=vec4(base,1.);
   }`);
  const material=shader(depthCode+`
   uniform float focusDistance,fStop,focalLength,sensorWidth;
   float coc(float z){float f=focalLength*.001;return min(24.,abs(f*f*(z-focusDistance)/(fStop*z*max(focusDistance-f,.01)))*resolution.x/sensorWidth*.5);}
   void main(){float z=depthAt(vUv),radius=coc(z);vec3 color=texture2D(colorMap,vUv).rgb;float weight=1.;
    for(int i=0;i<32;i++){float a=float(i)*2.39996323;vec2 delta=vec2(cos(a),sin(a))*sqrt((float(i)+.5)/32.)*radius;vec2 uv=clamp(vUv+delta/resolution,vec2(0.),vec2(1.));float dz=depthAt(uv);float w=dz<z?clamp(coc(dz)/(length(delta)+.001),0.,1.):1.;color+=texture2D(colorMap,uv).rgb*w;weight+=w;}
    gl_FragColor=vec4(color/weight,1.);
   }`);
  const finalMaterial=shader(`varying vec2 vUv;uniform sampler2D colorMap;uniform vec2 resolution;uniform float aa;
   void main(){vec2 px=1./resolution;vec3 c=texture2D(colorMap,vUv).rgb;
    if(aa>.5){vec3 nw=texture2D(colorMap,vUv+vec2(-1.,-1.)*px).rgb,ne=texture2D(colorMap,vUv+vec2(1.,-1.)*px).rgb,sw=texture2D(colorMap,vUv+vec2(-1.,1.)*px).rgb,se=texture2D(colorMap,vUv+px).rgb;vec3 lum=vec3(.299,.587,.114);float a=dot(nw,lum),b=dot(ne,lum),d=dot(sw,lum),e=dot(se,lum),m=dot(c,lum);float low=min(m,min(min(a,b),min(d,e))),high=max(m,max(max(a,b),max(d,e)));
     if(high-low>max(.03,high*.1)){vec2 dir=vec2(-((a+b)-(d+e)),(a+d)-(b+e));float reduce=max((a+b+d+e)*.03125,.0078125);dir=clamp(dir/(min(abs(dir.x),abs(dir.y))+reduce),vec2(-8.),vec2(8.))*px;vec3 ca=.5*(texture2D(colorMap,vUv+dir*(-.166667)).rgb+texture2D(colorMap,vUv+dir*.166667).rgb);vec3 cb=ca*.5+.25*(texture2D(colorMap,vUv-dir*.5).rgb+texture2D(colorMap,vUv+dir*.5).rgb);float l=dot(cb,lum);c=l<low||l>high?ca:cb;}
    }gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`);
  const screen=new T.Scene(),quad=new T.Mesh(new T.PlaneGeometry(2,2),material);screen.add(quad);post={target,reflected,blurred,uniforms,material,reflectionMaterial,finalMaterial,screen,quad,camera:new T.Camera()};sizePost();
 }
 function disposePost(){if(!post)return;for(const k of ['target','reflected','blurred','material','reflectionMaterial','finalMaterial'])post[k].dispose();post.quad.geometry.dispose();post=null;}
 function sizePost(){if(!post)return;const size=renderer.getDrawingBufferSize(new T.Vector2());for(const k of ['target','reflected','blurred'])post[k].setSize(size.x,size.y);post.uniforms.resolution.value.copy(size);}
 function updateFocus(distance){focusInput.value=T.MathUtils.clamp(distance,.5,100).toFixed(1);host.querySelector('#spatial-focus-value').textContent=focusInput.value+' m';if(post)post.uniforms.focusDistance.value=Number(focusInput.value);}
 function renderFrame(){if(!dofEnabled&&!aaEnabled&&!ssrEnabled){renderer.render(scene,camera);return;}makePost();const u=post.uniforms;u.fStop.value=Number(apertureInput.value);u.focusDistance.value=Number(focusInput.value);u.focalLength.value=Number(focalInput.value)||35;u.sensorWidth.value=camera.getFilmWidth()*.001;u.outdoor.value=room==='land'?1:0;u.aa.value=aaEnabled?1:0;
  renderer.setRenderTarget(post.target);renderer.render(scene,camera);u.colorMap.value=post.target.texture;
  if(ssrEnabled){post.quad.material=post.reflectionMaterial;renderer.setRenderTarget(post.reflected);renderer.render(post.screen,post.camera);u.colorMap.value=post.reflected.texture;}
  if(dofEnabled){post.quad.material=post.material;renderer.setRenderTarget(post.blurred);renderer.render(post.screen,post.camera);u.colorMap.value=post.blurred.texture;}
  post.quad.material=post.finalMaterial;renderer.setRenderTarget(null);renderer.render(post.screen,post.camera);
 }
 on(dofButton,'click',()=>{dofEnabled=!dofEnabled;dofButton.setAttribute('aria-pressed',String(dofEnabled));dofButton.textContent='景深 '+(dofEnabled?'开':'关');if(!dofEnabled){pickFocus=false;pickButton.setAttribute('aria-pressed','false');pickButton.textContent='点击对焦';}request();});
 on(aaButton,'click',()=>{aaEnabled=!aaEnabled;aaButton.setAttribute('aria-pressed',String(aaEnabled));aaButton.textContent='抗锯齿 '+(aaEnabled?'开':'关');disposePost();request();});
 on(ssrButton,'click',()=>{ssrEnabled=!ssrEnabled;syncSSR();request();});
 on(focalInput,'input',()=>{camera.setFocalLength(Number(focalInput.value));host.querySelector('#spatial-focal-value').textContent=focalInput.value+' mm';request();});
 on(apertureInput,'input',()=>{host.querySelector('#spatial-aperture-value').textContent='F'+Number(apertureInput.value).toFixed(2).replace(/0$/,'');request();});
 on(focusInput,'input',()=>{updateFocus(Number(focusInput.value));request();});
 on(pickButton,'click',()=>{pickFocus=!pickFocus;pickButton.setAttribute('aria-pressed',String(pickFocus));pickButton.textContent=pickFocus?'点击画面选择焦点':'点击对焦';if(document.pointerLockElement===canvas)document.exitPointerLock?.();});
 const raycaster=new T.Raycaster();
 function rotateFirstPerson(dx,dy){if(mode!=='fps')return;yaw-=dx*.0022;pitch=T.MathUtils.clamp(pitch-dy*.0022,-Math.PI*.47,Math.PI*.47);applyFirstPersonLook();request();}
 on(canvas,'pointerdown',e=>{stop();transition=null;pauseOrbit();pointerStart=[e.clientX,e.clientY];pointerLast=[e.clientX,e.clientY];if(mode==='fps')canvas.setPointerCapture?.(e.pointerId);dragging=mode==='fps';canvas.focus({preventScroll:true});});
 on(canvas,'pointermove',e=>{if(mode==='fps'&&dragging&&document.pointerLockElement!==canvas){const dx=e.movementX??e.clientX-pointerLast[0],dy=e.movementY??e.clientY-pointerLast[1];pointerLast=[e.clientX,e.clientY];rotateFirstPerson(dx,dy);}});
 on(canvas,'pointerup',e=>{dragging=false;if(!pointerStart)return;const click=Math.hypot(e.clientX-pointerStart[0],e.clientY-pointerStart[1])<=6;let entered=false;if(pickFocus&&click){const r=canvas.getBoundingClientRect();scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hits=raycaster.intersectObjects([lobby,hall,pedestal,world,...Object.values(themed)].filter(g=>g.visible),true).filter(h=>h.object.isMesh&&!h.object.material.transparent);if(hits.length){updateFocus(-camera.worldToLocal(hits[0].point.clone()).z);pickFocus=false;pickButton.setAttribute('aria-pressed','false');pickButton.textContent='点击对焦';request();}pointerStart=null;return;}if(room==='lobby'&&click){const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=raycaster.intersectObjects(portals,true)[0];if(hit){select(hit.object.userData.view);entered=true;}}if(mode==='fps'&&click&&!entered&&!compact&&canvas.requestPointerLock)Promise.resolve(canvas.requestPointerLock()).catch(()=>{});pointerStart=null;pointerLast=null;});
 on(canvas,'pointercancel',()=>{dragging=false;pointerStart=null;pointerLast=null;stop();});on(canvas,'lostpointercapture',()=>{dragging=false;});
 on(document,'mousemove',e=>{if(mode==='fps'&&document.pointerLockElement===canvas)rotateFirstPerson(e.movementX,e.movementY)});
 on(document,'pointerlockchange',()=>host.classList.toggle('is-pointer-locked',document.pointerLockElement===canvas));
 on(canvas,'wheel',()=>{if(mode==='cinema'){transition=null;stop();pauseOrbit();}});
 const accepted=['w','a','s','d','q','e'];
 on(canvas,'keydown',e=>{const key=e.key.toLowerCase();if(!accepted.includes(key))return;e.preventDefault();transition=null;pauseOrbit();keys.add(key);request();});
 on(window,'keyup',e=>keys.delete(e.key.toLowerCase()));on(canvas,'blur',()=>{if(document.pointerLockElement!==canvas)stop()});on(window,'blur',stop);
 host.querySelectorAll('[data-move]').forEach(b=>{on(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);transition=null;pauseOrbit();keys.add(b.dataset.move);request()});for(const type of ['pointerup','pointercancel','lostpointercapture'])on(b,type,()=>keys.delete(b.dataset.move));});
 function moveFirstPerson(dt){
  forward.set(-Math.sin(yaw),0,-Math.cos(yaw));right.set(-forward.z,0,forward.x);direction.set(0,0,0).addScaledVector(forward,Number(keys.has('w'))-Number(keys.has('s'))).addScaledVector(right,Number(keys.has('d'))-Number(keys.has('a')));if(direction.lengthSq()>0)direction.normalize().multiplyScalar(4.8);direction.y=(Number(keys.has('e'))-Number(keys.has('q')))*3;
  velocity.lerp(direction,1-Math.exp(-(keys.size?8:12)*dt));if(velocity.lengthSq()<.00001)velocity.set(0,0,0);fpsFeet.x=T.MathUtils.clamp(fpsFeet.x+velocity.x*dt,-23,23);fpsFeet.z=T.MathUtils.clamp(fpsFeet.z+velocity.z*dt,-20,22);verticalOffset=T.MathUtils.clamp(verticalOffset+velocity.y*dt,0,12);fpsFeet.x=T.MathUtils.clamp(fpsFeet.x,room==='land'?-11.5:-23,room==='land'?11.5:23);fpsFeet.z=T.MathUtils.clamp(fpsFeet.z,room==='land'?-9.5:-20,room==='land'?9.5:22);fpsFeet.y=groundAt(fpsFeet.x,fpsFeet.z)+verticalOffset;camera.position.set(fpsFeet.x,fpsFeet.y+1.5,fpsFeet.z);constrainCamera();fpsFeet.x=camera.position.x;fpsFeet.z=camera.position.z;applyFirstPersonLook();return keys.size>0||velocity.lengthSq()>0;
 }
 const cinemaOffset=new T.Vector3(),cinemaSphere=new T.Spherical();
 function moveCinema(dt){
  const offset=cinemaOffset.copy(camera.position).sub(controls.target),sp=cinemaSphere.setFromVector3(offset);const active=keys.size>0;
  if(keys.has('w'))sp.radius*=Math.exp(-1.15*dt);if(keys.has('s'))sp.radius*=Math.exp(1.15*dt);if(keys.has('a'))sp.theta-=.9*dt;if(keys.has('d'))sp.theta+=.9*dt;if(keys.has('q'))sp.phi+=.72*dt;if(keys.has('e'))sp.phi-=.72*dt;
  sp.radius=T.MathUtils.clamp(sp.radius,controls.minDistance,controls.maxDistance);sp.phi=T.MathUtils.clamp(sp.phi,.12,controls.maxPolarAngle);camera.position.copy(controls.target).add(cinemaOffset.setFromSpherical(sp));return active;
 }
 function move(dt){return mode==='fps'?moveFirstPerson(dt):moveCinema(dt);}
 const captureButton=host.querySelector('#spatial-capture'),dialog=host.querySelector('#spatial-photo'),photo=dialog.querySelector('img'),download=dialog.querySelector('a[download]');let photoURL=null;
 on(dialog.querySelector('button'),'click',()=>dialog.close());
 on(captureButton,'click',async()=>{
  stop();pauseOrbit();transition=null;captureButton.disabled=true;const capturedRoom=room,capturedExhibit=exhibits[activeExhibit];
  try{
   // Render and copy synchronously: preserveDrawingBuffer is unnecessary during normal browsing.
   renderFrame();const snapshot=document.createElement('canvas');snapshot.width=canvas.width;snapshot.height=canvas.height;const sc=snapshot.getContext('2d');if(!sc)throw Error('canvas');sc.drawImage(canvas,0,0);
   await document.fonts.ready;if(disposed)return;
   const card=document.createElement('canvas'),w=Math.min(2400,Math.max(1200,snapshot.width)),pad=Math.round(w*.035),imageH=Math.round((w-pad*2)*snapshot.height/snapshot.width),footer=Math.round(w*.185);card.width=w;card.height=pad+imageH+footer;
   const ctx=card.getContext('2d');if(!ctx)throw Error('canvas');ctx.fillStyle='#eeeae0';ctx.fillRect(0,0,w,card.height);ctx.drawImage(snapshot,pad,pad,w-pad*2,imageH);
   const y=pad+imageH;ctx.fillStyle='#263630';ctx.font=`500 ${w*.013}px sans-serif`;ctx.fillText('GAME TEMPLE  /  游戏圣殿',pad,y+w*.038);ctx.textAlign='right';ctx.fillText('SPATIAL COLLECTION  —  '+capturedExhibit.number,w-pad,y+w*.038);ctx.textAlign='left';
   ctx.font=`500 ${w*.036}px sans-serif`;ctx.fillText(capturedRoom==='lobby'?'三件物品，三个世界':capturedExhibit.caption,pad,y+w*.087);ctx.font=`${w*.013}px sans-serif`;ctx.fillStyle='#5f6b63';ctx.fillText(capturedExhibit.en+' / '+capturedExhibit.title+' · 原创空间致敬',pad,y+w*.12);
   ctx.strokeStyle='#b9c0b7';ctx.beginPath();ctx.moveTo(pad,y+w*.14);ctx.lineTo(w-pad,y+w*.14);ctx.stroke();ctx.font=`${w*.01}px monospace`;ctx.fillText(`${new Date().toISOString().slice(0,10)}  /  ${capturedRoom==='lobby'?'ATRIUM':capturedRoom==='land'?'WILDERNESS':'EXHIBITION'}  /  v1.5.0`,pad,y+w*.163);ctx.textAlign='right';ctx.fillText(capturedExhibit.quote,w-pad,y+w*.163);
   const blob=await new Promise(resolve=>card.toBlob(resolve,'image/png'));if(!blob)throw Error('export');if(disposed)return;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(blob);photo.src=photoURL;download.href=photoURL;download.download=`game-temple-${capturedRoom}-${Date.now()}.png`;dialog.showModal();
  }catch(e){status.hidden=false;status.textContent='图片生成失败，请重试。';}finally{captureButton.disabled=false;request();}
 });
 function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.35:1.75,Math.sqrt(3200000/(w*h))));renderer.setSize(w,h);camera.aspect=w/h;camera.filmGauge=35/Math.min(1,camera.aspect);camera.setFocalLength(Number(focalInput.value)||35);sizePost();request();}const observer=new ResizeObserver(resize);observer.observe(host);
 function request(){if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick);}
 function tick(now){frame=0;if(disposed||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;if(transition){camera.position.lerp(transition.p,1-Math.exp(-5*dt));controls.target.lerp(transition.t,1-Math.exp(-5*dt));if(camera.position.distanceTo(transition.p)<.015){camera.position.copy(transition.p);controls.target.copy(transition.t);const fps=transition.fps;transition=null;if(fps)syncFirstPerson();}}const moving=transition?false:move(dt);const changed=mode==='cinema'&&controls.update();if(mode==='fps')constrainCamera();clampCinema();if(rain.visible&&!reduced){for(let i=0;i<900;i++){let j=i*6;rainP[j+1]-=dt*3;rainP[j+4]-=dt*3;if(rainP[j+1]<1.5){rainP[j+1]+=10;rainP[j+4]+=10;}}rainGeo.attributes.position.needsUpdate=true;}renderFrame();if(moving||transition||controls.autoRotate||(rain.visible&&!reduced)||changed)request();}
 controls.addEventListener('change',request);on(document,'visibilitychange',()=>{if(document.hidden){stop();cancelAnimationFrame(frame);frame=0;}else{last=performance.now();request();}});on(canvas,'webglcontextlost',e=>{e.preventDefault();status.hidden=false;status.textContent='三维画面已暂停，请刷新页面恢复。';cancelAnimationFrame(frame);frame=0;disposed=true;});
 status.hidden=true;setMode('cinema',false);select('lobby');resize();return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();events.abort();if(document.pointerLockElement===canvas)document.exitPointerLock?.();dialog.close();if(photoURL)URL.revokeObjectURL(photoURL);controls.dispose();disposePost();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});renderer.dispose();canvas.remove();};
}
