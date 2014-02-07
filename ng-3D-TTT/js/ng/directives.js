"use strict";

tttApp.directive("selectcube", function(ThreeEnv){
  return {
    restrict: "A",
    link: function(scope, element){

      var offsetLeft = element[0].offsetLeft,
        offsetTop = element[0].offsetTop,
        mouseDown = {x: null, y:null};

      element.bind('mousedown', function(event){

        // normalizing X/Y mousedown positions WRT the canvas position.
        mouseDown.x = ((event.clientX - event.currentTarget.offsetLeft) / event.currentTarget.width) * 2 - 1;
        mouseDown.y = -((event.clientY - event.currentTarget.offsetTop) / event.currentTarget.height) * 2 + 1;

        ThreeEnv.makeSelection(mouseDown);
      });

    }
  };
});
