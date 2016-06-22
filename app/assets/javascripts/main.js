// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    paths: {
        'angular': '../lib/angularjs/angular',
        'domReady': '../lib/requirejs-domready/domReady',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'visjs': '../lib/visjs/vis'
    },
    shim: {
        angular: {
           exports : 'angular'
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['./app'], function (app) {
  angular.bootstrap(document, ['app']);
});
