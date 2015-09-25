function Board(gameSize) {
  this.size  = gameSize;
  this.board = this.makeBoard();
};

//~~~~~~ Make a board ~~~~~~//
Board.prototype.makeBoard = function() {
  var emptyBoard = [];

  for (var x = 0; x < this.size; x++) {
    //~~~~~~ Make rows ~~~~~~//
    var row = emptyBoard[x] = [];
    //~~~~~~ Make squares in rows ~~~~~~//
    for (var y = 0; y < this.size; y++) {
      row.push(null);
    };
  };
  return emptyBoard;
};

Board.prototype.dupeBoard = function () {
  var duplicateBoard = new Board(this.size);

  for (var row = 0; row < duplicateBoard.size; row++) {
    for (var col = 0; col < duplicateBoard.size; col++) {
      var duplicateTile = this.board[row][col].dupeTile();
      duplicateBoard.addTile(duplicateTile);
    };
  };

  return duplicateBoard;
};

//~~~~~~ Returns position as object ~~~~~~//
Board.prototype.position = function(y, x) { //<<< have to pass to x, y reversed
  return {x: x, y: y};
};

//~~~~~~ Add tile to board with x & y coords ~~~~~~//
Board.prototype.addTile = function(tile) {
  console.log("adding tile to board...");
  this.board[tile.x][tile.y] = tile;
};

//~~~~~~ Check if move is in bounds of board (will return true or false) ~~~~~~//
Board.prototype.inBounds = function(position) {
  return position.x >= 0 && position.y >= 0 && position.x < this.size && position.y < this.size;
};

//~~~~~~ Serialize current board ~~~~~~//
Board.prototype.serializeBoard = function() {
  //~~~~ Create board copy to store ~~~~//
  var currBoard = [];
  var currState;
  for (var x = 0; x < this.size; x++) {
    var row = currBoard[x] = [];
    for (var y = 0; y < this.size; y++) {
      row.push(this.board[x][y]);
    };
  };

  //~~~ Save current board in object ~~~//
  currState = {
    size: this.size,
    savedBoard: currBoard
  };

  return currState;
};
