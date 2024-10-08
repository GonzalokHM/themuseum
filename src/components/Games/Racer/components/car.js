import * as THREE from 'three';
import { applyPhysics } from '../utils/physics';
import { checkCollisions } from '../utils/collisions';
import { accelerate, brake, turnLeft, turnRight, stopTurning } from './carActions';

export const initCar = (scene, camera) => {
  const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const carMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const car = new THREE.Mesh(carGeometry, carMaterial);

  car.position.set(0, 0.25, 0);
  car.velocity = 0;
  car.lives = 3;
  car.score = 0;
  car.speed = 0;
  car.maxSpeed= 200
  car.mass = 1000; // masa del coche
  car.wheelBase = 2.5; // distancia entre las ruedas delanteras y traseras
  car.steeringAngle = 0; 
  car.acceleration = 0; 
  car.maxAcceleration = 0.5;
  car.maxSteeringAngle = Math.PI / 6; // máximo ángulo de dirección (30 grados)

  scene.add(car);

  car.accelerate = () => accelerate(car);
  car.brake = () => brake(car);
  car.turnLeft = () => turnLeft(car);
  car.turnRight = () => turnRight(car);
  car.stopTurning = () => stopTurning(car);

  // Actualizar la posición de la cámara en relación con el coche
  car.updateCameraPosition = () => {
    camera.position.x = car.position.x;
    camera.position.z = car.position.z + 5; // Atraso la cámara para ver el coche desde atrás
    camera.position.y = car.position.y + 2; // Elevar la cámara un poco
    camera.lookAt(car.position);
  };

    car.update = () => {
      applyPhysics(car);
      
      // Verificar colisiones
  const collisionObject = checkCollisions(car, scene.children);
      if (collisionObject && collisionObject.userData.type === 'obstacle') {
        car.velocity *= 0.5; // Frenar el coche cuando colisiona con un obstáculo
        car.lives--; // Reducir vidas en colisión con obstáculos
        scene.remove(collisionObject); // Remover el obstáculo de la escena
    
        if (car.lives <= 0) {
          console.log('Game Over');
          return;
        }
      }
      
      car.updateCameraPosition();

      // Actualizar la puntuación (metros recorridos)
      car.score += car.velocity * 10;
      car.speed = car.velocity;
    };

  return car;
};