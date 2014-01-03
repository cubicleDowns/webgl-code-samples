var Demo = Demo || {};

Demo.Game = function (params) {

  this.game;

  // scene graph and other stuff.
  this.demo;

  this._gameDims = 3;
  this._cubeSeperation = 25;
  this._cubeDimension = 10;
  this._turn = 0;
  this._rays = [];

  this._collisions = [];

  this._rotateCamera = false;

  this.gameOver = false;

  this._userManager = [];

  this.userColor1 = new THREE.Color(0xFF434C);
  this.userColor2 = new THREE.Color(0x00CC00);
  this.cubeColor1 = new THREE.Color(0x6ACEEB);
  this.cubeColor2 = new THREE.Color(0xFFFFFF);
  this.cubeColor3 = new THREE.Color(0xCCCCCC);

};

Demo.Game.prototype = {

  init: function () {
    this.userManager.push( new Demo.Player({ name: "Josh", cssColor: "#0000FF", hexColor: 0x0000FF, isComputer: true}) );
    this.userManager.push( new Demo.Player({ name: "User", cssColor: "#FF0000", hexColor: 0xFF0000, isComputer: true}) );

    $('#jqv').text($.fn.jquery);
    $('#tjsv').text(THREE.REVISION);

    this.listeners();

  },

  listeners: function () {

    var me = this;

    $("#ray-intersection").on("click", function (e) {
      if(!this.gameOver){
        me.selectCube(e);
      }
    });

    $("#toggle-arrows").on("click", function () {
      me.toggleArrows();
    });

    $("#toggle-rotation").on("click", function () {
      me._rotateCamera = (me._rotateCamera) ? false : true;
    });

    $("#numCubes").on("click", function (e) {

      $("body").append('<div id="ray-intersection"></div>');
      $("#what").fadeOut();

      me._gameDims = $('#gridDimensions').val();

      me.demo = new Demo.Scene("ray-intersection", me._gameDims);
      me.rotateCamera = true;

      me.displacement = (me.cubeSeparation * (me._gameDims -1))/2;

      me.createCubes(displacement);
      me.createRays(displacement);

      // start the animation
      // this also does all of the setup.  i've encapsulated all of this work for brevity.
      me.animate();

    });
  },


  selectCube: function (event){

    event.preventDefault();

    var mouse = {};

    // since this isn't a full screen app, lets use the dimensions of the container div.
    // OFFSET change.  Now I'll adjust the offset of the canvas element from the click.
    var leftOffset = _demo.jqContainer.offset().left;
    var topOffset = _demo.jqContainer.offset().top;

    mouse.x = ((event.clientX - leftOffset) / _demo.jqContainer.width()) * 2 -1;
    mouse.y = -((event.clientY - topOffset) / _demo.jqContainer.height()) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    _demo.projector.unprojectVector(vector, _demo.cameras.liveCam);

    var ray = new THREE.Raycaster(_demo.cameras.liveCam.position, vector.sub(_demo.cameras.liveCam.position).normalize());

    // Casting a ray to find if there is an intersection.
    var intersected = ray.intersectObjects( _demo.collisions );

    // only change the first (closest) intersected object.
    if(intersected.length > 0) {
      console.log('mesh num: ', intersected[0].object.cubeNum);
      // if(!intersected[0].object.ttt && turn === 1) {
      if(intersected[0].object.ttt === undefined && turn === 1) {


        intersected[0].object.material.color = userColor1;
        intersected[0].object.ttt = 'user1';

        // only change turn if selection legit
        turn *= -1;

        if(!gameOver) {
          checkForTTT();
          // after a short pause, execute user code.
          window.setTimeout(function(){
            userTurn();
          }, 500);
        }
      }
    }
  },

  userTurn: function () {
    var gridStatus = getGridStatus(),
      selection = yourTurn(gridStatus);

    getGridStatus();

    if(selection >= 0 && selection <= 26){
      for(var i = 0; i < _demo.collisions.length; i++){
        var cube = _demo.collisions[i];
        if(cube.cubeNum === selection && cube.ttt === undefined) {
            console.log('computer selected cube ' + selection);
            cube.material.color = userColor2;
            cube.ttt = 'user2';
            turn *= -1;
            checkForTTT();
            return;
        }
      }
    } else {
      console.log("selection is not within 0-26");
    }

    // select again.
    this.userTurn();
  },

  getGridStatus: function () {
    var i,
        gridInfo = [];

    for(i = 0; i < _demo.collisions.length; i++){
       cube = _demo.collisions[i];

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

    for(i = 0; i < rays.length; i++){
      collisions = rays[i].intersectObjects(_demo.collisions);
      ticUser1 = 0;
      ticUser2 = 0;

      for(j = 0; j < collisions.length; j++){
        if(collisions[j].object.ttt === 'user1'){
          ticUser1++;
        } else if (collisions[j].object.ttt === 'user2'){
          ticUser2++;
        }
      }

      if(ticUser1 === collisions.length){
        console.log("Tic Tac Toe - User 1");
        $('#winner').append("Tic Tac Toe - User 1 (red) is Winner!");
        alert("Tic Tac Toe - User 1 (red) is Winner!");

        gameOver = true;
      }

      if (ticUser2 === collisions.length){
        console.log("Tic Tac Toe - User 2 (black) - Winner");
        $('#winner').append("Tic Tac Toe - User 2 (black) - Winner");
        gameOver = true;
      }
    }
  },

  toggleArrows: function () {
    var i,
        vis;

    for(i = 0; i < _demo.arrows.length; i++){
      _demo.arrows[i].cone.visible = (_demo.arrows[i].cone.visible) ? false : true;
      _demo.arrows[i].line.visible = (_demo.arrows[i].line.visible) ? false : true;
    }
  },

  blockOpponent: function () {

  },

  // looks for any ray with TWO of your own spots already selected
  // looks for any ray with
  selectBestLocation: function () {

  },

};
