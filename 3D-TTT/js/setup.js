var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};


/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
Demo.Scene.Setup = function (params) {

  this.context = params.context;

  this.numCubes = params.cubes || 1;

  this.width = this.context.jqContainer.width();
  this.height = this.context.jqContainer.height();

  this.mesh = null;

  this.init();
};

Demo.Scene.Setup.prototype = {

  /**
   * Initialize all of the THREE.JS framework and additional code.
   */
  init: function () {

    this.setupRenderer();
    this.lights();
    this.createGeometry();
  },

  /**
   * Setup the render inforamtion.
   */
  setupRenderer: function () {
    this.context.renderer.setSize(this.width, this.height);
    this.context.container.appendChild(this.context.renderer.domElement);
  },

  /**
   * Add supporting geometry to the scene.  Axis helpers, stats, grid etc.
   */
  createGeometry: function () {
    this.context.scene.add(new THREE.AxisHelper(10));
  },

  /**
   * Add light(s) to the scene
   */
  lights: function () {

    var dl,
        rotatePos = 30 * Math.PI / 180,
        rotateNeg = -90 * Math.PI / 180;

    // this.context.scene.add(new THREE.AmbientLight(0xFFFFFF));

    dlPos = new THREE.DirectionalLight(0xFFFFFF, 1);
    dlPos.position.set(rotatePos,rotatePos,rotatePos);

    dlNeg = new THREE.DirectionalLight(0xFFFFFF, 1);
    dlNeg.position.set(rotateNeg,rotateNeg,rotateNeg);

    this.context.scene.add(dlPos);
    this.context.scene.add(dlNeg);

  },

  /**
   *  Create a random color
   */
  randomColor: function () {
      //cleverness via Paul Irish et al.
      return new THREE.Color().setHex('0x' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6));
  },

  /**
   *   Change a group of meshes to random colors.
   */
  highlight: function (meshes) {
    for(var i = 0; i < meshes.length; i++) {
      meshes[i].mesh.material.color = this.randomColor();
    }
  }
};

