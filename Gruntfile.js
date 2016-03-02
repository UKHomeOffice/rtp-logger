module.exports = function(grunt) {

    var allSrc = [
        'lib/*.js',
        'test/lib/*.js',
        'Gruntfile.js'
    ];

    grunt.initConfig({
        jscs: {
            options: {
                config: '.jscsrc',
                esnext: true,
                verbose: true,
                requireCurlyBraces: [ 'if' ]
            },
            javascripts: {
                src: allSrc
            }
        },
        eslint: {
            target: [
                '.'
            ],
        },
        mocha_istanbul: {
            src: ['test'],
            options: {
                reportFormats: ['html', 'cobertura']
            }
        },
        mochaTest: {
            local: {
                options: 'test/mocha.opts',
                src: ['test/lib/*.js']
            },
            ci: {
                options: {
                    reporter: 'xunit',
                    captureFile: 'testreports.xml',
                    quiet: true,
                    clearRequireCache: true
                },
                src: ['test/lib/*.js']
            }
        },
        watch: {
            js: {
                options: {
                    spawn: true,
                    interrupt: true
                },
                files: allSrc,
                tasks: ['jshint', 'mochaTest:local']
            }
        }
    });

    [
        'grunt-contrib-jshint',
        'grunt-mocha-istanbul',
        'grunt-open',
        'grunt-mocha-test',
        'grunt-contrib-watch',
        'grunt-eslint'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });

    grunt.registerTask('dev', [
        'eslint',
        'mochaTest:local'
    ]);

    grunt.registerTask('ci', [
        'eslint',
        'mochaTest:ci',
        'mocha_istanbul'
    ]);
};
