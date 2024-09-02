import * as THREE from 'three';

export const checkCollisions = (car, objects) => {
    const carBox = new THREE.Box3().setFromObject(car);
  
    for (let obj of objects) {
      if (obj.userData.type === 'obstacle') { // Asegurarse de que sólo verificamos contra obstáculos
        const obstacleBox = new THREE.Box3().setFromObject(obj);
        if (carBox.intersectsBox(obstacleBox)) {
          return true;
        }
      }
    }
    return false;
  };
  