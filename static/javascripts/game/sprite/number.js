define(['underscore', 'game/sprite'],
       function(_, Sprite) {
  return Sprite.extend({
    initialize: function(options) {
      options = _.defaults(options || {}, {
        top: 440,
        width: 32,
        height: 32,
        value: ':',
        asciiOffset: 48
      });

      Sprite.prototype.initialize.call(this, options);

      this.asciiOffset = options.asciiOffset;
      this.top = options.top;
      this.width = options.width;
      this.height = options.height;

      this.setValue(options.value);
    },
    setValue: function(value) {
      var ascii;
      var left;

      this.value = value;

      ascii = this.value.charCodeAt(0) - this.asciiOffset;
      left = ascii * this.width;

      this.clipRect.set(
          left,
          this.top,
          this.width + left,
          this.top + this.height);
    }
  });
});

