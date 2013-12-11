var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};


/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
Demo.Scene.Setup = function (params) {

  this.context = params.context;

  this.numCubes = params.cubes;

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
    this.createCubes();
  },

  /**
   * Setup the render inforamtion.
   */
  setupRenderer: function () {
    this.context.renderer.setSize(this.width, this.height);
    this.context.container.appendChild(this.context.renderer.domElement);
  },

  /**
   *  Create cubes yo.
   *
   */
  createCubes: function () {

    var i,
        mesh,
        material,
        color,
        cube = new THREE.CubeGeometry(25, 25, 25);

    for(i = 0; i < this.numCubes; i++) {

      material = new THREE.MeshLambertMaterial({color: this.context.utils.randomColor()});

      this.mesh = new THREE.Mesh(cube, material);
      this.mesh.position.x = Math.random() * 100 - 50;
      this.mesh.position.y = Math.abs(Math.random() * 100 - 50);
      this.mesh.position.z = Math.random() * 100 - 50;

      this.context.collisions.push(this.mesh);
      this.context.scene.add(this.mesh);
    }
  }

};

