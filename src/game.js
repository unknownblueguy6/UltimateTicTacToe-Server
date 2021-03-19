const EventEmitter = require('events')
const Player = require('./player.js')


class Game extends EventEmitter{
    constructor(){
        super();
        this.players = [];
        this.turn = 0;
        this.board = makeEmptyBoard();
    }
    addPlayer(player){
        this.players.push(player);
        if(this.players.length == 2){
            this.emit('started')
        }
    }
}

function makeEmptyBoard(){
    let arr = Array(9);
    arr.fill([]);
    console.log(arr);
    return arr;
}

module.exports = Game;