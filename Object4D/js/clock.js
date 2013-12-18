var Demo = Demo || {};

Demo.Clock = function () {

  this.paused = false;
  this._clock = new THREE.Clock();
  this._oldTime = 0;
  this._pausedTime = 0;
  this._resumedTime = 0;

};

Demo.Clock.prototype = {
  /**
   * Returns the delta between the last render and the current render.
   * @return {Number}
   */
  getTimeDelta: function () {
    var temp = this._clock.getElapsedTime(),
        timeDelta = temp - this._oldTime;
    this._oldTime = temp;
    return timeDelta;
  },

  /**
   * Pauses clock when window is inactive.
   */
  pauseClock: function () {
    this.paused = true;
    this._pausedTime = this._clock.getElapsedTime();
    console.log('paused');
  },

  /**
   * Resumes clock when window is active.   Removes delta from clock time.
   * @return {[type]} [description]
   */
  resumeClock: function () {
    if(this.paused){
        this._resumedTime = this._clock.getElapsedTime();
        var temp = this._resumedTime - this._pausedTime;
        this._oldTime += temp;
        this.paused = false;
        console.log('resume');
    }
  }
};
