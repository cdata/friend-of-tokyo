define(['underscore', 'backbone'],
       function(_, Backbone) {
  return Backbone.Model.extend({
    defaults: {
      score: 0,
      turn: 0,
      orientation: 0,
      military: 0,
      industry: 0,
      science: 0
    },
    completeTurn: function() {
      this.set('turn', this.get('turn') + 1);
    },
    addPoints: function(value) {
      this.set('score', this.get('score') + value);
    }
  });
});
