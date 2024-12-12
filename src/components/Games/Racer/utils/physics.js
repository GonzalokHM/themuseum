export const applyPhysics = (car) => {
  // Ajustar aceleración
  const accelerationStep = 0.02; // incrementos suaves
  if (car.isAccelerating) {
    car.acceleration = Math.min(car.acceleration + accelerationStep, car.maxAcceleration);
  } else if (car.isBraking) {
    car.acceleration = Math.max(car.acceleration - accelerationStep * 3, -0.5); 
  } else {
    // Si no se acelera ni frena, la aceleración tiende a 0
    if (car.acceleration > 0) {
      car.acceleration = Math.max(car.acceleration - accelerationStep, 0);
    } else if (car.acceleration < 0) {
      car.acceleration = Math.min(car.acceleration + accelerationStep, 0);
    }
  }

  // Actualizar la velocidad según la aceleración
  car.velocity += car.acceleration;
  
  // Aplicar fricción lineal suave
  if (!car.isAccelerating && car.velocity > 0) {
    const friction = 0.995;
    car.velocity *= friction;
  }

  // Limitar la velocidad máxima
  car.velocity = Math.min(car.velocity, car.maxSpeed);

  // Evitar velocidad negativa
  if (car.velocity < 0) car.velocity = 0;

  // Ajustar el ángulo de dirección
  const steeringSpeed = 0.02; // qué tan rápido gira el volante
  if (car.turnDirection === 1) {
    // girar a la izquierda
    car.steeringAngle = Math.min(car.steeringAngle + steeringSpeed, car.maxSteeringAngle);
  } else if (car.turnDirection === -1) {
    // girar a la derecha
    car.steeringAngle = Math.max(car.steeringAngle - steeringSpeed, -car.maxSteeringAngle);
  } else {
    // volver la dirección a 0 gradualmente
    if (car.steeringAngle > 0) {
      car.steeringAngle = Math.max(car.steeringAngle - steeringSpeed, 0);
    } else if (car.steeringAngle < 0) {
      car.steeringAngle = Math.min(car.steeringAngle + steeringSpeed, 0);
    }
  }

  // Actualizar la rotación del coche en función de la velocidad y el ángulo de dirección
  // Un modelo simple: a mayor velocidad y ángulo de dirección, más gira el coche por frame.
  // La distancia entre ejes (wheelBase) influye en la curvatura.
  const turnRadius = car.wheelBase / Math.sin(Math.max(0.001, Math.abs(car.steeringAngle)));
  const angularVelocity = car.velocity / turnRadius;
  
  car.rotation.y += angularVelocity * (car.steeringAngle > 0 ? 1 : -1) * (Math.abs(car.steeringAngle) > 0.001 ? 1 : 0);

  // Actualizar posición en función de la velocidad y la rotación
  car.position.z -= car.velocity * Math.cos(car.rotation.y);
  car.position.x -= car.velocity * Math.sin(car.rotation.y);
};

