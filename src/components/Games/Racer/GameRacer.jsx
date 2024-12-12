import { useEffect, useRef, useState } from 'react';
import { initScene, animateScene } from './constructor/scene';
import { initCar } from './components/car';
import { initControls } from './constructor/controls';
import { initObstacles } from './constructor/obstacles';
import { addTrackBorders } from './components/enviroment';
import HUD from './components/Hud';

const GameRacer = () => {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const MAX_SECTIONS = 10;

  useEffect(() => {
    const { scene, camera, renderer, track } = initScene(mountRef.current);
    const car = initCar(scene, camera);

    initControls(car);

    if (track.sections.length > 0 && track.sections[0].curve) {
      const firstSectionCurve = track.sections[0].curve;

      // Inicializar obstáculos en la primera curva
      initObstacles(scene, firstSectionCurve, track.trackWidth);

      // Añadir vallas para cada sección que tenga curva
      track.sections.forEach((section) => {
        if (section.curve) {
          addTrackBorders(scene, section.curve, track.trackWidth);
        } else {
          console.error('Section is missing a curve:', section);
        }
      });
    } else {
      console.error('First curve is undefined.');
    }

    const animate = () => {

         // Verificación de vidas
         if (car.lives <= 0 && !isGameOver) {
          setIsGameOver(true);
          return;
        }

      if (!isGameOver) {
        requestAnimationFrame(animate);
        animateScene(scene, camera, renderer, car);

        if (track.sections && track.sections.length > 0) {
          const lastSection = track.sections[track.sections.length - 1];

          if (lastSection.trackSection && lastSection.trackSection.geometry) {
            // Verificar si boundingBox está definida
            if (lastSection.trackSection.geometry.boundingBox) {
              // Si la boundingBox existe, verificar si el coche está cerca del final
              if (
                car.position.z <
                lastSection.trackSection.geometry.boundingBox.max.z - 40
              ) {
                const { curve } = track.generateSection();
                addTrackBorders(scene, curve, track.trackWidth);
                initObstacles(scene, curve, track.trackWidth);

                if (track.sections.length > MAX_SECTIONS) {
                  const oldestSection = track.sections.shift();
                  scene.remove(oldestSection.trackSection);
                }
              }
            } else {
              // Calcular la boundingBox
              lastSection.trackSection.geometry.computeBoundingBox();
            }
          }
        }

        // Actualizar el HUD solo si hay cambios en la puntuación, vidas o velocidad
        setScore(car.score);
        if (car.lives !== lives) setLives(car.lives);
        setSpeed(car.velocity);
      }
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [isGameOver]);

  return (
    <div>
      <div ref={mountRef} />
      <HUD score={score} lives={lives} speed={speed} />
      {isGameOver && (
        <div className="game-over-overlay">
          <h1>Game Over</h1>
          <p>Score:{score}m</p>
        </div>
      )}
    </div>
  );
};

export default GameRacer;
