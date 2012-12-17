define(['underscore', 'game/object', 'game/engine', 'game/renderer', 'game/world', 'model/game'],
       function(_, GameObject, Engine, Renderer, World, GameModel) {
  return GameObject.extend({
    initialize: function() {
      this.engine = new Engine();
      this.model = new GameModel();
      this.world = new World({
        model: this.model
      });
      this.renderer = new Renderer();
      this.el = document.createElement('div');
      this.el.appendChild(this.renderer.canvas);

      this.renderer.scene.append(this.world);
    },
    play: function() {
      this.engine.on('render', this.renderer.render, this.renderer);
      this.engine.on('render', this.updateUI, this);
      this.engine.start();
    },
    updateUI: function() {
      var science = this.model.get('science');
      var industry = this.model.get('industry');
      var military = this.model.get('military');
      var context = this.renderer.context;

      context.save();
      context.globalAlpha = this.world.alpha;
      context.fillStyle = '#de0000';
      context.fillRect(
          48 / window.pixelRatio, 
          14 / window.pixelRatio, 
          Math.min(Math.round(military / 200 * 200) / window.pixelRatio, 200 / window.pixelRatio), 
          16 / window.pixelRatio);
      context.fillStyle = '#af00db';
      context.fillRect(
          48 / window.pixelRatio, 
          46 / window.pixelRatio, 
          Math.min(Math.round(science / 200 * 200) / window.pixelRatio, 200 / window.pixelRatio), 
          16 / window.pixelRatio);

      context.fillStyle = '#00acd8';
      context.fillRect(
          48 / window.pixelRatio, 
          78 / window.pixelRatio, 
          Math.min(Math.round(industry / 200 * 200) / window.pixelRatio, 200 / window.pixelRatio), 
          16 / window.pixelRatio);

      context.restore();
    }
  });
});
