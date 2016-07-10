// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    paths: {
        'angular': '../lib/angularjs/angular',
        'angular_resource': '../lib/angularjs/angular-resource',
        'angular_cookies': '../lib/angularjs/angular-cookies',
        'angular_ui_bootstrap': '../lib/angular-ui-bootstrap/ui-bootstrap',
        'domReady': '../lib/requirejs-domready/domReady',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'visjs': '../lib/visjs/vis'
    },
    shim: {
        angular: {
           exports : 'angular'
        },
        angular_resource: {
           deps : ['angular']
        },
        angular_cookies: {
           deps : ['angular']
        },
        angular_ui_bootstrap: {
           deps : ['angular', 'bootstrap']
        }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['./app'], function (app) {
  angular.bootstrap(document, ['app']);
});
