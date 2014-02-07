'use strict';

tttApp.factory('ThreeEnv', function ($http, $log, $rootScope ) {

  var demo,
    rotateCamera = true,
    canvas = document.getElementById('ttt-canvas');

  /**
   * Initialize the 3D scene.
   * @param  {Object} params {}
   */
  function init(params) {

    demo = new Demo.Scene(params);
    demo.init();
    demo.game.init(params);
    animate();

  }

  function animate () {
    requestAnimationFrame(animate);
    render();
  }

  ///////////////////////////////////////////////////////////////////
  ///
  ///  EXTERNAL API CALLS
  ///    Try and keep as much logic as possible within this call
  ///    Minimize additiona functions in the scene classes.
  ///    If you need to do something complex, do it in DEMO.UTIL and
  ///    call that function from within the following API function references
  ///
  ///////////////////////////////////////////////////////////////////

  /**
   * Renders the THREE.js scene graph.
   * @return {screen} Rendered frame buffer of scene.
   */
  function render() {
    demo.renderer.render(demo.scene, demo.cameras.liveCam);
    if(rotateCamera){
      demo.cameras.rotateCamera();
    } else {
      demo.controls.update();
    }
  }

  /**
   * Make a
   * @param  {[type]} mouse [description]
   * @return {[type]}       [description]
   */
  function makeSelection(mouse) {
    console.info('selection: ', mouse);

    $.event.trigger({
      type: "userClick",
      message: mouse
    });
    
  }

  /**
   * Single toggle interface to interact with three.js environment.
   * @param  {string} toggleType What kind of toggle needs to be executed.
   * @return {[type]}            [description]
   */
  function toggle(toggleType) {
    switch(toggleType){
      case "arrows":
          Demo.Util.toggleArrows(demo.arrows);
        break;
      case "rotate":
        rotateCamera = (rotateCamera) ? false : true;
        break;
      case "wireframes":
        Demo.Util.toggleWireframes(demo.collisions);
        break;
      default:
        $log.error('ThreeEnv: no toggle param set');
        break;
    }

  }


  //-------------------------------------------------------
  //  EVENT LISTENERS
  //-------------------------------------------------------

  function onWindowResize () {
    demo.cameras.resizeCanvas();
  }

  //-------------------------------------------------------
  //  UPDATES
  //-------------------------------------------------------


  //-------------------------------------------------------
  //  EVENT WATCHERS
  //-------------------------------------------------------

  var tttGame = {
    init: init,
    toggle: toggle,
    // update: update,
    // destroy: destroy,
    // renderNow: renderNow,
    makeSelection: makeSelection,
  };

  return tttGame;
});

