function GameControls() {
  console.log("game controls set...");
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
    console.log("swipe right working");
    that.emitter("move", "right");
  });

  $("#board-container").on("swipeleft", function() {
    console.log("swipe left working");
    that.emitter("move", "left");
  });

  $("#board-container").on("swipeup", function() {
    console.log("swipe up working");
    that.emitter("move", "up");
  });

  $("#board-container").on("swipedown", function() {
    console.log("swipe down working");
    that.emitter("move", "down");
  });

  //~~~ Buttons ~~~//
  $(".retry").on("click", function() {
    console.log("restart click working...");
    that.restart.call(that, event);
  });

  $(".next").on("click", function() {
    console.log("next click working...");
    that.nextMap.call(that, event);
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
}

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
