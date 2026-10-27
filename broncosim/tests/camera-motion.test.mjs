import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import { smoothProgress, travelCurve } from '../camera-motion.js';

test('camera interpolation remains on the route at frame timing boundaries', () => {
  const route = [new T.Vector3(0, 0, 0), new T.Vector3(0, 1, 0), new T.Vector3(0, 2, 0)];
  const curve = travelCurve(route, route, route[0], route[2]);
  // A queued animation timestamp can precede a navigation event's performance.now().
  for (const t of [-0.01, -0.0001, 0, 0.5, 0.9999999, 1, 1.01]) {
    const progress = smoothProgress(t);
    assert.ok(progress >= 0 && progress <= 1, `out of route at ${t}: ${progress}`);
    const point = curve.getPointAt(progress);
    assert.ok([point.x, point.y, point.z].every(Number.isFinite));
  }
  assert.equal(smoothProgress(-0.01), 0);
  assert.equal(smoothProgress(1.01), 1);
});
