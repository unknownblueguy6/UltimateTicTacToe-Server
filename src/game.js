const EventEmitter = require('events')
const Player = require('./player.js')


class Game extends EventEmitter{
    constructor(){
        super();
        this.players = [];
        this.turn = 0;
        this.board = makeEmptyBoard();
        this.showBoard()
    }
    addPlayer(player){
        this.players.push(player);
        if(this.players.length == 2){
            this.emit('started')
        }
    }
    showBoard(){
        for(let i = 0; i < 3; ++i){
            for(let j = 0; j < 3; ++j){
                let s = '';
                for(let k = 3*j; k < 3*j + 3; ++k){
                    s += `  ${this.board[j][k]} | ${this.board[j+1][k]} | ${this.board[j+2][k]}  `;
                    if (k%3 < 2){
                        s += '║';
                    }
                }
                console.log(s);
                if(j < 2)
                    console.log(' ---+---+--- ║ ---+---+--- ║ ---+---+---');
            }
            if(i < 2)
                console.log('═════════════╬═════════════╬═════════════');
        }
        console.log()
    }
}

function makeEmptyBoard(){
    let arr = []
    for(let i = 0; i < 9; ++i){
        arr.push([])
        for(let j = 0; j < 9; ++j){
            arr[i].push(' ')
        }
    }
    return arr;
}

module.exports = Game;