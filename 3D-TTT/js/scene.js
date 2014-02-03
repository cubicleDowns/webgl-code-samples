var Demo = Demo || {};

Demo.Scene = function (containerId, dims) {

  this.scene = new THREE.Scene();
  this.projector = new THREE.Projector();
  this.renderer = new THREE.WebGLRenderer({antialias: true});

  this.jqContainer = $('#' + containerId);
  this.container = document.getElementById(containerId);

  // an array of scene elements we're interested in colliding with
  this.collisions = [];

  // rays for casting.
  this.rays = [];

  // arrows visualizing vectors
  this.arrows = [];

  this.cameras = null;
  this.setup = null;
  this.controls = null;

  this.players = [];

  this.rotateCamera = true;

  this.theta = 0;
  this.radius = 100;

  this.init(dims);

};

Demo.Scene.prototype = {

  init: function (dims) {

    var params = {context: this, cubes: dims};
    this.cameras = new Demo.Scene.Cameras(params);
    this.setup = new Demo.Scene.Setup(params);
    this.controls = new THREE.OrbitControls( this.cameras.liveCam, this.container );

    this.listeners();
  },

  listeners: function () {
    var me = this;
    window.addEventListener('resize', me.onWindowResize, false);
  },

  /**
   * Resizes the camera when document is resized.
   * @return {[type]}
   */
  onWindowResize: function () {
    this.liveCam.aspect = this.jqContainer.width() / this.jqContainer.height();
    this.liveCam.updateProjectionMatrix();
    this.renderer.setSize(this.jqContainer.width(), this.jqContainer.height());
  },


  /**
   * Animates the scene
   * @param {Boolean} animate
   */
  animate: function (animate) {
    this.rotateCamera = animate || true;
    // NOTE: using the global variable "demo" instead of "this".
      requestAnimationFrame(demo.scene.animate);
      demo.scene.render();
  },

  /**
   * Renders the WebGL scene
   */
  render: function () {

    this.controls.update();

    if(this.rotateCamera){
      this.theta += 0.3;

      this.cameras.liveCam.position.x = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.y = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.z = this.radius * Math.cos(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.lookAt(this.scene.position);
    } else {
      this.controls.update();
    }

    // NOTE: using the global variable "demo" instead of "this".
    this.renderer.render(this.scene, demo.scene.cameras.liveCam);
  }
};
