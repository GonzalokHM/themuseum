import { initTrack } from '../components/track';
import { addEnvironmentElements } from '../components/enviroment';
import { addLighting } from '../components/lighting';
import * as THREE from 'three';

export const initScene = (mountNode) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    (window.innerWidth/ 3.6) / (window.innerHeight/ 2.6),
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
// Ajustar el tamaño del renderer al tamaño del contenedor y prevenir duplicados

// Verifica si no existe un canvas previo
if (mountNode.childElementCount === 0) {
  renderer.setSize(window.innerWidth / 3.6, window.innerHeight / 2.6);  // Mitad del tamaño de la ventana
  renderer.setPixelRatio(window.devicePixelRatio);  // Mejor calidad en pantallas retina
  mountNode.appendChild(renderer.domElement);  // Agregar solo si no se ha agregado antes
}

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
