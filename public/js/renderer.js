function GameRenderer() {
  console.log("rendering game...");
  this.$gameContainer  = $("#game-container");
  this.$boardContainer = $("#board-container");
};

//~~~~~~ Render start gameboard ~~~~~~//
GameRenderer.prototype.initBoard = function(size, board, userTile) {
  this.makeRows(size, board);
  this.updateBoard(board, userTile, null, null);
};

//~~~~~~ Update gameboard ~~~~~~//
GameRenderer.prototype.updateBoard = function(userTile, newPosition, mixedColor) {
  this.renderUser(userTile, newPosition, mixedColor);
};

//~~~~~~ Make HTML rows and squares ~~~~~~//
GameRenderer.prototype.makeRows = function(size, board) {
  for (var y = 0; y < size; y++) {
    var $row = $("<div class='board-row " + "row" + (y + 1) + "'>");

    for (var x = 0; x < size; x++) {
      var $sq   = $("<div class='board-sq " + "square" + (x + 1) + "'>");
      $sq.css({
        "width": "calc(100% / " + size + ")"
      });
      //~~~~~~ Render the tiles inside the squares ~~~~~~//
      var tile  = this.renderTiles(board, y, x);
      $sq.append(tile);
      $row.append($sq);
    };

    $row.css({
      "height": "calc(100% / " + size + ")"
    });
    this.$boardContainer.append($row);
  };
};

//~~~~~~ Dynamically adds color attribute to tiles ~~~~~~//
GameRenderer.prototype.renderTiles = function(board, y, x) { //<<< have to pass in x, y values reversed
  var $tile = $("<div class='tile " + "tile-position-" + (x + 1) + "-" + (y + 1) + "'>");

  //~~~~~~ Use color from board tiles to render HTML ~~~~~~//
  $tile.css({
    "background-color": "hsl(" + board[x][y].color + ", 75%, 60%)"
  });

  return $tile;
};

//~~~~~~ Render user takes in the user tile, the new position it's moving and the new color ~~~~~~//
GameRenderer.prototype.renderUser = function(userTile, newPosition, color) {
  var $user = $(".tile-position-" + (userTile.x + 1) + "-" + (userTile.y + 1));

  //~~~~~~ Render updated new position ~~~~~~//
  if(newPosition !== null) {
    $user.removeClass("user");
    $user = $(".tile-position-" + (newPosition.x + 1) + "-" + (newPosition.y + 1));
    $user.css({
      "background-color": "hsl(" + color + ", 75%, 60%)"
    });
    $user.addClass("user");

  //~~~~~~ If the game just started, render chosen user tile ~~~~~~//
  } else {
    $user.addClass("user");
  };
};

GameRenderer.prototype.undoUser = function(currPos, color) {
  var $user = $(".tile-position-" + (currPos.x + 1) + "-" + (currPos.y + 1));

  $user.removeClass("user");
  $user = $(".tile-position-" + (currPos.x + 1) + "-" + (currPos.y + 1));
  $user.css({
    "background-color": "hsl(" + color + ", 75%, 60%)"
  });
};
