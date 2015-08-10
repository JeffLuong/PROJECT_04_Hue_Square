function Tile(position, color) {
  this.x              = position.x;
  this.y              = position.y;
  this.color          = color;
  this.lastPosition   = null;
  this.aiLastPosition = {x: 0, y: 0};
};

Tile.prototype.startPosition = function() {
  return {x: this.x, y: this.y};
};

Tile.prototype.saveLastPosition = function(position, aiPlayer) {
  if (aiPlayer === true) {
    this.aiLastPosition = {x: position.x, y: position.y};
  } else {
    this.lastPosition = {x: position.x, y: position.y};
  }
};

Tile.prototype.updatePosition = function(position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.dupeTile = function () {
  return new Tile({
    x: this.x,
    y: this.y
  }, this.color);
}

// var x = new Tile(...);   x.dup();
