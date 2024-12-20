export const applyPhysics = (car) => {
  if (car.isAccelerating) {
    car.acceleration = car.maxAcceleration;
  } else if (car.isBraking) {
    car.acceleration = -0.1;
  } else {
    car.acceleration = 0;
  }

  car.velocity += car.acceleration;

  if (!car.isAccelerating && !car.isBraking) {
    const friction = 0.98;
    car.velocity *= friction;
  }

  car.velocity = Math.max(car.velocity, 0);
  car.velocity = Math.min(car.velocity, car.maxSpeed);

  const steeringSpeed = 0.1;

  if (car.turnDirection === 1) {
    car.steeringAngle += steeringSpeed;
  } else if (car.turnDirection === -1) {
    car.steeringAngle -= steeringSpeed;
  } else {
    if (car.steeringAngle > 0) {
      car.steeringAngle = Math.max(car.steeringAngle - steeringSpeed, 0);
    } else if (car.steeringAngle < 0) {
      car.steeringAngle = Math.min(car.steeringAngle + steeringSpeed, 0);
    }
  }

  if (car.steeringAngle > car.maxSteeringAngle) {
    car.steeringAngle = car.maxSteeringAngle;
  } else if (car.steeringAngle < -car.maxSteeringAngle) {
    car.steeringAngle = -car.maxSteeringAngle;
  }

  let turnRadius = Infinity;
  if (Math.abs(car.steeringAngle) > 0.001) {
    turnRadius = car.wheelBase / Math.sin(Math.abs(car.steeringAngle));
  }

  let angularVelocity = 0;
  if (turnRadius !== Infinity) {
    angularVelocity = (car.velocity / turnRadius)/ 10;
  }

  if (car.steeringAngle > 0) {
    car.rotation.y += angularVelocity;
  } else if (car.steeringAngle < 0) {
    car.rotation.y -= angularVelocity;
  }

  car.position.z -= car.velocity * Math.cos(car.rotation.y);
  car.position.x -= car.velocity * Math.sin(car.rotation.y);
};
