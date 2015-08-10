function GameRenderer() {
  console.log("rendering game...");
  this.$gameContainer    = $("#game-container");
  this.$boardContainer   = $("#board-container");
  this.$messageContainer = $(".game-message");
};

//~~~~~~ Render start gameboard ~~~~~~//
GameRenderer.prototype.initBoard = function(size, board, userTile, winColor) {
  this.makeRows(size, board, winColor);
  this.renderUser(board, userTile, null, null);
};

GameRenderer.prototype.removeGameBoard = function(board) {
  var $rows = $(".board-row");

  $rows.remove();
  this.clearMessage();
}

GameRenderer.prototype.renderMoveCount = function(count) {
  $(".moves").text(count);
}

//~~~~~~ Make HTML rows and squares ~~~~~~//
GameRenderer.prototype.makeRows = function(size, board, winColor) {
  var windowSize = $(window).width();

  for (var y = 0; y < size; y++) {
    var $row = $("<div class='board-row row" + (y + 1) + "'>");

    for (var x = 0; x < size; x++) {
      var $sq   = $("<div class='board-sq square" + (x + 1) + "'>");
      $sq.css({
        "width": "calc(100% / " + size + ")"
      });
      //~~~~~~ Render the tiles inside the squares ~~~~~~//
      var $tile  = this.renderTiles(board, y, x);

      //~~~ If the last tile is being made, create and append goal color ~~~//
      if ((x === (size - 1)) && (y === (size - 1))) {
        var $goal = $("<div class='game-goal shadow'>");

        $goal.css({
          "background-color": "hsl(" + winColor + ", 75%, 60%)"
        });

        $tile.append($goal);
      };
      $sq.append($tile);
      $row.append($sq);
    };

    $row.css({
      "height": "calc(100% / " + size + ")"
    });
    //~~ APPEND EACH TILE INDIVIDUALLY WITH DELAY? ~~//
    this.$boardContainer.append($row);
  };
  setTimeout(function() {
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var $eachTile = $(".tile-position-" + (x + 1) + "-" + (y + 1));
        $eachTile.addClass("delayX" + (x + 1) + "Y" + (y + 1));
        $eachTile.addClass("animateIn");
      };
    }
  }, 250);
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

GameRenderer.prototype.removePreviews = function() {
  $(".preview").remove();
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

GameRenderer.prototype.renderMessage = function(wonRound, wonGame) {
  var message = wonRound ? "You Win!" : "You Lost!",
      winGame = "You beat the game!",
      options = wonRound ? "next"     : "retry",
      $retry  = $(".retry"),
      $next   = $(".next");

  if (wonRound && wonGame === false) {
    $retry.text("play again");
    $next.text("next puzzle");
    $(".game-message > p").text(message);
  } else if (!wonRound && !wonGame) {
    $next.text("skip puzzle");
    $retry.text("try again");
    $(".bottom-option").addClass("block");
    $(".game-message > p").text(message);
  } else if (wonRound && wonGame) {
    $retry.remove();
    $next.remove();
    $(".game-message > p").text(winGame);
  }

  this.$messageContainer.addClass("game-over");
};

GameRenderer.prototype.clearMessage = function() {
  $(".bottom-option").removeClass("block");
  this.$messageContainer.removeClass("game-over");
};

GameRenderer.prototype.rotateGoal = function(restart, won) {
  if (!restart && won) {
    $(".game-goal").addClass("rotate");
    setTimeout(function() {
      $(".game-goal").removeClass("shadow");
    },750);
  } else if (restart && won) {
    $(".game-goal").removeClass("rotate");
    setTimeout(function() {
      $(".game-goal").addClass("shadow");
    },500);
  } else if (!restart && !won){
    setTimeout(function() {
      $(".game-goal").removeClass("shadow");
    },750);
  } else if (restart && !won) {
    setTimeout(function() {
      $(".game-goal").addClass("shadow");
    },500);
  }
}
