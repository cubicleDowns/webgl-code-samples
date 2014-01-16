var Demo = Demo || {};
Demo.Player = Demo.Player || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Player.Computer = function ( params ) {

  this.context = params.context;
  this.name = params.name || "Computer";
  this.cssColor = params.color || "#FF0000";
  this.random = params.random || true;

  this.isHuman = false;

  this.uid = Demo.Util.generateUUID();

};


Demo.Player.Computer.prototype = {

  /**
   * Computer turn.  Either a random choice or a calculated turn.
   * @return {[type]} [description]
   */
  takeTurn: function () {

    if(this.random){
      this.randomTurn();
    } else {
      this.calculatedTurn();
    }
  },

  /**
   * Selects a random cube.  If that cube hasn't been selected, it is then selected.
   * @return {[type]}
   */
  randomTurn: function () {
    var i,
      me = this,
      cube,
      randomVal = Demo.Util.randomTTTCube(this.context.userDims);

    cube = this.context.scene.collisions[randomVal];

    // if the interesected cube hasn't been selected, make the selection!
    if(cube.ttt === null){
      this.makeSelection(cube);
    } else {
      this.randomTurn();
    }
  },

  /**
   * Makes the cube selection for the computer.   Adds a slight delay for realism.
   * @param  {THREE.Mesh} cube [description]
   */
  makeSelection: function (cube) {
    var me = this;

    setTimeout(function () {
      Demo.Util.selectCube(cube, {color: me.cssColor, name: me.name });
      me.context.checkForTTT();
      if(!me.context.gameOver){
        // adding a little delay for realism.
        $.event.trigger({
          type: "nextTurn",
        });
      }
    }, 600);

  },

  //TODO
  calculatedTurn: function () {

    var uhoh,
      bestSelection;

    uhoh = this.blockOpponentOrWin();

    if(!uhoh) {
      bestSelection = this.findBestSelection();
    } else {
      bestSelection = uhoh.shift();
    }

    this.makeComputerSelection(bestSelection);
  },

  //TODO
  findTurn: function () {

  },

  //TODO
  blockOpponent: function () {

  },

  // looks for rays intersections sets where a single cube has not been selected.
  blockOpponentOrWin: function () {

    var i,j,
        lossSlots = [],
        winSlots = [],
        collisions,
        personUser,
        computerUser;

    for(i = 0; i < this.scene.rays.length; i++){
      collisions = this.scene.rays[i].intersectObjects(this.scene.collisions);
      personUser = 0;
      computerUser = 0;

      for(j = 0; j < collisions.length; j++){
        if(collisions[j].object.ttt === 'user'){
          personUser++;
        } else if (this.scene.collisions[j].ttt === 'computer'){
          computerUser++;
        }
      }

      // push the positions that have N-1 selections from the human user already
      if(personUser === (collisions.length - 2)){
        lossSlots.push(collisions[j].object.num);
      }

      // push the positions that have N-1 selections from the computer user already
      // these are winning selections
      if (computerUser === (collisions.length - 2)){
        winSlots.push(collisions[j].object.num);
      }
    }

    // return win slots first.
    // return the loss slots second.
    // else, return false as there aren't any win or loss selection options.
    if(winSlots.length > 0){
      return winSlots;
    } else if(blockSlots.length > 0) {
      return blockSlots;
    } else {
      return false;
    }
  },

  setupWeightObject: function () {
    var i,
      weights = {},
      maxDims = this.userDims * this.userDims * this.userDims;

    for(var i = 0; i < maxDims; i++){
      weights[i] = {computer: 0, user: 0};
    }
  },

  // finds the best selection location for the computer
  findBestSelection: function () {
    var i,j,
        collisions,
        ticUser1,
        ticUser2,
        weighting;

    weighting = this.setupWeightObject();

    for(i = 0; i < this.scene.rays.length; i++){
      collisions = this.scene.rays[i].intersectObjects(this.scene.collisions);

      for(j = 0; j < collisions.length; j++){
        if(collisions[j].object.ttt === 'user'){
          weighting[collisions[j].object.num].user++;
        } else if (this.scene.collisions[j].ttt === 'computer'){
          weighting[collisions[j].object.num].computer++;
        }
      }
    }

    return weighting;
  },


};
