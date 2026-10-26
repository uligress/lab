import fs from 'node:fs';
import {MarchingCubes} from '../vendor/MarchingCubes.js';
import * as T from '../vendor/three.module.js';
const nodes=JSON.parse(fs.readFileSync(new URL('./airway-input.json',import.meta.url))),by=Object.fromEntries(nodes.map(n=>[n.id,n]));
const res=112,half=6,offset=[0,.4,0],mc=new MarchingCubes(res,new T.MeshBasicMaterial(),false,false,180000);mc.isolation=0;
for(let z=0;z<res;z++)for(let y=0;y<res;y++)for(let x=0;x<res;x++){
 const p=[(x/res*2-1)*half+offset[0],(y/res*2-1)*half+offset[1],(z/res*2-1)*half+offset[2]];let d=100;
 for(const n of nodes){const a=n.parent?by[n.parent].p:[0,5.5,0],b=n.p,ab=b.map((v,i)=>v-a[i]),ap=p.map((v,i)=>v-a[i]),t=Math.max(0,Math.min(1,ap.reduce((v,q,i)=>v+q*ab[i],0)/ab.reduce((v,q)=>v+q*q,0)));const r0=n.parent?by[n.parent].r*.92:n.r,r=r0+(n.r-r0)*t;let q=Math.hypot(...p.map((v,i)=>v-a[i]-t*ab[i]))-r;
 const k=.16,h=Math.max(k-Math.abs(d-q),0)/k;d=Math.min(d,q)-h*h*k*.25;
 }mc.field[x+y*res+z*res*res]=-d;
}
mc.update();const arr=mc.geometry.attributes.position.array.slice(0,mc.count*3);for(let i=0;i<arr.length;i++)arr[i]=arr[i]*half+offset[i%3];
fs.writeFileSync(new URL('../airway.bin',import.meta.url),Buffer.from(arr.buffer));fs.writeFileSync(new URL('../airway-normals.bin',import.meta.url),Buffer.from(mc.geometry.attributes.normal.array.slice(0,mc.count*3).buffer));console.log('surface vertices',mc.count,'bytes',arr.byteLength);
