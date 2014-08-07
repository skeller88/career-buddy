module.exports = function(grunt) {
  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
            dev: {
                options: {
                    sassDir: ['app/scss'],
                    cssDir: ['app/css'],
                    environment: 'development'
                }
            },
            prod: {
                options: {
                    sassDir: ['app/scss'],
                    cssDir: ['app/css'],
                    environment: 'production'
                }
            }
        },

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

        watch: {
              compass: {
                  files: 'app/scss/*.scss',
                  tasks: ['compass:dev']
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

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['compass:dev', 'watch']);
    grunt.registerTask('test', ['mochaTest', 'karma']);
}