requirejs.config({
  baseUrl: 'javascripts',
  //urlArgs: 'bust=' + (new Date()).getTime(),
  paths: {
    'jquery': 'support/jquery',
    'underscore': 'support/lodash',
    'backbone': 'support/backbone',
    'stats': 'support/stats',
    'tween': 'support/tween',
    'q': 'support/q'
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'stats': {
      exports: 'Stats'
    },
    'tween': {
      exports: 'TWEEN'
    }
  }
});

require(['app'], function(App) {
  // TODO: ?
  window.app = new App();
  
});
