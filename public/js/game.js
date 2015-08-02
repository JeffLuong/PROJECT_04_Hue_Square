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
  this.size       = GameSize;
  this.controls   = new GameControls;
  this.renderer   = new GameRenderer;
  this.data       = new GameData;
  this.baseColors = [
    // red can be 0 or 360 degrees in HSL
    360, 230, 60
  ];
  // saturation and luminosity values are: 75% and 60% respectively
  this.initiate();
};

Game.prototype.initiate = function() {
  this.board = new Board(this.size);
  this.makeTiles();
};

Game.prototype.genColor = function() {
  return this.baseColors[Math.floor(Math.random() * this.baseColors.length)];
};

Game.prototype.makeTiles = function() {
  for (var i = 1; i < this.size + 1; i++) {
    for (var j = 1; j < this.size + 1; j++) {
      console.log("making tile...");
      var color = this.genColor();
      var tile  = new Tile(this.board.position(i, j), color);

      this.board.addTile(tile);
    };
  };
};

Game.prototype.restart = function() {

};
