import * as T from './vendor/three.module.js';
// Deterministic, original mucosal texture. No patient imagery or external image assets.
export function mucosa(surface,nodes,byId){
 const size=512,c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d'),im=ctx.createImageData(size,size);let seed=71;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const grid=Array.from({length:33},()=>Array.from({length:33},rand));
 const noise=(x,y,period)=>{const ix=Math.floor(x)%period,iy=Math.floor(y)%period,fx=x-Math.floor(x),fy=y-Math.floor(y),u=fx*fx*(3-2*fx),w=fy*fy*(3-2*fy);return T.MathUtils.lerp(T.MathUtils.lerp(grid[iy][ix],grid[iy][(ix+1)%period],u),T.MathUtils.lerp(grid[(iy+1)%period][ix],grid[(iy+1)%period][(ix+1)%period],u),w);};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const n=noise(x/size*4,y/size*4,4)*.6+noise(x/size*16,y/size*16,16)*.3+rand()*.1,fold=Math.pow(.5+.5*Math.cos(y/size*Math.PI*16+Math.sin(x/size*Math.PI*2)*.24),7),i=(y*size+x)*4;im.data[i]=191+n*42+fold*14;im.data[i+1]=137+n*52+fold*21;im.data[i+2]=135+n*50+fold*21;im.data[i+3]=255;}ctx.putImageData(im,0,0);
 for(let i=0;i<65;i++){let x=rand()*size,y=rand()*size;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<8;j++){x+=(rand()-.5)*35;y+=rand()*15;ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(130,50,64,${.045+rand()*.075})`;ctx.lineWidth=.4+rand()*.9;ctx.stroke();}
 const texture=new T.CanvasTexture(c);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;

 const material=new T.MeshPhysicalMaterial({map:texture,color:0xffffff,roughness:.5,metalness:0,clearcoat:.48,clearcoatRoughness:.24,side:T.BackSide});
 material.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 mucosaPosition; varying vec3 mucosaNormal;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nmucosaPosition=position;mucosaNormal=normal;');shader.fragmentShader='varying vec3 mucosaPosition; varying vec3 mucosaNormal;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`vec3 w=pow(abs(normalize(mucosaNormal)),vec3(4.0));w/=w.x+w.y+w.z;vec3 p=mucosaPosition*.55;vec4 texel=texture2D(map,p.yz)*w.x+texture2D(map,p.xz)*w.y+texture2D(map,p.xy)*w.z;diffuseColor*=texel;`);shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
vec3 pFine=mucosaPosition*110.0;normal=normalize(normal+vec3(sin(pFine.y)*sin(pFine.z),sin(pFine.z)*sin(pFine.x),sin(pFine.x)*sin(pFine.y))*.022);`);};return material;
}
export function createInstrument(scene){
 const group=new T.Group();scene.add(group);group.renderOrder=5;
 const mat=new T.MeshPhysicalMaterial({color:0x101114,metalness:.35,roughness:.28,clearcoat:.9,depthTest:false,transparent:true});
 const tip=new T.Mesh(new T.CylinderGeometry(.078,.078,.16,16),new T.MeshStandardMaterial({color:0xd1bd7c,metalness:.8,roughness:.25,depthTest:false,transparent:true}));tip.renderOrder=7;group.add(tip);
 const beam=new T.Mesh(new T.ConeGeometry(.27,.65,24,1,true),new T.MeshBasicMaterial({color:0xffe6aa,transparent:true,opacity:.19,depthWrite:false,depthTest:false,transparent:true,side:T.DoubleSide}));beam.renderOrder=6;group.add(beam);let tube;
 return {update(points,position,direction){if(tube){group.remove(tube);tube.geometry.dispose();}const curve=new T.CatmullRomCurve3(points,false,'centripetal');tube=new T.Mesh(new T.TubeGeometry(curve,72,.075,12,false),mat);tube.renderOrder=5;group.add(tube);tip.position.copy(position);tip.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction);beam.position.copy(position).addScaledVector(direction,.32);beam.quaternion.setFromUnitVectors(new T.Vector3(0,-1,0),direction);}};
}
