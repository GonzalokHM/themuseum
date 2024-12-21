import * as THREE from 'three';

export const addLighting = (scene) => {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const lightEnviroment = new THREE.DirectionalLight(0xffffff, 1);
  lightEnviroment.position.set(-10, 5, -7.5);
  scene.add(lightEnviroment);
};

export const addTunnelLights = (scene, curve, numLights = 5) => {
  for (let i = 0; i < numLights; i++) {
    const t = i / (numLights - 1); 
    const point = curve.getPointAt(t);

    const tunnelLight = new THREE.PointLight(0xffffff, 1.0, 50);
    tunnelLight.position.set(point.x, point.y + 5, point.z);
    

    const bulbGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bulbMesh = new THREE.Mesh(bulbGeom, bulbMat);
    bulbMesh.position.copy(tunnelLight.position);

    scene.add(tunnelLight);
    scene.add(bulbMesh);
  }
};
