import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useMuseumNavigation from '../../hooks/useMuseumNavigation'
import { useGlobalState } from '../../context/useGlobalState'
import HallOfFameOverlay from '../../components/HallOfFame/HallOfFameOverlay'
import styles from './Museum.module.css'
import {
  createArtworks,
  moveCameraToHallOfFame,
  setupLights,
  setupScene
} from './museumSetup'
import getTrophiesData from '../../components/trophy/trophyData'
import Trophy from '../../components/trophy/Trophy'
import ArtworkDetail from './ArtWorkDetail/ArtWorkDetail'

const Museum = () => {
  const mountRef = useRef(null)
  const [scene, setScene] = useState(null)
  const [camera, setCamera] = useState(null)
  const [renderer, setRenderer] = useState(null)
  const { state, dispatch } = useGlobalState()
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [currentHallOfFame, setCurrentHallOfFame] = useState(null)
  const [hallOfFameIndex, setHallOfFameIndex] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true)
  const {
    currentArtwork,
    selectedTrophy,
    resetCameraPosition,
    resetSelectedTrophy
  } = useMuseumNavigation(scene, camera, renderer)

  const hallOfFameIds = ['hallpuzzle', 'hallracer', 'hallshooter']

  useEffect(() => {
    const handleResize = () => {
      if (renderer && camera) {
        const container = mountRef.current
        if (container) {
          const width = container.clientWidth
          const height = container.clientHeight
          renderer.setSize(width, height)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [renderer, camera])

  useEffect(() => {
    if (!mountRef.current) return

    const { scene, camera, renderer } = setupScene(mountRef.current)
    setupLights(scene)
    createArtworks(scene)
    setScene(scene)
    setCamera(camera)
    setRenderer(renderer)

    return () => {
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  useEffect(() => {
    if (!currentArtwork || !renderer || !camera) return

    if (currentArtwork.userData.isHallOfFame) {
      setCurrentHallOfFame(currentArtwork.userData.id)
      dispatch({ type: 'END_GAME' })
    } else {
      setSelectedArtwork(currentArtwork.userData.id)
    }
  }, [currentArtwork, renderer, camera, dispatch])

  const handleResetCamera = () => {
    setCurrentHallOfFame(null)
    setSelectedArtwork(null)
    resetSelectedTrophy()
    resetCameraPosition()
  }

  const renderBackButton = () => {
    if (currentArtwork || currentHallOfFame || selectedTrophy) {
      return (
        <button className={styles.backHallButton} onClick={handleResetCamera}>
          Volver al pasillo
        </button>
      )
    }
    return null
  }

  const handleNextHallOfFame = () => {
    moveCameraToHallOfFame(
      scene,
      camera,
      renderer,
      hallOfFameIds,
      hallOfFameIndex,
      setHallOfFameIndex,
      setCurrentHallOfFame,
      setShowOverlay
    )
  }

  return (
    <div ref={mountRef} className={styles.museum}>
      {selectedArtwork && <ArtworkDetail artworkId={selectedArtwork} />}

      {currentHallOfFame && showOverlay && (
        <HallOfFameOverlay
          currentHallOfFame={currentHallOfFame}
          handleNextHallOfFame={handleNextHallOfFame}
        />
      )}

      {scene &&
        getTrophiesData(state.completedGames).map((trophy) => (
          <Trophy
            key={trophy.id}
            id={trophy.id}
            gameId={trophy.gameId}
            position={trophy.position}
            gameCompleted={trophy.gameCompleted}
            gameName={trophy.gameName}
            scene={scene} // 🔹 Pasar la escena correctamente
            cupMaterialType={trophy.cupMaterialType}
          />
        ))}

      {renderBackButton()}
    </div>
  )
}
export default Museum
