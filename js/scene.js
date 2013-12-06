var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

Demo.Scene = function (containerId, numcubes, marqueeBool, cacheBool) {

  this.scene = new THREE.Scene();
  this.projector = new THREE.Projector();
  this.renderer = new THREE.WebGLRenderer({antialias: true});

  this.jqContainer = $('#' + containerId);
  this.container = document.getElementById(containerId);
  // an array of scene elements we're interested with regards to collisions
  this.collisions = [];

  this.cameras = new Demo.Cameras(this);

  // i'm using the same code to run multiple demos, yo.
  if(marqueeBool){
    this.marquee = new Demo.Marquee(this);
  }
  if(cacheBool){
    this.cache = new Demo.Cache(this);
  }

  this.setup = new Demo.Scene.Setup({ context: this, cubes: numcubes});
  this.stats = null;

  this.rotateCamera = false;

  this.theta = 0;
  this.radius = 100;

  this.init();

};

Demo.Scene.prototype = {

  init: function () {
    this.listeners();
    this.statsSetup();

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
      requestAnimationFrame(demo.animate);
      demo.render();
      demo.stats.update();
  },

  /**
   * Renders the WebGL scene
   */
  render: function () {

    if(this.rotateCamera){
      this.theta += 0.1;

      this.cameras.liveCam.position.x = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.y = this.radius * Math.sin(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.position.z = this.radius * Math.cos(THREE.Math.degToRad(this.theta));
      this.cameras.liveCam.lookAt(this.scene.position);
    }

    // NOTE: using the global variable "demo" instead of "this".
    this.renderer.render(this.scene, demo.cameras.liveCam);
  }
};
