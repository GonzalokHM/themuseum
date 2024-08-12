import PropTypes from 'prop-types';
import {saveHighScore} from '../../utils/storageUtils.js'
import MinigamePuzzle from './Puzzle/GamePuzzle';


const GameLauncher = ({ artworkId, onGameEnd }) => {
  const gameId = artworkId; // Supongamos que el artworkId coincide con el gameId

  const handleGameEnd = (score) => {
    const username = 'User'; 
    saveHighScore(gameId, username, score);
    onGameEnd(); // Notificar al componente padre que el juego ha terminado
  };

  switch (artworkId) {
    case 'puzzle':
      return <MinigamePuzzle onGameEnd = {handleGameEnd} />;
    // Agrega más casos para otros juegos aquí
    default:
      return <p>Juego no disponible para esta obra de arte.</p>;
  }
};

GameLauncher.propTypes = {
  artworkId: PropTypes.string.isRequired,
  onGameEnd: PropTypes.func.isRequired,
};

export default GameLauncher;
