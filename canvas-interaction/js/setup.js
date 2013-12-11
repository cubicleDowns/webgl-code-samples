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
    this.createCubes();
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

      material = new THREE.MeshLambertMaterial({color: this.randomColor()});

      this.mesh = new THREE.Mesh(cube, material);
      this.mesh.position.x = Math.random() * 100 - 50;
      this.mesh.position.y = Math.random() * 100 - 50;
      this.mesh.position.z = Math.random() * 100 - 50;

      this.context.collisions.push(this.mesh);

      this.context.scene.add(this.mesh);
    }

  },

  /**
   * Add light(s) to the scene
   */
  lights: function () {

    var dl,
        rotate = 30 * Math.PI / 180;

    this.context.scene.add(new THREE.AmbientLight(0x999999));

    dl = new THREE.DirectionalLight(0xFFFFFF, 1);
    dl.position.set(rotate,rotate,rotate);

    this.context.scene.add(dl);
  },


  /**
   *   Change a group of meshes to random colors.
   *  -- this function is duplicated in marquee.js
   */
  highlight: function (meshes) {

    for(var i = 0; i < meshes.length; i++) {
      meshes[i].mesh.material.color = this.randomColor();
    }
  },

  /**
   *  Create a random color
   *  -- this function is duplicated in marquee.js
   */
  randomColor: function () {
      //cleverness via Paul Irish et al.  Thx Internets!
      return new THREE.Color().setHex('0x' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6));
  }

};

