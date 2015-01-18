module.exports = function(grunt) {
  
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      templates: {
        files: 'static/assets/templates/*.handlebars',
        tasks: 'handlebars'
      },
      javascripts: {
        files: 'static/javascripts/**/*.js',
        tasks: 'requirejs'
      }
    },
    handlebars: {
      all: {
        src: 'static/assets/templates',
        dest: 'static/javascripts/support/handlebars/templates.js'
      }
    },
    requirejs: {
      default: {
        baseUrl: './static/javascripts',
        name: 'friend-of-tokyo',
        mainConfigFile: './static/javascripts/friend-of-tokyo.js',
        out: './static/javascripts/friend-of-tokyo-release.js'
      }
    }
  });

  grunt.registerTask('default', [
    'watch'
  ]);

};
