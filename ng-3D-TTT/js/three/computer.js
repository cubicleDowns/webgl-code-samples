var Demo = Demo || {};
Demo.Player = Demo.Player || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Player.Computer = function ( params ) {

  this.manager = params.context;
  this.name = params.name || "Computer";
  this.cssColor = params.color || "#FF0000";
  this.random = params.random || true;

  this.scene = this.manager.context;

  this.random = false;

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
      randomVal = Demo.Util.randomTTTCube(this.manager.context.dims);

    cube = this.manager.context.collisions[randomVal];
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
      me.manager.checkForTTT();
      if(!me.manager.gameOver){
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

    this.makeSelection(bestSelection);
  },

  // looks for rays intersections sets where a single cube has not been selected.
  blockOpponentOrWin: function () {

    var i,j,
        lossSlots = [],
        winSlots = [],
        collisions,
        personUser,
        emptyUser,
        computerUser;

    var computerName = (this.name === this.manager.playerManager.players[0].name) ? this.name : this.manager.playerManager.players[1].name;
    var userName = (this.name !== computerName) ? this.manager.playerManager.players[1].name : this.manager.playerManager.players[0].name;


    for(i = 0; i < this.scene.rays.length; i++){

      var ray = this.scene.rays[i];

      collisions = Demo.Util.removeDupes(this.scene.rays[i].intersectObjects(this.scene.collisions));
      personUser = 0;
      emptyUser = 0;
      computerUser = 0;

      for(j = 0; j < collisions.length; j++){
        if(collisions[j].ttt === userName){
          personUser++;
        } else if (collisions[j].ttt === computerName){
          computerUser++;
        } else if (collisions[j].ttt === null){
          emptyUser++;
        }
      }

      // some of the ray tracing code wasn't returning the correct number of intersections.
      if(collisions.length < this.scene.dims ){
        debugger;
      }

      // push the positions that have N-1 selections from the human user already
      if(personUser === (collisions.length - 1) && computerUser === 0){
        for(var k = 0; k < collisions.length; k++){
          if(collisions[k].ttt === null){
            lossSlots.push(collisions[k]);
            break;
          }
        }
      }

      // push the positions that have N-1 selections from the computer user already
      // these are winning selections
      if (computerUser === (collisions.length - 1) && personUser === 0){
        for(var l = 0; l < collisions.length; l++){
          //only push
          if(collisions[l].ttt === null){
            winSlots.push(collisions[l]);
            break;
          }
        }
      }
    }

    // return win slots first.
    // return the loss slots second.
    // else, return false as there aren't any win or loss selection options.
    if(winSlots.length > 0){
      return winSlots;
    } else if(lossSlots.length > 0) {
      return lossSlots;
    } else {
      return false;
    }
  },

  setupWeightObject: function () {
    var i,
      weights = {},
      maxDims = Math.pow(this.scene.dims, 3);

    for(i = 0; i < maxDims; i++){
      weights[i] = {computer: 0, user: 0, empty: 0};
    }

    return weights;
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
      collisions = Demo.Util.removeDupes(this.scene.rays[i].intersectObjects(this.scene.collisions));

      for(j = 0; j < collisions.length; j++){
        if(collisions[j].ttt === this.manager.playerManager.players[0].name){
          weighting[collisions[j].cubeNum].user++;
        } else if (this.scene.collisions[j].ttt === this.manager.playerManager.players[1].name){
          weighting[collisions[j].cubeNum].computer++;
        } else {
          weighting[collisions[j].cubeNum].empty++;
        }
      }
    }

    var cubeWeights = this.selectHighestWeightedCube(weighting);
    var num = this.selectCubeFromWeightedCategories(cubeWeights);

    return this.scene.collisions[num];

  },

  selectCubeFromWeightedCategories: function (cubeWeights) {

    var selectedCube = null;




    if (cubeWeights.computer[0] !== 0 && cubeWeights.user[0] !== 0) {

      var comp = cubeWeights.computer[0];
      var user = cubeWeights.user[0];

      selectedCube = (comp.weight > user.weight) ? comp.cube : user.cube;

      console.count('joint decision');

    } else if(cubeWeights.computer[0].weight !== 0){
      // look in computer weighted cubes for onethat hasn't been selected yet
      for(var i = 0; i < cubeWeights.computer.length; i++){
        if(this.scene.collisions[cubeWeights.computer[i].cube].ttt === null){
          selectedCube = cubeWeights.computer[i].cube;
          break;
        }
      }
    } else {
      // look in empty weighted cubes for one that hasn't been selected yet.
      for(var i = 0; i < cubeWeights.empty.length; i++){
        if(this.scene.collisions[cubeWeights.empty[i].cube].ttt === null){
          selectedCube = cubeWeights.empty[i].cube;
          break;
        }
      }
    }


    return selectedCube;
  },

  selectHighestWeightedCube: function (weights){

    var emptyHighest = [];
    var userHighest = [];
    var computerHighest = []

    var highestEmpty = {cube: null, weight: 0},
      highestComputer = {cube: null, weight: 0},
      highestUser = {cube: null, weight: 0};

    for(var i in weights){


      if(weights[i].empty >= highestEmpty.weight){
        emptyHighest.push({cube: i, weight: weights[i].empty});
      }
      if(weights[i].user >= highestUser.weight){
        userHighest.push({cube: i, weight: weights[i].user});
      }

      if(weights[i].computer >= highestUser.weight){
        computerHighest.push({cube: i, weight: weights[i].computer});
      }

    }

    emptyHighest.sortOn("weight");
    computerHighest.sortOn("weight");
    userHighest.sortOn("weight");

    emptyHighest.reverse();
    computerHighest.reverse();
    userHighest.reverse();

    return {empty: emptyHighest, computer: computerHighest, user: userHighest};
  },


};
