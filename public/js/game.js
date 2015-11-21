function Game(GameControls, GameRenderer, GameData) {
  this.controls   = new GameControls;
  this.renderer   = new GameRenderer;
  this.data       = new GameData;
  //~~~~~ red can be 0 or 360 degrees in HSL ~~~~~~//
  //~~~~~ saturation and luminosity values are: 75% and 60% respectively ~~~~~~//
  this.baseColors = [
    360, 230, 60
  ];
  this.userStats = this.data.getUserStats();  // check if user stats are stored
  if (this.userStats) {
    this.setting = this.userStats.level; // refers to difficulty level...if current player's level is saved, load that
  } else {
    this.setting = 1;
  }
  this.score     = 0;
  this.wins      = 0;
  this.totalWins = 0;
  this.rounds    = 2;
  this.levels    = this.initLevels();
  this.initiate(this.setting);
  this.controls.onEvent("move", this.moveUser.bind(this));
  this.controls.onEvent("restart", this.restart.bind(this));
  this.controls.onEvent("nextMap", this.nextMap.bind(this));
  this.controls.onEvent("undo", this.undo.bind(this));
  this.controls.onEvent("redo", this.redo.bind(this));
  this.controls.onEvent("solution", this.showSolution.bind(this));
};

Game.prototype.initiate = function(setting) {
var prevState     = this.data.getCurrGame();
    this.gameOver = false;
    this.won      = false;

  if (prevState) {
    this.board            = new Board(prevState.board.size);
    this.gameBoard        = prevState.board.savedBoard;
    this.size             = prevState.board.size;
    this.movedFromStart   = true;
    this.score            = prevState.score;
    this.totalWins        = prevState.totalWins;
    this.moves            = prevState.moves; // this is an object that has undoMoves and redoMoves arrays
    this.userMoves        = this.moves.undoMoves.length;
    this.aiMoves          = prevState.aiMoves;
    if (this.userStats) {
      this.wins           = this.userStats.wins;
      this.totalWins      = this.userStats.totalWins;
    }
    this.winColor         = prevState.winColor;
    this.winPoint         = prevState.winPoint;
    this.makeTiles(prevState.board.savedBoard);
    this.initUser(prevState.savedPosition);
    this.renderer.initBoard(this.size, prevState.board.savedBoard, this.userTile, this.winColor);
    this.renderer.renderStats(this.userMoves, setting, this.totalWins);
    this.getPreviewColors(prevState.savedPosition);
  } else {
    this.currLevel        = this.levels[setting]; // setting refers to what user passes in as difficulty
    this.size             = this.currLevel.size;
    this.board            = new Board(this.size);
    this.gameBoard        = this.board.board;
    this.movedFromStart   = false;
    this.aiMovedFromStart = false;
    this.userMoves        = 0;
    this.moves            = { undoMoves: [], redoMoves: [] };
    this.aiMoves          = [];
    this.winColor;
    this.makeTiles();
    this.initUser();
    this.genSolution(this.currLevel);
    this.renderer.initBoard(this.size, this.gameBoard, this.userTile, this.winColor);
    this.renderer.renderStats(this.userMoves, this.setting, this.totalWins);
    this.startPoint = this.getStartPosition(this.size);
    this.getPreviewColors(this.startPoint);
    this.data.storeGame(this.serializeState(this.startPoint));
  };
};

Game.prototype.initLevels = function() {
  var that = this;
  var levels  = {
        1: { scale: 0.80, size: 2, moveRange: { min: 2, max: 4} }, //moveRange is num of moves ai takes
        2: { scale: 0.85, size: 3, moveRange: { min: 3, max: 6} },
        3: { scale: 0.90, size: 4, moveRange: { min: 4, max: 8} },
        4: { scale: 0.92, size: 5, moveRange: { min: 7, max: 14} },
        5: { scale: 0.94, size: 6, moveRange: { min: 8, max: 16} },
        6: { scale: 0.96, size: 7, moveRange: { min: 10, max: 20} },
        winPoint: function(level) {
          return { x: that.levels[level].size - 1, y: that.levels[level].size - 1 };
        }
      };
  return levels;
};

//~~~~~~ Randomly generate colors ~~~~~~//
Game.prototype.genColor = function() {
  return this.baseColors[Math.floor(Math.random() * this.baseColors.length)];
};

//~~~~~~ Make tiles on back-end ~~~~~~//
Game.prototype.makeTiles = function(savedBoard) {
  for (var y = 0; y < this.size; y++) {
    for (var x = 0; x < this.size; x++) {
      if (savedBoard) {
        var color = this.gameBoard[y][x].color;
      } else {
        var color = this.genColor();
      }
      var tile = new Tile(this.board.position(y, x), color);

      this.board.addTile(tile);
    };
  };

};

//~~~~~~ Initiate user ~~~~~~//
Game.prototype.initUser = function(savedPosition) {
  var startPos;
  if (savedPosition) {
    startPos = this.getStartPosition(this.size, savedPosition);
  } else {
    startPos = this.getStartPosition(this.size);
  }
  this.insertUser(this.gameBoard, startPos);
};

//~~~~~~  Game re-start ~~~~~~//
Game.prototype.restart = function() {
  this.data.deleteGameState();
  this.gameOver = false;
  this.renderer.clearMessage();
  var allMoves = this.moves.undoMoves,
      length   = allMoves.length;

  //~~~ Executes all undos ~~~//
  for (var i = 0; i < length; i++) {
    this.undo();
  };

  if (this.won === true) {
    this.renderer.rotateGoal(true, true);
  } else if (this.won === false) {
    this.renderer.rotateGoal(true, false);
  }
  this.won = false;
  this.moves.undoMoves = [];
  this.moves.redoMoves = [];
};

//~~~~~~  Game re-start ~~~~~~//
Game.prototype.nextMap = function() {
  this.gameOver = false;
  this.moves.undoMoves = [];
  this.moves.redoMoves = [];
  this.renderer.removeGameBoard();
  this.initiate(this.setting);
  this.won = false;
};

//~~~~~ Generate user start position ~~~~~//
Game.prototype.getStartPosition = function(size, savedPosition) {
  //~~~ May use this in different game mode where start and win position is rand ~~//
  // var x        = Math.floor(Math.random() * size),
      // y        = Math.floor(Math.random() * size),
  if (savedPosition === undefined) {
    var x        = 0,
        y        = 0,
        position = {x: x, y: y},
        color    = this.gameBoard[x][y].color;
        tile     = new Tile(position, color);

    return tile.startPosition();

  } else if (savedPosition) {
    var x        = savedPosition.x,
        y        = savedPosition.y,
        position = {x: x, y: y},
        color    = this.gameBoard[x][y].color;
        tile     = new Tile(position, color);
        tile.lastPosition = position;

    return tile.startPosition();
  }
};



//~~~~~~ Get color from new position ~~~~~~//
Game.prototype.returnColor = function(position, board) {
  return board[position.x][position.y].color;
};

//~~~~~ Insert user start position ~~~~~//
Game.prototype.insertUser = function(board, position) {
  this.userTile = board[position.x][position.y];
};

//~~~~~~ Move user Tile ~~~~~~//
Game.prototype.moveUser = function(direction, aiPlayer, aiMoves, solution) {
  var position = null,
      vector   = this.getDirection(direction);
  //~~~~~ If game over, do nothing ~~~~~//
  if(this.gameOver) {
    return;
  };

  if (aiMoves) {
    this.renderer.removePreviews();
  }
  //~~~ if real user (non- AI) is playing, execute ~~~//
  if (aiPlayer === undefined) {
    this.moves.redoMoves = [];
    //~~~~~ Get user position ~~~~~//
    if (this.movedFromStart) {
      position = tile.lastPosition;
    } else {
      position = tile.startPosition();
    };
  };


  //~~~ AI moves ~~~//
  if (aiPlayer) {
    if (this.aiMovedFromStart) {
      position = tile.aiLastPosition;
    } else {
      position = tile.startPosition();
    }
    //~~~~~ Move to new position and get new color mix ~~~~~//
    var nextPosition = this.findNextPosition(position, vector);
    var mixedColor;
    if (this.board.inBounds(nextPosition)) {
      //~~~~~ Find color mix of the next position ~~~~~//
      mixedColor = this.findAverage(this.returnColor(position, this.dupeBoard), this.returnColor(nextPosition, this.dupeBoard));
      //~~~~~ Save color of the next position ~~~~~//
      this.dupeBoard[nextPosition.x][nextPosition.y].color = mixedColor;
      //~~~~~ Save new position as ai position ~~~~~//
      tile.saveLastPosition(nextPosition, true);
      this.aiMoves.push(direction);
    } else {
      return;
    };
    this.aiMovedFromStart = true;
  }

  //~~~ User moves ~~~//
  if (aiPlayer === undefined) {
    //~~~~~ Move to new position and get new color mix ~~~~~//
    var nextPosition = this.findNextPosition(position, vector);
    var mixedColor;

    if (this.board.inBounds(nextPosition)) {
      //~~~~~ Find color mix of the next position ~~~~~//
      mixedColor = this.findAverage(this.returnColor(position, this.gameBoard), this.returnColor(nextPosition, this.gameBoard));
      //~~~~~ Save color of the next position ~~~~~//
      this.gameBoard[nextPosition.x][nextPosition.y].color = mixedColor;
      //~~~~~ Save new position as user position ~~~~~//
      tile.saveLastPosition(nextPosition);
    } else {
      return;
    };
    //~~~~~ Find neighbors of newest position ~~~~~//
    if (aiMoves === undefined) {
      this.getPreviewColors(nextPosition);
    }

    //~~~ Pass last move made so it can be stored ~~~///
    var lastMove = {
      currPosition: nextPosition,
      lastPosition: position,
      lastVector: vector,
      lastColor: this.returnColor(position, this.gameBoard),
      mergedColor: mixedColor
    };
    this.movedFromStart = true;
    this.updateGame(lastMove, nextPosition, mixedColor);
    this.testIfWon(nextPosition, mixedColor, solution);
    this.userMoves++;
    this.renderer.renderStats(this.userMoves, this.setting, this.totalWins);
  };
};

//~~~~~ Returns the direction chosen by user  ~~~~~//
Game.prototype.getDirection = function(direction) {
  var directionKeys = {
    "up":    { x:  0, y: -1 },
    "right": { x:  1, y:  0 },
    "down":  { x:  0, y:  1 },
    "left":  { x: -1, y:  0 }
  };

  return directionKeys[direction];
};

Game.prototype.findNextPosition = function(position, vector) {
  return { x: (position.x + vector.x), y: (position.y + vector.y) };
};

Game.prototype.findLastPosition = function(position, vector) {
  return { x: (position.x - vector.x), y: (position.y - vector.y) };
};

Game.prototype.findNeighbors = function(position) {
  var availableNeighbors = [],
      availableVectors   = [
        { x:  0, y: -1 }, // up
        { x:  1, y:  0 }, // right
        { x:  0, y:  1 }, // down
        { x: -1, y:  0 }  // left
      ];

  for (var i = 0; i < 4; i++) {
    var neighbor = this.findNextPosition(position, availableVectors[i]);

    //~~ push into availableNeighbors array if in bounds ~~//
    if (this.board.inBounds(neighbor)) {
      availableNeighbors.push(neighbor);
    }
  };
  return availableNeighbors;
};

Game.prototype.testIfWon = function(position, color, solution) {
  var rangeHigh = this.winColor + 2.25,
      rangeLow  = this.winColor - 2.25;
  if (position.x === this.winPoint.x && position.y === this.winPoint.y) {
    this.data.deleteGameState();
    this.gameOver = true;
    if (color >= rangeLow && color <= rangeHigh && solution !== true) {
      this.won = true;
      this.wins++;
      this.totalWins++;
      this.renderer.rotateGoal(false, true);

      if (this.wins === this.rounds) {
        this.setting++;
        this.wins = 0;
      }

      if (this.setting === 8 && this.wins === 3) {
        this.renderer.renderMessage(true, true)
      } else {
        this.renderer.renderMessage(true, false);
      }
    } else if (color >= rangeLow || color <= rangeHigh) {
      this.renderer.rotateGoal(false, false);
      this.renderer.renderMessage(false, false);
    };
  };
};

Game.prototype.getPreviewColors = function(position) {
  var neighbors     = this.findNeighbors(position);
      length        = neighbors.length,
      previewColors = [];

  for (var i = 0; i < length; i++) {
    var color = this.findAverage(this.gameBoard[position.x][position.y].color, this.returnColor(neighbors[i], this.gameBoard));
    previewColors.push(color);
  };

  this.renderer.renderPreview(this.gameBoard, neighbors, previewColors);
};

//~~~~~ Mix / average the colors  ~~~~~//
Game.prototype.findAverage = function(color1, color2) {
  var colorDiff;

  //~~~ Finds out if colors are over 180 or not ~~~//
  var colorResult1 = 360 - color1,
      colorResult2 = 360 - color2;

  //~~~ Finds out if color difference is over 180 or not ~~~//
  if (color1 > color2) {
    colorDiff = color1 - color2;
  } else if (color2 > color1) {
    colorDiff = color2 - color1;
  }

  //~~~ If difference between colors is larger than 180 ~~~//
  if (colorDiff > 180) {
    var finalColor;
    if (colorResult1 < 180 && colorResult2 > 180) {
      finalColor = ((colorResult2 + color1) / 2) - colorResult2;
    } else if (colorResult1 > 180 && colorResult2 < 180) {
      finalColor = ((colorResult1 + color2) / 2) - colorResult1;
    };

    //~~~ If mixed color value is less than 0, rotate back to positive  ~~~//
    if (finalColor < 0) {
      return finalColor + 360
    }

    return finalColor;
  } else {
    return ((color1 + color2) / 2);
  };
};

//~~~~~ Unmix / un-average the colors  ~~~~~//
Game.prototype.reverseAverage = function(color1, color2) {
  var unMixedColor = (color1 * 2) - color2;

  if (unMixedColor < 0) {
    return unMixedColor + 360;
  } else if (unMixedColor > 360){
    return unMixedColor - 360;
  } else {
    return unMixedColor;
  }
};

//~~~ Serialize and save current game state  ~~~//
Game.prototype.serializeState = function(currPosition) {
  var currGame = {
    board:         this.board.serializeBoard(this.gameBoard),
    moves:         this.moves,
    winColor:      this.winColor,
    winPoint:      this.winPoint,
    savedPosition: currPosition,
    aiMoves:       this.aiMoves
  };

  var userStats = {
    totalWins: this.totalWins,
    level:     this.setting,
    wins:      this.wins
  }

  // stores user stats
  this.data.storeUserStats(userStats);

  return currGame;
};

//~~ update Game ~~//
Game.prototype.updateGame = function(lastMove, nextPosition, mixedColor) { // nextPosition is the current position...
  this.moves.undoMoves.unshift(lastMove);
  this.renderer.renderUser(lastMove.lastPosition, nextPosition, mixedColor);
  this.data.storeGame(this.serializeState(nextPosition));
};

//~~ Undo function ~~//
Game.prototype.undo = function() {
  if (this.gameOver) {
    return;
  }
  //~~~ Return if there are no undo moves in stored ~~~//
  if (this.moves.undoMoves.length === 0) {
    return;
  }

  //~~~ Store undo moves into redo moves array ~~~//
  if (this.moves.undoMoves.length !== 0) {
    this.moves.redoMoves.unshift(this.moves.undoMoves[0]);
  }

  //~~~ Remove last move from undo list ~~~//
  var lastMove     = this.moves.undoMoves.shift(),
      lastPos      = this.findLastPosition(lastMove.currPosition, lastMove.lastVector),
      unMixedColor = this.reverseAverage(lastMove.mergedColor, lastMove.lastColor);

  //~~~ Save undone position ~~~//
  tile.saveLastPosition(lastMove.lastPosition);
  //~~~ Save undone colors onto board ~~~//
  this.gameBoard[lastMove.lastPosition.x][lastMove.lastPosition.y].color = lastMove.lastColor;
  this.gameBoard[lastMove.currPosition.x][lastMove.currPosition.y].color = unMixedColor;
  //~~~ Render changes ~~~//
  this.renderer.undoUser(lastMove.currPosition, unMixedColor);
  this.renderer.renderUser(lastMove.currPosition, lastMove.lastPosition, lastMove.lastColor);
  this.getPreviewColors(lastMove.lastPosition);
  this.userMoves -=1;
  this.renderer.renderStats(this.userMoves, this.setting, this.totalWins);
  //~~~ serialize game ~~~//
  this.data.storeGame(this.serializeState(lastMove.lastPosition));
};

//~~ Redo function ~~//
Game.prototype.redo = function() {
  if (this.gameOver) {
    return;
  }

  //~~~ Return if there are no redo moves in stored ~~~//
  if (this.moves.redoMoves.length === 0) {
    return;
  }

  //~~~ Store undo moves into redo moves array ~~~//
  if (this.moves.redoMoves.length !== 0) {
    this.moves.undoMoves.unshift(this.moves.redoMoves[0]);
  }

  //~~~ Remove last move from redo list ~~~//
  var redoLast = this.moves.redoMoves.shift(),
      redoPos  = this.findNextPosition(redoLast.lastPosition, redoLast.lastVector);

  //~~~ Save redone position ~~~//
  tile.saveLastPosition(redoLast.currPosition);
  //~~~ Save redone colors onto board ~~~//
  this.gameBoard[redoLast.currPosition.x][redoLast.currPosition.y].color = redoLast.mergedColor;
  this.gameBoard[redoLast.lastPosition.x][redoLast.lastPosition.y].color = redoLast.lastColor;
  //~~~ Render changes ~~~//
  this.renderer.undoUser(redoLast.lastPosition, redoLast.lastColor);
  this.renderer.renderUser(redoLast.lastPosition, redoLast.currPosition, redoLast.mergedColor);
  this.getPreviewColors(redoLast.currPosition);
  this.userMoves++;
  this.renderer.renderStats(this.userMoves, this.setting, this.totalWins);
  //~~~ serialize game ~~~//
  this.data.storeGame(this.serializeState(redoLast.currPosition));
};

//~~~~~~ AI PLAY ~~~~~~//
Game.prototype.genSolution = function(difficulty) {
  //~~ level must be 1-8 ~~//
  var makeDupeBoard = this.board.dupeBoard();
  this.dupeBoard    = makeDupeBoard.board;
  this.winPoint     = this.levels.winPoint(this.setting);

  while (true) {
    var move = this.executeMove(difficulty);
    if ((tile.aiLastPosition.x === this.winPoint.x) && (tile.aiLastPosition.y === this.winPoint.y)) {
      break;
    };
  };
  this.winColor = this.returnColor(this.winPoint, this.dupeBoard);
};

//~~~~~ Play solution ~~~~~//
Game.prototype.showSolution = function() {
  this.restart();
  var length   = this.aiMoves.length,
      that     = this,
      solution = true,
      timeout  = 10;

  for (var i = 0; i < length; i++) {
    (function(i) {
      setTimeout(function() {
        that.moveUser(that.aiMoves[i], undefined, true, solution);
      }, 750 + (750 * i));
    })(i);
  };
};

Game.prototype.executeMove = function(difficulty) {
  var chance  = Math.random(),
      move    = null;

  if (chance < difficulty.scale) {
    var moves = ["right", "down"];
        move  = moves[Math.floor(Math.random() * 2)];
    this.moveUser(move, true, null);
  } else {
    var moves = ["up", "left"];
        move  = moves[Math.floor(Math.random() * 2)];
    this.moveUser(move, true, null);
  };
};
