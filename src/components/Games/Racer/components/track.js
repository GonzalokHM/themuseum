import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('img/tunelTexture.webp');

export const initTrack = (scene) => {
  const sections = [];
  const trackWidth = 10;
  let lastPoint = new THREE.Vector3(0, 0, 0);

  const generateSection = () => {
    const nextPoint = new THREE.Vector3(
      lastPoint.x + (Math.random() - 0.5) * 20,
      0,
      lastPoint.z - 80
    );

    const curve = new THREE.CatmullRomCurve3([lastPoint, nextPoint]);

    const geometry = new THREE.TubeGeometry(
      curve,
      100,
      trackWidth / 2,
      20,
      false
    );


    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.BackSide,
    });

    const trackSection = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();

    scene.add(trackSection);
    sections.push({ trackSection, curve });

    lastPoint = nextPoint;

    return { curve };
  };

 
    generateSection();
  

  return { sections, generateSection, trackWidth };
};
