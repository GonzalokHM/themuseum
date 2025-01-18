import * as THREE from 'three';
import { applyPhysics } from '../utils/physics';
import { checkCollisions } from '../utils/collisions';

const textureLoader = new THREE.TextureLoader();
const cabinTexture = textureLoader.load('img/cabin.jpg');

export const initCar = (scene, camera) => {
  const car = new THREE.Group();

  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x525252});
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  car.add(body);

  const cabinGeometry = new THREE.BoxGeometry(0.6, 0.4, 1);
  const cabinMaterial = new THREE.MeshBasicMaterial({
    map: cabinTexture,
    side: THREE.DoubleSide,
  });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.set(0, 0.45, 0);
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  car.add(cabin);

  const headlightGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
  const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
  const headlight2 = headlight1.clone();
  headlight1.position.set(-0.3, 0.1, -1.01); // Frente izquierdo
  headlight2.position.set(0.3, 0.1, -1.01); // Frente derecho
  car.add(headlight1, headlight2);

  const taillightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const taillight1 = new THREE.Mesh(headlightGeometry, taillightMaterial);
  const taillight2 = taillight1.clone();
  taillight1.position.set(-0.3, 0.1, 1.01); // Trasero izquierdo
  taillight2.position.set(0.3, 0.1, 1.01); // Trasero derecho
  car.add(taillight1, taillight2);

  const neonGeometry = new THREE.PlaneGeometry(1.2, 2.2);
  const neonMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });
  const neon = new THREE.Mesh(neonGeometry, neonMaterial);
  neon.rotation.x = Math.PI / 2;
  neon.position.y = -0.25;
  car.add(neon);

  const sidePanelGeometry = new THREE.BoxGeometry(0.05, 0.1, 1.5);
  const sidePanelMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.7 });
  const sidePanel1 = new THREE.Mesh(sidePanelGeometry, sidePanelMaterial);
  const sidePanel2 = sidePanel1.clone();
  sidePanel1.position.set(-0.55, 0.1, 0); // Panel izquierdo
  sidePanel2.position.set(0.55, 0.1, 0); // Panel derecho
  car.add(sidePanel1, sidePanel2);

  car.position.y = 0.25;

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
