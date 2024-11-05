import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from 'three';

function Enemy({ position, onHit }) {
    const enemyRef = useRef();
  
    useFrame(() => {
      if (enemyRef.current) {
        for (let bullet of bullets) {
          const distance = enemyRef.current.position.distanceTo(bullet.position);
          if (distance < 0.5) {
            onHit();
          }
        }
      }
    });
  
    return (
      <mesh ref={enemyRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="green" />
      </mesh>
    );
  }
  
  function Game() {
    const [enemies, setEnemies] = useState([{ position: new THREE.Vector3(0, 0, -10) }]);
    
    const handleHit = (index) => {
      setEnemies((en) => en.filter((_, i) => i !== index));
    };
  
    return (
      <>
        <PlayerWithShooting />
        {enemies.map((enemy, i) => (
          <Enemy key={i} position={enemy.position} onHit={() => handleHit(i)} />
        ))}
      </>
    );
  }
  