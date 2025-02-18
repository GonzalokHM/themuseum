import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../../context/useGlobalState'
import UserLogin from '../../components/User/UserLogin'
import styles from './Home.module.css'
import { useState } from 'react'

const Home = () => {
  const navigate = useNavigate()
  const { state } = useGlobalState()
  const [isHovered, setIsHovered] = useState(false)

  const handleNavigateToMuseum = () => {
    navigate('/museum')
  }
  return (
    <div className={styles.container}>
      <div
        className={`${styles.overlay} ${isHovered ? styles.reveal : ''}`}
      ></div>
      {state.user && (
        <div className={styles.welcomeCont}>
          <h1 className={styles.title}>Bienvenidos al Museo Virtual</h1>
          <p className={styles.description}>
            Explora obras de arte y disfruta de minijuegos interactivos.
          </p>
        </div>
      )}
      {state.user ? (
        <button
          className={styles.enterButton}
          onClick={handleNavigateToMuseum}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Explorar Ahora
        </button>
      ) : (
        <div className={styles.userLoginCont}>
          <img
            src='/img/homeBackground.jpeg'
            alt='backLogin'
            className={styles.backLoginImg}
          />
          <UserLogin />
        </div>
      )}
    </div>
  )
}

export default Home
