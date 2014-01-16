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

    this.cssColor = params.cssColor || "#0000FF";

    this.myTurn = true;

    this.isHuman = true;

};

Demo.Player.User.prototype = {

  takeTurn: function () {
    this.enableClick();
  },

  enableClick: function () {

    var me = this;

    // this.myTurn = true;
    $("#ray-intersection").bind("click", function (e){
      if(!me.context.gameOver){
        me.selectCube(e);
      }
    });
  },

  disableClick: function () {
    $("#ray-intersection").unbind('click');
  },

  getTurn: function () {
    return this.myTurn;
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
    this.context.scene.projector.unprojectVector(vector, this.context.scene.cameras.liveCam);

    ray = new THREE.Raycaster(this.context.scene.cameras.liveCam.position, vector.sub(this.context.scene.cameras.liveCam.position).normalize());

    // Casting a ray to find if there is an intersection.
    intersected = ray.intersectObjects( this.context.scene.collisions );

    // only change the first (closest) intersected object.
    if(intersected.length > 0) {

      if(intersected[0].object.ttt === null) {

        Demo.Util.selectCube(intersected[0].object, {color: this.cssColor, name: this.name });

        this.context.checkForTTT();
        this.disableClick();

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
