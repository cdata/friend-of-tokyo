define(['underscore', 'game/node', 'game/sprite/building', 'game/sprite/arrow', 'game/vector2', 'game/sprite/dinosaur', 'q', 'game/sprite/humans', 'game/sprite/score', 'game/sprite/points', 'game/sprite/compass', 'game/sprite', 'tween'],
       function(_, Node, Building, Arrow, Vector2, Dinosaur, q, Humans, Score, Points, Compass, Sprite, TWEEN) {
  return Sprite.extend({
    initialize: function(options) {
      Sprite.prototype.initialize.call(this, options);
      this.clipRect.set(0, 0, 0, 0);

      this.model = options.model;
      this.tileWidth = 32;
      this.tileHeight = 16;
      this.width = 500;
      this.height = 300;
      this.interactive = true;

      this.on('hover:arrow', this.handleArrowHover, this);
      this.on('click:compass', this.setOrientation, this);
      this.on('gg', this.endGame, this);

      this.resetTiles();
    },
    endGame: function(outcome) {
      var start = { alpha: 1 };
      this.disableInteraction();
      this.tween = new TWEEN.Tween(start)
          .to({ alpha: 0 }, 1000)
          .onUpdate(_.bind(function() {
            this.alpha = start.alpha;
          }, this))
          .onComplete(_.bind(function() {
            app.navigate('game-over/' + outcome, { trigger: true });
          }, this))
          .start();
    },
    enableInteraction: function() {
      this.interactive = true;
    },
    disableInteraction: function() {
      this.interactive = false;
    },
    handleArrowHover: function(arrow) {
      if (!this.interactive) {
        return;
      }

      var currentArrow = this.hoveredArrow;

      if (!currentArrow) {
        this.hoveredArrow = arrow;
      } else if (currentArrow.position.y < arrow.position.y) {
        currentArrow.setColor(0);
        this.hoveredArrow = arrow;
      }
    },
    update: function(mouse) {
      Node.prototype.update.apply(this, arguments);

      var tiles;

      if (!this.interactive) {
        return;
      }

      if (this.hoveredArrow) {
        this.hoveredArrow.setColor(1);

        tiles = this.getLineOfTiles(this.hoveredArrow.direction,
                                this.hoveredArrow.column);

        this.highlightTiles(tiles);
      } else {
        this.clearHighlight();
      }

      if (mouse.clicked && this.hoveredArrow) {
        mouse.reset();
        this.tick(tiles, this.hoveredArrow);
      }

      this.hoveredArrow = null;
    },
    tick: function(tiles, arrow) {
      this.disableInteraction();

      var dinosaur = this.append(new Dinosaur({
        direction: arrow.direction                                       
      }));

      var dropTarget = this.hoveredArrow.position.clone();

      if (arrow.direction === 0) {
        dropTarget.x += this.tileWidth * 2;
        dropTarget.y -= this.tileHeight * 2;
      } else {
        dropTarget.x -= this.tileWidth * 2;
        dropTarget.y -= this.tileHeight * 2;
      }

      dinosaur.drop(dropTarget).then(_.bind(function() {
        var result = q.resolve();
        var science = 0;
        var military = 0;
        var industry = 0;

        _.each(tiles, function(tile) {
          result = result.then(_.bind(function() {
            return dinosaur.move(tile.position).then(_.bind(function() {
              var value = tile.value();
              switch (tile.color) {
                case 1:
                  value = Math.pow(value, ++science);
                  break;
                case 2:
                  value = Math.pow(value, ++military);
                  break;
                case 3:
                  value = Math.pow(value, ++industry);
                  break;
              }
              
              this.model.addPoints(value);
              this.showPoints(value, tile.position);
              tile.collapse();
            }, this));
          }, this));
        }, this);

        return result;
      }, this)).then(_.bind(function() {
        var lastMove = tiles[tiles.length - 1]
            .position.clone()
            .subtract(tiles[tiles.length - 2].position)
            .multiply(2)
            .add(tiles[tiles.length-1].position);

        return dinosaur.move(lastMove);
      }, this)).then(_.bind(function() {
        return dinosaur.leave().then(_.bind(function() {

          dinosaur.parent.remove(dinosaur);
          dinosaur.dispose();

          return this.clearHighlight();
        }, this));
      }, this)).then(_.bind(function() {
        this.model.completeTurn();
        var science = 0;
        var military = 0;
        var industry = 0;

        _.each(this.tiles, function(tile) {
          for (var i = 0; i < tiles.length; i++) {
            if (tiles[i] === tile)
              return;
          }

          tile.grow(0.1 + Math.floor(this.model.get('turn') / 10) * 0.025);

          if (tile.color === 1) {
            science += tile.value();
          } else if (tile.color === 2) {
            military += tile.value();
          } else if (tile.color === 3) {
            industry += tile.value();
          }
        }, this);

        this.model.set({
          science: science,
          military: military,
          industry: industry
        });

        this.enableInteraction();
      }, this));

    },
    highlightTiles: function(tiles) {
      var i;
      var j;

      for (i = 0; i < this.tiles.length; ++i) {
        for (j = 0; j < tiles.length; ++j) {
          if (this.tiles[i] === tiles[j]) {
            this.tiles[i].focus();
            break;
          }
        }

        if (j === tiles.length) {
          this.tiles[i].blur();
        }
      }
    },
    getLineOfTiles: function(direction, index) {
      var result = [];
      var insert = 'unshift';
      var i;

      for (i = 0; i < 10; i++) {
        if (direction === 0) {
          result[insert](this.tiles[index * 10 + i]);
        } else {
          result[insert](this.tiles[index + i * 10]);
        }
      }

      return result;
    },
    setOrientation: function(compass) {
      var tiles = this.tiles.reverse();
      var offsetX = this.tileWidth - this.width;
      var offsetY = this.tileHeight + 160 - this.height;
      var index;
      var tile;
      var x;
      var y;

      for (index = 0; index < tiles.length; index++) {
        y = index % 10;
        x = Math.floor(index / 10);

        tile = tiles[index];

        tile.position.x = x * this.tileWidth - y * this.tileWidth - offsetX;
        tile.position.y = y * this.tileHeight + x * this.tileHeight - 56 - offsetY;

        this.buildings.remove(tile);
        this.buildings.append(tile);
      }

      this.tiles = tiles;
    },
    clearHighlight: function() {
      var result = q.defer();
      var i;
      var column;

      for (var i = 0; i < this.tiles.length; ++i) {
        this.tiles[i].focus();
      }

      setTimeout(function() {
        result.resolve();
      }, 500)

      return result.promise;
    },
    showPoints: function(value, position) {
      var points = new Points({
        value: value,
        position: position.clone()
      });

      this.ui.prepend(points);
    },
    resetTiles: function() {
      var offsetX = this.tileWidth - this.width;
      var offsetY = this.tileHeight + 160 - this.height;
      var matrix = [];
      var tiles = [];
      var column;

      var tile;

      var frame;
      var color;
      var x;
      var y;

      this.clearChildren();

      this.buildings = this.append(new Node());
      this.arrows = this.append(new Node());
      this.ui = this.append(new Node());

      tile = this.ui.append(new Humans({
        position: new Vector2(10, 10),
        model: this.model
      }));

      tile = this.ui.append(new Score({
        position: new Vector2(992, 10),
        model: this.model
      }));

      tile = this.ui.append(new Compass({
        position: new Vector2(894, 490)
      }));

      for (x = 0; x < 10; ++x) {
        column = [];
        matrix.push(column);
        for (y = 0; y < 10; ++y) {

          frame = Math.random() > 0.75 ? Math.floor(Math.random() * 4) : 0;
          color = 0;

          tile = this.buildings.append(new Building({
            color: color,
            frame: frame,
            position: new Vector2(x * this.tileWidth - y * this.tileWidth - offsetX,
                                  y * this.tileHeight + x * this.tileHeight - 56 - offsetY)
          }));

          column.push(tile);
          console.log(tiles.push(tile) - 1, x, y);

          if (x === 9) {
            // y-axis arrows
            tile = this.arrows.append(new Arrow({
              direction: 1,
              column: y,
              position: new Vector2(
                  x * this.tileWidth - y * this.tileWidth + 4 * this.tileWidth - offsetX,
                  y * this.tileHeight + x * this.tileHeight + 4 * this.tileHeight - offsetY)
            }));
          }
        }

        // x-axis arrows
        tile = this.arrows.append(new Arrow({
          direction: 0,
          column: x,
          position: new Vector2(x * this.tileWidth - 13 * this.tileWidth - offsetX,
                                y * this.tileHeight + x * this.tileHeight + 3 * this.tileHeight - offsetY)
        }));
      }

      this.matrix = matrix;
      this.tiles = tiles;
    }
  });
});
