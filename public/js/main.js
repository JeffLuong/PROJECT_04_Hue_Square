$(document).ready(function() {

  function onReady(callback) {
    var interval = window.setInterval(checkReady, 250);
    function checkReady() {
      if ($("body")[0] !== undefined) {
        window.clearInterval(interval);
        callback.call(this);
      }
    }
  }

  onReady(function() {
    $("#loading").fadeOut(250);
    $("#main-container").fadeIn(350);
  });

  window.game = new Game(GameControls, GameRenderer, GameData);
});
