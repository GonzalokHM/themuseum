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

    const onDocumentClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children,true);
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
      const offset = new THREE.Vector3(2, 0, 0);
      if (artwork.rotation.y === Math.PI / 2) {
        offset.set(1.1, 0, 0); // Si el cuadro está en la pared izquierda
      } else if (artwork.rotation.y === -Math.PI / 2) {
        offset.set(-1, 0, 0); // Si el cuadro está en la pared derecha
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
            if (state.currentGame !== artwork.userData.id){
            // Lanzar el juego correspondiente después de 3 segundos
            alert(`Lanzando el juego para ${artwork.userData.name}`);
            dispatch({ type: 'LAUNCH_GAME', payload: artwork.userData.id });
          } else {
            alert(`El juego para ${artwork.userData.name} ya está lanzado`);
          }
          }, 3000);
        }
      };

      cancelAnimationFrame(animationRef.current);
      animateCamera();
    },
    [camera, renderer, scene, dispatch]
  );

  const resetCameraPosition = useCallback(() => {
    setCurrentArtwork(null)
    dispatch({ type: 'END_GAME' });
    const initialPosition = new THREE.Vector3(0, 0, 5);
    const animateCamera = () => { 
      camera.position.lerp(initialPosition, 0.1);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      renderer.render(scene, camera);
      if (camera.position.distanceTo(initialPosition) > 0.05) {
        animationRef.current = requestAnimationFrame(animateCamera);
      } else {
        cancelAnimationFrame(animationRef.current);
      }
    };

    cancelAnimationFrame(animationRef.current);
    animateCamera();
  }, [camera, renderer, scene, dispatch]);


  useEffect(() => {
    if (currentArtwork) {
      moveCameraToArtwork(currentArtwork);
    }
  }, [currentArtwork, moveCameraToArtwork]);

  return { currentArtwork, resetCameraPosition};
};

export default useMuseumNavigation;
