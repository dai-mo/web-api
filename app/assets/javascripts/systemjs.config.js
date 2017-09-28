
(function(global) {
    System.config({
        map: {
            'app': '/assets/javascripts',
            '@angular':'assets/lib/@angular',
            // angular bundles
            '@angular/core': 'assets/lib/@angular/core/bundles/core.umd.js',
            '@angular/animations': 'assets/lib/@angular/animations/bundles/animations.umd.js',
            '@angular/animations/browser': 'assets/lib/@angular/animations/bundles/animations-browser.umd.js',
            '@angular/platform-browser/animations': 'assets/lib/@angular/platform-browser/bundles/platform-browser-animations.umd.js',
            '@angular/common': 'assets/lib/@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'assets/lib/@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'assets/lib/@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'assets/lib/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'assets/lib/@angular/http/bundles/http.umd.js',
            '@angular/router': 'assets/lib/@angular/router/bundles/router.umd.js',
            '@angular/forms': 'assets/lib/@angular/forms/bundles/forms.umd.js',

            // angular testing umd bundles
            // '@angular/core/testing': 'assets/lib/@angular/core/bundles/core-testing.umd.js',
            // '@angular/common/testing': 'assets/lib/@angular/common/bundles/common-testing.umd.js',
            // '@angular/compiler/testing': 'assets/lib/@angular/compiler/bundles/compiler-testing.umd.js',
            // '@angular/platform-browser/testing': 'assets/lib/@angular/platform-browser/bundles/platform-browser-testing',
            // '@angular/platform-browser-dynamic/testing': 'assets/lib/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing',
            // '@angular/http/testing': 'assets/lib/@angular/http/bundles/http-testing.umd.js',
            // '@angular/router/testing': 'assets/lib/@angular/router/bundles/router-testing.umd.js',
            // '@angular/forms/testing': 'assets/lib/@angular/forms/bundles/forms-testing.umd.js',

            // third party dependencies
            'rxjs':'assets/lib/rxjs',
            'symbol-observable': 'assets/lib/rxjs/node_modules/symbol-observable',
            'moment': 'assets/lib/moment',
            'primeng': 'assets/lib/primeng',
            'angular-split': 'assets/lib/angular-split/dist/index.js',
            'leaflet': 'assets/lib/leaflet/dist',
            'keycloak': 'assets/lib/keycloak-js/dist',
            'keycloak-authz': 'assets/lib/keycloak-js/dist',
            'traceur' : 'assets/lib/traceur/bin/traceur.js',
            'seamless-immutable' : 'assets/lib/seamless-immutable',
            '@ngrx/core' : 'assets/lib/@ngrx/core',
            '@ngrx/store' : 'assets/lib/@ngrx/store',
            'lodash' : 'assets/lib/lodash'
        },
        packages: {
            'app': {main: 'main.js', defaultExtension: 'js'},
            'rxjs': {defaultExtension: 'js'},
            'assets/lib': {defaultExtension: 'js'},
            'symbol-observable': {defaultExtension: 'js', main: 'index.js'},
            'moment': {defaultExtension: 'js', main: 'moment.js'},
            'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
            'primeng': { defaultExtension: 'js' },
            'angular-split': {defaultExtension: 'js'},
            'leaflet': {main: 'leaflet.js',defaultExtension: 'js'},
            'keycloak': { defaultExtension: 'js' },
            'keycloak-authz': { defaultExtension: 'js' },
            'traceur': { defaultExtension: 'js' },
            'seamless-immutable': {main: 'seamless-immutable.development.js', defaultExtension: 'js' },
            '@ngrx/core': {main: 'index.js', defaultExtension: 'js' },
            '@ngrx/store': {main: 'index.js', defaultExtension: 'js' },
            'lodash': {main: 'lodash.js', defaultExtension: 'js'}

        }
    });
})(this);