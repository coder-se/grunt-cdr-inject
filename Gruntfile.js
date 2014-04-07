/*
 * grunt-cdr-inject
 * https://github.com/coder-se/grunt-cdr-inject
 *
 * Copyright (c) 2014 
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    copy: {
      tests: {
        files: [
          {cwd:'test/fixtures/', src:['scripts/**/*'], dest: 'tmp/', expand:true},
          {cwd:'test/fixtures/', src:['styles/**/*'], dest: 'tmp/', expand:true},
        ]
      }
    },

    // Configuration to be run (and then tested).
    cdr_inject: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options.html': ['test/fixtures/test.html'],
        },
      },
      custom_options: {
        options: {
          basePath: 'tmp',
        },
        files: {
          'tmp/custom_options.html': ['test/fixtures/test.html'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'cdr_inject'/*, 'nodeunit'*/]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
