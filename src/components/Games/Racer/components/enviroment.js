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
};

// vallas limitacion pista
export const addTrackBorders = (scene, curve, trackWidth) => {
  const borders = [];

  // Añadir bordes izquierdo y derecho a lo largo de la curva
  for (let t = 0; t <= 1; t += 0.1) {
    const position = curve.getPointAt(t);
    const leftBorderGeometry = new THREE.BoxGeometry(0.5, 1, 5); // Usamos una caja para que sea sólida
    const rightBorderGeometry = new THREE.BoxGeometry(0.5, 1, 5);

    const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    const leftBorder = new THREE.Mesh(leftBorderGeometry, borderMaterial);
    const rightBorder = new THREE.Mesh(rightBorderGeometry, borderMaterial);

    leftBorder.userData.type = 'border';
    rightBorder.userData.type = 'border';

    // Posicionar los bordes a los lados de la pista
    leftBorder.position.set(position.x - trackWidth / 2, position.y + 0.5, position.z);
    rightBorder.position.set(position.x + trackWidth / 2, position.y + 0.5, position.z);

    scene.add(leftBorder);
    scene.add(rightBorder);

    borders.push(leftBorder, rightBorder);
  }

  return borders;
};
