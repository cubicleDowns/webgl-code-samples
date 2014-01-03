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

  randomTTTCube: function () {

  },

};
