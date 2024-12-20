import * as THREE from 'three';

export const checkCollisions = (car, objects) => {
  const carBox = new THREE.Box3().setFromObject(car);
  let collisionDetected = false;

  for (let obj of objects) {
    if (obj.userData.type === 'obstacle' || obj.userData.type === 'border') {
      const obstacleBox = new THREE.Box3().setFromObject(obj);
      if (carBox.intersectsBox(obstacleBox)) {
        collisionDetected = true;
        car.hasCollided = true;

        if (obj.userData.type === 'obstacle') {
          if (car.lastCollidedObject !== obj) {
            car.velocity *= 0.5;
            car.lives = Math.max(0, car.lives - 1);
            car.lastCollidedObject = obj;
            console.log('Colisión con obstáculo, vidas restantes: ', car.lives);

            if (car.lives === 0) {
              console.log('Game Over');
              return;
            }
          }
        }

        if (obj.userData.type === 'border') {
          const directionToCenter = -Math.sign(car.position.x);
          car.position.x += directionToCenter * 0.1;
          car.velocity *= 0.7;
          // car.rotation.y += -directionToCenter * 0.05;
          console.log('Colisión con valla, rebote aplicado');
        }
        return obj;
      }
    }
  }

  // if (!car.hasCollided && car.lastCollidedObject) {
  //   car.lastCollidedObject = null;
  // }
  if (!collisionDetected) {
    // Si este frame no hay colisión, restablecer flags
    if (car.hasCollided) car.hasCollided = false;
    if (car.lastCollidedObject) car.lastCollidedObject = null;
  }
  return null;
};
