var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Scene.Cameras = function (context, camMult) {

    this.context = context;

    this.cameraMultiplier = camMult;

    this.liveCam = null;
    this.FOV = 70;
    this.WIDTH = context.jqContainer.width();
    this.HEIGHT = context.jqContainer.height();
    this.ASPECT_RATIO = this.WIDTH / this.HEIGHT;
    this.NEAR_PLANE = 1;
    this.FAR_PLANE = 100000;

    this.controls = null;

    this.init();
};

Demo.Scene.Cameras.prototype = {

    /**
     * Initialize the camera object and create default cameras.
     */
    init: function () {
        this.initPerspective();
    },

    /**
     * Initialize the perspective camera.
     */
    initPerspective: function () {
        this.liveCam = new THREE.PerspectiveCamera(this.FOV, this.ASPECT_RATIO, this.NEAR_PLANE, this.FAR_PLANE);
        this.liveCam.position.z = this.cameraMultiplier * 60;
    }

};
