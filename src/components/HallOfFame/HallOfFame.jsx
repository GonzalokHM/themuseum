import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getGameScores } from '../../api/api'
import styles from './HallOfFame.module.css'

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
    <div className={styles.rankCont}>
      <h2>Hall of Fame {gameId}</h2>
      {rankings.length > 0 ? (
        <div className={styles.topCont}>
          <h3 className={styles.topTitle}>Top 3 Scores</h3>
          <ul className={styles.rankList}>
            {rankings.map((player, index) => (
              <li key={index} className={styles.rankItem}>
                {index + 1}. {player.username}: {player.scores[gameId]}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No hay puntuaciones registradas aún para este juego.</p>
      )}

      {userScore && (
        <div className={styles.bestUser}>
          <h3>Tu mejor puntuación</h3>
          <p>{userScore.scores[gameId]}</p>
        </div>
      )}
    </div>
  )
}

HallOfFame.propTypes = {
  gameId: PropTypes.string.isRequired
}

export default HallOfFame
