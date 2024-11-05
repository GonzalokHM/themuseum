import * as THREE from 'three';

export const checkCollisions = (car, objects) => {
  const carBox = new THREE.Box3().setFromObject(car);

  for (let obj of objects) {
    if (obj.userData.type === 'obstacle' || obj.userData.type === 'border') {
      // Asegúrate de que se verifica solo contra obstáculos
      const obstacleBox = new THREE.Box3().setFromObject(obj);
      if (carBox.intersectsBox(obstacleBox)) {
        car.hasCollided = true;

        if (obj.userData.type === 'obstacle') {
        // Solo restar una vida si es un nuevo obstáculo o hemos dejado de colisionar con el anterior
        if (car.lastCollidedObject !== obj) {
          car.velocity *= 0.5; // Ralentizar el coche
          car.lives = Math.max(0, car.lives - 1); // Restar una vida (mínimo 0)
          car.lastCollidedObject = obj; // Guardar el objeto como último obstáculo colisionado
          console.log("Colisión con obstáculo, vidas restantes: ", car.lives);

          if (car.lives === 0) {
            console.log("Game Over");
            return;
          }
        } 
      }

        if (obj.userData.type === 'border') {
          // Aplicar rebote
          car.position.z += 1.0; // Aleja el coche hacia atrás un poco
          car.velocity *= -0.3; // Reducir velocidad y aplicar una ligera inversión
          console.log('Colisión con valla, rebote aplicado');
        }
        return obj; // Devuelve el objeto con el que se colisiona
      }
    }
  }
  
  // Si no hay colisión, restablecer el flag y el último objeto
  if (!car.hasCollided && car.lastCollidedObject) {
    car.lastCollidedObject = null; // Restablecer el último objeto con el que colisionamos
  }
  return null; // Si no hay colisión, devuelve null
};
