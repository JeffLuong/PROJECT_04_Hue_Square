// If browser doesn't support window.localStorage, use window.tempStorage
window.tempStorage = {
  data: {},

  setItem: function(id, val) {
    return this.data[id] = String(val);
  },

  getItem: function(id) {
    if (this.data.hasOwnProperty(id)) {
      return this.data[id];
    } else {
      return undefined;
    }
  },

  removeItem: function(id) {
    return delete this.data[id];
  },

  clearData: function() {
    return this.data = {};
  }
}

function GameData() {
  this.moves = {
    undoMoves: [],
    redoMoves: []
  };
  this.gameState;
  this.dupeBoard;
  this.movesKey = "moves";
  this.gameKey  = "gameState";

  // Test if browser supports window.localStorage
  var browserSupports = this.isLocalStorageSupported();

  if (browserSupports) {
    this.storage = window.localStorage;
  } else {
    this.storage = window.tempStorage;
  };
};

GameData.prototype.isLocalStorageSupported = function() {
  var test    = "works?",
      storage = window.localStorage;

  console.log("testing if local storage is supported...");
  try {
    storage.setItem(test, "yes");
    storage.removeItem(test);
    console.log("supported");
    return true;
  } catch (err) {
    console.log("not supported", err);
    return false;
  }
};

// Game state functions
GameData.prototype.getCurrGame = function() {
  var gameJSON = this.storage.getItem(this.gameKey);
  if (gameJSON) {
    return JSON.parse(gameJSON);
  } else {
    return null;
  };
};

GameData.prototype.storeGame = function(game) {
  console.log("storing game data...");
  this.storage.setItem(this.gameKey, JSON.stringify(game));
  console.log(this.storage);
};

GameData.prototype.deleteGameState = function() {
  this.storage.removeItem(this.gameKey);
};

// Game moves functions
// GameData.prototype.getMovesMade = function() {
  // return this.storage.getItem(this.movesKey)userMoves || [];
// };


// GameData.prototype.storeMove = function(lastMove) {
//   this.moves.undoMoves.unshift(lastMove);
// };

// GameData.prototype.saveMoves = function(moves) {
//   return this.storage.setData(this.movesKey, moves);
// };

GameData.prototype.getMoves = function() {
  return this.storage.setData(this.movesKey) || JSON.stringify({ undoMoves: [], redoMoves: [] });
};



//~~~ This is a different game mode...needs to be finished! ~~~//
// GameData.prototype.generateLevels = function() {
//   console.log("generating levels...");
//   var levels = {
//     1: { winColor: 295, winPos: {x: 1, y: 0}, moves: 1,
//          board: { size: 2, tiles: [ [ [ { color:230, x:0, y:0 } ], [ { color:60, x:0, y:1} ] ],
//                                     [ [ { color:360, x:1, y:0 } ], [ { color:60, x:1, y:1 } ] ] ] } },
//     2: { winColor: 30,  winPos: {x: 0, y: 1}, moves: 1,
//          board: { size: 2, tiles: [ [ [ { color:60, x:0, y:0 } ], [ { color:360, x:0, y:1} ] ],
//                                     [ [ { color:230, x:1, y:0 } ], [ { color:60, x:1, y:1 } ] ] ] } },
//     3: { winColor: 15,  winPos: {x: 2, y: 2}, moves: 2,
//          board: { size: 2, tiles: [ [ [ { color:60, x:0, y:0 } ], [ { color:230, x:0, y:0} ] ],
//                                     [ [ { color:360, x:1, y:0 } ], [ { color:360, x:1, y:1 } ] ] ] } },
//     4: { winColor: 102.5, winPos: {x: 3, y: 3}, moves: 3,
//          board: { size: 3, tiles: [ [ [ { color:60, x:0, y:0 } ], [ { color:230, x:0, y:0} ], [ { color:230, x:0, y:0} ] ],
//                                     [ [ { color:360, x:1, y:0 } ], [ { color:60, x:1, y:1 } ], [ { color:360, x:1, y:1 } ] ]
//                                     [ [ { color:60, x:0, y:0 } ], [ { color:360, x:0, y:0} ], [ { color:60, x:0, y:0} ] ] ] } },
//     5: { board: { size: 3, tiles: [] }, winColor: 30,    winPos: {x: 3, y: 3}, moves: 3 },
//     6: { board: { size: 3, tiles: [] }, winColor: 145,   winPos: {x: 3, y: 3}, moves: 3 }
    // 7: { size: 4, winColor: }

//   };
//   return levels;
// };
