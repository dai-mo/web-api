module.exports = function(config) {
    config.set({

        basePath: './',

        frameworks: ['jasmine'],

        files: [
            // paths loaded by Karma
            'node_modules/systemjs/dist/system.src.js',
            
            {pattern: 'node_modules/core-js/client/shim.min.js', included: true, watched: false},

            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            {pattern: 'node_modules/reflect-metadata/Reflect.js', included: true, watched: false},
            {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: false},
            {pattern: 'app/assets/javascripts/systemjs.config.js', included: true, watched: true},


            // paths loaded via module imports
            {pattern: 'target/typescript/main/javascripts/**/*.js', included: false, watched: true},

            {pattern: 'karma-test-shim.js', included: true, watched: true},

            // third party libs
            {pattern: 'node_modules/**/*.js', included: false, watched: false},

            // paths to support debugging with source maps in dev tools
            {pattern: 'app/assets/**/*.ts', included: false, watched: false},
            {pattern: 'target/typescript/main/javascripts/**/*.js.map', included: false, watched: false}
        ],

        // proxied base paths
        proxies: {
            // required for component assets fetched by Angular's compiler
            '/assets/lib/': '/base/node_modules/',
            '/traceur.js': '/base/node_modules/traceur/bin/traceur.js'
        },

        port: 9876,


        logLevel: config.LOG_INFO,
        client: {
            captureConsole: true
        },
        colors: true,

        autoWatch: true,

        // browsers: ['Chrome'],

        browsers: ['PhantomJS'],

        browserDisconnectTimeout : 10000, // default 2000
        browserDisconnectTolerance : 1, // default 0
        browserNoActivityTimeout : 60000, //default 10000

        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        },

        // Karma plugins loaded
        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-mocha-reporter',
            'karma-junit-reporter'
        ],

        // Coverage reporter generates the coverage
        reporters: ['mocha', 'dots', 'junit', 'coverage'],

        junitReporter: {
            outputDir: 'target/karma',
            outputFile: 'test-results.xml',
            useBrowserName: false
        },
        // Source files that you wanna generate coverage for.
        // Do not include tests or libraries (these files will be instrumented by Istanbul)
        preprocessors: {
            '**/target/web/public/main/javascripts/**/*.js': ['coverage']
        },

        coverageReporter: {
            reporters:[
                {type: 'json', dir: 'target/karma', subdir: 'coverage', file: 'coverage-final.json'}
            ]
        },

        singleRun: true
    })
};
