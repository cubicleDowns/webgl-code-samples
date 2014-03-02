var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
Demo.Scene.Setup = function (params) {

  this.context = params.context;

  this.gameDimensions = this.context.dims;

  this.WIDTH = this.context.container.clientWidth;
  this.HEIGHT = this.context.container.clientHeight;

  // size of a cube
  this.cubeDim = SETUP.CUBES.DIMENSION;

  // distance between cube centroids  [5c5]555[5c5]555[5c5] etc.
  this.cubeSeparation = SETUP.CUBES.SEPERATION;

  this.displacement = (this.cubeSeparation * (this.gameDimensions - 1))/2;

  this.mesh = null;

  this.cubeColor1 = new THREE.Color(SETUP.COLORS.CUBE1);
  this.cubeColor2 = new THREE.Color(SETUP.COLORS.CUBE2);
  this.cubeColor3 = new THREE.Color(SETUP.COLORS.CUBE3);

  this.numTextures = [];

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
    this.context.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.context.jqContainer.fadeIn();
  },

  /**
   * Add supporting geometry to the scene.  Axis helpers, stats, grid etc.
   */
  createGeometry: function () {

    if(SETUP.SCENE.HELPERS){
      this.context.scene.add(new THREE.AxisHelper(10));
    }

    this.cubeTextures();
    this.createCubes();
    this.createRays();
  },

  cubeTextures: function () {

    var max = Math.pow(this.gameDimensions, 3);


    for(var i = 0; i < max; i++){

      var canvas = document.createElement('canvas');
      var size = 128;
      canvas.width = size;
      canvas.height = size;

      var context = canvas.getContext('2d');
      var texture;

      context.fillStyle = "#FFF000";
      context.fillRect = (0,0,size,size);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "55px Arial";
      context.fillStyle = "#FF0000";
      context.fillText(i, size/2, size/2);
      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      this.numTextures.push(texture);
    }
  },

  /**
   * Add light(s) to the scene
   */
  lights: function () {

    var dl,
      rotatePos = 30 * Math.PI / 180,
      rotateNeg = -90 * Math.PI / 180;

    dlPos = new THREE.DirectionalLight(0xFFFFFF, 1);
    dlPos.position.set(rotatePos,rotatePos,rotatePos);

    dlNeg = new THREE.DirectionalLight(0xFFFFFF, 1);
    dlNeg.position.set(rotateNeg,rotateNeg,rotateNeg);

    this.context.scene.add(dlPos);
    this.context.scene.add(dlNeg);

  },

  createCubes: function () {

    var i,j,k,
      mesh,
      mat,
      num = 0,
      geo = new THREE.CubeGeometry(this.cubeDim, this.cubeDim, this.cubeDim, 1, 1, 1),
      materialOutside = new THREE.MeshLambertMaterial({color: this.cubeColor2}),
      cubeGroup = new THREE.Object3D();

    // just in case this is executed twice
    this.context.collisions = [];

    var l = 0;


    // this approach should work for any dimension tic-tac-toe setup.  e.g. 4x4x4
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){
        for(k = 0; k < this.gameDimensions; k++){


          // var mesh = new THREE.Mesh(geo.clone(), materialOutside.clone());
          if(SETUP.DEBUG_MODE){
            mat = new THREE.MeshBasicMaterial({map: this.numTextures[num]});
          } else {
            mat = materialOutside;
          }
          mesh = new THREE.Mesh(geo.clone(), mat);
          mesh.cubeNum = num;
          mesh.position = new THREE.Vector3((i)*this.cubeSeparation - this.displacement, (j)*this.cubeSeparation - this.displacement, (k)*this.cubeSeparation - this.displacement);

          // this is the signifier for the Tic-Tac-Toe choice.
          mesh.ttt = null;
          // this is a sequential number.   i prefer a linear sequence.
          num++;

          // instead of using scene.children, I create an array for ray collisions.
          this.context.collisions.push(mesh);
          this.context.scene.add(mesh);
        }
      }
    }
  },

  /**
   * Creates rays for ray-casting.
   */
  createRays: function () {

    var setup = {
        xDirection: xDirection = new THREE.Vector3(-1,0,0),
        yDirection: yDirection = new THREE.Vector3(0,-1,0),
        zDirection: zDirection = new THREE.Vector3(0,0,-1),
        xy1Direction: xy1Direction = new THREE.Vector3(-1,-1,0).normalize(),
        xy2Direction: xy2Direction = new THREE.Vector3(-1,1,0).normalize(),
        xz1Direction: xz1Direction = new THREE.Vector3(-1,0,-1).normalize(),
        xz2Direction: xz2Direction = new THREE.Vector3(-1,0,1).normalize(),
        yz1Direction: yz1Direction = new THREE.Vector3(0,-1,-1).normalize(),
        yz2Direction: yz2Direction = new THREE.Vector3(0,1,-1).normalize(),
        xyz1Direction: xyz1Direction = new THREE.Vector3(-1,-1,-1).normalize(),
        xyz2Direction: xyz2Direction = new THREE.Vector3(1,-1,-1).normalize(),
        xyz3Direction: xyz3Direction = new THREE.Vector3(-1,-1,1).normalize(),
        xyz4Direction: xyz4Direction = new THREE.Vector3(1,-1,1).normalize(),
        length: 20
    };

    // should be this.gameDimensions^3 of these guys.
    this.create2DVectors(setup);

    // should be 18 of these guys  (for a 3x3x3)
    this.create2DDiagonals(setup);

    // should be 4 of these guys
    this.create3DDiagonals(setup);
  },

  /**
   * Create all 2D vectors
   * @param  {Object} setup Setup object containing all normalized vector directions.
   */
  create2DVectors: function (setup) {
    var i,j,
        x,y,z,
        arrow,
        origin,
        ray;

    // create rays looking down X
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){

        x = (this.gameDimensions) * this.cubeSeparation;
        y = i * this.cubeSeparation - this.displacement;
        z = j * this.cubeSeparation - this.displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.xDirection, origin, setup.length, 0xFF0000);

        this.context.scene.add(arrow);
        this.context.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.xDirection);
        ray.name = "2D - down X - red";
        this.context.rays.push(ray);
      }
    }

    // create rays looking down Y
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){

        y = (this.gameDimensions + 1) * this.cubeSeparation;
        x = (i * this.cubeSeparation) - this.displacement;
        z = (j * this.cubeSeparation) - this.displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.yDirection, origin, setup.length, 0x00FF00);

        this.context.scene.add(arrow);
        this.context.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.yDirection);
        ray.name = "2D - down Y - green";
        this.context.rays.push(ray);

      }
    }

    // create rays looking down Z
    for(i = 0; i < this.gameDimensions; i++){
      for(j = 0; j < this.gameDimensions; j++){

        z = (this.gameDimensions + 1) * this.cubeSeparation;
        y = (i * this.cubeSeparation) - this.displacement;
        x = (j * this.cubeSeparation) - this.displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.zDirection, origin, setup.length, 0x0000FF);

        this.context.scene.add(arrow);
        this.context.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.zDirection);
        ray.name = "2D - down Z - green";
        this.context.rays.push(ray);
      }
    }
  },

  create2DDiagonals: function (setup) {
    var i,j,
        x,y,z,
        arrow1,
        arrow2,
        origin1,
        origin2,
        ray1,
        ray2;

    // create rays for XY diagonals
    for(i = 0; i < this.gameDimensions; i++){

        x = (this.gameDimensions + 1) * this.cubeSeparation;
        y = (this.gameDimensions + 1) * this.cubeSeparation;
        z = (i * this.cubeSeparation) - this.displacement;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,-y,z);

        arrow1 = new THREE.ArrowHelper(setup.xy1Direction, origin1, setup.length, 0xFFF000);
        arrow2 = new THREE.ArrowHelper(setup.xy2Direction, origin2, setup.length, 0xFFF000);

        this.context.scene.add(arrow1);
        this.context.scene.add(arrow2);

        this.context.arrows.push(arrow1);
        this.context.arrows.push(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.xy1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.xy2Direction);

        ray1.name = "2D diag - yellow";
        ray2.name = "2D diag - yellow";

        this.context.rays.push(ray1);
        this.context.rays.push(ray2);
    }

    // create rays for XZ diagonals
    for(i = 0; i < this.gameDimensions; i++){

        x = (this.gameDimensions + 1) * this.cubeSeparation;
        y = (i * this.cubeSeparation) - this.displacement;
        z = (this.gameDimensions + 1) * this.cubeSeparation;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,y,-z);

        arrow1 = new THREE.ArrowHelper(setup.xz1Direction, origin1, setup.length, 0xFF00FF);
        arrow2 = new THREE.ArrowHelper(setup.xz2Direction, origin2, setup.length, 0xFF00FF);

        this.context.scene.add(arrow1);
        this.context.scene.add(arrow2);

        this.context.arrows.push(arrow1);
        this.context.arrows.push(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.xz1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.xz2Direction);

        ray1.name = "2D diag - pink";
        ray2.name = "2D diag - pink";

        this.context.rays.push(ray1);
        this.context.rays.push(ray2);
    }

    // create rays for YZ diagonals
    for(i = 0; i < this.gameDimensions; i++){

        x = (i * this.cubeSeparation) - this.displacement;
        y = (this.gameDimensions + 1) * this.cubeSeparation;
        z = (this.gameDimensions + 1) * this.cubeSeparation;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,-y,z);

        arrow1 = new THREE.ArrowHelper(setup.yz1Direction, origin1, setup.length, 0x00FFFF);
        arrow2 = new THREE.ArrowHelper(setup.yz2Direction, origin2, setup.length, 0x00FFFF);

        this.context.arrows.push(arrow1);
        this.context.arrows.push(arrow2);

        this.context.scene.add(arrow1);
        this.context.scene.add(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.yz1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.yz2Direction);

        ray1.name = "2D diag - aqua";
        ray2.name = "2D diag - aqua";

        this.context.rays.push(ray1);
        this.context.rays.push(ray2);

    }
  },

  create3DDiagonals: function (setup) {
    var i,j,
        x,y,z,
        arrow1, arrow2, arrow3, arrow4,
        origin1, origin2, origin3, origin4,
        ray1, ray2, ray3, ray4,
        distance = (this.gameDimensions) * this.cubeSeparation;

    x = distance;
    y = distance;
    z = distance;

    origin1 = new THREE.Vector3(x,y,z);
    origin2 = new THREE.Vector3(-x,y,z);
    origin3 = new THREE.Vector3(x,y,-z);
    origin4 = new THREE.Vector3(-x,y,-z);

    arrow1 = new THREE.ArrowHelper(setup.xyz1Direction, origin1, setup.length, 0xFFFFFF);
    arrow2 = new THREE.ArrowHelper(setup.xyz2Direction, origin2, setup.length, 0xFFFFFF);
    arrow3 = new THREE.ArrowHelper(setup.xyz3Direction, origin3, setup.length, 0xFFFFFF);
    arrow4 = new THREE.ArrowHelper(setup.xyz4Direction, origin4, setup.length, 0xFFFFFF);

    this.context.arrows.push(arrow1);
    this.context.arrows.push(arrow2);
    this.context.arrows.push(arrow3);
    this.context.arrows.push(arrow4);

    this.context.scene.add(arrow1);
    this.context.scene.add(arrow2);
    this.context.scene.add(arrow3);
    this.context.scene.add(arrow4);

    ray1 = new THREE.Raycaster(origin1, setup.xyz1Direction);
    ray2 = new THREE.Raycaster(origin2, setup.xyz2Direction);
    ray3 = new THREE.Raycaster(origin3, setup.xyz3Direction);
    ray4 = new THREE.Raycaster(origin4, setup.xyz4Direction);

    this.context.rays.push(ray1);
    this.context.rays.push(ray2);
    this.context.rays.push(ray3);
    this.context.rays.push(ray4);
  },

};

