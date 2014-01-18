var Demo = Demo || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Util = {

  /**
   * Not sure what I'm doing with this yet.   Maybe an online multi-player version?
   * @return {[type]} [description]
   */
  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = 'demo-xxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? 1 : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  },

  /**
   * Returns a random cube value.
   * @param  {Integer} nDimension 1 dimension of the scene.  e.g. 3, 4, 5, etc.
   * @return {[type]}            [description]
   */
  randomTTTCube: function (nDimension) {
      // return a number between [0,26] representing the cube number.
      // right click on the cube to get the cube number.
      return num = Math.floor((Math.random()*nDimension*nDimension*nDimension));
  },

  /**
   *  Create a random color
   */
  randomColor: function () {
      //cleverness via Paul Irish et al.
      return ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
  },

  toggleWireframes: function (meshes) {

    for(var i = 0; i< meshes.length; i++){
      meshes[i].material.wireframe = !meshes[i].material.wireframe;
    }
  },

  toggleArrows: function (arrows) {
    var i,
        vis;

    for(i = 0; i < arrows.length; i++){
      arrows[i].cone.visible = (arrows[i].cone.visible) ? false : true;
      arrows[i].line.visible = (arrows[i].line.visible) ? false : true;
    }
  },

  /**
   * Sets the mesh material color.  Sets the ttt value to the user name.
   * @param  {THREE.Mesh} mesh   Selected mesh.
   * @param  {Object} params {color: hexValue, name: String}
   * @return {[type]}        [description]
   */
  selectCube: function(mesh, params) {
    mesh.material.color.setStyle(params.color);
    mesh.ttt = params.name;
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
