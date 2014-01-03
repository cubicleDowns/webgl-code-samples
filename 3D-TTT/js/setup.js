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

  createCubes: function () {

    var i,j,k,
      num = 0,
      geo = new THREE.CubeGeometry(this.cubeDim, this.cubeDim, this.cubeDim),
      materialVerts = new THREE.MeshLambertMaterial({color: this.cubeColor1}),
      materialOutside = new THREE.MeshLambertMaterial({color: this.cubeColor2}),
      materialInside = new THREE.MeshLambertMaterial({color: this.cubeColor3}),
      cubeGroup = new THREE.Object3D();

    // this approach should work for any dimension tic-tac-toe setup.  e.g. 4x4x4
    for(i = 0; i < gameDimensions; i++){
      for(j = 0; j < gameDimensions; j++){
        for(k = 0; k < gameDimensions; k++){

          var mesh = new THREE.Mesh(geo.clone(), materialOutside.clone());
          mesh.cubeNum = num;
          mesh.position = new THREE.Vector3((i)*cubeSeparation - this.displacement, (j)*cubeSeparation - this.displacement, (k)*cubeSeparation - this.displacement);

          num++;

          // instead of using scene.children, I create an array for ray collisions.
          this.collisions.push(mesh);
          this.scene.add(mesh);
        }
      }
    }
  },

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


    // should be gameDimensions^3 of these guys.
    this.create2DVectors(setup);

    // should be 18 of these guys  (for a 3x3x3)
    this.create2DDiagonals(setup);

    // should be 4 of these guys
    this.create3DDiagonals(setup);
  },

  create2DVectors: function (setup) {
    var i,j,
        x,y,z,
        arrow,
        origin,
        ray;

    // create rays looking down X
    for(i = 0; i < gameDimensions; i++){
      for(j = 0; j < gameDimensions; j++){

        x = (gameDimensions) * cubeSeparation;
        y = i * cubeSeparation - displacement;
        z = j * cubeSeparation - displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.xDirection, origin, setup.length, 0xFF0000);

        _demo.scene.add(arrow);
        _demo.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.xDirection);
        rays.push(ray);
      }
    }

    // create rays looking down Y
    for(i = 0; i < gameDimensions; i++){
      for(j = 0; j < gameDimensions; j++){

        y = (gameDimensions + 1) * cubeSeparation;
        x = (i * cubeSeparation) - displacement;
        z = (j * cubeSeparation) - displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.yDirection, origin, setup.length, 0x00FF00);

        _demo.scene.add(arrow);
        _demo.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.yDirection);
        rays.push(ray);

      }
    }

    // create rays looking down Z
    for(i = 0; i < gameDimensions; i++){
      for(j = 0; j < gameDimensions; j++){

        z = (gameDimensions + 1) * cubeSeparation;
        y = (i * cubeSeparation) - displacement;
        x = (j * cubeSeparation) - displacement;

        origin = new THREE.Vector3(x,y,z);
        arrow = new THREE.ArrowHelper(setup.zDirection, origin, setup.length, 0x0000FF);

        _demo.scene.add(arrow);
        _demo.arrows.push(arrow);

        ray = new THREE.Raycaster(origin, setup.zDirection);
        rays.push(ray);
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
    for(i = 0; i < gameDimensions; i++){

        x = (gameDimensions + 1) * cubeSeparation;
        y = (gameDimensions + 1) * cubeSeparation;
        z = (i * cubeSeparation) - displacement;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,-y,z);

        arrow1 = new THREE.ArrowHelper(setup.xy1Direction, origin1, setup.length, 0xCC0000);
        arrow2 = new THREE.ArrowHelper(setup.xy2Direction, origin2, setup.length, 0xCC0000);

        _demo.scene.add(arrow1);
        _demo.scene.add(arrow2);

        _demo.arrows.push(arrow1);
        _demo.arrows.push(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.xy1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.xy2Direction);

        rays.push(ray1);
        rays.push(ray2);
    }

    // create rays for XZ diagonals
    for(i = 0; i < gameDimensions; i++){

        x = (gameDimensions + 1) * cubeSeparation;
        y = (i * cubeSeparation) - displacement;
        z = (gameDimensions + 1) * cubeSeparation;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,y,-z);

        arrow1 = new THREE.ArrowHelper(setup.xz1Direction, origin1, setup.length, 0x00CC00);
        arrow2 = new THREE.ArrowHelper(setup.xz2Direction, origin2, setup.length, 0x00CC00);

        _demo.scene.add(arrow1);
        _demo.scene.add(arrow2);

        _demo.arrows.push(arrow1);
        _demo.arrows.push(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.xz1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.xz2Direction);

        rays.push(ray1);
        rays.push(ray2);
    }

    // create rays for YZ diagonals
    for(i = 0; i < gameDimensions; i++){

        x = (i * cubeSeparation) - displacement;
        y = (gameDimensions - 1) * cubeSeparation;
        z = (gameDimensions - 1) * cubeSeparation;

        origin1 = new THREE.Vector3(x,y,z);
        origin2 = new THREE.Vector3(x,-y,z);

        arrow1 = new THREE.ArrowHelper(setup.yz1Direction, origin1, setup.length, 0x0000CC);
        arrow2 = new THREE.ArrowHelper(setup.yz2Direction, origin2, setup.length, 0x0000CC);

        _demo.arrows.push(arrow1);
        _demo.arrows.push(arrow2);

        _demo.scene.add(arrow1);
        _demo.scene.add(arrow2);

        ray1 = new THREE.Raycaster(origin1, setup.yz1Direction);
        ray2 = new THREE.Raycaster(origin2, setup.yz2Direction);

        rays.push(ray1);
        rays.push(ray2);

    }
  },

  create3DDiagonals: function (setup) {
    var i,j,
        x,y,z,
        arrow1, arrow2, arrow3, arrow4,
        origin1, origin2, origin3, origin4,
        ray1, ray2, ray3, ray4,
        distance = (gameDimensions + 1) * cubeSeparation;

    x = distance;
    y = distance;
    z = distance;

    origin1 = new THREE.Vector3(x,y,z);
    origin2 = new THREE.Vector3(-x,y,z);
    origin3 = new THREE.Vector3(x,y,-z);
    origin4 = new THREE.Vector3(-x,y,-z);

    arrow1 = new THREE.ArrowHelper(setup.xyz1Direction, origin1, setup.length, 0x333333);
    arrow2 = new THREE.ArrowHelper(setup.xyz2Direction, origin2, setup.length, 0x333333);
    arrow3 = new THREE.ArrowHelper(setup.xyz3Direction, origin3, setup.length, 0x333333);
    arrow4 = new THREE.ArrowHelper(setup.xyz4Direction, origin4, setup.length, 0x333333);

    _demo.arrows.push(arrow1);
    _demo.arrows.push(arrow2);
    _demo.arrows.push(arrow3);
    _demo.arrows.push(arrow4);

    _demo.scene.add(arrow1);
    _demo.scene.add(arrow2);
    _demo.scene.add(arrow3);
    _demo.scene.add(arrow4);

    ray1 = new THREE.Raycaster(origin1, setup.xyz1Direction);
    ray2 = new THREE.Raycaster(origin2, setup.xyz2Direction);
    ray3 = new THREE.Raycaster(origin3, setup.xyz3Direction);
    ray4 = new THREE.Raycaster(origin4, setup.xyz4Direction);

    rays.push(ray1);
    rays.push(ray2);
    rays.push(ray3);
    rays.push(ray4);
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

