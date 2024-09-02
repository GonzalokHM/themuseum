export const applyPhysics = (car) => {

   // Aplicar aceleración
   car.velocity += car.acceleration;
   
  // Aplicar fricción lineal
  const friction = 0.98;
  car.velocity *= friction;

  // Limitar la velocidad máxima
  car.velocity = Math.min(car.velocity, car.maxSpeed);

  // Simular gravedad
  if (car.position.y > 0) {
    car.position.y -= 0.01; // Gravedad sencilla
  }

  // Simular el giro basado en el ángulo de dirección
  if (car.steeringAngle !== 0) {
    const turnRadius = car.wheelBase / Math.sin(car.steeringAngle);
    const angularVelocity = car.velocity / turnRadius;

    car.rotation.y += angularVelocity;
  }

  // Actualizar posición en función de la velocidad y la dirección del coche

  car.position.z -= car.velocity * Math.cos(car.rotation.y);
  car.position.x -= car.velocity * Math.sin(car.rotation.y);

  // Calcular la velocidad actual del coche
  car.speed = car.velocity;
};
