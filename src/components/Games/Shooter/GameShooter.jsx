// GameShooter.jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import PropTypes from 'prop-types'
import styles from './gameShooter.module.css'

const GameShooter = ({ onGameEnd }) => {
  const mountRef = useRef(null)
  const requestRef = useRef(null)
  const [score, setScore] = useState(0)

  const scoreRef = useRef(0)
  const [targetCount, setTargetCount] = useState(null)

  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const targetsRef = useRef([])
  const texturesRef = useRef([])

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  const createTarget = useCallback((x, y, z) => {
    const geometry = new THREE.CircleGeometry(0.3, 32)
    const textures = texturesRef.current
    const randomIndex = Math.floor(Math.random() * textures.length)
    const material = new THREE.MeshBasicMaterial({
      map: textures[randomIndex],
      transparent: true
    })
    const target = new THREE.Mesh(geometry, material)
    target.position.set(x, y, z)
    target.userData = { isTarget: true }
    return target
  }, [])

  const addTargets = useCallback(
    (n) => {
      const scene = sceneRef.current
      const newTargets = []
      for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * 4
        const y = (Math.random() - 0.5) * 3
        const target = createTarget(x, y, 0)
        newTargets.push(target)
        scene.add(target)
      }
      targetsRef.current = targetsRef.current.concat(newTargets)
      setTargetCount(targetsRef.current.length)
    },
    [createTarget]
  )

  useEffect(() => {
    const mount = mountRef.current
    const width = mount.clientWidth || 800
    const height = mount.clientHeight || 600

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const texturePaths = [
      '/targets/head-hunting.png',
      '/targets/head-hunting1.png',
      '/targets/head-hunting2.png',
      '/targets/head-hunting3.png'
    ]

    const textureLoader = new THREE.TextureLoader()
    Promise.all(
      texturePaths.map(
        (path) =>
          new Promise((resolve, reject) => {
            textureLoader.load(path, resolve, undefined, reject)
          })
      )
    ).then((loadedTextures) => {
      texturesRef.current = loadedTextures
      addTargets(5)
    })

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(targetsRef.current)
      if (intersects.length > 0) {
        const target = intersects[0].object
        scene.remove(target)
        targetsRef.current = targetsRef.current.filter((t) => t !== target)
        setTargetCount(targetsRef.current.length)
        setScore((prev) => {
          const newScore = prev + 1
          scoreRef.current = newScore
          return newScore
        })
        if (targetsRef.current.length < 1) {
          addTargets(5)
        }
      }
    }
    renderer.domElement.addEventListener('click', handleClick)

    // Juego finaliza por tiempo (10 segundos)
    const gameTimeout = setTimeout(() => {
      onGameEnd(scoreRef.current, true)
    }, 10000)

    return () => {
      clearTimeout(gameTimeout)
      renderer.domElement.removeEventListener('click', handleClick)
      cancelAnimationFrame(requestRef.current)
      mount.removeChild(renderer.domElement)
    }
  }, [addTargets, onGameEnd])

  return (
    <div className={styles.container} ref={mountRef}>
      <div className={styles.hud}>
        <p>Score: {score}</p>
      </div>
    </div>
  )
}

GameShooter.propTypes = {
  onGameEnd: PropTypes.func.isRequired
}

export default GameShooter
