import * as THREE from 'three';
import { applyPhysics } from '../utils/physics';
import { checkCollisions } from '../utils/collisions';

export const initCar = (scene, camera) => {
  const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const carMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const car = new THREE.Mesh(carGeometry, carMaterial);

  car.isAccelerating = false;
  car.isBraking = false;
  car.turnDirection = 0;
  car.velocity = 0;
  car.lives = 3;
  car.score = 0;
  car.maxSpeed = 10;
  car.mass = 1200;
  car.wheelBase = 2.5;
  car.steeringAngle = 0;
  car.acceleration = 0;
  car.maxAcceleration = 0.02;
  car.maxSteeringAngle = Math.PI / 6; 

  // Iniciar flag para colisiones
  car.lastCollidedObject = null;
  car.hasCollided = false;

  scene.add(car);

  // Actualizar la posición de la cámara en relación con el coche
  car.updateCameraPosition = () => {
    camera.position.x = car.position.x;
    camera.position.z = car.position.z + 5; // Atraso la cámara para ver el coche desde atrás
    camera.position.y = car.position.y + 2; // Elevar la cámara un poco
    camera.lookAt(car.position);
  };

  car.update = () => {
    applyPhysics(car);

    checkCollisions(car, scene.children, car.trackCurve, car.trackWidth);

    car.updateCameraPosition();

    // Actualizar la puntuación
    car.score += car.velocity / 10;
  };

  return car;
};
