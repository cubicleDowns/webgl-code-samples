var Demo = Demo || {};

Demo = function (params) {

  // scene graph and other stuff.
  this.turn = 1;

  this.scene = null;

  this.gameOver = false;

  this._userDims = 0;

  this.userManager = [];

};

Demo.prototype = {

  init: function () {

    // this.userManager.push( new Demo.Player({ name: "Josh", cssColor: "#0000FF", hexColor: 0x0000FF, isComputer: true}) );
    // this.userManager.push( new Demo.Player({ name: "User", cssColor: "#FF0000", hexColor: 0xFF0000, isComputer: true}) );

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
      me._userDims = gameDims;

      me.scene = new Demo.Scene("ray-intersection", gameDims);

      me.rayListener();

      me.scene.animate();

    });
  },

  rayListener: function () {

    var me = this;

    $("#ray-intersection").on("click", function (e) {
      if(!me.gameOver){
        me.selectCube(e);
      }
    });

  },

  selectCube: function (event){

    var mouse,
      leftOffset,
      topOffset,
      vector,
      ray,
      status,
      intersected;

    event.preventDefault();

    mouse = {};

    // since this isn't a full screen app, lets use the dimensions of the container div.
    // OFFSET change.  Now I'll adjust the offset of the canvas element from the click.
    leftOffset = this.scene.jqContainer.offset().left;
    topOffset = this.scene.jqContainer.offset().top;

    mouse.x = ((event.clientX - leftOffset) / this.scene.jqContainer.width()) * 2 -1;
    mouse.y = -((event.clientY - topOffset) / this.scene.jqContainer.height()) * 2 + 1;

    vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    this.scene.projector.unprojectVector(vector, this.scene.cameras.liveCam);

    ray = new THREE.Raycaster(this.scene.cameras.liveCam.position, vector.sub(this.scene.cameras.liveCam.position).normalize());

    // Casting a ray to find if there is an intersection.
    intersected = ray.intersectObjects( this.scene.collisions );

    // only change the first (closest) intersected object.
    if(intersected.length > 0) {
      console.log('mesh num: ', intersected[0].object.cubeNum);
      if(intersected[0].object.ttt === null && this.turn === 1) {

        intersected[0].object.material.color = this.scene.setup.userColor1;
        intersected[0].object.ttt = 'user1';

        // only change turn if selection legit
        this.turn *= -1;

        if(!this.gameOver) {
          status = this.checkForTTT();

          if(!status){
            // after a short pause, execute user code.
            window.setTimeout(function(){
              demo.userTurn();
            }, 500);
          }
        }
      }
    }
  },

  userTurn: function () {
    var gridStatus = this.getGridStatus(),
      dimsMax = this._userDims * this._userDims * this._userDims;
      selection = yourTurn(gridStatus);

    if(selection >= 0 && selection < dimsMax){
      for(var i = 0; i < this.scene.collisions.length; i++){
        var cube = this.scene.collisions[i];
        if(cube.cubeNum === selection && cube.ttt === null) {
            console.log('computer selected cube ' + selection);
            cube.material.color = this.scene.setup.userColor2;
            cube.ttt = 'computer';
            this.turn *= -1;
            this.checkForTTT();
            return;
        }
      }
    } else {
      console.log("selection is not within 0-" + dimsMax );
    }

    // select again.
    this.userTurn();
  },

  getGridStatus: function () {
    var i,
        gridInfo = [];

    for(i = 0; i < this.scene.collisions.length; i++){
       cube = this.scene.collisions[i];

       var cubeInfo = {
         num: cube.cubeNum,
         selected: false,
         user: undefined,
       };

       if(!cube.ttt){
         cubeInfo.selected = false;
       } else {
         cubeInfo.selected = true;
         cubeInfo.user = cube.ttt;
       }
       gridInfo.push(cubeInfo);
    }

    return gridInfo;
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

    return this.gameOver;
  },

  nextComputerTurn: function () {

    var uhoh,
      bestSelection;

    uhoh = this.blockOpponentOrWin();

    if(!uhoh) {
      bestSelection = this.findBestSelection();
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
