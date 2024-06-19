import { useParams } from 'react-router-dom';
import GameLauncher from '../components/GameLauncher';

const ArtworkDetail = () => {
  const { id } = useParams();

  return (
    <div className="artwork-detail">
      <h1>Detalle de la Obra de Arte</h1>
      <p>ID de la obra de arte: {id}</p>
      {/* Aquí puedes añadir más detalles sobre la obra de arte */}
      <div className="game-container">
        <GameLauncher artworkId={id} />
      </div>
    </div>
  );
};

export default ArtworkDetail;