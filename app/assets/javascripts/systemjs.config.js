
(function(global) {

    var map = {
        'app': '/assets/javascripts',
        '@angular':'assets/lib/@angular',
        'rxjs':'assets/lib/rxjs',
        'symbol-observable': 'assets/lib/rxjs/node_modules/symbol-observable',
        'webcola':'assets/lib/webcola/WebCola',
        'd3':'assets/lib/d3',
        'moment': 'assets/lib/moment',
        'ng2-bootstrap': 'assets/lib/ng2-bootstrap',
        'ng2-select': 'assets/lib/ng2-select',
        'primeng': 'assets/lib/primeng'

    };

    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'assets/lib': {defaultExtension: 'js'},
        'symbol-observable': {defaultExtension: 'js', main: 'index.js'},
        'd3': {defaultExtension: 'js', main: 'd3.js'},
        'webcola': {defaultExtension: 'js', main: 'index.js'},
        'moment': {defaultExtension: 'js', main: 'moment.js'},
        'ng2-bootstrap': {defaultExtension: 'js', main: 'ng2-bootstrap.js'},
        'ng2-select': {defaultExtension: 'js', main: 'ng2-select.js'},
        'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
        'primeng': { defaultExtension: 'js' }

    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'forms'
    ];

    var ngIndexPackageNames = [
        'http'
    ];

    function packIndex(pkgName) {
        packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    function packUmd(pkgName) {
        packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }
    // Most environments should use UMD; some (Karma) need the individual index files
    function addAngularModulesToMap(pkgName) {
        map['@angular/'+pkgName] = 'assets/lib/angular__' + pkgName;
    }

    // Add package entries for angular packages
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    ngPackageNames.forEach(setPackageConfig);
    ngIndexPackageNames.forEach(packIndex);
    
    // Add map entries for angular packages
    // ngPackageNames.forEach(function(pkgName){
    //     addAngularModulesToMap(pkgName);
    // });

    System.config({
        map : map,
        packages: packages,
    });

})(this);