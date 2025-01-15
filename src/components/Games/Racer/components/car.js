import * as THREE from 'three';
import { applyPhysics } from '../utils/physics';
import { checkCollisions } from '../utils/collisions';
import { mergeBufferGeometries } from 'three-stdlib';

const textureLoader = new THREE.TextureLoader();
const carTexture = textureLoader.load('img/nGrid.jpg')

carTexture.wrapS = THREE.ClampToEdgeWrapping;
carTexture.wrapT = THREE.ClampToEdgeWrapping;
carTexture.repeat.set(1, 1);

export const initCar = (scene, camera) => {
  const carBodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const bodyUVs = new Float32Array([
    // Frente
    0.5, 0.5,  0.75, 0.5,  0.75, 0.75,  0.5, 0.75,
    // Parte trasera
    0.75, 0.5,  1.0, 0.5,  1.0, 0.75,  0.75, 0.75,
    // Superior
    0.5, 0.75,  0.75, 0.75,  0.75, 1.0,  0.5, 1.0,
    // Inferior
    0.0, 0.5,  0.25, 0.5,  0.25, 0.75,  0.0, 0.75,
    // Izquierda
    0.25, 0.25,  0.5, 0.25,  0.5, 0.5,  0.25, 0.5,
    // Derecha
    0.0, 0.25,  0.25, 0.25,  0.25, 0.5,  0.0, 0.5,
  ]);
  carBodyGeometry.setAttribute('uv', new THREE.BufferAttribute(bodyUVs, 2));

  const cabinGeometry = new THREE.BufferGeometry(); 

  //vértices y caras para la cabina con inclinaciones para el parabrisas
  const vertices = new Float32Array([
    // Base inferior
    -0.3, 0, -0.4,  0.3, 0, -0.4,  0.3, 0, 0.4,  -0.3, 0, 0.4,
    // Techo superior
    -0.2, 0.3, -0.3,  0.2, 0.3, -0.3,  0.2, 0.3, 0.3,  -0.2, 0.3, 0.3,
  ]);

  const indices = [
    // Base inferior
    0, 1, 2,  2, 3, 0,
    // Lados
    0, 1, 5,  5, 4, 0,
    1, 2, 6,  6, 5, 1,
    2, 3, 7,  7, 6, 2,
    3, 0, 4,  4, 7, 3,
    // Techo superior
    4, 5, 6,  6, 7, 4,
  ];
  const cabinUvs = new Float32Array([
   // Base inferior
   0.0, 0.0,  0.25, 0.0,  0.25, 0.25,  0.0, 0.25,
   // Techo superior
   0.25, 0.25,  0.5, 0.25,  0.5, 0.5,  0.25, 0.5,
   // Lados
   0.5, 0.0,  0.75, 0.0,  0.75, 0.25,  0.5, 0.25,
 ]);

  cabinGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  cabinGeometry.setAttribute('uv', new THREE.BufferAttribute(cabinUvs, 2));
  cabinGeometry.setIndex(indices);
  // cabinGeometry.computeVertexNormals(); // Para sombreado

  cabinGeometry.translate(0, 0.4, 0);

  const combinedGeometry = mergeBufferGeometries([carBodyGeometry, cabinGeometry]);

  const carMaterial = new THREE.MeshBasicMaterial({ map: carTexture });

  // Crear la malla del coche
  const car = new THREE.Mesh(combinedGeometry, carMaterial);

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
