function Game(GameControls, GameRenderer, GameData) {
  this.controls   = new GameControls;
  this.renderer   = new GameRenderer;
  this.data       = new GameData;
  //~~~~~ red can be 0 or 360 degrees in HSL ~~~~~~//
  //~~~~~ saturation and luminosity values are: 75% and 60% respectively ~~~~~~//
  this.baseColors = [
    360, 230, 60
  ];
  this.initiate();
  this.controls.onEvent("move", this.moveUser.bind(this));
  this.controls.onEvent("restart", this.restart.bind(this));
  this.controls.onEvent("undo", this.undo.bind(this));
  this.controls.onEvent("redo", this.redo.bind(this));
};

Game.prototype.initiate = function() {
  var prevState = this.data.getCurrGame();

  if (prevState) {
    console.log("getting previous state...");
    this.board          = new Board(prevState.board.size, prevState.board.board);
    this.score          = prevState.score;
    this.wins           = prevState.wins;
    this.level          = prevState.level;
  } else {
    this.size           = this.data.levels[4].board.size;
    this.board          = new Board(this.size);
    this.gameBoard      = this.board.board;
    this.movedFromStart = false
    this.score          = 0;
    this.wins           = 0;
    this.level          = 1;
    this.makeTiles();
    this.initUser();
    this.dupeBoard = this.board.dupeBoard();
    this.renderer.initBoard(this.size, this.gameBoard, this.userTile);
    this.getPreviewColors(this.getStartPosition());
    console.log(this.gameBoard);
  };
};

//~~~~~~ Randomly generate colors ~~~~~~//
Game.prototype.genColor = function() {
  return this.baseColors[Math.floor(Math.random() * this.baseColors.length)];
};

//~~~~~~ Make tiles on back-end ~~~~~~//
Game.prototype.makeTiles = function() {
  for (var y = 0; y < this.size; y++) {
    for (var x = 0; x < this.size; x++) {
      var color = this.genColor();
      var tile  = new Tile(this.board.position(y, x), color);

      this.board.addTile(tile);
    };
  };
};

//~~~~~~ Initiate user ~~~~~~//
Game.prototype.initUser = function() {
  var startPos = this.getStartPosition(this.size);
  this.insertUser(this.gameBoard, startPos);
};

//~~~~~~ Restart Game ~~~~~~//
Game.prototype.restart = function() {
  var allMoves = this.data.moves.undoMoves,
      length   = allMoves.length;

  //~~~ Executes all undos ~~~//
  for (var i = 0; i < length; i++) {
    this.undo();
  };
};

//~~~~~ Randomly generate user start position ~~~~~//
Game.prototype.getStartPosition = function(size) {
  // var x        = Math.floor(Math.random() * size),
      // y        = Math.floor(Math.random() * size),
  var x        = 0,
      y        = 0,
      position = {x: x, y: y},
      color    = this.gameBoard[x][y].color
      tile     = new Tile(position, color);

  return tile.startPosition();
};

//~~~~~~ Get color from new position ~~~~~~//
Game.prototype.returnColor = function(position) {
  return this.gameBoard[position.x][position.y].color;
};

//~~~~~ Insert user start position ~~~~~//
Game.prototype.insertUser = function(board, position) {
  this.userTile = board[position.x][position.y];
};

//~~~~~~ Move user Tile ~~~~~~//
Game.prototype.moveUser = function(direction) {
  var position = null,
      vector   = this.getDirection(direction);

  this.data.moves.redoMoves = [];

  //~~~~~ If game over, do nothing ~~~~~//
  // if(this.isGameOver()) {
  //   return;
  // };

  //~~~~~ Get user position ~~~~~//
  if (this.movedFromStart) {
    position = tile.lastPosition;
  } else {
    position = tile.startPosition();
  };

  //~~~~~ Move to new position and get new color mix ~~~~~//
  var nextPosition = this.findNextPosition(position, vector);
  var mixedColor;
  if (this.board.inBounds(nextPosition)) {

    //~~~~~ Find color mix of the next position ~~~~~//
    mixedColor = this.findAverage(this.returnColor(position), this.returnColor(nextPosition));

    //~~~~~ Save color of the next position ~~~~~//
    this.gameBoard[nextPosition.x][nextPosition.y].color = mixedColor;

    //~~~~~ Remove the color of the original position ~~~~~//
    // this.gameBoard[position.x][position.y].color = "none";

    //~~~~~ Save new position as user position ~~~~~//
    tile.saveLastPosition(nextPosition);
  } else {
    return;
  };

  //~~~~~ Find neighbors of newest position ~~~~~//
  this.getPreviewColors(nextPosition);

  //~~~ Pass last move made so it can be stored ~~~///
  var lastMove = {
    currPosition: nextPosition,
    lastPosition: position,
    lastVector: vector,
    lastColor: this.returnColor(position),
    mergedColor: mixedColor
  };
  this.movedFromStart = true;
  this.updateGame(lastMove, nextPosition, mixedColor);
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
  console.log(availableNeighbors);
  return availableNeighbors;
};

Game.prototype.testIfWon = function(position, color) {
  if (position === winPosition) {
    if (color === winColor) {
      return
    }
  };
};

Game.prototype.getPreviewColors = function(position) {
  var neighbors      = this.findNeighbors(position);
      length         = neighbors.length,
      previewColors = [];

  console.log("getting preview colors...");
  for (var i = 0; i < length; i++) {
    var color = this.findAverage(this.gameBoard[position.x][position.y].color, this.returnColor(neighbors[i]));
    previewColors.push(color);
  };
  console.log(previewColors);
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
Game.prototype.serializeState = function() {
  var currGame = {
    board: this.board.serializeBoard(),
    moves: this.data.moves,
    score: this.score,
    wins:  this.wins,
    level: this.level
  };
  return currGame;
};

Game.prototype.updateGame = function(lastMove, nextPosition, mixedColor) {
  this.data.storeMove(lastMove);
  this.renderer.updateBoard(lastMove.lastPosition, nextPosition, mixedColor);
  this.data.storeGame(this.serializeState());
  console.log(this.data.moves.undoMoves);
};

Game.prototype.undo = function() {
  //~~~ Return if there are no undo moves in stored ~~~//
  if (this.data.moves.undoMoves.length === 0) {
    return;
  };

  //~~~ Store undo moves into redo moves array ~~~//
  if (this.data.moves.undoMoves.length !== 0) {
    this.data.moves.redoMoves.unshift(this.data.moves.undoMoves[0]);
  }
  //~~~ Remove last move from undo list ~~~//
  var lastMove     = this.data.moves.undoMoves.shift(),
      lastPos      = this.findLastPosition(lastMove.currPosition, lastMove.lastVector),
      unMixedColor = this.reverseAverage(lastMove.mergedColor, lastMove.lastColor);

  //~~~ Save undone position ~~~//
  tile.saveLastPosition(lastMove.lastPosition);
  //~~~ Save undone colors onto board ~~~//
  this.gameBoard[lastMove.lastPosition.x][lastMove.lastPosition.y].color = lastMove.lastColor;
  this.gameBoard[lastMove.currPosition.x][lastMove.currPosition.y].color = unMixedColor;
  //~~~ Render changes ~~~//
  this.renderer.undoUser(lastMove.currPosition, unMixedColor);
  this.renderer.updateBoard(lastMove.currPosition, lastMove.lastPosition, lastMove.lastColor);
  this.getPreviewColors(lastMove.lastPosition);
};

Game.prototype.redo = function() {
  //~~~ Return if there are no redo moves in stored ~~~//
  if (this.data.moves.redoMoves.length === 0) {
    return;
  };

  //~~~ Store undo moves into redo moves array ~~~//
  if (this.data.moves.redoMoves.length !== 0) {
    this.data.moves.undoMoves.unshift(this.data.moves.redoMoves[0]);
  }
  //~~~ Remove last move from redo list ~~~//
  var redoLast = this.data.moves.redoMoves.shift(),
      redoPos  = this.findNextPosition(redoLast.lastPosition, redoLast.lastVector);

  //~~~ Save redone position ~~~//
  tile.saveLastPosition(redoLast.currPosition);
  //~~~ Save redone colors onto board ~~~//
  this.gameBoard[redoLast.currPosition.x][redoLast.currPosition.y].color = redoLast.mergedColor;
  this.gameBoard[redoLast.lastPosition.x][redoLast.lastPosition.y].color = redoLast.lastColor;
  //~~~ Render changes ~~~//
  this.renderer.undoUser(redoLast.lastPosition, redoLast.lastColor);
  this.renderer.updateBoard(redoLast.lastPosition, redoLast.currPosition, redoLast.mergedColor);
  this.getPreviewColors(redoLast.currPosition);
};
