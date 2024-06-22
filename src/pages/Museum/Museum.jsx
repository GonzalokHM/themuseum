import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import useMuseumNavigation from '../../hooks/useMuseumNavigation';
import { useGlobalState } from '../../context/useGlobalState';
import GameLauncher from '../../components/Games/GameLauncher';
import HallOfFame from '../../components/HallOfFame/HallOfFame';
import { getHighScores , getUserScore } from '../utils/localStorageUtils';
import styles from './Museum.module.css';

const Museum = () => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [selectedArtworkPosition, setSelectedArtworkPosition] = useState(null);
  const { state, dispatch } = useGlobalState();
  const { currentArtwork, resetCameraPosition } = useMuseumNavigation(
    scene,
    camera,
    renderer
  );

  const username = 'User';


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
      const topBottomGeometry = new THREE.BoxGeometry(
        1 + frameThickness * 2,
        frameDepth,
        frameThickness
      );
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

        // Cuadros en la pared derecha (Hall of Fame)
        const createHallOfFame = (x, y, z, id) => {
          const geometry = new THREE.PlaneGeometry(2, 1); // Tamaño del cuadro
          const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
          const artwork = new THREE.Mesh(geometry, material);
          artwork.position.set(x, y, z);
          artwork.userData = { id };
    
          // Rotar el cuadro para que esté paralelo a la pared
          artwork.rotation.y = -Math.PI / 2;
    
          scene.add(artwork);
        };
    
        createHallOfFame(4.9, 2, -2, 'game-1');
        createHallOfFame(4.9, 1, -2, 'game-2');
        createHallOfFame(4.9, 0, -2, 'game-3');
    

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

    // Función para manejar el redimensionamiento de la ventana
    const handleResize = () => {
      const width = mountNode.clientWidth;
      const height = mountNode.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Escuchar el evento de redimensionamiento de la ventana
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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

      vector.x = vector.x * widthHalf + widthHalf;
      vector.y = -(vector.y * heightHalf) + heightHalf;

      setSelectedArtworkPosition({
        left: `${vector.x}px`,
        top: `${vector.y}px`,
      });
    } else {
      setSelectedArtworkPosition(null); // Ocultar la interfaz del cuadro seleccionado
    }
  }, [currentArtwork, renderer, camera]);

  return (
    <div ref={mountRef} className={styles.museum}>
      {selectedArtworkPosition && (
        <div
          className={styles.artworkOverlay}
          style={{
            left: selectedArtworkPosition.left,
            top: selectedArtworkPosition.top,
          }}
        >
          <h2>Detalles de la Obra de Arte</h2>
          <p>Nombre: {currentArtwork?.userData.name}</p>
          {state.currentGame && (
            <div className={styles.gameOverlay}>
              <GameLauncher artworkId={state.currentGame} />
              <button onClick={() => dispatch({ type: 'END_GAME' })}>
                Cerrar Juego
              </button>
            </div>
          )}
          <button
            className={styles.backHallButton}
            onClick={resetCameraPosition}
          >
            Volver al pasillo
          </button>
        </div>
      )}
      <div className={styles.hallOfFameSection}>
        {['game-1', 'game-2', 'game-3'].map(gameId => (
          <HallOfFame
            key={gameId}
            gameId={gameId}
            rankings={getHighScores(gameId)}
            userScore={getUserScore(gameId, username) || { username, score: 0 }}
          />
        ))}
      </div>
    </div>
  );
};
export default Museum;
