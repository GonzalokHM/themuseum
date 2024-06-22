import PropTypes from 'prop-types';
import MinigamePuzzle from './Puzzle/GamePuzzle';


const GameLauncher = ({ artworkId }) => {
  switch (artworkId) {
    case 'artwork-1':
      return <MinigamePuzzle />;
    // Agrega más casos para otros juegos aquí
    default:
      return <p>Juego no disponible para esta obra de arte.</p>;
  }
};

GameLauncher.propTypes = {
  artworkId: PropTypes.string.isRequired,
};

export default GameLauncher;
