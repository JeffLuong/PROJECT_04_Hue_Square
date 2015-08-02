function Tile(position, color) {
  this.x     = position.x;
  this.y     = position.y;
  this.color = color;
  console.log(this.x, this.y, this.color);
};


// Tile.prototype.makeTiles = function(numOfTiles) {
//   console.log("making tiles...");
//
//   for (var i = 0; i < this.numOfTiles; i++) {
//     $tile = $("<div class='tile' id='tile" + i + "'>");
//     $tile.css({
//       "background-color": this.genColor
//     });
//     $("#board-container").append($tile);
//     this.arrTiles.push(
//       {
//         $el: $tile,
//         name: "tile" + i,
//       }
//     );
//   };
// };


// var tile = {
//   arrTiles: [],
//   baseColors: [
//     "hsl(360, 75%, 60%)",
//     "hsl(230, 75%, 60%)",
//     "hsl(60, 75%, 60%)"
//   ],
//
//   genColor: function() {
//     var len     = tile.baseColors.length,
//         randNum = [Math.floor(Math.random()*len)],
//         color   = tile.baseColors[randNum];
//     return color;
//   },
//
//   makeTiles: function() {
//     console.log("generating tiles...");
//     var numOfTiles = game.rows * game.cols;
//     for (var i = 0; i < numOfTiles; i++) {
//       $tile = $("<div class='tile' id='tile" + i + "'>");
//       $tile.css({
//         "background-color": this.genColor
//       });
//       $("#board-container").append($tile);
//       this.arrTiles.push(
//         {
//           $el: $tile,
//           name: "tile" + i,
//         }
//       );
//     };
//   },
//
//   selectAnimation: function() {
//
//   }
// };
