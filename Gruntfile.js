var path = require('path'),
    fs = require('fs');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-replace');

    //explicity set source files because order is important
    var srcFiles = [
        '<%= dirs.src %>/main.js'
    ],
    vendorFiles = [
    ],
    banner = [
        '/**',
        ' * @license',
        ' * <%= pkg.longName %> - v<%= pkg.version %>',
        ' * Copyright (c) 2013, Chad Engler',
        ' * <%= pkg.homepage %>',
        ' *',
        ' * Compiled: <%= grunt.template.today("yyyy-mm-dd") %>',
        ' *',
        ' * <%= pkg.longName %> is licensed under the <%= pkg.license %> License.',
        ' * <%= pkg.licenseUrl %>',
        ' */',
        ''
    ].join('\n');

    //Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            build: 'build',
            docs: 'docs',
            src: 'js',
            vendor: 'vendor'
        },
        files: {
            vendorBlob: '<%= dirs.vendor %>/**/*js',
            srcBlob: '<%= dirs.src %>/**/*.js',
            intro: '<%= dirs.src %>/intro.js',
            outro: '<%= dirs.src %>/outro.js',
            build: '<%= dirs.build %>/<%= pkg.name %>.js',
            buildMin: '<%= dirs.build %>/<%= pkg.name %>.min.js'
        },
        replace: {
            dist: {
                options: {
                    variables: {
                        'VERSION': '<%= pkg.version %>',
                        'GF_VERSION': '<%= pkg.engines.gf %>'
                    },
                    prefix: '@@'
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= files.build %>', '<%= files.buildMin %>'],
                        dest: '<%= dirs.build %>'
                    }
                ]
            }
        },
        concat: {
            options: {
                banner: banner
            },
            dist: {
                src: ['<%= files.intro %>'].concat(vendorFiles).concat(srcFiles).concat(['<%= files.outro %>']),
                dest: '<%= files.build %>'
            }
        },
        uglify: {
            options: {
                banner: banner,
                mangle: false
            },
            dist: {
                src: '<%= files.build %>',
                dest: '<%= files.buildMin %>'
            }
        },
        jshint: {
            beforeconcat: srcFiles,
            options: {
                /* Enforcement options */
                bitwise: false,     //allow bitwise operators
                camelcase: false,   //must use camelCase or UPPER_CASE
                curly: false,       //one line conditionals w/o braces are allowed
                eqeqeq: true,       //must use === if possible
                forin: false,       //forin loops much check hasOwnProperty
                immed: true,        //self-calling functions must be wrapped in parens
                latedef: true,      //can't use a variable until it is defined
                newcap: true,       //ctor names must be Captialized
                noarg: true,        //arguments.caller/callee are deprecated, disallow
                noempty: true,      //warn about empty blocks
                nonew: true,        //no using `new Constructor();` without saving the value (no using only side-effects)
                plusplus: false,    //you can use unary increment and decrement operators
                quotmark: true,     //quotes must be consistent
                unused: true,       //warn about declared but not used variables
                strict: false,      //do not require functions to be able to run in strict-mode
                trailing: true,     //help prevent weird whitespace errors in multi-line strings using \ 
                maxlen: 200,        //no line should be longer than 120 characters

                /* Relaxing Options */
                boss: true,        //do not warn about the use of assignments in cases where comparisons are expected

                /* Environments */
                browser: true,      //this runs in a browser :)
                devel: false,       //warn about using console.log and the like
                jquery: false,      //no jquery used here
                node: false,        //no node support...YET! :)
                worker: true,       //web-workers are used

                /* Globals */
                undef: true,
                globals: {
                    PIXI: false,
                    gf: false,
                    cp: false
                }
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: '<%= dirs.src %>',
                    outdir: '<%= dirs.docs %>'
                }
            }
        }
    });

    //Load tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'replace']);
    grunt.registerTask('docs', ['yuidoc']);
};