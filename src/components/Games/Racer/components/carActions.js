export const accelerate = (car) => {
  car.acceleration += 0.02;
  // car.velocity = Math.min(car.maxSpeed, car.velocity + car.acceleration);
};

export const brake = (car) => {
  car.acceleration = -0.05; 
  // car.velocity = Math.max(0, car.velocity + car.acceleration);
};

export const turnLeft = (car) => {
  const turnEffectiveness = Math.max(0.1, 1 - car.velocity / car.maxSpeed); // A menor velocidad, más efectivo el giro
  car.steeringAngle = Math.min(car.maxSteeringAngle, car.steeringAngle + 0.05 * turnEffectiveness);
};

export const turnRight = (car) => {
  const turnEffectiveness = Math.max(0.1, 1 - car.velocity / car.maxSpeed);
  car.steeringAngle = Math.max(-car.maxSteeringAngle, car.steeringAngle - 0.05 * turnEffectiveness);};

export const stopTurning = (car) => {
    // Enderezamiento automático
    const alignmentSpeed = 0.05; // Ajustar

    if (car.steeringAngle > 0) {
      car.steeringAngle = Math.max(0, car.steeringAngle - alignmentSpeed);
    } else if (car.steeringAngle < 0) {
      car.steeringAngle = Math.min(0, car.steeringAngle + alignmentSpeed);
    }
  };