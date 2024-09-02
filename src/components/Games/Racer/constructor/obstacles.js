import * as THREE from 'three';

export const initObstacles = (scene, curve, trackWidth) => {
  const obstacles = [];

  const generateObstacle = (t) => {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

        // Obtener la posición en la curva para el obstáculo
        const position = curve.getPointAt(t);
        const offset = Math.random() * trackWidth - trackWidth / 2;

        obstacle.position.set(position.x + offset, position.y + 0.5, position.z);
        scene.add(obstacle);
        obstacles.push(obstacle);
  };

  // Generar varios obstáculos a lo largo de la curva
  for (let i = 0; i < 10; i++) {
    generateObstacle(i / 10);
  }

  return obstacles;
};