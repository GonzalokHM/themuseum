import PropTypes from 'prop-types'
import MinigamePuzzle from './Puzzle/GamePuzzle'
import GameRacer from './Racer/GameRacer.jsx'
import { useGlobalState } from './../../context/useGlobalState'
import HallOfFame from '../HallOfFame/HallOfFame.jsx'
import { useState } from 'react'
import { getGameScores, updateUserScore } from '../../api/api.js'

const GameLauncher = ({ artworkId, onGameEnd }) => {
  const { dispatch } = useGlobalState()
  const [rankings, setRankings] = useState([])
  const [userScore, setUserScore] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGameEnd = async (score) => {
    setLoading(true)

    const response = await updateUserScore(artworkId, Math.floor(score))
    if (response) {
      console.log('Puntuación guardada correctamente:', response)
    }

    const updatedScores = await getGameScores(artworkId)
    if (updatedScores) {
      setRankings(updatedScores.top3)
      setUserScore(updatedScores.userScore)
    }

    setLoading(false)
    onGameEnd()
  }

  const handleGameComplete = () => {
    dispatch({ type: 'COMPLETE_GAME', payload: gameId })
  }

  useEffect(() => {
    // Obtener los rankings al cargar el juego
    const fetchScores = async () => {
      const scores = await getGameScores(artworkId)
      if (scores) {
        setRankings(scores.top3)
        setUserScore(scores.userScore)
      }
    }
    fetchScores()
  }, [artworkId])

  if (loading) {
    return <p className={styles.loading}>Cargando resultados...</p>
  }

  if (userScore) {
    return (
      <HallOfFame
        gameId={artworkId}
        rankings={rankings}
        userScore={userScore}
      />
    )
  }

  switch (artworkId) {
    case 'puzzle':
      return (
        <MinigamePuzzle
          onGameEnd={handleGameEnd}
          onGameComplete={handleGameComplete}
        />
      )
    case 'racer':
      return (
        <GameRacer
          onGameEnd={handleGameEnd}
          onGameComplete={handleGameComplete}
        />
      )
    default:
      return (
        <p className={styles.unavailable}>
          Juego no disponible para esta obra de arte.
        </p>
      )
  }
}

GameLauncher.propTypes = {
  artworkId: PropTypes.string.isRequired,
  onGameEnd: PropTypes.func.isRequired
}

export default GameLauncher
