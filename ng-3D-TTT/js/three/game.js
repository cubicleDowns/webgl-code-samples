var Demo = Demo || {};

Demo.Game = function (params) {

  this.turn = null;

  this.context = params.context;

  this.gameOver = false;

  this.userDims = null;

  this.playerManager = null;

};

Demo.Game.prototype = {

  init: function (params) {

    var user, computer;

    this.playerManager = new Demo.PlayerManager({context: this, turn: params.userFirst});


    user = new Demo.Player.User({ context: this, name: params.userName, cssColor: params.userColor}),
    computer = new Demo.Player.Computer({context: this, cssColor: "#FF0000"});

    // add user first b/c of userFirst turn value.
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

    for(i = 0; i < this.context.rays.length; i++){
      collisions = this.context.rays[i].intersectObjects(this.context.collisions);
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
