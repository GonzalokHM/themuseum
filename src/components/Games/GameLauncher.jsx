import PropTypes from 'prop-types'
import MinigamePuzzle from './Puzzle/GamePuzzle'
import GameRacer from './Racer/GameRacer.jsx'
import { useGlobalState } from './../../context/useGlobalState'
import { getGameScores, updateUserScore } from '../../api/api.js'
import styles from './GameLauncher.module.css'
import { useState } from 'react'

const GameLauncher = ({ artworkId, onGameEnd }) => {
  const { dispatch } = useGlobalState()
  const [gameActive, setGameActive] = useState(true)

  const handleGameEnd = async (score, completed) => {
    if (score === null || isNaN(score) || score <= 0) return
    if (completed || artworkId === 'racer' || artworkId === 'shooter') {
      try {
        const previousScores = await getGameScores(artworkId)
        const bestPreviousScore =
          previousScores?.userScore?.scores[artworkId] || null
        if (!bestPreviousScore || score > parseFloat(bestPreviousScore)) {
          await updateUserScore(artworkId, Math.floor(score))
        }
        dispatch({ type: 'COMPLETE_GAME', payload: artworkId })
      } catch (error) {
        console.error('Error al finalizar el juego:', error)
      }
    }
    setGameActive(false)
    setTimeout(() => {
      onGameEnd()
    }, 100)
  }

  return (
    <div className={styles.gameContainer}>
      <button
        className={styles.exitButton}
        onClick={() => handleGameEnd(0, false)}
      >
        Finalizar Juego
      </button>

      {gameActive && artworkId === 'puzzle' && (
        <MinigamePuzzle onGameEnd={handleGameEnd} />
      )}
      {gameActive && artworkId === 'racer' && (
        <GameRacer onGameEnd={handleGameEnd} />
      )}
      {/* {artworkId === 'shooter' && <GameShooter onGameEnd={handleGameEnd} />} */}
    </div>
  )
}

GameLauncher.propTypes = {
  artworkId: PropTypes.string.isRequired,
  onGameEnd: PropTypes.func.isRequired
}

export default GameLauncher
