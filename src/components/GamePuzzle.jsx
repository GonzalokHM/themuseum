import { useState, useEffect } from 'react';
import './gamePuzzle.css';

const MinigamePuzzle = () => {
  const [pieces, setPieces] = useState(shufflePieces());
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    checkSolution();
  }, [pieces]);

  const handlePieceClick = (index) => {
    const emptyIndex = pieces.indexOf(null);
    const isAdjacent = [index - 1, index + 1, index - 3, index + 3].includes(emptyIndex);

    if (isAdjacent) {
      const newPieces = [...pieces];
      [newPieces[emptyIndex], newPieces[index]] = [newPieces[index], newPieces[emptyIndex]];
      setPieces(newPieces);
    }
  };

  const checkSolution = () => {
    const solved = pieces.slice(0, -1).every((piece, index) => piece === index + 1);
    setIsSolved(solved);
  };

  return (
    <div>
      <h2>Rompecabezas</h2>
      {isSolved ? <p>¡Felicidades, has resuelto el rompecabezas!</p> : null}
      <div className="puzzle">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`puzzle-piece ${piece === null ? 'empty' : ''}`}
            onClick={() => handlePieceClick(index)}
          >
            {piece}
          </div>
        ))}
      </div>
    </div>
  );
};

const shufflePieces = () => {
  const pieces = [...Array(8).keys()].map(x => x + 1).concat(null);
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
};

export default MinigamePuzzle;
