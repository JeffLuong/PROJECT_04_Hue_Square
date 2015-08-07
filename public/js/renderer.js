function GameRenderer() {
  console.log("rendering game...");
  this.$gameContainer    = $("#game-container");
  this.$boardContainer   = $("#board-container");
  this.$messageContainer = $(".game-message");
};

//~~~~~~ Render start gameboard ~~~~~~//
GameRenderer.prototype.initBoard = function(size, board, userTile) {
  this.makeRows(size, board);
  this.updateBoard(board, userTile, null, null);
};

GameRenderer.prototype.removeGameBoard = function(board) {
  var $rows = $(".board-row");

  $rows.remove();
  this.clearMessage();
}

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
    //~~ APPEND EACH TILE INDIVIDUALLY WITH DELAY? ~~//
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

GameRenderer.prototype.renderGoal = function(position, color) {
  var $goal    = $("<div class='game-goal'>"),
      $winTile = $(".tile-position-" + (position.x + 1) + "-" + (position.y + 1));

  $goal.css({
    "background-color": "hsl(" + color + ", 75%, 60%"
  });
  $winTile.append($goal);
};

GameRenderer.prototype.renderPreview = function(board, neighbors, colors) {
  //~~~ Select all previous previews: if any exists ~~~//
  var $lastPreview = $(".preview"),
      length = neighbors.length;

  //~~~ Remove last previews if exists ~~~//
  $lastPreview.fadeOut(500);

  for (var i = 0; i < length; i++) {
    var $preview      = $("<div class='preview'>"),
        $tile         = $(".tile-position-" + (neighbors[i].x + 1) + "-" + (neighbors[i].y + 1));
        neighborColor = board[neighbors[i].x][neighbors[i].y].color,
        range         = this.findColorRange(neighborColor, colors[i]);

    if ($tile.children().length === 0) {
      $tile.append($preview);

      $preview.css({
        "background-color": "hsl(" + colors[i] + ", 75%, 60%)"
      });
      $preview.fadeIn(500);
    }
  };
  $lastPreview.remove();
};

GameRenderer.prototype.findColorRange = function(color1, color2) {
  var range;

  if (color1 > color2) {
    range = color1 - color2;
  } else if (color2 > color1) {
    range = color2 - color1;
  };

  if (range >= 0 && range <= 360) {
    return range;
  } else if (range < 0) {
    return range + 360;
  } else if (range > 360) {
    return range - 360;
  };
};

GameRenderer.prototype.renderMessage = function(won) {
  console.log("rendering message...");
  var message = won ? "You Win!" : "You Lost!",
      options = won ? "next"     : "retry",
      $retry  = $(".retry"),
      $next   = $(".next");

  if (won) {
    $(".game-goal").fadeOut(300);
    $retry.text("play again");
    $next.text("next puzzle");
  } else {
    $next.text("skip puzzle");
    $retry.text("try again");
  }

  this.$messageContainer.addClass("game-over");
  // $(".next").addClass("game-over");
  // $(".retry").addClass("game-over");
  $(".game-message > p").text(message);

};

GameRenderer.prototype.clearMessage = function() {
  this.$messageContainer.removeClass("game-over");
};
