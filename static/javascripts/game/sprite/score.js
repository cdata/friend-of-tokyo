define(['underscore', 'game/sprite', 'game/sprite/number', 'game/vector2'],
       function(_, Sprite, Number, Vector2) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
      });
      Sprite.prototype.initialize.call(this, options);

      this.model = options.model;
      this.model.on('change:score', this.updateScore, this);

      this.clipRect.set(0, 0, 0, 0);
      this.updateScore();
    },
    updateScore: function() {
      var score = this.model.get('score').toString().split('');
      var number;
      var index;

      this.clearChildren();

      for (index = score.length - 1; index > -1; --index) {
        this.append(new Number({
          value: score[index],
          top: 480,
          width: 20,
          height: 20,
          position: new Vector2((score.length - index) * -20, 0)
        }));
      }
    }
  });
});
