import { useParams } from 'react-router-dom';
import GameLauncher from '../../components/Games/GameLauncher';
import styles from './ArtWorkDetail.module.css'

const ArtworkDetail = () => {
  const { id } = useParams();

  return (
    <div className={styles.artworkDetail}>
      <h1 className={styles.title}>Detalle de la Obra de Arte</h1>
      <p className={styles.artworkId}>ID de la obra de arte: {id}</p>
      <div className={styles.details}>
        <p className={styles.detailText}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          voluptatem quam
        </p>
        <div className={styles.gameContainer}>
          <GameLauncher artworkId={id} />
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
