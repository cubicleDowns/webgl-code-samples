var Demo = Demo || {};
Demo.Player = Demo.Player || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Player.User = function ( params ) {

    this.context = params.context;

    this.name = params.name || "Player 1";

    this.uid = Demo.Util.generateUUID();

    this.hexColor = params.hexColor || 0x0000FF;
    this.cssColor = params.cssColor || "#0000FF";

    this.myTurn = false;

    this.init();

};

Demo.Player.User.prototype = {

  init: function () {
      this.rayListener();
  },

  takeTurn: function () {
      // do turn logic
      this.myTurn = true;
  },

  rayListener: function () {

    var me = this;
    $("#ray-intersection").on("click", function (e) {
      if(!me.context.gameOver && me.myTurn){
        me.selectCube(e);
        me.myTurn = false;
      }
    });
  },

  selectCube: function (event){

    var mouse = {},
      leftOffset,
      topOffset,
      vector,
      ray,
      intersected;

    event.preventDefault();


    // since this isn't a full screen app, lets use the dimensions of the container div.
    // OFFSET change.  Now I'll adjust the offset of the canvas element from the click.
    leftOffset = this.context.scene.jqContainer.offset().left;
    topOffset = this.context.scene.jqContainer.offset().top;

    mouse.x = ((event.clientX - leftOffset) / this.context.scene.jqContainer.width()) * 2 -1;
    mouse.y = -((event.clientY - topOffset) / this.context.scene.jqContainer.height()) * 2 + 1;

    vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    this.scene.projector.unprojectVector(vector, this.context.scene.cameras.liveCam);

    ray = new THREE.Raycaster(this.context.scene.cameras.liveCam.position, vector.sub(this.context.scene.cameras.liveCam.position).normalize());

    // Casting a ray to find if there is an intersection.
    intersected = ray.intersectObjects( this.context.scene.collisions );

    // only change the first (closest) intersected object.
    if(intersected.length > 0) {

      console.log('mesh num: ', intersected[0].object.cubeNum);

      if(intersected[0].object.ttt === null) {

        intersected[0].object.material.color = this.context.scene.setup.userColor1;
        intersected[0].object.ttt = 'user1';

        this.context.checkForTTT();

        if(!this.context.gameOver) {
            // after a short pause, execute user code.
            $.event.trigger({
              type: "nextTurn",
            });
        }
      }
    }
  },

};
