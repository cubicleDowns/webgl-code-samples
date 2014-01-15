var Demo = Demo || {};
Demo.Player = Demo.Player || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Player.Computer = function ( params ) {

  this.context = params.context;

  this.name = params.name || "Computer";

  this.uid = Demo.Util.generateUUID();

  this.hexColor = 0xFF0000;  // red
  this.cssColor = "#FF0000";

  this.random = params.random || true;

};


Demo.Player.Computer.prototype = {

  takeTurn: function () {

    if(this.random){
      this.randomTurn();
    } else {

    }

    if(!this.context.gameOver){
      $.event.trigger({
        type: "nextTurn",
      });
    }
  },

  /**
   * Selects a random cube.  If that cube hasn't been selected, it is then selected.
   * @return {[type]}
   */
  randomTurn: function () {
    var i,
      cube,
      randomVal = Demo.Util.randomTTTCube(this.context.userDims);

    cube = this.context.scene.collisions[randomVal];

    if(cube.ttt === null){
      cube.ttt = this.name;
      cube.material.color = this.hexColor;
      this.context.checkTTT();
    } else {
      this.randomTurn();
    }
  },


  findTurn: function () {

  },

  blockOpponent: function () {

  },



};
