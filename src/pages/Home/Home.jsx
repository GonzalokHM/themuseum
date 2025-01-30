import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../../context/useGlobalState'
import UserLogin from '../../components/User/UserLogin'
import styles from './Home.module.css'

const Home = () => {
  const navigate = useNavigate()
  const { state } = useGlobalState()

  const handleNavigateToMuseum = () => {
    navigate('/museum')
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenidos al Museo Virtual</h1>
      <p className={styles.description}>
        Explora obras de arte y disfruta de minijuegos interactivos.
      </p>
      {state.user ? (
        <button className={styles.enterButton} onClick={handleNavigateToMuseum}>
          Explorar Ahora
        </button>
      ) : (
        <UserLogin />
      )}
    </div>
  )
}

export default Home
