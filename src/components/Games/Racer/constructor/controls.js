export const initControls = (car) => {
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'w':
        car.isAccelerating = true;
        break;
      case 's':
        car.isBraking = true;
        break;
      case 'a':
        car.turnDirection = 1;
        break;
      case 'd':
        car.turnDirection = -1;
        break;
      default:
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'w':
        car.isAccelerating = false;
        break;
      case 's':
        car.isBraking = false;
        break;
      case 'a':
      case 'd':
        car.turnDirection = 0;
        break;
      default:
        break;
    }
  });
};
