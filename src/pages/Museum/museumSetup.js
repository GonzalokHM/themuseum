import * as THREE from 'three'
import Trophy from '../../components/trophy/Trophy'

const createWalls = (scene) => {
  const wallGeometry = new THREE.PlaneGeometry(10, 5)
  const wallMaterial = new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide
  })

  const backWall = new THREE.Mesh(wallGeometry, wallMaterial)
  backWall.position.set(0, 0, -5)

  const leftWall = new THREE.Mesh(wallGeometry, wallMaterial)
  leftWall.position.set(-5, 0, 0)
  leftWall.rotation.y = Math.PI / 2

  const rightWall = new THREE.Mesh(wallGeometry, wallMaterial)
  rightWall.position.set(5, 0, 0)
  rightWall.rotation.y = -Math.PI / 2

  scene.add(backWall)
  scene.add(leftWall)
  scene.add(rightWall)
}

export const setupScene = (mountNode) => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  mountNode.appendChild(renderer.domElement)

  camera.position.set(0, 0, 5)

  createWalls(scene)

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  animate()
  return { scene, camera, renderer }
}

export const setupLights = (scene) => {
  const light = new THREE.PointLight(0xffffff, 1)
  light.position.set(0, 2, 2)
  scene.add(light)

  const positions = [
    [-2, 0.5, -3],
    [0, 0.5, -3],
    [2, 0.5, -3],
    [-3, 0.5, -2],
    [-1, 0.6, -2],
    [1, 0.6, -2],
    [3, 0.6, -2]
  ]

  positions.forEach(([x, y, z]) => {
    const trophyLight = new THREE.PointLight(0xffffff, 1, 100)
    trophyLight.position.set(x, y, z)
    scene.add(trophyLight)
  })
}

export const createArtworks = (scene) => {
  const artworks = [
    { x: -4.9, y: 0, z: -3, id: 'puzzle', name: 'Obra de Arte 1' },
    { x: -4.9, y: 0, z: -1, id: 'racer', name: 'Obra de Arte 2' },
    { x: -4.9, y: 0, z: 1, id: 'shooter', name: 'Obra de Arte 3' },
    {
      x: 4.9,
      y: 1.5,
      z: -2,
      id: 'hallPuzzle',
      name: 'Hall of Fame Puzzle',
      isHallOfFame: true
    },
    {
      x: 4.9,
      y: 0,
      z: -2,
      id: 'hallRacer',
      name: 'Hall of Fame Racer',
      isHallOfFame: true
    },
    {
      x: 4.9,
      y: -1.5,
      z: -2,
      id: 'hall3',
      name: 'Hall of Fame shooter',
      isHallOfFame: true
    }
  ]

  artworks.forEach(({ x, y, z, id, name, isHallOfFame }) => {
    const geometry = new THREE.PlaneGeometry(1, 1.5)
    const material = new THREE.MeshBasicMaterial({
      color: isHallOfFame ? 0xffff00 : 0xffffff,
      side: THREE.DoubleSide
    })
    const artwork = new THREE.Mesh(geometry, material)
    artwork.position.set(x, y, z)
    artwork.rotation.y = isHallOfFame ? -Math.PI / 2 : Math.PI / 2
    artwork.userData = { id, name, isHallOfFame, type: 'artwork' }
    scene.add(artwork)

    const frameThickness = 0.1
    const frameDepth = 0.05

    const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

    const topBottomGeometry = new THREE.BoxGeometry(
      1 + frameThickness * 2,
      frameDepth,
      frameThickness
    )

    const topFrame = new THREE.Mesh(topBottomGeometry, frameMaterial)
    topFrame.position.set(x, y + 0.75, z + frameDepth / 2)

    const bottomFrame = new THREE.Mesh(topBottomGeometry, frameMaterial)
    bottomFrame.position.set(x, y - 0.75, z + frameDepth / 2)

    topFrame.rotation.y = Math.PI / 2
    bottomFrame.rotation.y = Math.PI / 2

    scene.add(topFrame)
    scene.add(bottomFrame)
  })
}

export const moveCameraToHallOfFame = (
  scene,
  camera,
  renderer,
  hallOfFameIds,
  hallOfFameIndex,
  setHallOfFameIndex,
  setCurrentHallOfFame,
  setShowOverlay
) => {
  setShowOverlay(false)

  const cameraPositions = [
    { x: 4, y: 1.5, z: -2 },
    { x: 4, y: 0, z: -2 },
    { x: 4, y: -1.5, z: -2 }
  ]

  let nextIndex = (hallOfFameIndex + 1) % hallOfFameIds.length

  const targetPosition = cameraPositions[nextIndex]

  if (!targetPosition) return

  const startTime = performance.now()
  const duration = 1.5

  const animateCamera = (time) => {
    const elapsed = (time - startTime) / 1000
    const t = Math.min(elapsed / duration, 1)
    const smoothT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    camera.position.lerpVectors(
      camera.position,
      new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
      smoothT
    )

    renderer.render(scene, camera)

    if (t < 1) {
      requestAnimationFrame(animateCamera)
    } else {
      setTimeout(() => {
        setHallOfFameIndex(nextIndex)
        setCurrentHallOfFame(hallOfFameIds[nextIndex])
        setShowOverlay(true)
      }, 400)
    }
  }

  requestAnimationFrame(animateCamera)
}
