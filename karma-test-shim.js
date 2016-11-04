// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};


function isJsFile(path) {
    return path.slice(-3) == '.js';
}

function isSpecFile(path) {
    return path.slice(-8) == '.spec.js';
}

function isBuiltFile(path) {
    var builtPath = '/base/target/typescript/main/javascripts';
    return isJsFile(path) && (path.substr(0, builtPath.length) == builtPath);
}

var allSpecFiles = Object.keys(window.__karma__.files)
    .filter(isSpecFile)
    .filter(isBuiltFile);

System.import('@angular/platform-browser/src/browser/browser_adapter')
    .then(function(browser_adapter) { browser_adapter.BrowserDomAdapter.makeCurrent(); })
    .then(function() { return Promise.all(
        allSpecFiles.map(function (moduleName) {
            return System.import(moduleName);
        }));
    })
    .then(function() { __karma__.start(); }, function(error) { __karma__.error(error.stack || error); });

System.config({
    "defaultJSExtensions": true
});