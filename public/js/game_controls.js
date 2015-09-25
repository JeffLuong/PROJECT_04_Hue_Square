function GameControls() {
  this.events = {};
  this.listeners();
};

//~~~~~ Set event listeners for keys ~~~~~~//
GameControls.prototype.listeners = function() {
  var that = this;
  var moveKeys = {
    38: "up",    // up arrow
    39: "right", // right arrow
    40: "down",  // down arrow
    37: "left",  // left arrow
    87: "up",    // W key
    68: "right", // D key
    83: "down",  // S key
    65: "left"   // A key
  };

  //~~~~~ Move events ~~~~~~//
  $(window).keydown(function(event) {
    var key          = moveKeys[event.which],
        modifierKeys = event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;

    if (!modifierKeys) {
      if (key !== undefined) {
        console.log(key, "pressed");
        event.preventDefault();
        that.emitter("move", key);
      };

      if (event.which === 85) {
        that.undo.call(that, event);
      };

      if (event.which === 73) {
        that.redo.call(that, event);
      };

      if (event.which === 82) {
        that.restart.call(that, event);
      };
    };
  });

  //~~~ Swipes for mobile ~~~//
  $("#board-container").on("swiperight", function() {
    that.emitter("move", "right");
  });

  $("#board-container").on("swipeleft", function() {
    that.emitter("move", "left");
  });

  $("#board-container").on("swipeup", function() {
    that.emitter("move", "up");
  });

  $("#board-container").on("swipedown", function() {
    that.emitter("move", "down");
  });

  //~~~ Buttons ~~~//
  $(".retry").on("click", function() {
    that.restart.call(that, event);
  });

  $(".next").on("click", function() {
    that.nextMap.call(that, event);
  });

  $(".redo-button").on("click", function() {
    that.redo.call(that, event);
  });

  $(".undo-button").on("click", function() {
    that.undo.call(that, event);
  });

  $(".restart-button").on("click", function() {
    that.restart.call(that, event);
  });

  $(".solution").on("click", function() {
    that.solution.call(that, event);
  });
};

GameControls.prototype.undo = function(event) {
  event.preventDefault();
  this.emitter("undo");
};

GameControls.prototype.redo = function(event) {
  event.preventDefault();
  this.emitter("redo");
};

GameControls.prototype.restart = function(event) {
  event.preventDefault();
  this.emitter("restart");
};

GameControls.prototype.nextMap = function(event) {
  event.preventDefault();
  this.emitter("nextMap");
};

GameControls.prototype.solution = function(event) {
  event.preventDefault();
  this.emitter("solution");
};

GameControls.prototype.emitter = function(event, data) {
  var callbacks = this.events[event];
  if(callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  };
};

GameControls.prototype.onEvent = function(event, callbackFunk) {
  if(!this.events[event]) {
    this.events[event] = [];
  };

  this.events[event].push(callbackFunk);
};
