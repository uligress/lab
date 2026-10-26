import * as T from './vendor/three.module.js';

function project(route, point) {
  let best = { index: 0, distance: Infinity };
  for (let i = 0; i < route.length - 1; i++) {
    const edge = route[i + 1].clone().sub(route[i]);
    const t = T.MathUtils.clamp(point.clone().sub(route[i]).dot(edge) / (edge.lengthSq() || 1), 0, 1);
    const distance = route[i].clone().addScaledVector(edge, t).distanceToSquared(point);
    if (distance < best.distance) best = { index: i + t, distance };
  }
  return best.index;
}

// Trim at projected positions, never at a nearest vertex behind the camera.
export function travelCurve(fromRoute, toRoute, from, to) {
  const start = project(fromRoute, from), end = project(toRoute, to);
  let common = 0;
  while (common < fromRoute.length && common < toRoute.length && fromRoute[common].distanceToSquared(toRoute[common]) < 1e-8) common++;
  const junction = Math.min(start, end, Math.max(0, common - 1));
  const points = [from.clone()];
  for (let i = Math.ceil(start) - 1; i > junction; i--) points.push(fromRoute[i]);
  if (junction < start - 1e-6) {
    const i = Math.floor(junction), next = Math.min(i + 1, fromRoute.length - 1);
    points.push(fromRoute[i].clone().lerp(fromRoute[next], junction - i));
  }
  for (let i = Math.floor(junction) + 1; i < end; i++) points.push(toRoute[i]);
  points.push(to.clone());
  const distinct = points.filter((point, i) => !i || point.distanceToSquared(points[i - 1]) > 1e-8);
  if (distinct.length < 2) distinct.push(to.clone());
  else distinct[distinct.length - 1] = to.clone();
  const curve = new T.CatmullRomCurve3(distinct, false, 'centripetal');
  curve.arcLengthDivisions = Math.max(200, distinct.length * 12);
  curve.updateArcLengths();
  return curve;
}

export function orientation(position, direction) {
  const up = new T.Vector3(0, 0, 1);
  if (Math.abs(up.dot(direction)) > .95) up.set(0, 1, 0);
  return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(position, position.clone().add(direction), up));
}

export function smoothProgress(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
