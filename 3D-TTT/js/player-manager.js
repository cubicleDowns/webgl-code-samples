var Demo = Demo || {};

/**
 * Managers the players.  Listens for the nextTurn event.
 */
Demo.PlayerManager = function () {

  this.players = [];

  this.turn = 0;

  this.init();

};

Demo.PlayerManager.prototype = {

  init: function () {
    this.turnListener();
  },

  /**
   * Adds a player to the players queue.
   */
  addPlayer: function (player) {
    this.players.push(player);
    this.names.push(player.name);
  },

  getNames: function () {
    return this.names;
  },

  /**
   * Take the next player's turn.
   * @return {[type]}
   */
  nextTurn: function () {

    var player = this.players[this.turn];

    if(!this.context.gameOver) {
      player.takeTurn();
      //increment turn
      this.turn++;

      //reset to 0 of num users run out
      this.turn %= this.players.length;
    }
  },

  /**
   * Listens for the 'nextTurn' event.
   * @return {[type]}
   */
  turnListener: function () {
    var me  = this;
    $(document).on("nextTurn", function () {
      me.nextTurn();
    });
  },


};

