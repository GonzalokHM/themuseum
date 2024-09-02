import { accelerate, brake, turnLeft, turnRight, stopTurning } from '../components/carActions';

export const initControls = (car) => {
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        accelerate(car);
        break;
      case 'ArrowDown':
        brake(car);
        break;
      case 'ArrowLeft':
        turnLeft(car);
        break;
      case 'ArrowRight':
        turnRight(car);
        break;
      default:
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      stopTurning(car);
    }
  });
};
