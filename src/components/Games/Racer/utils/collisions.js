import * as THREE from 'three';
import { checkBorderCollisionParametric } from './parametricalCollisions';

export const checkCollisions = (car, objects, trackCurve, trackWidth) => {
  
  const borderCollision = checkBorderCollisionParametric(car, trackCurve, trackWidth);
  
  car.hasCollided = false;
  const carBox = new THREE.Box3().setFromObject(car);

  for (let obj of objects) {
    if (obj.userData.type === 'obstacle' ) {
      const obstacleBox = new THREE.Box3().setFromObject(obj);
      if (carBox.intersectsBox(obstacleBox)) {
        car.hasCollided = true;

          if (car.lastCollidedObject !== obj) {
            car.velocity *= 0.5;
            car.lives = Math.max(0, car.lives - 1);
            car.lastCollidedObject = obj;

            if (car.lives === 0) {
              console.log('Game Over');
              return obj;
            }
          }
        return obj;
      }
    }
  }

  if (!car.hasCollided && car.lastCollidedObject) {
    car.lastCollidedObject = null;
  }
  return null;
};
