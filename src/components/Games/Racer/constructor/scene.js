import { initTrack } from '../components/track';
import { addLighting, addTunnelLights } from '../components/lighting';
import * as THREE from 'three';

export const initScene = (mountNode) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / 3.6 / (window.innerHeight / 2.6),
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();

  if (mountNode.childElementCount === 0) {
    renderer.setSize(window.innerWidth / 3.6, window.innerHeight / 2.6);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountNode.appendChild(renderer.domElement);
  }
  const track = initTrack(scene);

  addLighting(scene);

  if (track.sections.length > 0) {

    const mainCurve = track.sections[0].curve;

    addTunnelLights(scene, mainCurve, 5);
  }

  camera.position.z = 5;

  return { scene, camera, renderer, track };
};

export const animateScene = (scene, camera, renderer, car) => {
  car.update();
  renderer.render(scene, camera);
};
