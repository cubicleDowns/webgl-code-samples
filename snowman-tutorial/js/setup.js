var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};


/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
Demo.Scene.Setup = function (params) {

  this.context = params.context;

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
    this.setupLights();
    this.addGround();
  },

  /**
   * Setup the render inforamtion.
   */
  setupRenderer: function () {
    this.context.renderer.setSize(this.width, this.height);
    this.context.container.appendChild(this.context.renderer.domElement);
  },

  /**
   *
   */
  setupLights: function () {
    var spotLight,
      ambientLight,
      directionalLight;

    spotLight = new THREE.SpotLight( 0xCCCCCC);
    spotLight.position.set(-50, 200, -50);
    spotLight.lookAt(this.context.scene);
    this.context.scene.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0x909090 );
    this.context.scene.add(ambientLight);

    // directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.5);
    // this.context.scene.add(directionalLight);
   },

   addGround: function () {
    var geometry,
        material,
        object;

    geometry = new THREE.PlaneGeometry(500, 500, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
    object = new THREE.Mesh(geometry, material);

    object.position.set(0, 0, 0);
    object.rotation.set(this.context.utils.degreesToRadians(90), 0, 0);
    this.context.scene.add(object);
   }

};

