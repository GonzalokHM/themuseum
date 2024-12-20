import * as THREE from 'three';

function getClosestPointOnCurve(curve, position, samples = 100) {
  let closestT = 0;
  let closestDistance = Infinity;
  const carPos = new THREE.Vector3(position.x, position.y, position.z);

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = curve.getPointAt(t);
    const dist = p.distanceTo(carPos);
    if (dist < closestDistance) {
      closestDistance = dist;
      closestT = t;
    }
  }

  return closestT;
}

export function checkBorderCollisionParametric(car, trackCurve, trackWidth) {
  if (!trackCurve) return false; // Si no tienes una curva disponible, no detectas nada

  const t = getClosestPointOnCurve(trackCurve, car.position);
  const closestPoint = trackCurve.getPointAt(t);
  const tangent = trackCurve.getTangentAt(t).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
  const toCar = new THREE.Vector3().subVectors(car.position, closestPoint);

  const lateralDistance = toCar.dot(binormal);

  if (Math.abs(lateralDistance) > trackWidth / 2) {
    // Fuera de la pista, aplicar rebote suave
    const directionToCenter = -Math.sign(lateralDistance);
    car.position.addScaledVector(binormal, directionToCenter * 0.1);
    car.velocity *= 0.9;
    return true;
  }

  return false;
}
