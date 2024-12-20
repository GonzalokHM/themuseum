import * as THREE from 'three';

export const initTrack = (scene) => {
  const sections = [];
  const trackWidth = 10;
  let lastPoint = new THREE.Vector3(0, 0, 0);

  const generateSection = () => {
    const nextPoint = new THREE.Vector3(
      lastPoint.x + (Math.random() - 0.5) * 20,
      0,
      lastPoint.z - 50
    );

    const curve = new THREE.CatmullRomCurve3([lastPoint, nextPoint]);

    const geometry = new THREE.TubeGeometry(
      curve,
      100,
      trackWidth / 2,
      20,
      false
    );
    const material = new THREE.MeshStandardMaterial({ color: 0x404040 });

    const trackSection = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();


    scene.add(trackSection);
    sections.push({ trackSection, curve });

    lastPoint = nextPoint;

    return { curve };
  };


  for (let i = 0; i < 1; i++) {
    generateSection();
  }

  return { sections, generateSection, trackWidth };
};
