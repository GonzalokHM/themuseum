const getTrophiesData = (completedGames) => [
  {
    id: 'trophy1Puzzle',
    position: [-3, 0, -3],
    gameCompleted: completedGames.puzzle,
    gameName: 'Puzzle',
    cupMaterialType: 'bronze'
  },
  {
    id: 'trophy2Racer',
    position: [-1, 0, -3],
    gameCompleted: completedGames.racer,
    gameName: 'Racer',
    cupMaterialType: 'silver'
  },
  {
    id: 'trophy3shooter',
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
