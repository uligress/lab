import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {travelCurve,orientation,smoothProgress,angleDelta,followControl} from '../camera-motion.js';
const data=JSON.parse(fs.readFileSync(new URL('../anatomy.json',import.meta.url)));
function pose(id){const n=data[id],route=n.route.map(p=>new T.Vector3(...p)),curve=new T.CatmullRomCurve3(route,false,'centripetal'),t=Math.max(.1,1-n.r*1.15/curve.getLength());return {route,position:curve.getPointAt(t),direction:curve.getTangentAt(t).normalize()};}
const links=[['TR','RMB'],['RMB','RUL'],['RUL','RB1'],['RMB','BI'],['BI','RML'],['RML','RB4'],['BI','RLL'],['RLL','RB6'],['RLL','RBAS'],['RBAS','RB10'],['TR','LMB'],['LMB','LUL'],['LUL','LUD'],['LUD','LB1+2'],['LUL','LING'],['LING','LB4'],['LMB','LLL'],['LLL','LB6'],['LLL','LBAS'],['LBAS','LB10'],['TR','TR']];
let largestTurn=0;
for(const [a,b] of [...links,...links.map(([a,b])=>[b,a])]){const from=pose(a),to=pose(b),curve=travelCurve(from.route,to.route,from.position,to.position),qa=orientation(from.position,from.direction),qb=orientation(to.position,to.direction);let previousQ=qa;
for(let i=0;i<=120;i++){const k=smoothProgress(i/120),p=curve.getPointAt(k),q=qa.clone().slerp(qb,k);assert([p.x,p.y,p.z,q.x,q.y,q.z,q.w].every(Number.isFinite),`${a} -> ${b} invalid`);largestTurn=Math.max(largestTurn,previousQ.angleTo(q));previousQ=q;}
assert(curve.getPointAt(0).distanceTo(from.position)<1e-6,`${a} -> ${b} start`);
assert(curve.getPointAt(1).distanceTo(to.position)<1e-6,`${a} -> ${b} end`);}
// A fractional starting position must not first move backwards to the preceding vertex.
const straight=[0,1,2,3].map(x=>new T.Vector3(x,0,0));
const curve=travelCurve(straight,straight,new T.Vector3(.4,0,0),new T.Vector3(2.6,0,0));
let previous=.4;for(let i=0;i<=120;i++){const x=curve.getPointAt(i/120).x;assert(x>=previous-1e-7,'Unintended reversal at arrow press');previous=x;}
assert(smoothProgress(1/120)<.00001);assert(1-smoothProgress(119/120)<.00001);
console.log(`42 transitions verified; exact endpoints, no initial reversal, finite poses; largest rotation step ${(largestTurn*180/Math.PI).toFixed(2)}° over 120 samples.`);

// Drag/slider changes settle continuously, without overshoot or a full turn at the wrap.
assert(Math.abs(angleDelta(179,-179)-2)<1e-8);
for(const target of [-60,60,180]){let current=0;const first=followControl(current,target,1/120);assert(Math.abs(first)<Math.abs(target)*.1);for(let i=0;i<120;i++){const next=followControl(current,target,1/120);assert(Math.abs(target-next)<=Math.abs(target-current)+1e-8);assert(Math.abs(next-current)<Math.abs(target)*.1);current=next;}assert(Math.abs(current-target)<.01);}
assert(followControl(179,-179,1/120,true)>179);
console.log('Control response verified: gradual rotation/flexion, no overshoot, shortest rotation across ±180°.');
