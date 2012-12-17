define(['backbone', 'underscore', 'jquery', 'game'],
       function(Backbone, _, $, Game) {
  return Backbone.Router.extend({
    routes: {
      '': 'default',
      'play': 'play',
      'game-over/:outcome': 'gameOver'
    },
    initialize: function() {
      $('body').addClass('friend-of-tokyo');
      this.container = $('#Container');
      Backbone.history.start();
    },
    default: function() {
      this.navigate('play', { trigger: true });
    },
    play: function() {
      this.container.children().remove();
      this.game = new Game();
      this.container.append(this.game.el);
      this.game.play();
    },
    gameOver: function(outcome) {
      var score = 0;

      if (this.game) {
        score = this.game.model.get('score');
        this.game.dispose();
        this.game = null;
      }

      this.container.children().remove();

      var resultContainer = document.createElement('div');
      var el;
      var resultText;

      switch (outcome) {
        case 'military':
          resultText = "After years of fending off the monster, the hapless military was finally able to devise the ultimate weapon to destroy her. The denizens of Tokyo looked on in terror as the explosion did its terrible work.";
          break;
        case 'science':
          resultText = "Deep in a secret underground geofront, Japanese scientists developed a deadly biological agent to fend off Tokyo's aggressor. The citizens of Tokyo were evacuated to biohazard shelters, and by the following  morning the monster was no more.";
          break;
        case 'industry':
          resultText = "With seemingly bottomless financial assets at their disposal, Japan was able to erect an industrial society capable of producing defensive and destructive capabilities faster than the monster could dispose of them. Outmanned, outgunned and less effective as each day passed, Tokyo's nemesis finally met her end.";
          break
      }

      resultContainer.className = 'outcome';

      el = document.createElement('span');
      $(el).text(resultText);

      resultContainer.appendChild(el);

      el = document.createElement('span');
      $(el).text('Your score: ' + score);

      resultContainer.appendChild(el);

      el = document.createElement('a');
      el.href = '#play';
      $(el).text('Play again?');

      resultContainer.appendChild(el);

      this.container.append(resultContainer);
    }
  });
});
