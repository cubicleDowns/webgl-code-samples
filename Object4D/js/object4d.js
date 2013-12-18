/**
 *
 * Extending THREE.Object3D with animation properties.
 * http://blog.tempt3d.com
 *
 * - Josh Staples may be found @ cbcldowns (at) gmail.com
 */

var Demo = Demo || {};

Demo.Object4D = function () {

  THREE.Object3D.call( this );

  this._targetLocation = {};
  this._moving = true;

  // i just did this for the demo
  this._speed = Math.floor(Math.random() * 30) + 60;

  // maximum value for random scene movement.
  this._maxBounds = 200;

  // I compare the max movement distance and the distance traveled to stop the animation.
  this._maxMovementDistance = 0;
  this._distanceTraveled = 0;

  this._movementVector = null;
};

// grabbing all the prototype methods from Object4D
Demo.Object4D.prototype = Object.create( THREE.Object3D.prototype );

// extending 4D with prototype function specific to time and movement
Demo.Object4D.prototype.setMovementTarget = function ( targetLocation ) {

  // gotta clone these guys as they are passed by reference.
  var mvClone = targetLocation.clone();
  var maxClone = targetLocation.clone();

  this._targetLocation =  targetLocation.clone();

  this._movementVector = mvClone.sub(this.position).normalize();
  this._maxMovementDistance = maxClone.sub(this.position).length();

  this._moving = true;

};

// in case the object is stopped and needs to start moving again.
Demo.Object4D.prototype.go = function () {

  this._moving = true;

};

// in case the object has a stop order
Demo.Object4D.prototype.stop = function () {

  this._moving = false;

};

// reset the object's movement if it has a new location.
Demo.Object4D.prototype.reset = function () {

  // reset everything
  this._distanceTraveled = 0;
  this._maxMovementDistance = 0;
  this._moving = false;

};

// Sends the object to a random X,Y,Z location.
Demo.Object4D.prototype.randomTarget = function () {

  var x, y, z,
    vector;

  this.reset();

  x = Math.floor(Math.random() * this._maxBounds);
  y = Math.floor(Math.random() * this._maxBounds);
  z = Math.floor(Math.random() * this._maxBounds);

  vector = new THREE.Vector3( x, y, z );
  this.setMovementTarget(vector);

};

// Passes in a time delta and updates the Mesh position based upon
// the Objects's speed and time since it last moved.  Tweening if you will.
Demo.Object4D.prototype.update = function ( timeDelta ) {

  var newSpeed,
      newDistance,
      newLength;

  if ( this._moving ) {
    // speed of object. this clamps movement distance based upon timeDelta since last render
    newSpeed = this._speed * timeDelta;

    // finding new distance object should travel
    newDistance = this._movementVector.clone().multiplyScalar( newSpeed );
    newLength = newDistance.length();

    // adding the distance to the distance traveled
    this._distanceTraveled += newLength;

    // checking to see if the travel distance is greater then the predicted distance. if so, no mesh movement.
    if(this._distanceTraveled < this._maxMovementDistance){
      this.position.add( newDistance );
    } else if (this._distanceTraveled >= this._maxMovementDistance) {

    // if the distance travled is greater than the max distance calculated initially
    // just set the location as the target location.  this keeps the object from moving beyond target point.
      this.position = this._targetLocation;
      this.reset();
    }
  }
};

