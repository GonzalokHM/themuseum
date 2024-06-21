import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import useMuseumNavigation from '../hooks/useMuseumNavigation';
import { useGlobalState } from '../context/useGlobalState';
import GameLauncher from '../components/GameLauncher';

const Museum = () => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [selectedArtworkPosition, setSelectedArtworkPosition] = useState(null);
  const { state, dispatch } = useGlobalState();
  const { currentArtwork, resetCameraPosition } = useMuseumNavigation(scene, camera, renderer);

  const scores = [
    { game: 'puzzle', player: 'Alex', score: '2:28' },
    { game: 'Juego 2', player: 'Emma', score: 950 },
    { game: 'puzzle', player: 'Jack', score: 850 },
    { game: 'Juego 3', player: 'Sophia', score: 900 },
    { game: 'Juego 2', player: 'Liam', score: 750 },
    { game: 'puzzle', player: 'Olivia', score: '2:35' },
    { game: 'Juego 2', player: 'Noah', score: 920 },
    { game: 'Juego 3', player: 'Ava', score: 880 },
    { game: 'puzzle', player: 'Mason', score: '2:20' },
    { game: 'Juego 3', player: 'Isabella', score: 830 }
  ];

  useEffect(() => {
    const mountNode = mountRef.current;

    // Crear escena, cámara y renderer

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountNode.appendChild(renderer.domElement);

    // Añadir luz
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 2, 2);
    scene.add(light);

    // Crear paredes
    const wallGeometry = new THREE.PlaneGeometry(10, 5);
    const wallMaterial = new THREE.MeshBasicMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
    });
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(-5, 0, 0);
    leftWall.rotation.y = Math.PI / 2;
    rightWall.position.set(5, 0, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(leftWall);
    scene.add(rightWall);

    // Añadir cuadros en las paredes
    const createArtwork = (x, y, z, id, name) => {
      const geometry = new THREE.PlaneGeometry(1, 1.5); // Tamaño del cuadro
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const artwork = new THREE.Mesh(geometry, material);
      artwork.position.set(x, y, z);
       artwork.rotation.y = Math.PI / 2;
      artwork.userData = { id, name };

      // Crear marco 3D para el cuadro
      const frameThickness = 0.1;
      const frameDepth = 0.05;

      // Lados del marco
      const topBottomGeometry = new THREE.BoxGeometry(1 + frameThickness * 2, frameDepth, frameThickness);
      const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });


      const topFrame = new THREE.Mesh(topBottomGeometry, frameMaterial);
      topFrame.position.set(x, y + 0.75, z + frameDepth / 2);

      const bottomFrame = new THREE.Mesh(topBottomGeometry, frameMaterial);
      bottomFrame.position.set(x, y - 0.75, z + frameDepth / 2);


      topFrame.rotation.y = Math.PI / 2;
      bottomFrame.rotation.y = Math.PI / 2;

      scene.add(artwork);
      scene.add(topFrame);
      scene.add(bottomFrame);
    };

    // Cuadros en la pared izquierda
    createArtwork(-4.9, 0, -2, 'artwork-1', 'Obra de Arte 1');
    createArtwork(-4.9, 0, 0, 'artwork-2', 'Obra de Arte 2');
    createArtwork(-4.9, 0, 2, 'artwork-3', 'Obra de Arte 3');

    // Configuración de la cámara
    camera.position.set(0, 0, 5);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);

    return () => {
      mountNode.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (currentArtwork) {
      console.log('Obra de arte seleccionada:', currentArtwork.userData);
      const vector = new THREE.Vector3();
      currentArtwork.getWorldPosition(vector);
      const canvas = renderer.domElement;
      const widthHalf = canvas.clientWidth / 2;
      const heightHalf = canvas.clientHeight / 2;

      vector.project(camera);

      vector.x = (vector.x * widthHalf) + widthHalf;
      vector.y = -(vector.y * heightHalf) + heightHalf;

      setSelectedArtworkPosition({
        left: `${vector.x}px`,
        top: `${vector.y}px`
      });
    }else {
      setSelectedArtworkPosition(null); // Ocultar la interfaz del cuadro seleccionado
    }
  }, [currentArtwork, renderer, camera]);

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {selectedArtworkPosition && (
        <div
          className="artwork-overlay"
          style={{
            position: 'absolute',
            left: selectedArtworkPosition.left,
            top: selectedArtworkPosition.top,
            padding: '10px',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <h2>Detalles de la Obra de Arte</h2>
          <p>Nombre: {currentArtwork?.userData.name}</p>
          {state.currentGame && (
            <div className="game-overlay">
              <GameLauncher artworkId={state.currentGame} />
              <button onClick={() => dispatch({ type: 'END_GAME' })}>Cerrar Juego</button>
            </div>
          )}
      <button className='backHallButton' onClick={resetCameraPosition} style={{ position: 'absolute', bottom: -20, right: -120 }}>Volver al pasillo</button>
        </div>
      )}
    </div>
  );
};
export default Museum;
