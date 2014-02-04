var Demo = Demo || {};

Demo.Game = function () {

  this.turn = 1;

  this.scene = null;

  this.gameOver = false;

  this.userDims = 3;

  this.winNum = 3;

  this.playerManager = null;

};

Demo.Game.prototype = {

  init: function () {

    this.listeners();

  },

  /**
   * Event listeners for the UI.
   * @return {[type]} [description]
   */
  listeners: function () {

    var me = this;

    $("#toggle-arrows").on("click", function () {
      $("#toggle-arrows").toggleClass("toggle-arrows-on");
      $("#toggle-arrows").toggleClass("toggle-arrows-off");
      Demo.Util.toggleArrows(me.scene.arrows);
    });

    $("#toggle-rotate").on("click", function () {
      $("#toggle-rotate").toggleClass("toggle-rotate-on");
      $("#toggle-rotate").toggleClass("toggle-rotate-off");
      me.scene.rotateCamera = (me.scene.rotateCamera) ? false : true;
    });

    $("#toggle-wireframes").on("click", function () {
      $("#toggle-wireframes").toggleClass("toggle-wireframes-on");
      $("#toggle-wireframes").toggleClass("toggle-wireframes-off");
      Demo.Util.toggleWireframes(me.scene.collisions);
    });

  },

  startGame: function () {

    this.playerManager = new Demo.PlayerManager({context: this, turn: 1});

    var user = new Demo.Player.User({ context: this, name: "user player", cssColor: "#00FF00"});
    var computer = new Demo.Player.Computer({context: this, cssColor: "#FF0000"});

    // add user first.
    this.playerManager.addPlayer(user);
    this.playerManager.addPlayer(computer);

    $.event.trigger({
      type: "nextTurn",
    });

  },

  /**
   * Check for Tic-Tac-Toe
   * loop through all the rays and look to see if all of their collisions objects show the same values.
   * essentially, a ray will intersect all faces in one particular direction.  3 cubes = 6 faces = 6 intersections
   * if all of the intersections show a 'selection' has take place, it'll check the selection types (ttt property)
   * @return {[type]} [description]
   */
  checkForTTT: function () {
    var i,j,
        user1 = this.playerManager.players[0],
        user2 = this.playerManager.players[1],
        collisions,
        ticUser1,
        ticUser2;

    for(i = 0; i < this.scene.rays.length; i++){
      collisions = this.scene.rays[i].intersectObjects(this.scene.collisions);
      ticUser1 = 0;
      ticUser2 = 0;

      for(j = 0; j < collisions.length; j++){
        if(collisions[j].object.ttt === user1.name){
          ticUser1++;
        } else if (collisions[j].object.ttt === user2.name){
          ticUser2++;
        }
      }

      // if all intersections are of a single player, we can conclude that player has tic/tac/toe.
      if(ticUser1 === collisions.length){
        this.declareWinner(user1);
      }

      if (ticUser2 === collisions.length){
        this.declareWinner(user2);
      }
    }

  },

  /**
   *  Declare the winner!
   *  @param {User Object} user
   */
  declareWinner: function (user) {

    this.gameOver = true;

    // adding a bit of a delay so the cube material has time to change color before declaring the winner.
    setTimeout(function() {
      if(user.isHuman){
        alert("Congrats " + user.name + ".  You win!");
        console.log("Congrats " + user.name + ".  You win!");
      } else {
        alert("You lose. Computer wins.");
        console.log("You lose.  Computer wins.");
      }
    }, 200);
  },


};
