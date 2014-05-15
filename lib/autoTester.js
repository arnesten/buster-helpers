var go = require('go-flow');
var fs = require('fs');
var exec = require('child_process').exec;
var directoryLister = require('./directoryLister.js');
var path = require('path');

module.exports.start = function (options) {
    var srcPath = options.srcPath;
    var testPath = options.testPath;
    var fileSuffix = options.fileSuffix;

    var timeoutId;
    var watchers = [];

    refreshWatchers();
    runTests();

    setInterval(function () {
        refreshWatchers();
        runTests();
    }, 30000);

    function getPaths(callback) {
        var g = go(function () {
            directoryLister.getAll(srcPath, g());
            directoryLister.getAll(testPath, g());
        }, function (err, paths1, paths2) {
            if (err) return callback(err);

            var paths = paths1
                .concat(paths2)
                .filter(function (p) {
                    if (p.indexOf('node_modules') >= 0) {
                        return false;
                    }
                    return p.length > 0;
                });

            callback(null, paths);
        });
    }

    function refreshWatchers() {
        watchers.forEach(function (w) {
            w.close();
        });
        watchers = [];

        getPaths(function (err, paths) {
            paths.forEach(function (p) {
                var w = fs.watch(p, function () {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                        runTests();
                    }, 500);
                });
                watchers.push(w);
            });
        });
    }

    function runTests() {
        var cmd = 'node ' + path.join(__dirname, 'testRunnerCmd.js') + ' "' + testPath + '"';
        if (fileSuffix) {
            cmd += ' --filesuffix "' + fileSuffix + '"';
        }
        var killTimeoutId;
        console.log('\n*********************************************************');
        console.log(new Date().toTimeString());
        console.log('*********************************************************');
        var childProcess = exec(cmd, function (err) {
            clearTimeout(killTimeoutId);
            if (err) {
                console.error(err);
            }
        });
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        killTimeoutId = setTimeout(function () {
            console.log('TIMEOUT: Terminating test run after 10 seconds...');
            childProcess.kill();

        }, 10 * 1000);
    }
};