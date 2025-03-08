import PropTypes from 'prop-types'
import MinigamePuzzle from './Puzzle/GamePuzzle'
import GameRacer from './Racer/GameRacer.jsx'
import { useGlobalState } from './../../context/useGlobalState'
import { getGameScores, updateUserScore } from '../../api/api.js'
import styles from './GameLauncher.module.css'
import { useState } from 'react'
import GameShooter from './Shooter/GameShooter.jsx'

const GameLauncher = ({ artworkId, onGameEnd }) => {
  const { dispatch } = useGlobalState()
  const [gameActive, setGameActive] = useState(true)

  const handleGameEnd = async (score, completed) => {
    if (score === null || isNaN(score) || score <= 0) {
      console.log('handleGAmeEnd nul score', score)
      setGameActive(false)
      onGameEnd(false)
      return
    }
    let finalScore = score
    if (artworkId === 'puzzle') {
      const minutes = Math.floor(score / 60)
      const seconds = score % 60
      finalScore = `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    }
    if (completed || artworkId === 'racer' || artworkId === 'shooter') {
      try {
        const previousScores = await getGameScores(artworkId)
        const bestPreviousScore =
          previousScores?.userScore?.scores[artworkId] || null
        let shouldUpdate = false
        if (!bestPreviousScore) {
          shouldUpdate = true
        } else if (artworkId === 'puzzle') {
          const [prevMin, prevSec] = bestPreviousScore.split(':').map(Number)
          const prevTotalSeconds = prevMin * 60 + prevSec
          if (score < prevTotalSeconds) {
            shouldUpdate = true
          }
        } else {
          if (score > parseFloat(bestPreviousScore)) {
            shouldUpdate = true
          }
        }

        if (shouldUpdate) {
          await updateUserScore(artworkId, finalScore)
        }
        dispatch({ type: 'COMPLETE_GAME', payload: artworkId })
      } catch (error) {
        console.error('Error al finalizar el juego:', error)
      }
    }
    setGameActive(false)
    onGameEnd(completed)
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
      {gameActive && artworkId === 'shooter' && (
        <GameShooter onGameEnd={handleGameEnd} />
      )}
    </div>
  )
}

GameLauncher.propTypes = {
  artworkId: PropTypes.string.isRequired,
  onGameEnd: PropTypes.func.isRequired
}

export default GameLauncher
