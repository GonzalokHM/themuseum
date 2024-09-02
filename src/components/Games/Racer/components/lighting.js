import * as THREE from 'three';

export const addLighting = (scene) => {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
  scene.add(ambientLight);

  const lightEnviroment = new THREE.DirectionalLight(0xffffff, 1);
  lightEnviroment.position.set(10, 10, 10);
  scene.add(lightEnviroment);
};