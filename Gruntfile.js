module.exports = function(grunt) {
  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: [
                'build'
            ]
        },

        compass: {
            dev: {
                options: {
                    sassDir: ['app/scss'],
                    cssDir: ['app/css'],
                    environment: 'development'
                }
            },
            dist: {
                options: {
                    sassDir: ['app/scss'],
                    cssDir: ['app/css'],
                    environment: 'production'
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {src: 'app/index.html', dest: 'dist/index.html'},
                    {expand: true, cwd: 'app', src: 'partials/*', dest: 'dist'},
                    {expand: true, cwd: 'app', src: 'img/*', dest: 'dist'}
                ]
            }
        },

        //TODO - add cache busting with grunt-hashres: http://davidtucker.net/articles/automating-with-grunt/#workflowClean or grunt-filerev: https://github.com/yeoman/grunt-filerev

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

        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html']
        },

        watch: {
                //could rename to sass
              compass: {
                  files: 'app/scss/*.scss',
                  tasks: ['compass:dev']
              },
              //could rename to js
              scripts: {
                files: [
                  'my.conf.js',
                  'app/js/*.js',
                  'app/util/*.js',
                  'app/lib/*.js',
                  'src/**/*.js',
                  'spec/**/*.js'
                ],
                tasks: ['mochaTest', 'karma', 'uglify']
              }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'compass:dev', 'copy', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin'
    ]);
    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('test', ['mochaTest', 'karma']);
    grunt.registerTask('deployProduction', ['clean:build', 'build']);
}