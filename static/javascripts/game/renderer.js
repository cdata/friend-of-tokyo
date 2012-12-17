define(['underscore', 'jquery', 'game/object', 'game/node', 'game/sprite', 'game/rectangle', 'game/vector2', 'game/polyfill'],
       function(_, $, GameObject, Node, Sprite, Rectangle, Vector2) {
  return GameObject.extend({
    initialize: function() {
      this.width = 500;
      this.height = 300;
      this.canvas = document.createElement('canvas');
      this.$canvas = $(this.canvas);
      this.context = this.canvas.getContext('2d');

      this.scene = new Node();

      this.invalidateSize();

      this.origin = new Vector2(this.width * window.pixelRatio / 2,
                                this.height * window.pixelRatio / 2);

      this.click = new Vector2(-1, -1);
      this.move = new Vector2(-1, -1);

      this.$canvas.on('mousemove', _.bind(this.handleMouseMove, this));
      this.$canvas.on('click', _.bind(this.handleMouseClick, this));
    },
    // Adapted from http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
    getMousePosition: function(event) {
      var x;
      var y;
      var offset;

      if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
      } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      offset = this.$canvas.offset();

      x -= offset.left;
      y -= offset.top;

      return new Vector2(x, y);
    },
    handleMouseMove: function(event) {
      this.move.copy(this.getMousePosition(event));
    },
    handleMouseClick: function(event) {
      this.click.copy(this.getMousePosition(event));
    },
    dispose: function() {
      this.$canvas.off('mousemove');
      this.$canvas.off('click');
      this.canvas = null;
      this.$canvas = null;
      this.context = null;
      this.scene.dispose();
      this.scene = null;
    },
    update: function() {
      var clearRatio = 2 / window.pixelRatio;
      var clickRatio = 2;
      this.context.clearRect(0, 0, this.width * clearRatio, this.height * clearRatio);
      this.scene.update({
        clicked: this.click.x > -1 && this.click.y > -1,
        moved: true,
        handled: false,
        click: this.click.clone().multiply(clickRatio),
        move: this.move.clone().multiply(clickRatio),
        reset: function() {
          this.move.set(-1, -1);
        }
      });

      this.click.set(-1, -1);
    },
    render: function(node) {
      var pixelRatio = window.pixelRatio;
      var position;
      var drawRect;
      var iter;
      var rot;

      node = node || this.scene;

      if (node === this.scene) {
        this.update();
      }

      this.context.save();

      if (node instanceof Sprite) {

        position = node.position;

        this.context.translate(position.x / pixelRatio, position.y / pixelRatio);
        this.context.rotate(node.rotation || 0);

        drawRect = new Rectangle(
            0, 0,
            node.clipRect.getWidth(),
            node.clipRect.getHeight());
            
        this.context.globalAlpha = node.alpha * this.context.globalAlpha;

        this.context.drawImage(
            node.image,
            node.clipRect.getX(),
            node.clipRect.getY(),
            node.clipRect.getWidth(),
            node.clipRect.getHeight(),
            drawRect.getX() / pixelRatio,
            drawRect.getY() / pixelRatio,
            drawRect.getWidth() / pixelRatio,
            drawRect.getHeight() / pixelRatio);
      }

      if (iter = node.firstChild) {
        do {
          this.render(iter);
        } while (iter = iter.nextSibling);
      }

      this.context.restore();
    },
    invalidateSize: function() {
      var pixelRatio = window.pixelRatio;
      this.canvas.width = this.width * pixelRatio;
      this.canvas.height = this.height * pixelRatio;

      this.$canvas.css({
        width: this.width + 'px',
        height: this.height + 'px'
      });

      // Grr..
      if (pixelRatio === 1) {
        this.context.scale(0.5, 0.5);
      } else {
        this.context.scale(pixelRatio, pixelRatio);
      }
    }
  });
});
