import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';

function Bullet({ position, direction }) {
    const bulletRef = useRef();
  
    useFrame(() => {
      bulletRef.current.position.add(direction);
    });
  
    return (
      <mesh ref={bulletRef} position={position}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
  
  function PlayerWithShooting() {
    const [bullets, setBullets] = useState([]);
    const playerRef = useRef();
  
    const shoot = () => {
      const dir = new THREE.Vector3();
      playerRef.current.getWorldDirection(dir);
      const pos = playerRef.current.position.clone();
      setBullets([...bullets, { position: pos, direction: dir.multiplyScalar(0.5) }]);
    };
  
    useEffect(() => {
      window.addEventListener('click', shoot);
      return () => window.removeEventListener('click', shoot);
    }, [bullets]);
  
    return (
      <>
        <mesh ref={playerRef} visible={false}>
          <perspectiveCamera makeDefault fov={75} />
        </mesh>
        {bullets.map((bullet, i) => (
          <Bullet key={i} position={bullet.position} direction={bullet.direction} />
        ))}
      </>
    );
  }
  