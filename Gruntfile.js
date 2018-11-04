module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        less : {
            options : {
                plugins : [
                    new (require('less-plugin-autoprefix'))({browsers : [ "last 2 versions", "> 1%"]}),
                    require('less-plugin-glob')
                ]
            },
            main : {
                files: {
                    'Web/Frontend/Assets/styles/css/styles.css' : 'Web/Frontend/Assets/styles/less/entry.less'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['less']);
};