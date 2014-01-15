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

  this.cameras = new Demo.Scene.Cameras(this, dims);
  this.setup = null;
  this.stats = null;

  this.players = [];

  this.rotateCamera = true;

  this.theta = 0;
  this.radius = 100;

  this.init(dims);

};

Demo.Scene.prototype = {

  init: function (dims) {

    this.setup = new Demo.Scene.Setup({ context: this, cubes: dims});
    this.listeners();
    // this.statsSetup();
  },

  listeners: function () {
    var me = this;
    window.addEventListener('resize', me.onWindowResize, false);
  },

  onWindowResize: function () {
    this.liveCam.aspect = this.jqContainer.width() / this.jqContainer.height();
    this.liveCam.updateProjectionMatrix();
    this.renderer.setSize(this.jqContainer.width(), this.jqContainer.height());
  },

  statsSetup: function () {
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild( this.stats.domElement );
  },

  /**
   * Animates the scene
   */
  animate: function () {
    // NOTE: using the global variable "demo" instead of "this".
      requestAnimationFrame(demo.scene.animate);
      demo.scene.render();
  },

  /**
   * Renders the WebGL scene
   */
  render: function () {

    if(this.rotateCamera){
      this.theta += 0.3;

      this.cameras.liveCam.position.x = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.y = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.z = this.radius * Math.cos(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.lookAt(this.scene.position);
    }

    // NOTE: using the global variable "demo" instead of "this".
    this.renderer.render(this.scene, demo.scene.cameras.liveCam);
  }
};
