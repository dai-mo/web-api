module.exports = function(config) {
    config.set({

        basePath: './',

        frameworks: ['jasmine'],

        files: [
            // paths loaded by Karma
            
            {pattern: 'node_modules/core-js/client/shim.min.js', included: true, watched: true},
            {pattern: 'node_modules/zone.js/dist/zone.js', included: true, watched: true},

            {pattern: 'node_modules/reflect-metadata/Reflect.js', included: true, watched: true},
            {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true},
            {pattern: 'app/assets/javascripts/systemjs.config.js', included: true, watched: true},
            {pattern: 'karma-test-shim.js', included: true, watched: true},

            // paths loaded via module imports
            {pattern: 'test/dist/**/*.js', included: false, watched: true},
            {pattern: 'target/web/public/main/javascripts/**/*.js', included: false, watched: true},

            // third party libs
            {pattern: 'node_modules/@angular/platform-browser/**/*.js', included: false, watched: false},

            // paths to support debugging with source maps in dev tools
            {pattern: 'app/assets/**/*.ts', included: false, watched: false},
            {pattern: 'test/assets/**/*.ts', included: false, watched: false},
            {pattern: 'test/dist/**/*.js.map', included: false, watched: false}
        ],

        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            '/test/': '/base/test/',
            '/assets/lib/': '/base/node_modules/'
        },

        port: 9876,

        logLevel: config.LOG_INFO,

        colors: true,

        autoWatch: true,

        //browsers: ['Chrome'],

        browsers: ['PhantomJS'],


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
            outputDir: 'test/dist',
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
                {type: 'json', dir: 'test', subdir: 'coverage', file: 'coverage-final.json'}
            ]
        },

        singleRun: true
    })
};
