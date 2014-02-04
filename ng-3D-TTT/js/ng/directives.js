"use strict";

tttApp.directive("selectcube", function(ThreeEnv){

  return {
    restrict: "A",
    link: function(scope, element){

      var offsetLeft = element[0].offsetLeft,
        offsetTop = element[0].offsetTop,
        mouseDown = {x: null, y:null};

      element.bind('mousedown', function(event){
        mouseDown.x = event.clientX - event.currentTarget.offsetLeft;
        mouseDown.y = event.clientY - event.currentTarget.offsetTop;

        ThreeEnv.makeSelection(mouseDown);
      });

    }
  };
});
