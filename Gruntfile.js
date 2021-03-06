'use strict';

module.exports = function(grunt) {
  // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: {
                src: ['dist/']
            }
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
                    {expand: true, cwd: 'app', src: 'index.html', dest: 'dist'},
                    {expand: true, cwd: 'app', src: 'img/*', dest: 'dist'}
                ]
            }
        },

        hashres: {
            options: {
                encoding: 'utf8',
                fileNameFormat: '${hash}.${name}.cache.${ext}',
                renameFiles: true
            },
            prod: {
                src: [
                    'dist/css/*.css',
                    'dist/js/*.js'
                ],
                dest: [
                    'dist/index.html',
                    'dist/partials/*.html'
                ]
            }
        },

        // TODO(shane): karma task hangs; fix
        karma: {
          unit: {
            configFile: 'my.conf.js',
            singleRun: true
          }
        },

        minifyHtml: {
            dist: {
                files: [
                    {
                        cwd: 'dist',
                        dest: 'dist',
                        expand: true,
                        src: 'index.html'
                    },
                    {
                        cwd: 'app',
                        dest: 'dist',
                        expand: true,
                        src: 'partials/*'
                    },
                ]
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
                dest: 'dist/'
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
                tasks: ['mochaTest', 'karma']
              }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-minify-html');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('build', [
        'clean',
        'compass:dev',
        'copy',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'hashres',
        'usemin',
        'minifyHtml'
    ]);
    grunt.registerTask('heroku:production', ['build']);
    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('test', ['mochaTest', 'karma']);
};