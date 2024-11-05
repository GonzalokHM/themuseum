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

  useEffect(() => {
    const { scene, camera, renderer, track } = initScene(mountRef.current);
    const car = initCar(scene, camera);

    initControls(car);

    // Asegúrarse de que la curva está correctamente definida antes de pasarla
    // Verificar si hay secciones y la primera curva está presente
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
                lastSection.trackSection.geometry.boundingBox.max.z - 180
              ) {
                const { curve } = track.generateSection();
                addTrackBorders(scene, curve, track.trackWidth);
                initObstacles(scene, curve, track.trackWidth);
              }
            } else {
              // Calcular la boundingBox si no está definida
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

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setSpeed(0);
    setIsGameOver(false);
  };

  return (
    <div>
      <div ref={mountRef} />
      <HUD score={score} lives={lives} speed={speed} />
      {isGameOver && (
        <div className="game-over-overlay">
          <h1>Game Over</h1>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default GameRacer;
