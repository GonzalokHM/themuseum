import * as THREE from 'three'
import { useCallback } from 'react'

const useTrophyInteraction = (
  camera,
  renderer,
  scene,
  setSelectedTrophy,
  completedGames
) => {
  const moveCameraToTrophy = useCallback(
    (trophy, onComplete) => {
      const targetPosition = new THREE.Vector3(
        trophy.position.x,
        trophy.position.y,
        trophy.position.z + 2
      )
      const duration = 2
      const startTime = performance.now()

      const animateCamera = (time) => {
        const elapsed = (time - startTime) / 1000
        const t = elapsed / duration
        const smoothT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

        camera.position.lerpVectors(
          camera.position.clone(),
          targetPosition,
          smoothT
        )
        camera.lookAt(trophy.position)
        renderer.render(scene, camera)

        if (t < 1) {
          requestAnimationFrame(animateCamera)
        } else {
          if (onComplete) onComplete()
        }
      }

      requestAnimationFrame(animateCamera)
    },
    [camera, renderer, scene]
  )

  const rotateTrophy = useCallback(
    (trophy) => {
      const duration = 2000
      const startTime = performance.now()

      const animateRotation = (time) => {
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)

        trophy.rotation.y += 0.05

        renderer.render(scene, camera)

        if (progress < 1) {
          requestAnimationFrame(animateRotation)
        }
      }

      requestAnimationFrame(animateRotation)
    },
    [renderer, camera, scene]
  )

  const handleTrophyClick = useCallback(
    (trophy) => {
      setSelectedTrophy(trophy)
      moveCameraToTrophy(trophy, () => {
        const isCompleted = completedGames[trophy.userData.id] || false

        console.log('Estado del juego en completedGames:', completedGames)
        console.log(
          'Trofeo seleccionado:',
          trophy.userData.id,
          'Completado:',
          isCompleted
        )

        if (!isCompleted) {
          const textureLoader = new THREE.TextureLoader()
          const lockImg = textureLoader.load('/img/lock.png')

          const lockGeometry = new THREE.PlaneGeometry(1, 1.8)
          const lockMaterial = new THREE.MeshBasicMaterial({
            map: lockImg,
            side: THREE.DoubleSide,
            transparent: true
          })
          const lock = new THREE.Mesh(lockGeometry, lockMaterial)
          lock.userData = { type: 'lock' }
          lock.position.set(0, 0, 0.55)
          trophy.add(lock)
          console.log('Lock agregado al trofeo:', lock)

          showLockOverlay()
        } else {
          removeLockOverlay()
          rotateTrophy(trophy)
        }
      })
    },
    [moveCameraToTrophy, rotateTrophy, setSelectedTrophy, completedGames]
  )

  const showLockOverlay = () => {
    const lockElement = document.createElement('div')
    lockElement.style.position = 'absolute'
    lockElement.style.top = '50%'
    lockElement.style.left = '50%'
    lockElement.style.transform = 'translate(-50%, -50%)'
    lockElement.style.width = '200px'
    lockElement.style.height = '200px'
    lockElement.style.backgroundImage = 'url(/img/lock.png)'
    lockElement.style.opacity = '0.8'
    lockElement.style.backgroundSize = 'cover'
    lockElement.style.zIndex = '100'
    lockElement.id = 'lockOverlay'

    document.body.appendChild(lockElement)
  }

  return { handleTrophyClick }
}

const removeLockOverlay = () => {
  const lockElement = document.getElementById('lockOverlay')
  if (lockElement) {
    document.body.removeChild(lockElement)
  }
}

export default useTrophyInteraction
