define(['underscore', 'game/sprite', 'game/sprite/number', 'game/vector2'],
       function(_, Sprite, Number, Vector2) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        value: 0
      });

      Sprite.prototype.initialize.call(this, options);

      this.clipRect.set(0, 0, 0, 0);
      this.setValue(options.value);
    },
    stopTween: function() {
      if (this.tween) {
        this.tween.stop();
      }
    },
    setValue: function(value) {
      var start = { alpha: 1, top: 0 };
      var startY = this.position.y;
      var points;
      var halfWidth;
      var index;

      this.value = value;

      if (!value) {
        this.alpha = 0;
        return;
      }

      this.clearChildren();
      
      points = value.toString().split('');
      halfWidth = points.length * 32 / 2 - 32;

      for (index = 0; index < points.length; index++) {
        this.append(new Number({
          value: points[index],
          position: new Vector2(index * 32 - halfWidth,  -32)
        }));
      }

      this.alpha = 1;
      this.stopTween();
      this.tween = new TWEEN.Tween(start)
          .to({ alpha: 0, top: 16 }, 750)
          .delay(300)
          .easing(TWEEN.Easing.Cubic.Out)
          .onUpdate(_.bind(function() {
            this.alpha = start.alpha;
            this.position.y = startY - start.top;
          }, this))
          .onComplete(_.bind(function() {
            this.parent.remove(this);
          }, this))
          .start();
    }
  });
});
