import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getGameScores } from '../../api/api'

const HallOfFame = ({ gameId }) => {
  const [rankings, setRankings] = useState([])
  const [userScore, setUserScore] = useState(null)

  useEffect(() => {
    const fetchScores = async () => {
      const data = await getGameScores(gameId)
      if (data) {
        setRankings(data.top3)
        setUserScore(data.userScore)
      }
    }

    fetchScores()
  }, [gameId])

  return (
    <div>
      <h2>Hall of Fame ${gameId}</h2>
      {rankings.length > 0 ? (
        <div>
          <h3>Top 3 Scores</h3>
          <ol>
            {rankings.map((player, index) => (
              <li key={index}>
                {index + 1}. {player.username}: {player.score}
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p>No hay puntuaciones registradas aún para este juego.</p>
      )}

      {userScore &&
        !rankings.some((score) => score.name === userScore.name) && (
          <div>
            <h3>Tu mejor puntuación</h3>
            <p>{userScore.score}</p>
          </div>
        )}
    </div>
  )
}

HallOfFame.propTypes = {
  gameId: PropTypes.string.isRequired
}

export default HallOfFame
