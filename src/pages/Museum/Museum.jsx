import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import useMuseumNavigation from '../../hooks/useMuseumNavigation'
import { useGlobalState } from '../../context/useGlobalState'
import GameLauncher from '../../components/Games/GameLauncher'
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

const Museum = () => {
  const mountRef = useRef(null)
  const [scene, setScene] = useState(null)
  const [camera, setCamera] = useState(null)
  const [renderer, setRenderer] = useState(null)
  const [isGameActive, setIsGameActive] = useState(false)
  const { state, dispatch } = useGlobalState()
  const [currentHallOfFame, setCurrentHallOfFame] = useState(null)
  const [hallOfFameIndex, setHallOfFameIndex] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true)
  const {
    currentArtwork,
    selectedTrophy,
    resetCameraPosition,
    resetSelectedTrophy
  } = useMuseumNavigation(scene, camera, renderer)

  const hallOfFameIds = ['hallPuzzle', 'hallRacer', 'hallshooter']

  useEffect(() => {
    if (!mountRef.current) return

    const { scene, camera, renderer } = setupScene(mountRef.current)
    setupLights(scene)
    createArtworks(scene)
    setScene(scene)
    setCamera(camera)
    setRenderer(renderer)

    return () => {
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!currentArtwork || !renderer || !camera) return

    if (currentArtwork.userData.isHallOfFame) {
      setCurrentHallOfFame(currentArtwork.userData.id)
      dispatch({ type: 'END_GAME' })
    } else {
      dispatch({ type: 'LAUNCH_GAME', payload: currentArtwork.userData.id })
      setIsGameActive(true)
    }
  }, [currentArtwork, renderer, camera, dispatch])

  const handleResetCamera = () => {
    setCurrentHallOfFame(null)
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

  const handleGameEnd = () => {
    setIsGameActive(false)
    dispatch({ type: 'END_GAME' })
  }
  return (
    <div ref={mountRef} className={styles.museum}>
      {isGameActive && state.currentGame && (
        <div className={styles.gameOverlay}>
          <GameLauncher
            artworkId={state.currentGame}
            onGameEnd={handleGameEnd}
          />
          <button onClick={handleGameEnd}>Reiniciar</button>
        </div>
      )}

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
