module.exports = function(grunt) {
  // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      karma: {
        unit: {
          configFile: 'my.conf.js',
          singleRun: true
        }
      },

      mochaTest: {
        test: {
          options: {
            reporter: 'spec'
          },
          src: ['spec/src/**/*.js']
        }
      },

      sass: {
          dist: {
              files: {
                  'app/css/app.css': 'app/scss/app.scss'
              }
          }
      },

      watch: {
        css: {
            files: 'app/scss/*.scss',
            tasks: ['sass']
        },
        scripts: {
          files: [
            'my.conf.js', 
            'app/js/*.js', 
            'app/util/*.js', 
            'app/lib/*.js', 
            'src/**/*.js', 
            'spec/**/*.js'
          ],
          tasks: ['mochaTest', 'karma']
        }
      }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('deploy', ['sass']);
    grunt.registerTask('test', ['mochaTest', 'karma']);
}