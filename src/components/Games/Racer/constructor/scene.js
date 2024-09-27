import { initTrack } from '../components/track';
import { addEnvironmentElements } from '../components/enviroment';
import { addLighting } from '../components/lighting';
import * as THREE from 'three';

export const initScene = (mountNode) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  mountNode.appendChild(renderer.domElement);

  // Inicializar la pista
  const track = initTrack(scene);

  // Añadir elementos del entorno
  addEnvironmentElements(scene);

  // Añadir iluminación
  addLighting(scene);

  camera.position.z = 5;

  return { scene, camera, renderer, track };
};

export const animateScene = (scene, camera, renderer, car) => {
  car.update();
  renderer.render(scene, camera);
};
