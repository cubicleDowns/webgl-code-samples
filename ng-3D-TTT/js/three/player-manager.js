var Demo = Demo || {};

/**
 * Managers the players.  Listens for the nextTurn event.
 */
Demo.PlayerManager = function (params) {

  this.context = params.context;

  this.players = [];

  this.turn = 1;

  this.init();

};

Demo.PlayerManager.prototype = {

  init: function () {
    this.turnListener();
  },

  /**
   * Adds a player to the players queue.
   * @param {Player Object} player
   */
  addPlayer: function (player) {
    this.players.push(player);
  },

  /**
   * Take the next player's turn.
   */
  nextTurn: function () {

    var player = this.players[this.turn];

    if(!this.context.gameOver) {
      //increment turn
      this.turn++;

      //reset to 0 of num users run out
      this.turn %= this.players.length;

      // each player has their own takeTurn method
      // which calls either turn logic or enables interaction with the canvas
      player.takeTurn();
    }
  },

  /**
   * Listens for the 'nextTurn' event.
   * @return {[type]}
   */
  turnListener: function () {
    //TODO  Make this into a service?

    var me  = this;
    $(document).on("nextTurn", function () {
      me.nextTurn();
    });
  },


};

