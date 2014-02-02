"use strict";

tttApp.controller('TTTController', function ($scope, ThreeEnv) {

  $scope.dims = 3;
  $scope.usercolor = "#0000FF";
  $scope.username = "Player1";
  $scope.userfirst = true;

  var canvasId = "ttt-canvas";


  $scope.startGame = function() {
    var height = $('#ray-intersection').height();
    var width = $('#ray-intersection').width();
    $('#what').fadeOut();
    $('#ttt-canvas').height(height);
    $('#ttt-canvas').width(width);
    $('#ray-intersection').fadeIn();
    init();

  };

  $scope.toggleWireframes = function () {

  };

  $scope.toggleArrows = function () {

  };

  $scope.toggleRotate = function () {

  };

  function init() {

    var params = {
            dims: $scope.dims,
            usercolor: $scope.usercolor,
            username: $scope.username,
            userfirst: $scope.userfirst,
            canvasId: canvasId
          };

    // initializing the three JS environment
    ThreeEnv.init(params);

  }

});
