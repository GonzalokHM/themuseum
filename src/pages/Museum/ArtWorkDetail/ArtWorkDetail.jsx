import PropTypes from 'prop-types'
import GameLauncher from '../../../components/Games/GameLauncher'
import { useState } from 'react'
import styles from './ArtWorkDetail.module.css'
import { useGlobalState } from '../../../context/useGlobalState'

const ArtworkDetail = ({ artworkId }) => {
  const [isGameActive, setIsGameActive] = useState(false)
  const { dispatch } = useGlobalState()

  const gameDescriptions = {
    puzzle:
      'Resuelve este rompecabezas lo más rápido posible. ¡Pon a prueba tu lógica!',
    racer:
      'Conduce tu coche y evita los obstáculos. ¿Hasta donde puedes llegar? controles: girar Izq(a) Dcha(d) acelerar (w) frenar (s)',
    shooter:
      'Dispara a los objetivos y consigue la máxima puntuación. ¡Apunta bien!'
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.artworkDetail}>
        {!isGameActive ? (
          <>
            <h1 className={styles.title}>Detalle del juego</h1>
            <p className={styles.artworkId}> {artworkId}</p>
            <div className={styles.details}>
              <p className={styles.detailText}>
                {gameDescriptions[artworkId] ||
                  'Explora esta obra de arte interactiva.'}
              </p>
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.startButton}
                onClick={() => setIsGameActive(true)}
              >
                Iniciar Juego
              </button>
            </div>
          </>
        ) : (
          <GameLauncher
            artworkId={artworkId}
            onGameEnd={() => {
              dispatch({ type: 'END_GAME' })
              setIsGameActive(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

ArtworkDetail.propTypes = {
  artworkId: PropTypes.string.isRequired
}

export default ArtworkDetail
