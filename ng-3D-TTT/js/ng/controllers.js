"use strict";

tttApp.controller('TTTController', function ($scope, ThreeEnv) {

  $scope.dims = 3;
// myForm.input.$valid = true
// myForm.input.$error = {"required":false,"number":false,"max":false,"min":false}
// myForm.$valid = true
// myForm.$error.required = false

  $scope.usercolor = "#0000FF";
  $scope.username = "Player1";
  $scope.userfirst = true;

  var canvasId = "ttt-canvas";

  $scope.startGame = function() {

    var height = $('#ray-intersection').height(),
      width = $('#ray-intersection').width();

    $('#what').fadeOut();
    $('#ttt-canvas').height(height);
    $('#ttt-canvas').width(width);
    $('#ray-intersection').fadeIn();

    var params = {
            dims: $scope.dims,
            usercolor: $scope.usercolor,
            username: $scope.username,
            userfirst: $scope.userfirst,
            canvasId: canvasId
          };

    debugger;
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


  // calling toggle function within ThreeEnv factory to toggle wireframes
  $scope.toggleWireframes = function () {
    ThreeEnv.toggle("wireframes");
  };

  // calling toggle function within ThreeEnv factory to toggle the arrows
  $scope.toggleArrows = function () {
    ThreeEnv.toggle("arrows");
  };

  $scope.toggleRotate = function () {
    ThreeEnv.toggle("rotate");
  };

  function init() {

  }

});
