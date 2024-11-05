import { useRef, useEffect } from 'react';
import {  useFrame } from '@react-three/fiber';

function Player() {
    const playerRef = useRef();
    const speed = 0.1;
    const keys = useRef({});
  
    useFrame(() => {
      const pos = playerRef.current.position;
      if (keys.current['w']) pos.z -= speed;
      if (keys.current['s']) pos.z += speed;
      if (keys.current['a']) pos.x -= speed;
      if (keys.current['d']) pos.x += speed;
    });
  
    useEffect(() => {
      const handleKeyDown = (e) => (keys.current[e.key] = true);
      const handleKeyUp = (e) => (keys.current[e.key] = false);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);
  
    return (
      <mesh ref={playerRef} visible={false}>
        <perspectiveCamera makeDefault fov={75} />
      </mesh>
    );
  }
  