var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Scene.Cameras = function (params) {

    this.context = params.context;

    this.cameraMultiplier = params.cubes;

    this.liveCam = null;
    this.FOV = 70;
    this.WIDTH = params.context.jqContainer.width();
    this.HEIGHT = params.context.jqContainer.height();
    this.ASPECT_RATIO = this.WIDTH / this.HEIGHT;
    this.NEAR_PLANE = 1;
    this.FAR_PLANE = 100000;

    this.controls = null;

    this.initPerspective();
};

Demo.Scene.Cameras.prototype = {

    /**
     * Initialize the perspective camera.
     */
    initPerspective: function () {
        this.liveCam = new THREE.PerspectiveCamera(this.FOV, this.ASPECT_RATIO, this.NEAR_PLANE, this.FAR_PLANE);
        var dim = (this.cameraMultiplier) * 25;
        var hyp = Math.sqrt(dim*dim + dim*dim + dim*dim);
        this.liveCam.position.z = hyp;
    }

};
