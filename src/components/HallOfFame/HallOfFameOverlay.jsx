import PropTypes from 'prop-types';
import HallOfFame from './HallOfFame';
import styles from './HallOfFame.module.css';
import {getHighScores, getUserScore } from '../../utils/ScoreFunctions';

const HallOfFameOverlay = ({ currentHallOfFame, username, handleNextHallOfFame }) => {
  return (
    <>
      
        <div className={styles.hallOfFameOverlay}>
          <HallOfFame
            gameId={currentHallOfFame}
            rankings={getHighScores(currentHallOfFame)}
            userScore={getUserScore(currentHallOfFame, username) || { name: username || 'Anonymous', score: 'N/A' }}
          />
          <button onClick={handleNextHallOfFame} className={styles.nextButton}>
            Siguiente Cuadro
          </button>
        </div>
    
    </>
  );
};

HallOfFameOverlay.propTypes = {
  currentHallOfFame: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  handleNextHallOfFame: PropTypes.func.isRequired,
};

export default HallOfFameOverlay;
