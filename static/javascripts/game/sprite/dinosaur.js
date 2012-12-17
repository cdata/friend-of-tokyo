define(['underscore', 'game/sprite', 'game/vector2', 'q', 'tween'],
       function(_, Sprite, Vector2, q, TWEEN) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        name: 'Dinosaur',
        direction: 0,
        position: new Vector2(-100, -100)
      });

      Sprite.prototype.initialize.call(this, options);

      this.direction = options.direction;
      this.updateClipRect();
    },
    updateClipRect: function() {
      this.clipRect.set(
        288 + this.direction * 104,
        0,
        392 + this.direction * 104,
        116);
    },
    drop: function(position) {
      var result = q.defer();
      var start;

      position = position.clone()
      position.x -= this.clipRect.getWidth() / 3.75;
      position.y -= this.clipRect.getHeight() / 1.25;

      start = position.clone();
      start.y -= 500;

      this.tween = new TWEEN.Tween(start)
          .to(position)
          .easing(TWEEN.Easing.Bounce.Out)
          .onUpdate(_.bind(function() {
            this.position.x = start.x;
            this.position.y = start.y;
          }, this))
          .onComplete(function() {
            result.resolve();
          })
          .start();

      return result.promise;
    },
    move: function(position) {
      var result = q.defer();
      var start;

      position = position.clone();
      
      if (this.direction === 0) {
        position.x -= 40;
        position.y -= 30;
      } else {
        position.x -= 0;
        position.y -= 30;
      }

      start = this.position.clone();

      this.tween = new TWEEN.Tween(start)
          .to(position, 10)
          .easing(TWEEN.Easing.Exponential.In)
          .onUpdate(_.bind(function() {
            this.position.x = start.x;
            this.position.y = start.y;
          }, this))
          .onComplete(function() {
            result.resolve();
          })
          .start();

      return result.promise;
    },
    leave: function() {
      var result = q.defer();
      var value = { alpha: 1 };

      this.tween = new TWEEN.Tween(value)
          .to({ alpha: 0 })
          .easing(TWEEN.Easing.Cubic.Out)
          .onUpdate(_.bind(function() {
            this.alpha = value.alpha;
          }, this))
          .onComplete(function() {
            result.resolve();
          })
          .start();

      return result.promise;
    }
  });
});
