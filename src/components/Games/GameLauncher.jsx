import PropTypes from 'prop-types';
import { saveHighScore } from '../../utils/ScoreFunctions.js';
import MinigamePuzzle from './Puzzle/GamePuzzle';
import GameRacer from './Racer/GameRacer.jsx';
import { useGlobalState } from './../../context/useGlobalState';

const GameLauncher = ({ artworkId, onGameEnd }) => {
  const { dispatch } = useGlobalState();
  const gameId = artworkId; //El artworkId coincide con el gameId

  const handleGameEnd = (score) => {
    const username = 'User';
    saveHighScore(gameId, username, score);
    onGameEnd(); // Notificar al componente padre que el juego ha terminado
  };

  const handleGameComplete = () => {
    dispatch({ type: 'COMPLETE_GAME', payload: gameId });
  };

  switch (artworkId) {
    case 'puzzle':
      return (
        <MinigamePuzzle
          onGameEnd={handleGameEnd}
          onGameComplete={handleGameComplete}
        />
      );
    case 'racer':
      return (
        <GameRacer
          onGameEnd={handleGameEnd}
          onGameComplete={handleGameComplete}
        />
      );
    // Agregar el resto de juegos!!!
    default:
      return <p>Juego no disponible para esta obra de arte.</p>;
  }
};

GameLauncher.propTypes = {
  artworkId: PropTypes.string.isRequired,
  onGameEnd: PropTypes.func.isRequired,
};

export default GameLauncher;
