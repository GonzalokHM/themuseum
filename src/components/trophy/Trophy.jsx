import * as THREE from 'three'
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import { FontLoader } from 'three/addons/loaders/FontLoader'
import { TextGeometry } from 'three/addons/geometries/TextGeometry'

const Trophy = ({
  id,
  position,
  completedGames,
  scene,
  gameName,
  cupMaterialType
}) => {
  const trophyRef = useRef()

  useEffect(() => {
    const loader = new FontLoader()

    loader.load('/fonts/gentilis.typeface.json', (font) => {
      const createTrophyGeometry = () => {
        const base = new THREE.BoxGeometry(0.7, 0.35, 0.7)
        const stem = new THREE.CylinderGeometry(0.15, 0.25, 0.8, 32)
        const cup = new THREE.SphereGeometry(0.35, 32, 32)

        const textureLoader = new THREE.TextureLoader()

        const bronzeTexture = textureLoader.load('/textures/bronze.jpg')
        const stemMetalTexture = textureLoader.load('/textures/stemMetal.jpg')
        const goldTexture = textureLoader.load('/textures/gold.jpg')
        const silverTexture = textureLoader.load('/textures/silver.jpg')
        const diamondTexture = textureLoader.load('/textures/diamond.jpg')
        const stampTexture = textureLoader.load('/textures/stamp.jpg')

        // Materiales
        const baseMaterial = new THREE.MeshPhongMaterial({
          color: 0x888888,
          shininess: 100
        })
        const stemMaterial = new THREE.MeshPhongMaterial({
          map: stemMetalTexture,
          shininess: 100
        })

        let cupMaterial
        switch (cupMaterialType) {
          case 'bronze':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: bronzeTexture,
              shininess: 100
            })
            break
          case 'silver':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: silverTexture,
              shininess: 100
            })
            break
          case 'gold':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: goldTexture,
              shininess: 100
            })
            break
          case 'diamond':
            cupMaterial = new THREE.MeshPhongMaterial({
              map: diamondTexture,
              shininess: 100
            })
            break
          default:
            cupMaterial = new THREE.MeshPhongMaterial({
              color: 0xffffff,
              shininess: 100
            })
        }

        const baseMesh = new THREE.Mesh(base, baseMaterial)
        const stemMesh = new THREE.Mesh(stem, stemMaterial)
        const cupMesh = new THREE.Mesh(cup, cupMaterial)

        baseMesh.position.y = -0.6
        stemMesh.position.y = -0.1
        cupMesh.position.y = 0.7

        const stampGeometry = new THREE.PlaneGeometry(0.6, 0.3)
        const stampMaterial = new THREE.MeshBasicMaterial({
          map: stampTexture,
          side: 0.1
        })
        const stampMesh = new THREE.Mesh(stampGeometry, stampMaterial)
        stampMesh.position.set(0, -0.6, 0.36)
        // stampMesh.rotation.x = -Math.PI / 2;

        const trophy = new THREE.Group()
        trophy.add(baseMesh)
        trophy.add(stemMesh)
        trophy.add(cupMesh)
        trophy.add(stampMesh)

        return trophy
      }

      const trophy = createTrophyGeometry()
      trophy.position.set(...position)
      trophy.userData = { id, completedGames, type: 'trophy' }
      trophyRef.current = trophy

      const textGeometry = new TextGeometry(gameName || id, {
        font: font,
        size: 0.095,
        depth: 0.03,
        curveSegments: 12
      })

      textGeometry.computeBoundingBox()
      const textWidth =
        textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const textMesh = new THREE.Mesh(textGeometry, textMaterial)
      textMesh.position.set(-textWidth / 2, -0.65, 0.34)

      trophy.add(textMesh)

      scene.add(trophy)
    })

    return () => {
      scene.remove(trophyRef.current)
    }
  }, [position, id, scene, completedGames, gameName, cupMaterialType])

  return null // No renderiza JSX en el DOM de React, todo es gestionado en Three.js
}

Trophy.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scene: PropTypes.instanceOf(THREE.Scene).isRequired,
  completedGames: PropTypes.bool,
  gameName: PropTypes.string,
  cupMaterialType: PropTypes.oneOf(['bronze', 'silver', 'gold', 'diamond'])
    .isRequired
}

export default Trophy
