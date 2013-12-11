var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};


/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
Demo.Scene.Utils = function (context) {

  this.context = context;

  this.init();

};

Demo.Scene.Utils.prototype = {

  init: function () {
    this.listener();
  },

  listener: function () {

    var me = this;

    this.context.jqContainer.on('click', function (event) {
      me.castRay(event);
    });

  },

  degreesToRadians: function (d) {

    return (d * Math.PI) / 180;

  },

  /**
   *  Create a random color
   *  -- this function is duplicated in marquee.js
   */
  randomColor: function () {
      //cleverness via Paul Irish et al.  Thx Internets!
      return new THREE.Color().setHex('0x' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6));
  },

  castRay: function (event) {

    event.preventDefault();

    var mouse = {};

    // since this isn't a full screen app, lets use the dimensions of the container div.
    // OFFSET change.  Now I'll adjust the offset of the canvas element from the click.
    var leftOffset = demo.jqContainer.offset().left;
    var topOffset = demo.jqContainer.offset().top;

    mouse.x = ((event.clientX - leftOffset) / demo.jqContainer.width()) * 2 -1;
    mouse.y = -((event.clientY - topOffset) / demo.jqContainer.height()) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    demo.projector.unprojectVector(vector, demo.cameras.liveCam);

    var ray = new THREE.Raycaster(demo.cameras.liveCam.position, vector.sub(demo.cameras.liveCam.position).normalize());

    // Casting a ray to find if there is an intersection.
    // Notice I reference an array of the cubes added to the scene.
    //   This is to prevent the ray from intersecting with any non-cube meshes.
    var intersected = ray.intersectObjects( demo.scene.children );

    // removing previous click marker.
    $(".clickMarkers").remove();

    // appending a click marker.
    demo.jqContainer.append('<div class="clickMarkers" style="pointer-events:none; position: absolute; z-index: 100; left: ' + event.offsetX + 'px; top: ' + event.offsetY +'px">*</div>' );

    // only change the first intersected object.
    if(intersected.length > 0) {
      intersected[0].object.material.color = this.randomColor();
    }
  }

};
