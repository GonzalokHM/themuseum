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
    // const { sections, curve, trackWidth } = track;
    const car = initCar(scene, camera);

    initControls(car);
        // Inicialmente, generar obstáculos para la primera curva
        const firstSectionCurve = track.sections[0].curve;
        initObstacles(scene, firstSectionCurve, track.trackWidth);

    // Inicialmente generar vallas para las secciones existentes
    // track.sections.forEach((section) => {
    //   addTrackBorders(scene, section);
    // });

    const animate = () => {
      if (!isGameOver) {
        requestAnimationFrame(animate);
        animateScene(scene, camera, renderer, car);
        
        if (track.sections && track.sections.length > 0) {
          const lastSection = track.sections[track.sections.length - 1];
          
          // Generar nuevas secciones de pista, vallas y obstaculos cuando el coche esté cerca del final de la última sección
          if (car.position.z < lastSection.geometry.boundingBox.max.z - 100) {
            const { curve } = track.generateSection();
            addTrackBorders(scene, curve, track.trackWidth);
            initObstacles(scene, curve, track.trackWidth);
          }
        }

        // Actualizar el HUD con los valores actuales del coche
        setScore(car.score);
        setLives(car.lives);
        setSpeed(car.speed);
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
      <div ref={mountRef} style={{ width: '70vw', height: '100vh' }} />
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
