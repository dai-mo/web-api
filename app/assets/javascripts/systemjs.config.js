/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {

    var map = {
        'app': '/assets/javascripts',
        '@angular':'assets/lib/@angular'
    };

    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'assets/lib': {defaultExtension: 'js'},
        'symbol-observable': {defaultExtension: 'js', main: 'index.js'}
    };

    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router'
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

  System.config(config);
})(this);