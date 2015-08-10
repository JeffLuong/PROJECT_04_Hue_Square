function Tile(position, color) {
  this.x              = position.x;
  this.y              = position.y;
  this.color          = color;
  this.lastPosition   = null;
  this.aiLastPosition = {x: 0, y: 0};
};

//~~~ return a start position as an object ~~~//
Tile.prototype.startPosition = function() {
  return {x: this.x, y: this.y};
};

//~~~ save a tile's position if it has recently changed ~~~//
Tile.prototype.saveLastPosition = function(position, aiPlayer) {
  if (aiPlayer === true) {
    this.aiLastPosition = {x: position.x, y: position.y};
  } else {
    this.lastPosition = {x: position.x, y: position.y};
  }
};

//~~~ update any tile's position ~~~//
Tile.prototype.updatePosition = function(position) {
  this.x = position.x;
  this.y = position.y;
};

//~~~ duplicate tiles ~~~//
Tile.prototype.dupeTile = function () {
  return new Tile({
    x: this.x,
    y: this.y
  }, this.color);
}
