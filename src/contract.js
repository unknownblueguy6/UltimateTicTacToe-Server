const contract = {
  gameStateChanges: {
    gameUnchanged: 0,
    gameStarted: 1,
    gameEnded: 2,
  },

  gameChanges: {
    gameWin: 0,
    gameTie: 1,
  },

  playerTurns: {
    O: 0,
    X: 1,
  },

  gridChangedState: {
    gridUnchanged: 0,
    gridChanged: 1,
  },

  gridChanges: {
    gridWon: 0,
    gridTied: 1,
  },
};

module.exports = contract;
