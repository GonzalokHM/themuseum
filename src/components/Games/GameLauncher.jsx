import PropTypes from 'prop-types';
import { getHighScores, getUserScore, saveHighScore } from '../../utils/ScoreFunctions.js';
import MinigamePuzzle from './Puzzle/GamePuzzle';
import GameRacer from './Racer/GameRacer.jsx';
import { useGlobalState } from './../../context/useGlobalState';
import HallOfFame from '../HallOfFame/HallOfFame.jsx';
import { useState } from 'react';

const GameLauncher = ({ artworkId, onGameEnd }) => {
  const { dispatch,state } = useGlobalState();
  const gameId = artworkId;
  const username = state.user || localStorage.getItem('username')
  const [rankings, setRankings] = useState([]);
  const [userScore, setUserScore] = useState({ name: username, score: 0 });
  const [gameFinished, setGameFinished] = useState(false);

  const handleGameEnd = (score) => {
    saveHighScore(gameId, username, Math.floor(score));
    setRankings(getHighScores(gameId));
    setUserScore(getUserScore(gameId, username));
    setGameFinished(true);
    onGameEnd();
  };

  const handleGameComplete = () => {
    dispatch({ type: 'COMPLETE_GAME', payload: gameId });
  };

  if (gameFinished) {
    return <HallOfFame gameId={gameId} rankings={rankings} userScore={userScore} />;
  }

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
