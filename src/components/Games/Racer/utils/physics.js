export const applyPhysics = (car) => {
  // Aplicar fricción lineal
  if (car.velocity > 0) {
    const friction = 0.98;
    car.velocity *= friction;
  }

  // Asegurarse de que la velocidad no sea negativa
  if (car.velocity < 0) {
    car.velocity = 0;
  }

  // Limitar la velocidad máxima
  car.velocity = Math.min(car.velocity, car.maxSpeed);

  // Actualizar posición en función de la velocidad y la dirección del coche

  car.position.z -= car.velocity * Math.cos(car.rotation.y);
  car.position.x -= car.velocity * Math.sin(car.rotation.y);

};
