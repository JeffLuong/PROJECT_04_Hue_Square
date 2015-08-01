// var game = {
//   gameOn: false,
//   rows: 4,
//   cols: 4,
//
//
//   gameInit: function() {
//     console.log("initializing game...");
//     tile.makeTiles();
//   },
//
//   setListeners: function() {
//     // $(".tile").on("click", function(event) {
//     //   tile.selectAnimation();
//     // });
//   },
//
// };

function Game(GameSize, GameControls, GameRenderer, GameData) {
  this.size     = GameSize;
  this.controls = new GameControls;
  this.renderer = new GameRenderer;
  this.data     = new GameData;

};

Game.prototype.initiate = function() {
  this.board = new Board(this.size);
  this.makeTiles();
};

Game.prototype.restart = function() {

};
