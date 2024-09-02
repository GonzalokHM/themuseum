import * as THREE from 'three';

// elementos entorno
export const addEnvironmentElements = (scene) => {
  
  const addTree = (x, z) => {
    const treeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5);
    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const tree = new THREE.Mesh(treeGeometry, treeMaterial);
    tree.position.set(x, 2.5, z);
    scene.add(tree);
  };

  addTree(-10, -10);
  addTree(10, 10);
  addTree(-10, 10);
  addTree(10, -10);
}

  // vallas limitacion pista
 export const addTrackBorders = (scene, trackSection) => {
  const borderGeometry = new THREE.BoxGeometry(0.2, 1, 50); // Vallas más gruesas y altas
  const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const leftBorder = new THREE.Mesh(borderGeometry, borderMaterial);
  leftBorder.position.set(trackSection.position.x - 5, 0.5, trackSection.position.z);
  scene.add(leftBorder);

  const rightBorder = new THREE.Mesh(borderGeometry, borderMaterial);
  rightBorder.position.set(trackSection.position.x + 5, 0.5, trackSection.position.z);
  scene.add(rightBorder);

  // Asegúrate de que las vallas estén marcadas como colisionables
  leftBorder.userData.type = 'border';
  rightBorder.userData.type = 'border';
};