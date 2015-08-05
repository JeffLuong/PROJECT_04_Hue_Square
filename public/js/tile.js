function Tile(position, color) {
  this.x            = position.x;
  this.y            = position.y;
  this.color        = color;
  this.lastPosition = null;
};

Tile.prototype.startPosition = function() {
  return {x: this.x, y: this.y};
};

Tile.prototype.saveLastPosition = function(position) {
  this.lastPosition = {x: position.x, y: position.y};
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
