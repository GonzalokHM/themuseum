// src/hooks/useMuseumNavigation.js
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGlobalState } from '../context/GlobalState';

const useMuseumNavigation = (scene, camera, renderer) => {
  const [currentArtwork, setCurrentArtwork] = useState(null);
  const [raycaster] = useState(new THREE.Raycaster());
  const [mouse] = useState(new THREE.Vector2());
  const animationRef = useRef();
  const { dispatch } = useGlobalState();

  useEffect(() => {
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onDocumentClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        setCurrentArtwork(intersectedObject);
      }
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onDocumentClick, false);

    return () => {
      document.removeEventListener('mousemove', onMouseMove, false);
      document.removeEventListener('click', onDocumentClick, false);
    };
  }, [camera, mouse, raycaster, scene]);

  const moveCameraToArtwork = (artwork) => {
    const targetPosition = new THREE.Vector3();
    artwork.getWorldPosition(targetPosition);
    targetPosition.z = 2; // Ajustar!!

    const animateCamera = () => {
      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(artwork.position);
      renderer.render(scene, camera);
      if (camera.position.distanceTo(targetPosition) > 0.1) {
        animationRef.current = requestAnimationFrame(animateCamera);
      } else {
        cancelAnimationFrame(animationRef.current);
        setTimeout(() => {
          // Lanzar el juego correspondiente después de 3 segundos
          alert(`Lanzando el juego para ${artwork.userData.name}`);
          dispatch({ type: 'LAUNCH_GAME', payload: artwork.userData.id });
        }, 3000);
      }
    };

    cancelAnimationFrame(animationRef.current);
    animateCamera();
  };

  useEffect(() => {
    if (currentArtwork) {
      moveCameraToArtwork(currentArtwork);
    }
  }, [currentArtwork]);

  return { currentArtwork };
};

export default useMuseumNavigation;
