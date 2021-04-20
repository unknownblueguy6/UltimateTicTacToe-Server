const http = require("http");
const WebSocket = require("ws");
const Player = require("./player.js");
const Game = require("./game.js");
const Contract = require("./contract.js");

const port = process.env.PORT || 3000;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let game = new Game();

wss.on("connection", (ws) => {
  if (game.players.length < 2) {
    game.addPlayer(new Player(ws));
  } else if (game.players.length == 2) {
    ws.close();
  }
});

game.on("started", () => {
  console.log("game started");
  game.players.forEach((player, index) => {
    const dataObj = {
      gameStateChanged: Contract.gameStateChanges.gameStarted,
      playerTurn: game.turn,
      gridChanged: Contract.gridChangedState.gridUnchanged,
      lastMove: null,
      payload: [index, index ? "X" : "O"],
    };

    player.socket.send(JSON.stringify(dataObj));
  });
  //game.players[game.turn].socket.send("Your turn!");
});

game.on("move", () => {
  game.players.forEach((player) => {
    player.socket.on("message", (move) => {
      if (game.players[game.turn] === player) {
        const playerMove = JSON.parse(move);
        console.log(playerMove);

        const dataObj = {
          gameStateChanged: Contract.gameStateChanges.gameUnchanged,
          playerTurn: game.turn,
          gridChanged: Contract.gridChangedState.gridUnchanged,
          lastMove: playerMove,
          payload: null,
        };

        game.makeMove(playerMove, dataObj);
        // game.showBoard();
        game.turn = !game.turn | 0; //toggle between 0 and 1.
        dataObj.playerTurn = game.turn;
        game.players.forEach((player) => {
          player.socket.send(JSON.stringify(dataObj));
        });
      }
    });
  });
});

game.on("win", (...args) => {
  const dataObj = {
    gameStateChanged: Contract.gameStateChanges.gameEnded,
    playerTurn: game.turn,
    gridChanged: Contract.gridChangedState.gridUnchanged,
    lastMove: args[0],
    payload: [Contract.gameChanges.gameWin, game.winner],
  };
  //TODO fininsh 'win' event
  game.players.forEach((player) => {
    player.socket.send(JSON.stringify(dataObj));
    player.socket.close();
  });
  game = new Game();
});

game.on("tie", () => {
  //TODO finish 'tie' event
  const dataObj = {
    gameStateChanged: Contract.gameStateChanges.gameEnded,
    playerTurn: game.turn,
    gridChanged: Contract.gridChangedState.gridUnchanged,
    lastMove: args[0],
    payload: [Contract.gameChanges.gameTie, game.turn],
  };
  //TODO fininsh 'win' event
  game.players.forEach((player) => {
    player.socket.send(JSON.stringify(dataObj));
    player.socket.close();
  });

  game = new Game();
});

server.listen(port, function () {
  console.log(`Server is listening on PORT ${port}`);
});
