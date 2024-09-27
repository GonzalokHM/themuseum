export const applyPhysics = (car) => {
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
    if (!isNaN(turnRadius) && turnRadius !== Infinity) {
      const angularVelocity = car.velocity / turnRadius;
      car.rotation.y += angularVelocity * 0.02; // Reducimos el efecto del giro
    }
  }

  // Actualizar posición en función de la velocidad y la dirección del coche

  car.position.z -= car.velocity * Math.cos(car.rotation.y);
  car.position.x -= car.velocity * Math.sin(car.rotation.y);

  // Limitar el ángulo de giro máximo
  car.steeringAngle = Math.max(
    -car.maxSteeringAngle,
    Math.min(car.maxSteeringAngle, car.steeringAngle)
  );
};
