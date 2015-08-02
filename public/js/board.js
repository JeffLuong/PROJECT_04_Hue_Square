function Board(GameSize) {
  this.size  = GameSize;
  this.board = this.makeBoard();
};

//~~~~~~ Make a board ~~~~~~//
Board.prototype.makeBoard = function() {
  console.log("making board...");
  var squares = [];

  for (var xPos = 1; xPos < this.size + 1; xPos++) {
    //~~~~~~ Make rows ~~~~~~//
    var row = squares[xPos] = [];

    for (var yPos = 1; yPos < this.size + 1; yPos++) {
      row.push(null);
    };
  };
  return squares;
};

//~~~~~~ Returns position as object ~~~~~~//
Board.prototype.position = function(x, y) {
  return {x: x, y: y};
};

//~~~~~~ Add tile to board with x & y coords ~~~~~~//
Board.prototype.addTile = function(tile) {
  this.board[tile.x][tile.y] = tile;
};
