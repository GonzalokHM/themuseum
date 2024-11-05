import  { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
  // Configuración de luces
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <PerspectiveCamera makeDefault fov={75} position={[0, 2, 5]} />
      <OrbitControls enableZoom={false} />
    </>
  );
}

export default function Shooter() {
    return (
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Game />
        </Canvas>
      );
    }
}
