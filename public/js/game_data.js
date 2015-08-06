function GameData() {
  console.log("game data being stored...");
  this.moves = {
    undoMoves: [],
    redoMoves: []
  };
  this.gameState;
  this.levels = this.generateLevels();
};

GameData.prototype.generateLevels = function() {
  console.log("generating levels...");
  var levels = {
    1: { winColor: 295, winPos: {x: 1, y: 0}, moves: 1,
         board: { size: 2, tiles: [ [ [ { color:230, x:0, y:0 } ], [ { color:60, x:0, y:1} ] ],
                                    [ [ { color:360, x:1, y:0 } ], [ { color:60, x:1, y:1 } ] ] ] } },
    2: { winColor: 30,  winPos: {x: 0, y: 1}, moves: 1,
         board: { size: 2, tiles: [ [ [ { color:60, x:0, y:0 } ], [ { color:360, x:0, y:1} ] ],
                                    [ [ { color:230, x:1, y:0 } ], [ { color:60, x:1, y:1 } ] ] ] } },
    3: { winColor: 15,  winPos: {x: 2, y: 2}, moves: 2,
         board: { size: 2, tiles: [ [ [ { color:60, x:0, y:0 } ], [ { color:230, x:0, y:0} ] ],
                                    [ [ { color:360, x:1, y:0 } ], [ { color:360, x:1, y:1 } ] ] ] } },
    4: { winColor: 102.5, winPos: {x: 3, y: 3}, moves: 3,
         board: { size: 3, tiles: [ [ [ { color:60, x:0, y:0 } ], [ { color:230, x:0, y:0} ], [ { color:230, x:0, y:0} ] ],
                                    [ [ { color:360, x:1, y:0 } ], [ { color:60, x:1, y:1 } ], [ { color:360, x:1, y:1 } ] ]
                                    [ [ { color:60, x:0, y:0 } ], [ { color:360, x:0, y:0} ], [ { color:60, x:0, y:0} ] ] ] } },
    5: { board: { size: 3, tiles: [] }, winColor: 30,    winPos: {x: 3, y: 3}, moves: 3 },
    6: { board: { size: 3, tiles: [] }, winColor: 145,   winPos: {x: 3, y: 3}, moves: 3 }
    // 7: { size: 4, winColor: }

  };
  return levels;
};

GameData.prototype.storeMove = function(lastMove) {
  //~~~ Stores last move made ~~~//
  this.moves.undoMoves.unshift(lastMove);
};

GameData.prototype.storeGame = function(game) {
  this.gameState = game;
};

GameData.prototype.getCurrGame = function() {
  console.log("current game loading...");
};
