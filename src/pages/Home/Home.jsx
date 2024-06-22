import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToMuseum = () => {
    navigate('/museum');
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenidos al Museo Virtual</h1>
      <p className={styles.description}>
        Explora obras de arte y disfruta de minijuegos interactivos.
      </p>
      <button className={styles.enterButton} onClick={handleNavigateToMuseum}>
        Explorar Ahora
      </button>
    </div>
  );
};

export default Home;
