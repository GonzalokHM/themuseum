import * as THREE from 'three';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { FontLoader } from 'three/addons/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry';

const Trophy = ({
  id,
  position,
  gameCompleted,
  scene,
  gameName,
  cupMaterialType,
}) => {
  const trophyRef = useRef();

  useEffect(() => {
    const loader = new FontLoader();

    // Cargar la fuente desde una URL o ruta local
    loader.load('/fonts/gentilis.typeface.json', (font) => {
      // Crear geometría del trofeo
      const createTrophyGeometry = () => {
        const base = new THREE.BoxGeometry(0.7, 0.35, 0.7);
        const stem = new THREE.CylinderGeometry(0.15, 0.25, 0.8, 32);
        const cup = new THREE.SphereGeometry(0.35, 32, 32);

        // cargar texturas
        const textureLoader = new THREE.TextureLoader();

        const bronzeTexture = textureLoader.load('/textures/bronze.jpg');
        const stemMetalTexture = textureLoader.load('/textures/stemMetal.jpg');
        const goldTexture = textureLoader.load('/textures/gold.jpg');
        const silverTexture = textureLoader.load('/textures/silver.jpg');
        const diamondTexture = textureLoader.load('/textures/diamond.jpg');
        const stampTexture = textureLoader.load('/textures/stamp.jpg');

        // Materiales
        const baseMaterial = new THREE.MeshPhongMaterial({
          color: 0x888888,
          shininess: 100,
        });
        const stemMaterial = new THREE.MeshPhongMaterial({
          map: stemMetalTexture,
          shininess: 100,
        });
        // Selección del material de la copa según el tipo de trofeo
        let cupMaterial;
        switch (cupMaterialType) {
          case 'bronze':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: bronzeTexture,
              shininess: 100,
            });
            break;
          case 'silver':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: silverTexture,
              shininess: 100,
            });
            break;
          case 'gold':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: goldTexture,
              shininess: 100,
            });
            break;
          case 'diamond':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: diamondTexture,
              shininess: 100,
            });
            break;
          default:
            cupMaterial = new THREE.MeshPhongMaterial({
              color: 0xffffff,
              shininess: 100,
            });
        }

        // Crear mallas
        const baseMesh = new THREE.Mesh(base, baseMaterial);
        const stemMesh = new THREE.Mesh(stem, stemMaterial);
        const cupMesh = new THREE.Mesh(cup, cupMaterial);

        // Posicionar piezas
        baseMesh.position.y = -0.6;
        stemMesh.position.y = -0.1;
        cupMesh.position.y = 0.7;

        // Crear la 'estampa' en la base del trofeo
        const stampGeometry = new THREE.PlaneGeometry(0.6, 0.3);
        const stampMaterial = new THREE.MeshBasicMaterial({
          map: stampTexture,
          side: 0.1,
        });
        const stampMesh = new THREE.Mesh(stampGeometry, stampMaterial);
        stampMesh.position.set(0, -0.6, 0.36); // Ajustar la posición sobre la base
        // stampMesh.rotation.x = -Math.PI / 2;

        // Agrupar en un trofeo
        const trophy = new THREE.Group();
        trophy.add(baseMesh);
        trophy.add(stemMesh);
        trophy.add(cupMesh);
        trophy.add(stampMesh);

        return trophy;
      };

      // Crear trofeo
      const trophy = createTrophyGeometry();
      trophy.position.set(...position);
      trophy.userData = { id, gameCompleted, type: 'trophy' };
      trophyRef.current = trophy;

      // Añadir el nombre del juego en el trofeo
      const textGeometry = new TextGeometry(gameName || id, {
        font: font,
        size: 0.095,
        depth: 0.03,
        curveSegments: 12,
      });

      // Centrar el texto sobre la estampa
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-textWidth / 2, -0.65, 0.34);

      trophy.add(textMesh);

      scene.add(trophy);
    });

    return () => {
      scene.remove(trophyRef.current);
    };
  }, [position, id, scene, gameCompleted, gameName, cupMaterialType]);

  return null; // No renderiza JSX en el DOM de React, todo es gestionado en Three.js
};

Trophy.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scene: PropTypes.instanceOf(THREE.Scene).isRequired,
  gameCompleted: PropTypes.bool,
  gameName: PropTypes.string,
  cupMaterialType: PropTypes.oneOf(['bronze', 'silver', 'gold', 'diamond']).isRequired,
};

export default Trophy;
