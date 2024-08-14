import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import useMuseumNavigation from '../../hooks/useMuseumNavigation';
import { useGlobalState } from '../../context/useGlobalState';
import GameLauncher from '../../components/Games/GameLauncher';
import HallOfFame from '../../components/HallOfFame/HallOfFame';
import { getHighScores, getUserScore } from '../../utils/storageUtils';
import styles from './Museum.module.css';

const Museum = () => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [selectedArtworkPosition, setSelectedArtworkPosition] = useState(null);
  const { state, dispatch } = useGlobalState();
  const [currentHallOfFame, setCurrentHallOfFame] = useState(null);
  const [hallOfFameIndex, setHallOfFameIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const { currentArtwork, resetCameraPosition } = useMuseumNavigation(
    scene,
    camera,
    renderer
  );

  const username = state.user;
  const hallOfFameIds = ['hallPuzzle', 'hall2', 'hall3'];

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
    const createArtwork = (x, y, z, id, name, isHallOfFame = false) => {
      const geometry = new THREE.PlaneGeometry(1, 1.5); // Tamaño del cuadro
      const material = new THREE.MeshBasicMaterial({
        color: isHallOfFame ? 0xffff00 : 0xffffff,
        side: THREE.DoubleSide,
      });
      const artwork = new THREE.Mesh(geometry, material);
      artwork.position.set(x, y, z);
      artwork.rotation.y = isHallOfFame ? -Math.PI / 2 : Math.PI / 2;
      artwork.userData = { id, name, isHallOfFame };

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

    // Cuadros juegos en la pared izquierda
    createArtwork(-4.9, 0, -3, 'puzzle', 'Obra de Arte 1');
    createArtwork(-4.9, 0, -1, 'game2', 'Obra de Arte 2');
    createArtwork(-4.9, 0, 1, 'game3', 'Obra de Arte 3');
    // cuadros Hall of Fame en la pared derecha
    createArtwork(4.9, 1.5, -2, 'hallPuzzle', 'Hall of Fame Puzzle', true);
    createArtwork(4.9, 0, -2, 'hall2', 'Hall of Fame game-2', true);
    createArtwork(4.9, -1.5, -2, 'hall3', 'Hall of Fame game-3', true);

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
    const artworkPosition = new THREE.Vector3();
    currentArtwork.getWorldPosition(artworkPosition);

      const canvas = renderer.domElement;
      const widthHalf = canvas.clientWidth / 2;
      const heightHalf = canvas.clientHeight / 2;

      artworkPosition.project(camera);

      const x = artworkPosition.x * widthHalf + widthHalf;
      const y = -(artworkPosition.y * heightHalf) + heightHalf;

      setSelectedArtworkPosition({
        left: `${x}px`,
        top: `${y}px`,
      });

    if (currentArtwork.userData.isHallOfFame) {
      setCurrentHallOfFame(currentArtwork.userData.id);
      dispatch({ type: 'END_GAME' }); // Asegurarse de que cualquier juego en ejecución termine
    } else {
      dispatch({ type: 'LAUNCH_GAME', payload: currentArtwork.userData.id });
    }
  } else {
    setSelectedArtworkPosition(null);
    setCurrentHallOfFame(null);
  }
}, [currentArtwork, renderer, camera, dispatch]);

  useEffect(() => {
    if (currentHallOfFame) {
      const hallOfFameObject = scene.children.find(
        (child) => child.userData && child.userData.id === currentHallOfFame
      );
      if (hallOfFameObject) {
        hallOfFameObject.getWorldPosition(camera.position);
        camera.lookAt(hallOfFameObject.position);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }
    }
  }, [currentHallOfFame, scene, camera, renderer]);

  const handleResetCamera = () => {
    setCurrentHallOfFame(null);
    resetCameraPosition();
    
  };

  
  const handleNextHallOfFame = () => {
    setShowOverlay(false); // Ocultar el overlay antes de mover la cámara

    const nextIndex = (hallOfFameIndex + 1) % hallOfFameIds.length;
    setHallOfFameIndex(nextIndex);
    setCurrentHallOfFame(hallOfFameIds[nextIndex]);

    const targetHallOfFame = scene.children.find(
      (child) => child.userData && child.userData.id === hallOfFameIds[nextIndex]
    );

    if (targetHallOfFame) {
      const targetY = targetHallOfFame.position.y;
      const targetZ = targetHallOfFame.position.z;
      const targetPosition = new THREE.Vector3(camera.position.x, targetY+0.1, targetZ+0.5);

      const duration = 2; // Duración de la animación en segundos
      const startTime = performance.now()

      const animateCamera = (time) => {
      
        const elapsed = (time - startTime) / 1000; // Convertimos a segundos
        const t = elapsed / duration; // Valor de interpolación de 0 a 1
   
          // Interpolación más suave con ease-in-out
          const smoothT = t < 0.5 
            ? 2 * t * t 
            : -1 + (4 - 2 * t) * t;

          // posición/orientacion
          camera.position.lerpVectors(camera.position, targetPosition, smoothT);
          camera.lookAt(targetHallOfFame.position);
          renderer.render(scene, camera);

          if (t < 1) {
        requestAnimationFrame(animateCamera); // Continúa la animación
      } else {
        setTimeout(() => setShowOverlay(true), 380); // Muestra el overlay después de un retardo
      }
    };

    requestAnimationFrame(animateCamera);
    }
  };  

  // Manejar el evento de finalización del juego
  const handleGameEnd = () => {
    dispatch({ type: 'END_GAME' });
  };

  return (
    <div ref={mountRef} className={styles.museum}>
      {selectedArtworkPosition && (
        <div
          className={styles.artworkOverlay}
          style={{
            left: `${selectedArtworkPosition.left}px`,
            top: `${selectedArtworkPosition.top}px`,
          }}
        >
          <h2>Detalles de la Obra de Arte</h2>
          <p>Nombre: {currentArtwork?.userData.name}</p>

          {state.currentGame && (
            <div className={styles.gameOverlay}>
              <GameLauncher
                artworkId={state.currentGame}
                onGameEnd={handleGameEnd}
              />
              <button onClick={() => dispatch({ type: 'END_GAME' })}>
                Reiniciar
              </button>
            </div>
          )}
          <button className={styles.backHallButton} onClick={handleResetCamera}>
            Volver al pasillo
          </button>
        </div>
      )}
      {currentHallOfFame && showOverlay && (
        <div className={styles.hallOfFameOverlay}>
          <HallOfFame
            gameId={currentHallOfFame}
            rankings={getHighScores(currentHallOfFame)}
            userScore={
              getUserScore(currentHallOfFame, username) || {
                name: username || 'Anonymous',
                score: 'N/A',
              }
            }
          />
          <button onClick={handleNextHallOfFame} className={styles.nextButton}>
            Siguiente Cuadro
          </button>
        </div>
      )}
    </div>
  );
};
export default Museum;
