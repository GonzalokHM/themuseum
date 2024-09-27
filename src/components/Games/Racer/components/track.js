import * as THREE from 'three';

export const initTrack = (scene) => {
  const sections = [];
  const trackWidth = 10; // Ancho de la pista
  let lastPoint = new THREE.Vector3(0, 0, 0); // Último punto de control

  const generateSection = () => {
    const nextPoint = new THREE.Vector3(
      lastPoint.x + (Math.random() - 0.5) * 20, // Desviación en X
      0,
      lastPoint.z - 50 // Cada punto más atrás en Z
    );

    const curve = new THREE.CatmullRomCurve3([lastPoint, nextPoint]);

    const geometry = new THREE.TubeGeometry(
      curve,
      100,
      trackWidth / 2,
      20,
      false
    );
    geometry.scale(1, -0.1, 1); //aplastar tubeGeometry para que sea plana
    const material = new THREE.MeshStandardMaterial({ color: 0x404040 });

    const trackSection = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    if (!geometry.boundingBox) {
      console.error("Bounding box is not defined.");
    } else {
      console.log("Bounding Box calculated:", geometry.boundingBox);
    }

    scene.add(trackSection);
    sections.push({ trackSection, curve });

    lastPoint = nextPoint; // Actualizar el último punto

    return { curve };
  };

  // Generar las secciones iniciales de la pista

  for (let i = 0; i < 5; i++) {
    generateSection();
  }

  return { sections, generateSection, trackWidth };
};
