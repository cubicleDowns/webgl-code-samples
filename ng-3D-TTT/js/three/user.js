var Demo = Demo || {};
Demo.Player = Demo.Player || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Player.User = function ( params ) {

    this.manager = params.context;

    this.name = params.name || "Player 1";

    this.uid = Demo.Util.generateUUID();

    this.cssColor = params.cssColor || "#0000FF";

    this.myTurn = true;

    this.isHuman = true;

};

Demo.Player.User.prototype = {

  /**
   * User takes a turn.  Called from the Player Manager
   * @return {[type]} [description]
   */
  takeTurn: function () {
    this.enableClick();
  },

  /**
   * Enables the click function.  Keeps interaction minimized when it isn't the user's turn.
   * @return {[type]} [description]
   */
  enableClick: function () {
    var me = this;
    $(document).bind("userClick", function (mouse){
      me.selectCube(mouse.message);
    });
  },


  /**
   * Unbind the disableClick
   */
  disableClick: function () {
    $(document).unbind("userClick");
  },

  /**
   * Cast a ray and select a cube if not already selected.
   * @param  {[type]} event Event information including mouse coordinates.
   * @return {[type]}       [description]
   */
  selectCube: function (mouseInfo){

    var mouse = {},
      leftOffset,
      topOffset,
      vector,
      ray,
      intersected;

    vector = new THREE.Vector3(mouseInfo.x, mouseInfo.y, 1);
    this.manager.context.projector.unprojectVector(vector, this.manager.context.cameras.liveCam);

    ray = new THREE.Raycaster(this.manager.context.cameras.liveCam.position, vector.sub(this.manager.context.cameras.liveCam.position).normalize());

    // Casting a ray to find if there is an intersection.
    intersected = ray.intersectObjects( this.manager.context.collisions );

    // only change the first (closest) intersected object.
    if(intersected.length > 0) {

      if(intersected[0].object.ttt === null) {
        Demo.Util.selectCube(intersected[0].object, {color: this.cssColor, name: this.name });

        this.manager.checkForTTT();
        this.disableClick();

        if(!this.manager.gameOver) {
            // after a short pause, execute user code.
            $.event.trigger({
              type: "nextTurn",
            });
        }
      }
    }
  },

};
