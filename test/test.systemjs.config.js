
(function(global) {

    var map = {
        'app': '/assets/javascripts',
        '@angular':'../node_modules/@angular',
        'rxjs':'../node_modules/rxjs',
        'symbol-observable': '../node_modules/rxjs/node_modules/symbol-observable',
        'webcola':'../node_modules/webcola/WebCola',
        'd3':'../node_modules/d3',
        'moment': '../node_modules/moment',
        'ng2-bootstrap': '../node_modules/ng2-bootstrap'

    };

    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        '../node_modules': {defaultExtension: 'js'},
        'symbol-observable': {defaultExtension: 'js', main: 'index.js'},
        'd3': {defaultExtension: 'js', main: 'd3.js'},
        'webcola': {defaultExtension: 'js', main: 'index.js'},
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
        map['@angular/'+pkgName] = '../node_modules/angular__' + pkgName;
    }

    // Add package entries for angular packages
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    ngPackageNames.forEach(setPackageConfig);

    // Add map entries for angular packages
    // ngPackageNames.forEach(function(pkgName){
    //     addAngularModulesToMap(pkgName);
    // });

    System.config({
        map : map,
        packages: packages,
    });

})(this);