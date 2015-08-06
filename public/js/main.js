$(document).ready(function() {
  window.game = new Game(3, GameControls, GameRenderer, GameData);
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
