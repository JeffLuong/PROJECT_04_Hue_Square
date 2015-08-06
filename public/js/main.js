$(document).ready(function() {
  window.game = new Game(GameControls, GameRenderer, GameData);
  fadeIn();
});

// function fadeInTiles () {
//   var $tiles = $('.tile');
//   $tiles.addClass('fadeIn');
// }

function fadeIn () {
  var $board = $('#board-container');
$board.fadeIn(500);
}
