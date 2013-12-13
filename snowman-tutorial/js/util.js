var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};


/**
 * @class Scene setup.  Most initialization of geometry and managers happen here.
 */
Demo.Scene.Utils = function (context) {

  this.context = context;

  this.init();

};

Demo.Scene.Utils.prototype = {

  init: function () {
    this.listener();
  },

  listener: function () {

    var me = this;
    this.context.jqContainer.on('click', function (event) {
      me.castRay(event);
    });
  },

  degreesToRadians: function (d) {
    return (d * Math.PI) / 180;
  },

  snowmanBody: function () {
    var nose,
        eyes,
        eye1,
        eye2,
        upperTorso,
        midTorso,
        lowerTorso,
        arm1,
        arm2,
        frostyColor,
        lowerMesh,
        midMesh,
        upperMesh,
        legs,
        snowmanBodyObject;


    // build snowman body
    snowmanBodyObject  = new THREE.Object3D();

    // frostyColor = new THREE.MeshLambertMaterial({color: 0xFFFFFF, wireframe: true});

    frostyColor = new THREE.MeshLambertMaterial({color: 0xFFFFFF, wireframe: false});
    carrotColor = new THREE.MeshLambertMaterial({color: 0xFFA500});
    charcoalColor = new THREE.MeshLambertMaterial({color: 0x333366});

    snowBall = new THREE.SphereGeometry(10);

    lowerMesh = new THREE.Mesh(snowBall.clone(), frostyColor);
    midMesh = new THREE.Mesh(snowBall.clone(), frostyColor);
    upperMesh = new THREE.Mesh(snowBall.clone(), frostyColor);

    // move the bottom snowball
    lowerMesh.position.set(0,50,0);
    lowerMesh.scale.set(2,2,2);

    // move the middle snowball
    midMesh.position.set(0,75,0);
    midMesh.scale.set(1.5,1.5,1.5);

    upperMesh.position.set(0,95,0);

    snowmanBodyObject.add(lowerMesh);
    snowmanBodyObject.add(midMesh);
    snowmanBodyObject.add(upperMesh);

    // build snowman face
    var carrotNose = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 30, 10, 5, false), carrotColor);
    carrotNose.position.y = 1;
    carrotNose.scale.set(0.5,0.5,0.5);


    var snowEye1 = new THREE.Mesh(new THREE.SphereGeometry(3, 4, 2), charcoalColor);
    var snowEye2 = snowEye1.clone();

    snowEye1.position.x = 3;
    snowEye2.position.x = -3;

    snowEye1.position.y -= 1;
    snowEye2.position.y -= 2;

    snowEye1.position.z = 4;
    snowEye2.position.z = 4;

    var faceObject = new THREE.Object3D();
    faceObject.add(snowEye1);
    faceObject.add(snowEye2);
    faceObject.add(carrotNose);

    faceObject.position.y = 95;

    faceObject.rotation.x = demo.utils.degreesToRadians(-90);
    faceObject.position.z = -10;

    snowmanBodyObject.add(faceObject);

    return snowmanBodyObject;
  },

  snowmanArm: function () {
        //snow man arm
        var armsObject = new THREE.Object3D(),
          armObject = new THREE.Object3D(),
          armColor = new THREE.MeshLambertMaterial({color: 0x333333}),
          armPart = new THREE.CylinderGeometry(1, 1, 30),
          armMesh,
          fingerGeo,
          finger1,
          finger2,
          finger3;

        armMesh = new THREE.Mesh(armPart, armColor);
        armMesh.position.y = -15;

        fingerGeo = new THREE.CylinderGeometry(0.8, 0.8, 5);
        finger1 = new THREE.Mesh(fingerGeo, armColor);
        finger1.position.y = 2.5;
        finger2 = finger1.clone();

        finger1.position.x = 2.0;
        finger1.rotation.z = demo.utils.degreesToRadians(-60);

        finger3 = finger1.clone();
        finger3.rotation.z = demo.utils.degreesToRadians(-120);
        finger3.position.x = -2.0;

        armObject.add(armMesh);
        armObject.add(finger1);
        armObject.add(finger2);
        armObject.add(finger3);

        armObject.position.y = 80;
        armObject.rotation.z = demo.utils.degreesToRadians(90);
        armObject.position.x += -30;

        var arm2 = armObject.clone();
        arm2.scale.set(1, -1, 1);
        arm2.position.x += 60;

        armsObject.add(armObject);
        armsObject.add(arm2);

        return armsObject;
  },

  /**
   *  Create a random color
   *  -- this function is duplicated in marquee.js
   */
  randomColor: function () {
      //cleverness via Paul Irish et al.  Thx Internets!
      return new THREE.Color().setHex('0x' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6));
  },

  castRay: function (event) {

    event.preventDefault();

    var mouse = {};

    // since this isn't a full screen app, lets use the dimensions of the container div.
    // OFFSET change.  Now I'll adjust the offset of the canvas element from the click.
    var leftOffset = demo.jqContainer.offset().left;
    var topOffset = demo.jqContainer.offset().top;

    mouse.x = ((event.clientX - leftOffset) / demo.jqContainer.width()) * 2 -1;
    mouse.y = -((event.clientY - topOffset) / demo.jqContainer.height()) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    demo.projector.unprojectVector(vector, demo.cameras.liveCam);

    var ray = new THREE.Raycaster(demo.cameras.liveCam.position, vector.sub(demo.cameras.liveCam.position).normalize());

    // Casting a ray to find if there is an intersection.
    // Notice I reference an array of the cubes added to the scene.
    //   This is to prevent the ray from intersecting with any non-cube meshes.
    var intersected = ray.intersectObjects( demo.scene.children );

    // removing previous click marker.
    $(".clickMarkers").remove();

    // appending a click marker.
    demo.jqContainer.append('<div class="clickMarkers" style="pointer-events:none; position: absolute; z-index: 100; left: ' + event.offsetX + 'px; top: ' + event.offsetY +'px">*</div>' );

    // only change the first intersected object.
    if(intersected.length > 0 && intersections === true) {
      var col = this.randomColor();
      intersected[0].object.material.color = col;
    }
  }

};
