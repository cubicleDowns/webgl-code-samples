var Demo = Demo || {};

Demo.Game = function (params) {

  // scene graph and other stuff.
  this.turn = 1;

  this.scene = null;

  this.gameOver = false;

  this.userDims = 0;

  this.userManager = new Demo.UserManager(this);

};

Demo.Game.prototype = {

  init: function () {

    var user = new Demo.Player.User({ context: this, name: "Josh", cssColor: "#0000FF", hexColor: 0x0000FF});
    var computer = new Demo.Player.Computer({context: this, cssColor: "#FF0000", hexColor: 0xFF0000});

    this.playerManager.addPlayer(user);
    this.playerManager.addPlayer(computer);

    $('#jqv').text($.fn.jquery);
    $('#tjsv').text(THREE.REVISION);

    this.listeners();

  },

  listeners: function () {

    var me = this;


    $("#toggle-arrows").on("click", function () {
      me.toggleArrows();
    });

    $("#toggle-rotation").on("click", function () {
      me._rotateCamera = (me._rotateCamera) ? false : true;
    });

    $("#numCubes").on("click", function (e) {

      $("body").append('<div id="ray-intersection"></div>');
      $("#what").fadeOut();

      var gameDims = parseInt($('#gridDimensions').val(), 10);
      me.userDims = gameDims;

      me.scene = new Demo.Scene("ray-intersection", gameDims);

      me.rayListener();

      me.scene.animate();

    });
  },

  // loop through all the rays and look to see if all of their collisions objects show the same values.
  //
  //    essentially, a ray will intersect all faces in one particular direction.  3 cubes = 6 faces = 6 intersections
  //    if all of the intersections show a 'selection' has take place, it'll check the selection types (ttt property)
  checkForTTT: function () {
    var i,j,
        collisions,
        ticUser1,
        ticUser2;

    for(i = 0; i < this.scene.rays.length; i++){
      collisions = this.scene.rays[i].intersectObjects(this.scene.collisions);
      ticUser1 = 0;
      ticUser2 = 0;

      for(j = 0; j < collisions.length; j++){
        if(collisions[j].object.ttt === 'user'){
          ticUser1++;
        } else if (this.scene.collisions[j].ttt === 'computer'){
          ticUser2++;
        }
      }

      if(ticUser1 === collisions.length){
        console.log("Tic Tac Toe - User 1");
        $('#winner').append("Tic Tac Toe - User 1 (red) is Winner!");
        alert("Tic Tac Toe - User 1 (red) is Winner!");
        this.gameOver = true;
      }

      if (ticUser2 === collisions.length){
        console.log("Tic Tac Toe - User 2 (black) - Winner");
        $('#winner').append("Tic Tac Toe - User 2 (black) - Winner");
        this.gameOver = true;
      }
    }

  },

  nextComputerTurn: function () {

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



  toggleArrows: function () {
    var i,
        vis;

    for(i = 0; i < this.scene.arrows.length; i++){
      this.scene.arrows[i].cone.visible = (this.scene.arrows[i].cone.visible) ? false : true;
      this.scene.arrows[i].line.visible = (this.scene.arrows[i].line.visible) ? false : true;
    }
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

  makeComputerSelection: function () {

  }

};
