/*
 * grunt-cdr-inject
 * https://github.com/coder-se/grunt-cdr-inject
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */
'use strict';
module.exports = function(grunt) {
    grunt.registerMultiTask('cdr_inject', 'Inject css and javascript files into your html-files.', function() {
        
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            basePath: ''
        });
        
        var templates = {
            js: '<script src="{file}"></script>',
            css: '<link href="{file}" rel="stylesheet" type="text/css" />'
        };
        
        var inject = function(source) {
            var re = /<!---?\s*inject:\s+(.*)\s*-?--\s*>/gi,
                included = [];
            var newSource = source.replace(re, function(match, p0) {
                var optionsObj = JSON.parse('{' + p0 + '}');
                var output = renderTemplate(optionsObj, included);
                return output;
            });
            return newSource;
        };

        var renderTemplate = function(option, included) {
            var tmpl = templates[option.type];
            var files = grunt.file.expand({
                cwd: options.basePath
            }, option.files);
            if (option.order) {
                var sorted = [];
                files.map(function(f, i) {
                    return {
                        index: i,
                        value: f
                    };
                }).sort(function(a, b) {
                    var aName = a.value.split('/').pop();
                    var bName = b.value.split('/').pop();
                    var aIdx = option.order.indexOf(aName);
                    var bIdx = option.order.indexOf(bName);
                    return aIdx > bIdx ? 1 : -1;
                }).map(function(obj, i) {
                    sorted[i] = obj.value;
                });
                files = sorted;
            }
            var out = '';
            files.forEach(function(f) {
                if (included.indexOf(f) === -1) {
                    included.push(f);
                    out += tmpl.replace('{file}', f) + '\n';
                }
            });
            return out;
        };
        
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                // Read file source.
                return grunt.file.read(filepath);
            }).join('');
            
            var newSource = inject(src);
            // Write the destination file.
            grunt.file.write(f.dest, newSource);
            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
};