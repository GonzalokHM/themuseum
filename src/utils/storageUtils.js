
const scoresDefault = [
    { game: 'puzzle', player: 'Alex', score: '2:28' },
    { game: 'Juego 2', player: 'Emma', score: 950 },
    { game: 'Juego 3', player: 'Sophia', score: 900 },
    { game: 'Juego 2', player: 'Liam', score: 750 },
    { game: 'puzzle', player: 'Olivia', score: '2:35' },
    { game: 'Juego 2', player: 'Noah', score: 920 },
    { game: 'Juego 3', player: 'Ava', score: 880 },
    { game: 'puzzle', player: 'Mason', score: '2:20' },
    { game: 'Juego 3', player: 'Isabella', score: 830 },
  ];

  export const getHighScores = (gameId) => {
    const scores = localStorage.getItem(`highScores_${gameId}`);
    const highScores = scores ? JSON.parse(scores) : [];
    const defaultScores = scoresDefault.filter(score => score.game === gameId);
  
    const combinedScores = [...highScores, ...defaultScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  
    return combinedScores;
  };
  
  export const saveHighScore = (gameId, username, score) => {
    const highScores = getHighScores(gameId);
    const userScoreIndex = highScores.findIndex((s) => s.username === username);
    if (userScoreIndex >= 0) {
      highScores[userScoreIndex].score = Math.max(highScores[userScoreIndex].score, score);
    } else {
      highScores.push({ username, score });
    }
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 3) {
      highScores.length = 3;
    }
    localStorage.setItem(`highScores_${gameId}`, JSON.stringify(highScores));
  };
  
  export const getUserScore = (gameId, username) => {
    const highScores = getHighScores(gameId);
    return highScores.find((s) => s.username === username);
  };