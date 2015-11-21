// If browser doesn't support window.localStorage, use window.tempStorage
window.tempStorage = {
  data: {},

  setItem: function(id, val) {
    return this.data[id] = String(val);
  },

  getItem: function(id) {
    if (this.data.hasOwnProperty(id)) {
      return this.data[id];
    } else {
      return undefined;
    }
  },

  removeItem: function(id) {
    return delete this.data[id];
  },

  clearData: function() {
    return this.data = {};
  }
}

function GameData() {
  this.currLvlKey   = "currLvl";
  this.userStatsKey = "stats";
  this.gameKey      = "gameState";

  // Test if browser supports window.localStorage
  var browserSupports = this.isLocalStorageSupported();

  if (browserSupports) {
    this.storage = window.localStorage;
  } else {
    this.storage = window.tempStorage;
  };
};

GameData.prototype.isLocalStorageSupported = function() {
  var test    = "works?",
      storage = window.localStorage;

  try {
    storage.setItem(test, "yes");
    storage.removeItem(test);
    return true;
  } catch (err) {
    return false;
  }
};

// Game state functions
GameData.prototype.getCurrGame = function() {
  var gameJSON = this.storage.getItem(this.gameKey);
  if (gameJSON) {
    return JSON.parse(gameJSON);
  } else {
    return null;
  };
};

GameData.prototype.storeGame = function(game) {
  this.storage.setItem(this.gameKey, JSON.stringify(game));
};

GameData.prototype.deleteGameState = function() {
  this.storage.removeItem(this.gameKey);
};

GameData.prototype.storeUserStats = function(stats) {
  this.storage.setItem(this.userStatsKey, JSON.stringify(stats));
}

GameData.prototype.getUserStats = function() {
  var statsJSON = this.storage.getItem(this.userStatsKey);
  if (statsJSON) {
    return JSON.parse(statsJSON);
  } else {
    return null;
  }
}
