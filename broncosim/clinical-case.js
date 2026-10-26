// Fictional exercises: object variety is educational, not an epidemiologic sample.
export function createCase({T,scene,camera,targets,getState,changed,reset}){
 const $=id=>document.getElementById(id);
 const catalog=[
  {id:'peanut',name:'Cacahuate',context:'mientras comía cacahuates',color:0xb98b53},
  {id:'seed',name:'Semilla de girasol',context:'mientras comía semillas',color:0x544637},
  {id:'carrot',name:'Fragmento de zanahoria',context:'mientras comía zanahoria cruda',color:0xc4793b},
  {id:'popcorn',name:'Fragmento de palomita',context:'mientras comía palomitas',color:0xdfcda1},
  {id:'toy',name:'Pieza de juguete',context:'mientras jugaba con piezas pequeñas',color:0x668c9c},
  {id:'coin',name:'Moneda · variante menos habitual',context:'mientras manipulaba monedas',color:0xa89a73}
 ];
 let active=false,stage='search',deployed=false,found=false,object,choice,targetId,lastObject='',lastTarget='',message='',extractionStart=0;
 const forceps=new T.Group();camera.add(forceps);forceps.visible=false;
 const metal=new T.MeshStandardMaterial({color:0xc6ced2,metalness:.9,roughness:.26});
 const cable=new T.MeshStandardMaterial({color:0x555d62,metalness:.7,roughness:.35});
 function rod(a,b,r,mat,parent){const d=b.clone().sub(a),m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),12),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());parent.add(m);return m;}
 rod(new T.Vector3(.43,-.48,-.06),new T.Vector3(0,-.035,-.71),.017,cable,forceps);
 const jaws=[new T.Group(),new T.Group()];for(const [i,jaw]of jaws.entries()){jaw.position.set(0,-.035,-.71);forceps.add(jaw);rod(new T.Vector3(),new T.Vector3(i?-.14:.14,.035,-.14),.014,metal,jaw);rod(new T.Vector3(i?-.14:.14,.035,-.14),new T.Vector3(i?-.08:.08,.045,-.18),.012,metal,jaw);}
 let confettiFrame=0;const confetti=document.createElement('canvas');confetti.className='case-confetti';confetti.hidden=true;confetti.setAttribute('aria-hidden','true');document.querySelector('.scope-wrap').append(confetti);
 function stopConfetti(){cancelAnimationFrame(confettiFrame);confetti.hidden=true;}
 function celebrate(){
  stopConfetti();confetti.dataset.motion='burst';
  const box=document.querySelector('.scope-wrap').getBoundingClientRect();
  confetti.width=box.width;confetti.height=box.height;confetti.hidden=false;
  const ctx=confetti.getContext('2d'),emojis=['🎉','✨','⭐️','🎊','💙','🌟'];
  const pieces=Array.from({length:38},(_,i)=>{const angle=Math.random()*Math.PI*2,speed=(.28+Math.random()*.48)*Math.min(box.width,box.height);return {vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-90,angle:Math.random()*6,spin:(Math.random()-.5)*6,size:17+Math.random()*13,emoji:emojis[i%emojis.length]};});
  const start=performance.now();
  function draw(now){const t=(now-start)/1000;ctx.clearRect(0,0,box.width,box.height);for(const p of pieces){ctx.save();ctx.globalAlpha=Math.min(1,Math.max(0,(3-t)/.8));ctx.translate(box.width/2+p.vx*t,box.height/2+p.vy*t+160*t*t);ctx.rotate(p.angle+t*p.spin);ctx.font=p.size+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.emoji,0,0);ctx.restore();}if(t<3)confettiFrame=requestAnimationFrame(draw);else confetti.hidden=true;}
  confettiFrame=requestAnimationFrame(draw);
 }

 const reticle=document.createElement('span');reticle.className='case-reticle';reticle.textContent='+';reticle.hidden=true;document.querySelector('.scope-wrap').append(reticle);
 function makeObject(item){const group=new T.Group(),mat=new T.MeshStandardMaterial({color:item.color,roughness:item.id==='coin'?.32:.82,metalness:item.id==='coin'?.75:0});
  function sphere(x,y,z,sx,sy,sz){const m=new T.Mesh(new T.IcosahedronGeometry(1,3),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);group.add(m);return m;}
  if(item.id==='peanut'){sphere(-.055,0,0,.095,.13,.095);sphere(.055,0,0,.095,.12,.09);for(let i=0;i<14;i++){const bump=new T.Mesh(new T.SphereGeometry(.009,6,4),mat);bump.position.set(Math.sin(i*2.4)*.14,Math.cos(i*2.4)*.10,.055+Math.sin(i)*.02);group.add(bump);}}
  if(item.id==='seed'){sphere(0,0,0,.07,.17,.045);const stripe=new T.Mesh(new T.BoxGeometry(.009,.23,.006),new T.MeshStandardMaterial({color:0xc2b497,roughness:1}));stripe.position.z=.045;group.add(stripe);group.rotation.z=.4;}
  if(item.id==='carrot'){const m=new T.Mesh(new T.CylinderGeometry(.105,.075,.18,7),mat);m.rotation.x=1;group.add(m);}
  if(item.id==='popcorn'){for(let i=0;i<6;i++)sphere(Math.sin(i*2)*.07,Math.cos(i*2)*.07,Math.sin(i)*.035,.085,.075,.065);}
  if(item.id==='toy'){group.add(new T.Mesh(new T.BoxGeometry(.19,.14,.11),mat));for(const x of [-.05,.05]){const m=new T.Mesh(new T.CylinderGeometry(.025,.025,.04,14),mat);m.rotation.x=Math.PI/2;m.position.set(x,0,.07);group.add(m);}}
  if(item.id==='coin'){const m=new T.Mesh(new T.CylinderGeometry(.15,.15,.022,48),mat);m.rotation.x=Math.PI/2;group.add(m);const ring=new T.Mesh(new T.TorusGeometry(.125,.006,6,40),mat);ring.position.z=.014;group.add(ring);}
  group.traverse(m=>{if(m.isMesh){m.renderOrder=2;}});return group;
 }
 function disposeObject(){if(!object)return;object.removeFromParent();const mats=new Set();object.traverse(m=>{if(m.isMesh){m.geometry.dispose();mats.add(m.material);}});mats.forEach(m=>m.dispose());object=null;}
 function choose(){const candidates=catalog.filter(x=>x.id!==lastObject);choice=candidates[Math.floor(Math.random()*candidates.length)];lastObject=choice.id;const places=Object.keys(targets).filter(x=>x!==lastTarget);targetId=places[Math.floor(Math.random()*places.length)];lastTarget=targetId;disposeObject();object=makeObject(choice);const target=targets[targetId];object.position.copy(target.position).addScaledVector(target.direction,.85);object.quaternion.copy(target.quaternion);scene.add(object);}
 function restart(){if(!active)return;stopConfetti();stage='search';deployed=false;found=false;message='';forceps.position.z=0;choose();refresh();}
 function start(){active=false;reset();active=true;document.body.classList.add('case-active');$('case-panel').hidden=false;$('start-case').textContent='Nuevo caso aleatorio ↻';$('reset').textContent='Reiniciar caso ↻';restart();changed();}
 function exit(){stopConfetti();active=false;stage='search';forceps.visible=false;reticle.hidden=true;disposeObject();$('case-panel').hidden=true;document.body.classList.remove('case-active','case-target');$('start-case').textContent='Caso 01 · Cuerpo extraño ↗';$('reset').textContent='Volver a carina ↺';changed();}
 function aligned(){if(!object)return false;const point=object.getWorldPosition(new T.Vector3()).project(camera);return Math.abs(point.x)<.22&&Math.abs(point.y)<.22&&point.z>0&&point.z<1;}
 function refresh(){if(!active)return;const {current,transition}=getState();document.body.classList.toggle('case-target',current===targetId);if(current===targetId&&!transition&&stage==='search')found=true;
  const activity={peanut:'durante la merienda',seed:'mientras compartía una bolsa de botana',carrot:'mientras comía alimentos crudos y crujientes',popcorn:'mientras veía una película y comía botana',toy:'mientras jugaba con piezas pequeñas',coin:'mientras jugaba junto a un monedero abierto'}[choice.id];const finding=targetId==='TR'?'Tos irritativa y ruido respiratorio central, sin predominio claro de un lado.':`Sibilancia y menor entrada de aire con predominio ${targetId.startsWith('L')?'izquierdo':'derecho'}.`;$('case-history').textContent=`Niño de 4 años. Atragantamiento ${activity}, seguido de tos persistente. ${finding} Evaluado por especialistas; estable en este escenario ficticio.`;
  let instruction=stage==='extracting'?'04 / Retirada final del conjunto por la tráquea…':stage==='done'?`Extracción completada: ${choice.name.toLowerCase()}. En clínica se revisa de nuevo la vía aérea y se vigilan complicaciones.`:stage==='carrying'?(current==='TR'&&!transition?'03 / Objeto sujeto en carina. Pulsa «Extraer objeto» para finalizar.':'03 / Objeto sujeto. Retira por las flechas inferiores hasta la carina.'):found?'02 / Objeto localizado. Abre la pinza, centra el objeto con rotación/flexión y sujétalo.':'01 / Recorre la vía aérea desde la tráquea. Localiza el cuerpo extraño y prepara la pinza.';
  $('case-step').textContent=message||instruction;
  $('case-tool').hidden=stage==='carrying'||stage==='extracting'||stage==='done';$('case-tool').textContent=deployed?'Guardar pinza':'Abrir pinza';$('case-tool').disabled=!!transition;
  $('case-grasp').hidden=stage==='carrying'||stage==='extracting'||stage==='done';$('case-grasp').disabled=!deployed||current!==targetId||!!transition;
  $('case-extract').hidden=stage!=='carrying';$('case-extract').disabled=current!=='TR'||!!transition;
  document.querySelector('.scope-badge').textContent=stage==='done'?'EXTRACCIÓN COMPLETADA':stage==='carrying'?'OBJETO SUJETO':'CASO 01 · CUERPO EXTRAÑO';changed();
 }
 $('start-case').onclick=start;$('exit-case').onclick=exit;
 $('case-tool').onclick=()=>{deployed=!deployed;message='';refresh();};
 $('case-grasp').onclick=()=>{const {current,transition}=getState();if(!active||!deployed||current!==targetId||transition)return;if(!aligned()){message='Centra el objeto en la cruz con rotación y flexión antes de cerrar la pinza.';refresh();return;}stage='carrying';message='';camera.attach(object);object.position.set(0,.01,-.84);object.quaternion.identity();refresh();};
 $('case-extract').onclick=()=>{const {current,transition}=getState();if(stage!=='carrying'||current!=='TR'||transition)return;stage='extracting';extractionStart=performance.now();refresh();};
 function canNavigate(id,parent){if(!active)return true;message='';if(stage==='extracting')return false;if(stage==='carrying'&&id!==parent){message='Con el objeto sujeto, usa «Retirar» para volver hacia la carina.';refresh();return false;}if(stage==='search'&&getState().current===targetId&&id!==parent){message='El objeto ocupa esta vía: sujétalo antes de continuar. Puedes retirar para reorientarte.';refresh();return false;}return true;}
 function animate(time){if(stage!=='extracting')return;const t=Math.min(1,(time-extractionStart)/1200),k=t*t*(3-2*t);forceps.position.z=k;object.position.z=-.84+k;if(t===1){stage='done';deployed=false;object.visible=false;forceps.position.z=0;celebrate();refresh();}changed();}
 function render(){forceps.visible=active&&deployed&&stage!=='done';reticle.hidden=!forceps.visible;if(object&&stage==='search')object.visible=active;for(const [i,jaw]of jaws.entries())jaw.rotation.y=['carrying','extracting'].includes(stage)?(i?-.65:.65):0;}
 return {refresh,render,restart,canNavigate,animate};
}
