
(function(global) {

    var map = {
        'app': '/assets/javascripts',
        '@angular':'assets/lib/@angular',
        'rxjs':'assets/lib/rxjs',
        'symbol-observable': 'assets/lib/symbol-observable',
        'd3':'assets/lib/d3',
        'moment': 'assets/lib/moment',
        'ng2-bootstrap': 'assets/lib/ng2-bootstrap'

    };

    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'assets/lib': {defaultExtension: 'js'},
        'symbol-observable': {defaultExtension: 'js', main: 'index.js'},
        'd3': {defaultExtension: 'js', main: 'd3.js'},
        'moment': {defaultExtension: 'js', main: 'moment.js'},
        'ng2-bootstrap': {defaultExtension: 'js', main: 'ng2-bootstrap.js'}

    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
        'forms'
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

    // Add map entries for angular packages
    ngPackageNames.forEach(function(pkgName){
        addAngularModulesToMap(pkgName);
    });

    System.config({
        map : map,
        packages: packages,
    });

})(this);