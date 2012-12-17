define(['underscore', 'backbone', 'game/sprite', 'game/rectangle'],
       function(_, Backbone, Sprite, Rectangle) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        name: 'Arrow',
        direction: 0,
        color: 0,
        column: -1
      });

      Sprite.prototype.initialize.call(this, options);

      this.direction = options.direction;
      this.color = options.color;
      this.column = options.column;
      this.updateClipRect();
    },
    setDirection: function(direction) {
      this.direction = direction;
      this.updateClipRect();
    },
    setColor: function(color) {
      this.color = color;
      this.updateClipRect();
    },
    update: function(mouse) {

      Sprite.prototype.update.apply(this, arguments);

      var rect;

      if (mouse.moved) {

        rect = new Rectangle(0, 0, this.clipRect.getWidth(), this.clipRect.getHeight());
        rect.translate(this.position);

        if (!mouse.handled && rect.containsPoint(mouse.move)) {
          this.trigger('hover:arrow', this);
        } else {
          this.setColor(0);
        }
      }
    },
    updateClipRect: function() {
      this.clipRect.set(
        320,
        120 + this.direction * 96 + this.color * 48,
        400,
        168 + this.direction * 96 + this.color * 48);
    }
  });
});
