import PropTypes from 'prop-types';
import styles from './HallOfFame.module.css';

const HallOfFame = ({ gameId, rankings, userScore }) => {
  const userInTop3 = rankings.some((player) => player.name === userScore.name);

  return (
    <div className={styles.hallOfFame}>
      <h3>{`Ranking del Juego ${gameId}`}</h3>
      <ol className={styles.rankList}>
        {rankings.map((player, index) => (
          <li key={index} className={styles.rankItem}>
            <span className={styles.playerName}>{player.name || 'N/A'}</span>:
            <span className={styles.playerScore}>{player.score || 'N/A'}</span>
          </li>
        ))}
      </ol>
      {!userInTop3 && (
        <div className={styles.userScore}>
          <span className={styles.playerName}>{userScore.name || 'N/A'}</span>:
          <span className={styles.playerScore}>{userScore.score || 'N/A'}</span>
        </div>
      )}
    </div>
  );
};

HallOfFame.propTypes = {
  gameId: PropTypes.string.isRequired,
  rankings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  userScore: PropTypes.shape({
    name: PropTypes.string.isRequired,
    score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default HallOfFame;
