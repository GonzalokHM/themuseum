import * as THREE from 'three';

export const checkCollisions = (car, objects) => {
  const carBox = new THREE.Box3().setFromObject(car);

  for (let obj of objects) {
    if (obj.userData.type === 'obstacle'|| obj.userData.type === 'border') { // Asegúrate de que se verifica solo contra obstáculos
      const obstacleBox = new THREE.Box3().setFromObject(obj);
      if (carBox.intersectsBox(obstacleBox)) {
        return obj; // Devuelve el objeto con el que se colisiona
      }
    }
  }
  return null; // Si no hay colisión, devuelve null
};
    