const http = require('http');
const WebSocket = require('ws');
const Player = require('./player.js')
const Game = require('./game.js')

const port = process.env.PORT || 3000;
const server = http.createServer();
const wss = new WebSocket.Server({server});

let game = new Game;

wss.on('connection', (ws)=>{
    if(game.players.length < 2){
        game.addPlayer(new Player(ws));
    }

    else if(game.players.length == 2){
        ws.close()
    }

});

game.on('started', () => {
    console.log('game started');
    game.players.forEach(player => player.socket.send('game started!'));
    game.players[game.turn].socket.send('Your turn!');
});

game.on('move', ()=>{
    game.players.forEach(player => {
        player.socket.on('message', (move) => {
            if(game.players[game.turn] === player){
                const playerMove = JSON.parse(move);
                console.log(playerMove);
                game.makeMove(playerMove);
                game.showBoard();
                game.turn = !game.turn | 0; //toggle between 0 and 1.
                game.players[game.turn].socket.send('Your turn!');
            }
        })
    });
});

game.on('win', ()=>{
    //TODO fininsh 'win' event
    game.players.forEach(player =>{
        player.socket.close()
    })
    game = new Game;
});

game.on('tie', ()=>{
    //TODO finish 'tie' event
    game.players.forEach(player =>{
        player.socket.close()
    })
    game = new Game;
});

server.listen(port, function(){
    console.log(`Server is listening on PORT ${port}`)
})