import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import useMuseumNavigation from '../hooks/useMuseumNavigation';
import { useGlobalState } from '../context/GlobalState';
import GameLauncher from '../components/GameLauncher';

const Museum = () => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const { currentArtwork } = useMuseumNavigation(scene, camera, renderer);
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    const mountNode = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountNode.appendChild(renderer.domElement);

        // Añadir cuadros en la pared
        const createArtwork = (x, y, z, id, name) => {
            const geometry = new THREE.PlaneGeometry(1, 1.5); // Tamaño del cuadro
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            const artwork = new THREE.Mesh(geometry, material);
            artwork.position.set(x, y, z);
            artwork.userData = { id, name };
            scene.add(artwork);
          };
      
          createArtwork(-2, 0, -5, 'artwork-1', 'Obra de Arte 1');
          createArtwork(0, 0, -5, 'artwork-2', 'Obra de Arte 2');
          createArtwork(2, 0, -5, 'artwork-3', 'Obra de Arte 3');

    camera.position.z = 2;

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
      // Lógica adicional para mostrar detalles de la obra de arte
    }
  }, [currentArtwork]);


  return(
     <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
    {state.currentGame && (
        <div className="game-overlay">
          <GameLauncher artworkId={state.currentGame} />
          <button onClick={() => dispatch({ type: 'END_GAME' })}>Cerrar Juego</button>
        </div>
      )}
    </div>
  );
};
export default Museum;
