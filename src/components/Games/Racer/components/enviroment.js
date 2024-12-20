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

  const points = curve.getPoints(200);

  const offsetPointsLeft = [];
  const offsetPointsRight = [];

  // Para desplazar los puntos lateralmente, necesitamos la dirección (tangente) de la curva
  // y un vector perpendicular a ella
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const t = curve.getTangent(i / (points.length - 1)).normalize();

    // Vector "arriba"
    const up = new THREE.Vector3(0, 1, 0);

    // Binormal: un vector perpendicular a la tangente y hacia un lado
    // cross(t, up) nos da un vector perpendicular a la tangente en el plano horizontal
    const binormal = new THREE.Vector3().crossVectors(t, up).normalize();

    // Desplazamos hacia la izquierda y derecha de la pista
    const leftOffset = new THREE.Vector3().copy(p).addScaledVector(binormal, -trackWidth / 2);
    const rightOffset = new THREE.Vector3().copy(p).addScaledVector(binormal, trackWidth / 2);

    offsetPointsLeft.push(leftOffset);
    offsetPointsRight.push(rightOffset);
  }

  const leftCurve = new THREE.CatmullRomCurve3(offsetPointsLeft);
  const rightCurve = new THREE.CatmullRomCurve3(offsetPointsRight);

  const shape = new THREE.Shape();
  shape.moveTo(-0.25, 0);
  shape.lineTo(0.25, 0);
  shape.lineTo(0.25, 1);    
  shape.lineTo(-0.25, 1);
  shape.closePath();

  const extrudeSettings = {
    steps: 200,          
    bevelEnabled: false,
    extrudePath: leftCurve
  };

  const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

  const leftGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const leftBorderMesh = new THREE.Mesh(leftGeometry, borderMaterial);
  leftBorderMesh.userData.type = 'border';
  scene.add(leftBorderMesh);

  extrudeSettings.extrudePath = rightCurve;
  const rightGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const rightBorderMesh = new THREE.Mesh(rightGeometry, borderMaterial);
  rightBorderMesh.userData.type = 'border';
  scene.add(rightBorderMesh);

  const boxHelper = new THREE.BoxHelper(rightBorderMesh, 0x00ff00);
scene.add(boxHelper);

  return [leftBorderMesh, rightBorderMesh];
};
