module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      './dcs/app/bower_components/angular/angular.js',
      './dcs/app/bower_components/angular-route/angular-route.js',
      './dcs/app/bower_components/angular-mocks/angular-mocks.js',
      './dcs/app/components/**/*.js',
      './dcs/app/*.js',
      './dcs/app/mobilise/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
