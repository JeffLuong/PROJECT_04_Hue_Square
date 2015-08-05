function GameData() {
  console.log("game data being stored...");
  this.moves = {
    undoMoves: [],
    redoMoves: []
  };
  this.gameState;
};

GameData.prototype.storeMove = function(lastMove) {
  //~~~ Stores last move made ~~~//
  this.moves.undoMoves.unshift(lastMove);
};

GameData.prototype.storeGame = function(game) {
  this.gameState = game;
};

GameData.prototype.returnLastMoves = function() {

};
