var Demo = Demo || {};

// This object manages all of the 4D objects.
//   Between renders, it'll take the difference between the last render and the current time.
//   This Time Delta is passed to each Object4D object.
//   Each Object4D object will then move a distance based upon their individually set speed,
Demo.Manager = function () {

  this.clock = new Demo.Clock();

  // an array container all of the Object4D guys.
  this._objectManager = [];

  this.init();

};

Demo.Manager.prototype = {

  init: function () {
    this.listeners();
  },

  listeners: function () {
    var me = this;

    $("#newTargets").on("click", function () {
      me.setRandomTargets();
    });

    $("#addTarget").on("click", function () {
      createCubes(1);
    });

    $("#add100Targets").on("click", function () {
      createCubes(1000);
    });


  },

  update: function () {
    var timeDelta = this.clock.getTimeDelta();
    this.updateMovers( timeDelta );
  },

  // Take the time delta, and pass it to each Object4D object.
  updateMovers: function ( timeDelta ) {
    for(var i = 0; i < this._objectManager.length; i++){
      this._objectManager[i].update( timeDelta );
    }
  },

  // Set random X,Y,Z locations for each managed Object4D
  setRandomTargets: function () {
    for(var i = 0; i < this._objectManager.length; i++){
      this._objectManager[i].randomTarget();
    }
  },

  // Add a random object to the mover.
  add4DObject: function ( mover ) {
    this._objectManager.push( mover );
  }
};
