define(['underscore', 'game/sprite', 'game/rectangle'],
       function(_, Sprite, Rectangle) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        name: 'Building',
        frame: 0,
        color: 0
      });

      Sprite.prototype.initialize.call(this, options);

      this.frame = options.frame;
      this.color = options.color;
      this.updateClipRect();
    },
    collapse: function() {
      this.setFrame(0);
      this.setColor(0);
    },
    value: function() {
      return this.frame > 0 ? (this.frame + 1) * (this.frame + 1) : 0;
    },
    stopTween: function() {
      if (this.tween) {
        this.tween.stop();
      }
    },
    blur: function() {
      var target = { alpha: 0.1 };

      this.stopTween();

      this.tween = new TWEEN.Tween(this)
          .to(target, 100)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
    },
    focus: function() {
      var target = { alpha: 1 };

      this.stopTween();

      this.tween = new TWEEN.Tween(this)
          .to(target, 500)
          .easing(TWEEN.Easing.Cubic.Out)
          .start();
    },
    grow: function(chance) {
      if (this.frame === 0) {
        if (Math.random() < chance) {
          this.setColor(Math.floor(Math.random() * 4));
          this.setFrame(1);
        }
      } else if (this.frame < 3 && Math.random() < chance) {
        this.setFrame(this.frame + 1);
      }
    },
    setFrame: function(frame) {
      this.frame = frame;
      this.updateClipRect();
    },
    setColor: function(color) {
      this.color = color;
      this.updateClipRect();
    },
    updateClipRect: function() {
      this.clipRect.set(
          72 * this.frame, 
          0 + this.color * 104, 
          72 + 72 * this.frame,
          104 + this.color * 104);
    }
  });
});
