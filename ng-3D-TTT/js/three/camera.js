"use strict"

var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

/**
 * @namespace  Camera initialization.  Contains setup for both Perpspective and Orthographic cameras.
 * @class Creates cameras for the scene.
 */
Demo.Scene.Cameras = function (params) {

    this.context = params.context;

    this.cameraMultiplier = this.context.dims;

    this.liveCam = null;
    this.FOV = SETUP.CAM.FOV || 70;

    this.WIDTH = this.context.container.clientWidth;
    this.HEIGHT = this.context.container.clientHeight;

    // VIEWSIZE is the virtual distance across internally to the orthographic display.
    //   How many "3D world units" across the ration will represent.
    //   Setting this variable ensures you will have a regular distance across even if your windows resizes.
    this.VIEWSIZE = SETUP.CAM.VIEWSIZE || 1000;
    this.ASPECT_RATIO = this.WIDTH / this.HEIGHT;

    // If true, use the ortho camera OR use the perpspective camera.
    this.ORTHO_CAMERA = (SETUP.CAM.ORTHO) ? true : false;

    /** Perspective camera setup **/

    this.perpCam = null;
    this.PERP_NEAR_PLANE = SETUP.CAM.PERP_NEAR_PLANE || 1;
    this.PERP_FAR_PLANE = SETUP.CAM.PERP_FAR_PLANE || 10000;

    this.orthCam = null;
    this.ORTH_NEAR_PLANE = SETUP.CAM.ORTH_NEAR_PLANE || -1000;
    this.ORTH_FAR_PLANE = SETUP.CAM.ORTH_FAR_PLANE || 1000;

    this.controls = null;

    // initial distance of the camera from scene.position
    this.RADIUS = 0;
    this.THETA = 0;
    this.THETA_DELTA = SETUP.CAM.THETA_DELTA || 0.3;

    this.init();
};

Demo.Scene.Cameras.prototype = {

  /**
   * Initialize a camera.
   * @return {[type]} [description]
   */
  init: function () {
    if(this.ORTHO_CAMERA){
      this.initOrthographicCamera();
    } else {
      this.initPerspective();
    }
  },

  /**
   * Inititalize the orthographic camera.
   */
  initOrthographicCamera: function () {

    this.orthoCam = new THREE.OrthographicCamera(-this.ASPECT_RATIO * this.VIEWSIZE/2, this.ASPECT_RATIO * this.VIEWSIZE/2, this.VIEWSIZE / 2, this.VIEWSIZE / -2, this.ORTH_NEAR_PLANE, this.ORTH_FAR_PLANE);

    // moving the camera so we're only working in quadrant 1 (+x, +y)
    this.orthoCam.position.x = this.ASPECT_RATIO * this.VIEWSIZE / 2;
    this.orthoCam.position.y = this.VIEWSIZE / 2;

    this.liveCam = this.orthoCam;

    console.log('init orth cam');
  },

  /**
   * Initialize the perspective camera.
   */
  initPerspective: function () {

      var dim = (this.cameraMultiplier) * this.context.setup.cubeSeparation;
      this.RADIUS = Math.sqrt(dim*dim + dim*dim + dim*dim);

      this.perpCam = new THREE.PerspectiveCamera(this.FOV, this.ASPECT_RATIO, this.PERP_NEAR_PLANE, this.PERP_FAR_PLANE);
      this.perpCam.position.z = this.RADIUS;

      this.liveCam = this.perpCam;

      console.log('init perp cam');
  },


  /**
   * Rotate the camera the SETUP.CAM.THETA.DELTA.   This is a small value to smoothly rotate around scene.position
   * @return {[type]} [description]
   */
  rotateCamera: function () {

    //TODO:   %360?!
    this.THETA = (this.THETA + this.THETA_DELTA)%360;

    // this.THETA += this.THETA_DELTA;

    this.liveCam.position.x = this.RADIUS * Math.sin(THREE.Math.degToRad(this.THETA));
    this.liveCam.position.y = this.RADIUS * Math.sin(THREE.Math.degToRad(this.THETA));
    this.liveCam.position.z = this.RADIUS * Math.cos(THREE.Math.degToRad(this.THETA));
    this.liveCam.lookAt(this.context.scene.position);
    this.liveCam.updateProjectionMatrix();
  }

};
