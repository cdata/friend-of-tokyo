define(['underscore', 'game/sprite', 'game/rectangle'],
       function(_, Sprite, Rectangle) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        name: 'Compass',
        rotation: 0
      });

      Sprite.prototype.initialize.call(this, options);

      this.asset = this.append(new Sprite({
      }));
      this.clipRect.set(0, 0, 0, 0);
      
      this.asset.position.x = -28;
      this.asset.position.y = -32;
      this.baseY = this.position.y;
      this.setHover(0);
      this.setOrientation(0);
    },
    setOrientation: function(value) {
      this.orientation = value;
      this.rotation = Math.PI * value;
      this.position.y = this.baseY + 24 * value;
    },
    setHover: function(hover) {
      this.asset.clipRect.set(
        440,
        120 + 64 * hover,
        496,
        184 + 64 * hover);
    },
    update: function(mouse) {
      if (!mouse.moved && !mouse.clicked) {
        return;
      }

      var hitRect = new Rectangle(0, 0,
                                  this.asset.clipRect.getWidth(),
                                  this.asset.clipRect.getHeight());

      hitRect.translate(this.position.clone().add(this.asset.position));

      if (hitRect.containsPoint(mouse.move)) {
        this.setHover(1);
      } else {
        this.setHover(0);
      }

      if (mouse.clicked) {
        if (hitRect.containsPoint(mouse.click)) {
          this.setOrientation(this.orientation ? 0 : 1);
          this.trigger('click:compass', this);
        }
      }
    }
  });
});
