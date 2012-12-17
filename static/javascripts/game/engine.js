define(['tween', 'stats', 'backbone', 'jquery', 'underscore', 'game/object', 'game/clock', 'game/polyfill'],
       function(TWEEN, Stats, Backbone, $, _, GameObject, Clock) {
  var Engine = GameObject.extend({
    initialize: function() {
      this.stats = new Stats();
      this.stats.$domElement = $(this.stats.domElement);
      this.stats.$domElement.css({
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
        'zIndex': 10000
      });
      //this.stats.$domElement.prependTo($('body'));

      this.boundNextFrame = _.bind(this.nextFrame, this);
      this.clock = new Clock(false);
      this.stop();
    },
    dispose: function() {
      this.stop();
      this.stats.$domElement.remove();

      this.stats = null;
      this.boundNextFrame = null;
      this.clock = null;
    },
    start: function() {
      this.running = true;
      this.clock.start();
      this.nextFrame();
    },
    stop: function() {
      this.clock.stop();
      this.time = 0;
      this.running = false;
    },
    nextFrame: function() {
      if (this.running) {
        this.stats.begin();
        this.time += this.clock.getDelta();
        if (this.time > this.tickInterval) {
          var ticks;
          var tick;

          ticks = Math.floor(this.time / this.tickInterval);
          for (tick = 0; tick < ticks; ++tick) {
            this.trigger('tick');
          }
          this.time -= ticks * this.tickInterval;
        }

        TWEEN.update();
        this.trigger('render');
        window.requestAnimFrame(this.boundNextFrame);
        this.stats.end();
      }
    }
  });

  // TODO: GameObject maybe gets events mixin?
  _.extend(Engine.prototype, Backbone.Events);

  return Engine;
});
