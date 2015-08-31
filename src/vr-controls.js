/* globals define */
(function(define){'use strict';define(function(require,exports,module){

		var cameraEl;
		// The canvas where the scene is painted
		var canvasEl;
		// To keep track of the pressed keys
		var keys = {};
		var mouseDown = false;

    var acceleration = 65;
    var velocity = new THREE.Vector3();

    var pitchObject = new THREE.Object3D();
    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add( pitchObject );

    var PI_2 = Math.PI / 2;

 		document.addEventListener("DOMContentLoaded", function() {
 			canvasEl = document.querySelector('vr-scene').canvas;
 			cameraEl = document.querySelector('vr-camera');
      var camera = cameraEl.object3D;
 			attachMouseKeyboardListeners();
  	});

    function attachMouseKeyboardListeners() {
      var position = cameraEl.getAttribute('position')
  		var x = position.x || 0;
  		var y = position.y || 0;
  		var z = position.z || 0;

      var rotation = cameraEl.getAttribute('rotation')
  		var rotX = rotation.x || 0;
      var rotY = rotation.y || 0;
      var rotZ = rotation.z || 0;

      var lastMouseX;
      var lastMouseY;
      var rotationEnabled;
      var lastPress = Date.now();

      // key events
      window.addEventListener('keydown', function(event) {
        keys[event.keyCode] = true;
      }, false);

      window.addEventListener('keyup', function(event) {
        keys[event.keyCode] = false;
      }, false);

      window.requestAnimationFrame(updateCamera);

      canvasEl.addEventListener('mousedown', function(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
      }, true);

      canvasEl.addEventListener('mouseup', function(event) {
        mouseDown = false;
      }, true);

      canvasEl.addEventListener('mousemove', function(event) {
        if (!mouseDown) {
          return;
        }

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;
        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
      }, true);

    };

    var prevTime = Date.now();
    function updateCamera() {
      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;
      prevTime = time;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      var position = cameraEl.getAttribute('position')
      var x = position.x || 0;
      var y = position.y || 0;
      var z = position.z || 0;

      var rotation = cameraEl.getAttribute('rotation')
      var rotX = rotation.x || 0;
      var rotY = rotation.y || 0;
      var rotZ = rotation.z || 0;

      if (keys[65]) { // Left
        velocity.x -= acceleration * delta;
      }
      if (keys[87]) { // Up
        velocity.z -= acceleration * delta;
      }
      if (keys[68]) { // Right
        velocity.x += acceleration * delta;
      }
      if (keys[83]) { // Down
        velocity.z += acceleration * delta;
      }

      if (keys[90]) { // Z
        x = 0;
        y = 0;
        z = 0;
        rotX = 0;
        rotY = 0;

        cameraEl.reset();
        // scene.resetSensor();

        position = cameraEl.getAttribute('position')
        x = position.x || 0;
        y = position.y || 0;
        z = position.z || 0;

        rotation = cameraEl.getAttribute('rotation')
        rotX = rotation.x || 0;
        rotY = rotation.y || 0;
        rotZ = rotation.z || 0;

      }

      rotation = THREE.Math.radToDeg(pitchObject.rotation.x) + ' ' +
                 THREE.Math.radToDeg(yawObject.rotation.y) + ' ' + rotZ;
      cameraEl.setAttribute('rotation', rotation)

      var movementVector = getMovementVector(delta);

      position = (x + movementVector.x) + ' ' +
                  y + ' ' +
                 (z + movementVector.z);
      cameraEl.setAttribute('position', position);

			window.requestAnimationFrame(updateCamera);
    }

    function getMovementVector(delta) {
      var direction = new THREE.Vector3( velocity.x * delta, 0, velocity.z * delta );
      var rotation = new THREE.Euler(0, 0, 0, "YXZ");
      rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
      return direction.applyEuler( rotation );
    }

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('VRControls',this));