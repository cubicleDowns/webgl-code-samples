var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

Demo.Scene = function (containerId) {

  this.scene = new THREE.Scene();
  this.projector = new THREE.Projector();
  this.renderer = new THREE.WebGLRenderer({antialias: true});

  this.jqContainer = $('#' + containerId);
  this.container = document.getElementById(containerId);

  // an array of scene elements we're interested in colliding with
  this.collisions = [];

  // arrows visualizing vectors
  this.arrows = [];

  this.cameras = new Demo.Cameras(this);
  this.setup = new Demo.Scene.Setup({ context: this, cubes: 3});
  this.stats = null;

  this.rotateCamera = false;

  this.theta = 0;
  this.radius = 100;

  this.init();

};

Demo.Scene.prototype = {

  init: function () {

    this.renderer.setClearColorHex( 0xEEEEEE, 0.2 );

    this.listeners();
    // this.statsSetup();
  },

  listeners: function () {
    var me = this;
    window.addEventListener('resize', me.onWindowResize, false);
  },

  onWindowResize: function (e) {
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
      requestAnimationFrame(_demo.animate);
      _demo.render();
      // _demo.stats.update();
      _demo.cameras.controls.update();
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
    this.renderer.render(this.scene, _demo.cameras.liveCam);
  }
};
