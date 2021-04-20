const EventEmitter = require("events");
const Player = require("./player.js");
const Contract = require("./contract");

const X = "X";
const O = "O";
const TIE = "T";
const EMPTY = " ";

class Game extends EventEmitter {
  constructor() {
    super();
    this.players = [];
    this.turn = 0;
    this.board = makeEmptyBoard();
    this.winner = null;
    // this.showBoard();
  }
  addPlayer(player) {
    this.players.push(player);
    if (this.players.length == 2) {
      this.emit("started");
      this.emit("move");
    }
  }
  makeMove(move, dataObj) {
    const token = this.turn ? X : O;
    if (this.board[move[0]][move[1]] === EMPTY)
      this.board[move[0]][move[1]] = token;
    if (isGridWon(this.board[move[0]])) {
      console.log(`Player ${this.turn} captured Cell ${move[0]}!`);
      this.board[move[0]] = token;
      dataObj.gridChanged = Contract.gridChangedState.gridChanged;
      dataObj.payload = [Contract.gridChanges.gridWon, move[0]];
    } else if (isGridTied(this.board[move[0]])) {
      console.log(`Cell ${move[0]} has been tied!`);
      this.board[move[0]] = TIE;
      dataObj.gridChanged = Contract.gridChangedState.gridChanged;
      dataObj.payload = [Contract.gridChanges.gridTied, move[0]];
    }
    if (isGridWon(this.board)) {
      console.log(`Player ${this.turn} has Won!!!`);
      this.winner = this.turn;
      this.emit("win", move);
    } else if (isGridTied(this.board)) {
      console.log(`The game is tied!!!`);
      this.emit("tie", move);
    }
  }

  showBoard() {
    for (let i = 0; i < 9; i += 3) {
      console.log("             ║             ║             ");
      for (let j = 0; j < 9; j += 3) {
        let s = "";
        for (let k = 0; k < 3; k++) {
          if (
            this.board[i + k] == X ||
            this.board[i + k] == O ||
            this.board[i + k] == TIE
          )
            s += `  ${this.board[i + k]} | ${this.board[i + k]} | ${
              this.board[i + k]
            }  `;
          else
            s += `  ${this.board[i + k][j]} | ${this.board[i + k][j + 1]} | ${
              this.board[i + k][j + 2]
            }  `;
          if (k < 2) s += "║";
        }
        console.log(s);
        if (j / 3 < 2) console.log(" ---+---+--- ║ ---+---+--- ║ ---+---+---");
      }
      console.log("             ║             ║             ");
      if (i / 3 < 2) console.log("═════════════╬═════════════╬═════════════");
    }
    console.log();
  }
}

function makeEmptyBoard() {
  let arr = [];
  for (let i = 0; i < 9; ++i) {
    arr.push([]);
    for (let j = 0; j < 9; ++j) {
      arr[i].push(EMPTY);
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

function isGridWon(board) {
  for (let i = 0; i < 9; i += 3) {
    const j = i / 3;
    if (
      typeof board[i] === "string" &&
      typeof board[i + 1] === "string" &&
      typeof board[i + 2] === "string"
    )
      if (
        board[i] !== EMPTY &&
        board[i] === board[i + 1] &&
        board[i + 1] === board[i + 2]
      )
        return true;
    if (
      typeof board[j] === "string" &&
      typeof board[j + 3] === "string" &&
      typeof board[j + 6] === "string"
    )
      if (
        board[j] !== EMPTY &&
        board[j] === board[j + 3] &&
        board[j + 3] === board[j + 6]
      )
        return true;
  }
  if (
    typeof board[0] === "string" &&
    typeof board[4] === "string" &&
    typeof board[8] === "string"
  )
    if (board[0] !== EMPTY && board[0] === board[4] && board[4] === board[8])
      return true;
  if (
    typeof board[2] === "string" &&
    typeof board[4] === "string" &&
    typeof board[6] === "string"
  )
    if (board[2] !== EMPTY && board[2] === board[4] && board[4] === board[6])
      return true;
  return false;
}

function isGridTied(board) {
  if (board.includes(EMPTY)) return false;
  board.findIndex((e) => typeof e === "object") == -1;
}

module.exports = Game;
