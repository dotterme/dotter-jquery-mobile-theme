module.exports = function( grunt ) {
    "use strict";

    var fs = require("fs");

    var staticDir = "src/main/webapp/static",
        themes = grunt.file.expand({
            cwd: staticDir,
            filter: "isDirectory"
        }, "*"),
        grunticonThemes = themes.filter(function(theme) {
            return grunt.file.isDir(staticDir + "/" + theme + "/icons");
        }),
        sassThemes = themes.filter(function(theme) {
            return grunt.file.isFile(staticDir + "/" + theme + "/dotter.scss");
        });

    grunt.initConfig({
        grunticon: (function() {
            var config = {};
            grunticonThemes.forEach(function(theme){
                config[theme] = {
                    files: [{
                        expand: true,
                        cwd: staticDir + "/" + theme + "/icons",
                        src: ["*.svg", "*.png"],
                        dest: staticDir + "/" + theme
                    }],
                    options: {
                        // CSS filenames
                        datasvgcss: "icons.data.svg.css",
                        datapngcss: "icons.data.png.css",
                        urlpngcss: "icons.fallback.css",

                        // preview HTML filename
                        previewhtml: "preview.html",

                        // grunticon loader code snippet filename
                        loadersnippet: "grunticon.loader.js",

                        // folder name (within dest) for png output
                        pngfolder: "icons/png",

                        // prefix for CSS classnames
                        cssprefix: ".icon-",

                        customselectors: {
                            "*" : [".ui-icon-$1:after"]
                        },

                        // css file path prefix - this defaults to "/" and will be placed before the "dest" path when stylesheets are loaded.
                        // This allows root-relative referencing of the CSS. If you don't want a prefix path, set to to ""
                        cssbasepath: "/"
                    }
                };
            });
            return config;
        }()),

        sass: (function(){
            var config = {};
            sassThemes.forEach(function(theme){
                config[theme] = {
                    options: {
                        style: "expanded",
                        trace: true
                    },
                    files: [{
                        expand: true,
                        cwd: staticDir + "/" + theme,
                        src: ["dotter.scss"],
                        dest: staticDir + "/" + theme,
                        ext: ".css"
                    }]
                };
            });
            return config;
        }()),

        watch: {
            scripts: {
                files: ['**/*.scss'],
                tasks: ['sass'],
            },
        },
    });

    // grunt plugins
    require( "load-grunt-tasks" )( grunt );

    grunt.registerTask( "default", [ "grunticon", "sass" ] );
    grunt.loadNpmTasks('grunt-contrib-watch');
};
