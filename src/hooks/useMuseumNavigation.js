import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useGlobalState } from '../context/useGlobalState';

const useMuseumNavigation = (scene, camera, renderer) => {
  const [currentArtwork, setCurrentArtwork] = useState(null);
  const [raycaster] = useState(new THREE.Raycaster());
  const [mouse] = useState(new THREE.Vector2());
  const animationRef = useRef();
  const { state, dispatch } = useGlobalState();

  if (!state || !dispatch) {
    throw new Error(
      'useMuseumNavigation must be used within a GlobalStateProvider'
    );
  }

  useEffect(() => {
    if (!scene || !camera || !renderer) {
      return; // No ejecutar si scene, camera o renderer no están definidos
    }

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onDocumentClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData.id) {
          setCurrentArtwork(intersectedObject);
        }
      }
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onDocumentClick, false);

    return () => {
      document.removeEventListener('mousemove', onMouseMove, false);
      document.removeEventListener('click', onDocumentClick, false);
    };
  }, [camera, mouse, raycaster, scene, renderer]);

  const moveCameraToArtwork = useCallback(
    (artwork) => {
      const targetPosition = new THREE.Vector3();
      artwork.getWorldPosition(targetPosition);
      // Ajustar la posición de la cámara para que esté un poco alejada del cuadro
      const offset = new THREE.Vector3(2, 0, 0); // Ajustar según la distancia deseada
      if (artwork.rotation.y === Math.PI / 2) {
        offset.set(2, 0, 0); // Si el cuadro está en la pared izquierda
      } else if (artwork.rotation.y === -Math.PI / 2) {
        offset.set(-2, 0, 0); // Si el cuadro está en la pared derecha
      }
      targetPosition.add(offset);

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
    },
    [camera, renderer, scene, dispatch]
  );

  useEffect(() => {
    if (currentArtwork) {
      moveCameraToArtwork(currentArtwork);
    }
  }, [currentArtwork, moveCameraToArtwork]);

  return { currentArtwork };
};

export default useMuseumNavigation;
