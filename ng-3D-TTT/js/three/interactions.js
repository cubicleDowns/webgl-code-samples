var Demo = Demo || {};
Demo.Scene = Demo.Scene || {};

Demo.Scene.Interactions = function (params) {
  this.context = params.context;


};

Demo.Scene.Interactions.prototype = {

  intersect: function (mouse) {
    if(SETUP.CAM.ORTHO){
      return this.ortoIntersect(mouse);
    } else {
      return this.perpIntersect(mouse);
    }
  },

  orthoIntersect: function (mouse){
    var ray,
      intersects,
      vector = new THREE.Vector3( mouse.x, mouse.y, 1);

    ray = this.context.projector.pickingRay(vector, this.context.cameras.liveCam);
    intersects = ray.intersectsObjects( this.context.collisions );

    return intersects;
  },

  perpIntersect: function (mouse){

    var ray,
      intersected,
      mouseWC = {},
      vector;

    mouseWC.x = (mouse.x / this.context.container.clientWidth) * 2 - 1;

    mouseWC.y = - (mouse.y / this.context.container.clientWidth) * 2 + 1;

    vector = new THREE.Vector3( mouseWC.x, mouseWC.y, 1);

    this.context.projector.unprojectVector(vector, this.context.cameras.liveCam);

    ray = new THREE.Raycaster(this.context.cameras.liveCam.position, vector.sub(this.context.cameras.liveCam.position).normalize());
    intersected = ray.intersectObjects(this.context.collisions);

    return intersected;

  }


};
