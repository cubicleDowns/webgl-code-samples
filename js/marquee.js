var Demo = Demo || {};
Demo.Marquee = Demo.Marquee || {};

Demo.Marquee = function (context) {

  this.context = context;
  this.mouseDown = false;
  this.mouseUp = true;
  this.mouseDownCoords = {};
  this.marquee = null;
  this.offset = {};


  this.init();

};

Demo.Marquee.prototype = {

  init: function () {
    this.offset.x = this.context.jqContainer.offset().left;
    this.offset.y = this.context.jqContainer.offset().top;
    this.marquee = $("#select-marquee");
    this.listeners();
  },

  listeners: function () {
    var me = this;

    this.context.jqContainer.mousedown(function (e) {
      me.mouseDownEvent(e);
    });

    this.context.jqContainer.mouseup(function (e){
      me.mouseUpEvent(e);
    });

    this.context.jqContainer.mousemove(function(e){
      me.marqueeSelect(e);
    });

    $("#toggle-cache").on("click", function (){
      me.context.cache.active = (me.context.cache.active) ? false : true;
      var msg = (me.context.cache.active) ? "cache enabled" : "cache disabled";

      $("#cache-status").html(msg);
    });
  },

  resetMarquee: function () {
    this.mouseUp = true;
    this.mouseDown = false;
    this.marquee.fadeOut();
    this.marquee.css({width: 0, height: 0});
    this.mouseDownCoords = {};
  },

  mouseDownEvent: function (event) {

    event.preventDefault();

    var pos = {};

    this.mouseDown = true;
    this.mouseDownCoords = { x: event.clientX, y: event.clientY };

    // adjust the mouse select
    pos.x = ((event.clientX - offset.x) / this.context.jqContainer.width()) * 2 -1;
    pos.y = -((event.clientY - offset.y) / this.context.jqContainer.height()) * 2 + 1;

    var vector = new THREE.Vector3(pos.x, pos.y, 1);

    this.context.projector.unprojectVector(vector, this.context.cameras.liveCam);

    // removing previous click marker.
    $(".clickMarkers").remove();

    // appending a click marker.
    this.context.jqContainer.append('<div class="clickMarkers" style="pointer-events:none; position: absolute; z-index: 100; left: ' + event.offsetX + 'px; top: ' + event.offsetY +'px">D</div>' );
  },

  mouseUpEvent: function (event) {
    event.preventDefault();
    event.stopPropagation();

    // reset the marquee selection
    this.resetMarquee();

    // appending a click marker.
    this.context.jqContainer.append('<div class="clickMarkers" style="left: ' + event.offsetX + 'px; top: ' + event.offsetY +'px">U</div>' );
  },

  marqueeSelect: function (event) {
      event.preventDefault();
      event.stopPropagation();

      // make sure we are in a select mode.
      if(this.mouseDown){

        this.marquee.fadeIn();

        var pos = {};
        pos.x = event.clientX - this.mouseDownCoords.x;
        pos.y = event.clientY - this.mouseDownCoords.y;

        // square variations
        // (0,0) origin is the TOP LEFT pixel of the canvas.
        //
        //  1 | 2
        // ---.---
        //  4 | 3
        // there are 4 ways a square can be gestured onto the screen.  the following detects these four variations
        // and creates/updates the CSS to draw the square on the screen
        if (pos.x < 0 && pos.y < 0) {
            this.marquee.css({left: event.clientX + 'px', width: -pos.x + 'px', top: event.clientY + 'px', height: -pos.y + 'px'});
        } else if ( pos.x >= 0 && pos.y <= 0) {
            this.marquee.css({left: this.mouseDownCoords.x + 'px',width: pos.x + 'px', top: event.clientY, height: -pos.y + 'px'});
        } else if (pos.x >= 0 && pos.y >= 0) {
            this.marquee.css({left: this.mouseDownCoords.x + 'px', width: pos.x + 'px', height: pos.y + 'px', top: this.mouseDownCoords.y + 'px'});
        } else if (pos.x < 0 && pos.y >= 0) {
            this.marquee.css({left: event.clientX + 'px', width: -pos.x + 'px', height: pos.y + 'px', top: this.mouseDownCoords.y + 'px'});
        }

        var selectedCubes = this.findCubesByVertices({x: event.clientX, y: event.clientY});
        this.highlight(selectedCubes);

      }
  },

  findCubesByVertices: function (location) {
    var currentMouse = {},
        mouseInitialDown = {},
        units,
        bounds,
        inside = false,
        selectedUnits = [],
        dupeCheck = {};

    currentMouse.x = location.x;
    currentMouse.y = location.y;

    mouseInitialDown.x = (this.mouseDownCoords.x - this.offset.x);
    mouseInitialDown.y = (this.mouseDownCoords.y - this.offset.y);

    units = this.context.cache.getUnitVertCoordinates();
    bounds = this.findBounds(currentMouse, this.mouseDownCoords);

    for(var i = 0; i < units.length; i++) {
      inside = this.withinBounds(units[i].pos, bounds);
      if(inside && (dupeCheck[units[i].id] === undefined)){
        selectedUnits.push(units[i]);
        dupeCheck[units[i].name] = true;
      }
    }

    return selectedUnits;
  },

  findBounds: function (pos1, pos2) {
    // calculating the origin and vector.
    var origin = {},
        delta = {};

    if (pos1.y < pos2.y) {
        origin.y = pos1.y;
        delta.y = pos2.y - pos1.y;
    } else {
        origin.y = pos2.y;
        delta.y = pos1.y - pos2.y;
    }

    if(pos1.x < pos2.x) {
        origin.x = pos1.x;
        delta.x = pos2.x - pos1.x;
    } else {
        origin.x = pos2.x;
        delta.x = pos1.x - pos2.x;
    }
    return ({origin: origin, delta: delta});
  },

  // checks to see if the unprojected vertice position is within the bounds of the marquee selection
  withinBounds: function (pos, bounds) {

    var ox = bounds.origin.x,
        dx = bounds.origin.x + bounds.delta.x,
        oy = bounds.origin.y,
        dy = bounds.origin.y + bounds.delta.y;

    if((pos.x >= ox) && (pos.x <= dx)) {
        if((pos.y >= oy) && (pos.y <= dy)) {
            return true;
        }
    }

    return false;
  },

  /**
   *   Change a group of meshes to random colors.
   */
  highlight: function (meshes) {

    for(var i = 0; i < meshes.length; i++) {
      meshes[i].mesh.material.color = this.randomColor();
    }
  },

  /**
   *  Create a random color
   */
  randomColor: function () {
      //cleverness via Paul Irish et al.  Thx Internets!
      return new THREE.Color().setHex('0x' + ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6));
  }

};
