"use strict";

tttApp.controller('TTTController', function ($scope, ThreeEnv) {

  $scope.dims = 3;

  $scope.usercolor = "#0000FF";
  $scope.username = "Player1";
  $scope.userfirst = false;

  var canvasId = "ttt-canvas";

  $scope.startGame = function() {

    var height = $('#ray-intersection').height(),
      width = $('#ray-intersection').width();

    $('#what').fadeOut();
    $('#ttt-canvas').height(height);
    $('#ttt-canvas').width(width);
    $('#ray-intersection').fadeIn();


    // notice the use of 'this'.  this refers to the controller $scope when this function is called
    // in normal JS callbacks you'd reference the values with 'var me = this'.  then reference 'me' in the callback function.
    var params = {
            dims: this.dims,
            userColor: this.usercolor,
            userName: this.username,
            userFirst: this.userfirst,
            canvasId: canvasId
          };

    ThreeEnv.init(params);

  };

  //////////////////////////////////////////////////////////
  ///
  /// Access the THREE.js scene through the following API functions.
  ///
  /// You may also want to use this approach for the following types of 3D scene interactions:
  ///    - mouse interaction.
  ///    - toggle environment settings (rotation)
  ///    - CRUD operations relating to ng-scoped variables.
  ///
  //////////////////////////////////////////////////////////
  ///  Not sure if creating the following as directives would have been
  ///  a better option.  Needs more research.
  //////////////////////////////////////////////////////////


  $scope.toggleWireframes = function () {
    ThreeEnv.toggle("wireframes");
  };

  $scope.toggleArrows = function () {
    ThreeEnv.toggle("arrows");
  };

  $scope.toggleRotate = function () {
    ThreeEnv.toggle("rotate");
  };

  function init() {

  }

});
