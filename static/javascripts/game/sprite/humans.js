define(['underscore', 'game/sprite', 'game/vector2'],
       function(_, Sprite, Vector2) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        name: 'Humans'
      });

      Sprite.prototype.initialize.call(this, options);

      this.skull = this.append(new Sprite({
        position: new Vector2(250, 0),
        alpha: 0
      }));

      this.model = options.model;
      this.model.on('change:military change:industry change:science',
                    this.updateSkullOpacity, this);

      this.skull.clipRect.set(
        320,
        320,
        380,
        416);

      this.clipRect.set(
        400,
        120,
        424,
        208);
    },
    updateSkullOpacity: function() {
      var military = this.model.get('military');
      var science = this.model.get('science');
      var industry = this.model.get('industry');
      var max = Math.max(military, science, industry);
      var outcome;

      this.skull.alpha = Math.max(max - 100, 0) / 100;

      if (max >= 200) {
        if (max === military) {
          outcome = 'military';
        } else if (max === science) {
          outcome = 'science';
        } else {
          outcome = 'industry';
        }

        this.trigger('gg', outcome);
      }
    }
  });
});
