import * as THREE from 'three'
import { useCallback } from 'react'

const useTrophyInteraction = (
  camera,
  renderer,
  scene,
  setSelectedTrophy,
  completedGames,
  lockTexture
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
      const duration = 5000
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
        const isCompleted = completedGames[trophy.userData.gameId] || false

        console.log('Estado del juego en completedGames:', completedGames)
        console.log(
          'Trofeo seleccionado:',
          trophy.userData,
          'Completado:',
          isCompleted
        )

        if (!isCompleted) {
          const lockGeometry = new THREE.PlaneGeometry(1, 1.8)
          const lockMaterial = new THREE.MeshBasicMaterial({
            map: lockTexture,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false
          })
          const lock = new THREE.Mesh(lockGeometry, lockMaterial)
          lock.userData = { type: 'lock' }
          lock.position.set(0, 0, 0.55)
          lock.renderOrder = 999
          trophy.add(lock)

          console.log('Lock agregado al trofeo:', lock)
        } else {
          rotateTrophy(trophy)
        }
      })
    },
    [moveCameraToTrophy, rotateTrophy, setSelectedTrophy, completedGames]
  )

  return { handleTrophyClick }
}

export default useTrophyInteraction
