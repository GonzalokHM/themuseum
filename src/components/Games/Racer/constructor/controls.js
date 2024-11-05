import { accelerate, brake, turnLeft, turnRight, stopTurning } from '../components/carActions';

export const initControls = (car) => {
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'w':
        accelerate(car);
        break;
      case 's':
        brake(car);
        break;
      case 'a':
        turnLeft(car);
        break;
      case 'd':
        turnRight(car);
        break;
      default:
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'a' || event.key === 'd') {
      stopTurning(car);
    }
  });
};
