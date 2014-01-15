var Demo = Demo || {};

/**
 * @namespace  Camera initialization
 * @class Creates cameras for the scene.
 */
Demo.Util = {

  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = 'demo-xxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? 1 : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  },

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

  /**
   *   Change a group of meshes to random colors.
   */
  highlight: function (meshes) {
    for(var i = 0; i < meshes.length; i++) {
      meshes[i].mesh.material.color = this.randomColor();
    }
  }

};
