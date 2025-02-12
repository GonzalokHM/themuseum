import PropTypes from 'prop-types'
import HallOfFame from './HallOfFame'
import styles from './HallOfFame.module.css'

const HallOfFameOverlay = ({ currentHallOfFame, handleNextHallOfFame }) => {
  const cleanedGameId = currentHallOfFame.replace('hall', '').toLowerCase()
  return (
    <div className={styles.hallOfFameOverlay}>
      <HallOfFame gameId={cleanedGameId} />
      <button onClick={handleNextHallOfFame} className={styles.nextButton}>
        Siguiente Cuadro
      </button>
    </div>
  )
}

HallOfFameOverlay.propTypes = {
  currentHallOfFame: PropTypes.string.isRequired,
  handleNextHallOfFame: PropTypes.func.isRequired
}

export default HallOfFameOverlay
