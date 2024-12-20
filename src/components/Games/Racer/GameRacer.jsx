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

  let bordersReferences= useRef([]);

  useEffect(() => {
    const { scene, camera, renderer, track } = initScene(mountRef.current);
    const car = initCar(scene, camera);

    initControls(car);

    let mainCurve = null;
    if (track.sections.length > 0) {
      const firstSection = track.sections[track.sections.length - 1];
      mainCurve = firstSection.curve; 

      car.trackCurve = mainCurve;
      car.trackWidth = track.trackWidth;

      const startPoint = mainCurve.getPointAt(0);
      car.position.set(startPoint.x, startPoint.y , startPoint.z);
      
      initObstacles(scene, mainCurve, track.trackWidth);

      const initialBorders = addTrackBorders(scene, mainCurve, track.trackWidth);
      bordersReferences.current.push({
        section: firstSection,
        borders: initialBorders
      });
    } else {
      console.error('No initial sections found');
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
            if (lastSection.trackSection.geometry.boundingBox) {
              if (
                car.position.z <
                lastSection.trackSection.geometry.boundingBox.max.z - 35
              ) {
                const { curve } = track.generateSection();

                mainCurve = curve;
                car.trackCurve = mainCurve;

                initObstacles(scene, curve, track.trackWidth);

                const newBorders = addTrackBorders(
                  scene,
                  curve,
                  track.trackWidth
                );
                bordersReferences.current.push({
                  section: track.sections[track.sections.length - 1],
                  borders: newBorders,
                });

                if (track.sections.length > MAX_SECTIONS) {
                  const oldestSection = track.sections.shift();
                  scene.remove(oldestSection.trackSection);

                  const removedBorders = bordersReferences.current.shift();
                  if (removedBorders && removedBorders.borders) {
                    removedBorders.borders.forEach((border) => {
                      scene.remove(border);
                    });
                  }
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
          <p>Score:{Math.floor(score)}meters</p>
        </div>
      )}
    </div>
  );
};

export default GameRacer;
