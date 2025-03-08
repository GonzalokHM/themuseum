const getTrophiesData = (completedGames) => [
  {
    id: 'trophy1Puzzle',
    position: [-3, 0, -3],
    gameId: 'puzzle',
    gameCompleted: completedGames.puzzle,
    gameName: 'Puzzle',
    cupMaterialType: 'bronze'
  },
  {
    id: 'trophy2Racer',
    gameId: 'racer',
    position: [-1, 0, -3],
    gameCompleted: completedGames.racer,
    gameName: 'Racer',
    cupMaterialType: 'silver'
  },
  {
    id: 'trophy3shooter',
    gameId: 'shooter',
    position: [1, 0, -3],
    gameCompleted: completedGames.shooter,
    gameName: 'Shooter',
    cupMaterialType: 'gold'
  },
  {
    id: 'trophy4All',
    position: [3, 0, -3],
    gameCompleted: completedGames.allGames,
    gameName: 'AllGames',
    cupMaterialType: 'diamond'
  }
]

export default getTrophiesData
