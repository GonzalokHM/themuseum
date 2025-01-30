import * as THREE from 'three'

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
    { x: -4.9, y: 0, z: 1, id: 'game3', name: 'Obra de Arte 3' },
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
      name: 'Hall of Fame game-3',
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
  })
}

export const createTrophies = (scene, completedGames) => {
  const trophies = [
    {
      id: 'trophy1Puzzle',
      position: [-3, 0, -3],
      gameCompleted: completedGames.puzzle,
      gameName: 'Puzzle',
      cupMaterialType: 'bronze'
    },
    {
      id: 'trophy2Racer',
      position: [-1, 0, -3],
      gameCompleted: completedGames.racer,
      gameName: 'Racer',
      cupMaterialType: 'silver'
    },
    {
      id: 'trophy3',
      position: [1, 0, -3],
      gameCompleted: completedGames.game3,
      gameName: 'Game3',
      cupMaterialType: 'gold'
    },
    {
      id: 'trophy4All',
      position: [3, 0, -3],
      gameCompleted: completedGames.allGames,
      gameName: 'AllGames',
      cupMaterialType: 'diamond'
    }
  ]

  return trophies.map(
    ({ id, position, gameCompleted, gameName, cupMaterialType }) =>
      gameCompleted
        ? new Trophy({ id, position, gameName, cupMaterialType, scene })
        : null
  )
}
