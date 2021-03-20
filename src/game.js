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
        for(let i = 0; i < 9; i+=3){
            console.log('             ║             ║             ');
            for(let j = 0; j < 9; j+=3){
                let s = '';
                for(let k = 0; k < 3; k++){
                    s += `  ${this.board[i+k][j]} | ${this.board[i+k][j+1]} | ${this.board[i+k][j+2]}  `;
                    if (k < 2){
                        s += '║';
                    }
                }
                console.log(s);
                if(j%3 < 2)
                    console.log(' ---+---+--- ║ ---+---+--- ║ ---+---+---');
            }
            console.log('             ║             ║             ');
            if(i/3 < 2)
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
    // arr[0][0] = 'X';
    // arr[1][1] = '0';
    // arr[2][2] = 'X';
    // arr[3][3] = '0';
    // arr[4][4] = 'X';
    // arr[5][5] = '0';
    // arr[6][6] = 'X';
    // arr[7][7] = '0';
    // arr[8][8] = 'X';
    // console.log(arr);
    return arr;
}

module.exports = Game;