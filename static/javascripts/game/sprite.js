define(['underscore', 'jquery', 'game/node', 'game/vector2', 'game/rectangle'],
       function(_, $, Node, Vector2, Rectangle) {
  return Node.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        url: 'images/friend-of-tokyo.png',
        name: 'Unnamed',
        clipRect: new Rectangle(0, 0, 72, 104),
        position: new Vector2(),
        alpha: 1,
        rotation: 0,
        visible: true
      });

      Node.prototype.initialize.call(this, options);

      this.name = options.name;
      this.$image = $('img[src="' + options.url + '"]');
      this.image = this.$image.get(0);
      this.clipRect = options.clipRect;
      this.position = options.position;
      this.alpha = options.alpha;
      this.rotation = options.rotation;
      this.visible = options.visible;
    },
    dispose: function() {
      this.$image = null;
      this.image = null;
      this.clipRect.dispose();
      this.clipRect = null;
      this.position.dispose();
      this.position = null;
    },
    update: function() {

    }
  });
});
