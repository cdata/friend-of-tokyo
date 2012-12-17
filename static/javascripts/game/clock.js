// Clock shamelessly adapted from Three.js. Original
// version by alteredq (http://alteredqualia.com/)
define(['game/object'],
       function(GameObject) {
  return GameObject.extend({
    initialize: function(autoStart) {
      this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

      this.startTime = 0;
      this.oldTime = 0;
      this.elapsedTime = 0;

      this.running = false;
    },
    start: function() {
      this.startTime = Date.now();
      this.oldTime = this.startTime;

      this.running = true;
    },
    stop: function() {
      this.getElapsedTime();

      this.running = false;
    },
    getElapsedTime: function() {
      this.elapsedTime += this.getDelta();

      return this.elapsedTime;
    },
    getDelta: function() {
      var diff = 0;

      if ( this.autoStart && ! this.running ) {
        this.start();
      }

      if ( this.running ) {
        var newTime = Date.now();
        diff = 0.001 * ( newTime - this.oldTime );
        this.oldTime = newTime;

        this.elapsedTime += diff;
      }

      return diff;
    }
  });
});
