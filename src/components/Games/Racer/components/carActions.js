export const accelerate = (car) => {
  car.acceleration = Math.min(car.maxAcceleration, car.acceleration + 0.1);
  car.velocity = Math.min(car.maxSpeed, car.velocity + car.acceleration);
};

export const brake = (car) => {
  car.acceleration = -0.3;
  car.velocity = Math.max(0, car.velocity + car.acceleration);
};

export const turnLeft = (car) => {
  car.rotation.y += 0.05;
};

export const turnRight = (car) => {
  car.rotation.y -= 0.05;
};

export const stopTurning = (car) => {
  car.steeringAngle = 0;
};
