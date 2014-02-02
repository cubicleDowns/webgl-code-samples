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
    animate();

  }



  function animate () {
    requestAnimationFrame(animate);
    render();
  }

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

    console.count('render');

  }


  function makeSelection(mouse) {
    $log.info('selection: ', mouse);
    // var intersected = demo.interaction.intersectCubes(mouse);
    // if(intersected.length > 0){
    //   demo.textures.selectUnits(intersected);
    //   demo.render();
    // }
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
    // update: update,
    // destroy: destroy,
    // renderNow: renderNow,
    makeSelection: makeSelection,
  };

  return tttGame;
});

