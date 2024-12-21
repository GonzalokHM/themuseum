import * as THREE from 'three';
import { applyPhysics } from '../utils/physics';
import { checkCollisions } from '../utils/collisions';

const textureLoader = new THREE.TextureLoader();
const bodyTexture = textureLoader.load('img/body.jpg'); // Ruta a la textura del cuerpo
const cabinTexture = textureLoader.load('img/cabin.jpg');

export const initCar = (scene, camera) => {
  const carBodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const carBodyMaterial = new THREE.MeshStandardMaterial({ map: bodyTexture });
  const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);

  // Cabina del coche
  const cabinGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.8);
  const cabinMaterial = new THREE.MeshStandardMaterial({ map: cabinTexture });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);

  cabin.position.set(0, 0.4, 0); 

  const car = new THREE.Group();
  car.add(carBody);
  car.add(cabin);

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

  car.updateCameraPosition = () => {
    camera.position.x = car.position.x;
    camera.position.z = car.position.z + 5; 
    camera.position.y = car.position.y + 2; 
    camera.lookAt(car.position);
  };

  car.update = () => {
    applyPhysics(car);

    checkCollisions(car, scene.children, car.trackCurve, car.trackWidth);

    car.updateCameraPosition();

    car.score += car.velocity / 10;
  };

  return car;
};
