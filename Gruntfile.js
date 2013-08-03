var path = require('path'),
    fs = require('fs');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-replace');

    //explicity set source files because order is important
    var srcFiles = [
        '<%= dirs.src %>/main.js',
        '<%= dirs.src %>/panels/Panel.js',
        '<%= dirs.src %>/panels/GamepadPanel.js',
        '<%= dirs.src %>/panels/PerformancePanel.js',
        '<%= dirs.src %>/panels/PhysicsPanel.js',
        '<%= dirs.src %>/panels/SpritesPanel.js',
        '<%= dirs.src %>/panels/MapPanel.js',
        '<%= dirs.src %>/util/Graph.js',
        '<%= dirs.src %>/util/Minimap.js',
        '<%= dirs.src %>/util/ui.js'
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
            less: 'styles',
            src: 'js'
        },
        files: {
            srcBlob: '<%= dirs.src %>/**/*.js',
            intro: '<%= dirs.src %>/intro.js',
            outro: '<%= dirs.src %>/outro.js',
            less: '<%= dirs.less %>/main.less',
            buildJs: '<%= dirs.build %>/<%= pkg.name %>.js',
            buildJsMin: '<%= dirs.build %>/<%= pkg.name %>.min.js',
            buildCss: '<%= dirs.build %>/<%= pkg.name %>.css',
            buildCssMin: '<%= dirs.build %>/<%= pkg.name %>.min.css',
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
                        src: ['<%= files.buildJs %>', '<%= files.buildJsMin %>'],
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
                src: ['<%= files.intro %>'].concat(srcFiles).concat(['<%= files.outro %>']),
                dest: '<%= files.buildJs %>'
            }
        },
        uglify: {
            options: {
                banner: banner,
                mangle: false
            },
            dist: {
                src: '<%= files.buildJs %>',
                dest: '<%= files.buildJsMin %>'
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
                worker: false,       //web-workers are not used

                /* Globals */
                undef: true,
                globals: {
                    gf: false,
                    PIXI: false
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
        },
        less: {
            dev: {
                options: {
                    paths: ['<%= dirs.less %>']
                },
                files: {
                    '<%= files.buildCss %>': '<%= files.less %>'
                }
            },
            prod: {
                options: {
                    paths: ['<%= dirs.less %>'],
                    yuicompress: true
                },
                files: {
                    '<%= files.buildCssMin %>': '<%= files.less %>'
                }
            }
        }
    });

    //default task
    grunt.registerTask('default', ['hint', 'buildJs', 'buildCss']);

    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('docs', ['yuidoc']);

    grunt.registerTask('buildJs', ['concat', 'uglify', 'replace']);
    grunt.registerTask('buildCss', ['less:dev', 'less:prod']);
};