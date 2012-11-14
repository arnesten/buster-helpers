var step = require('step');
var fs = require('fs');
var exec = require('child_process').exec;
var directoryLister = require('./directoryLister.js');
var path = require('path');

module.exports.start = function (options) {
    var srcPath = options.srcPath;
    var testPath = options.testPath;
    var filePattern = options.filePattern;

    var timeoutId;
    var watchers = [];

    refreshWatchers();
    runTests();

    setInterval(function () {
        refreshWatchers();
        runTests();
    }, 30000);

    function getPaths(callback) {
        step(function () {
            directoryLister.getAll(srcPath, this.parallel());
            directoryLister.getAll(testPath, this.parallel());
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
        if (filePattern) {
            cmd += ' --filepattern "' + filePattern + '"';
        }
        var killTimeoutId;
        console.log('\n*********************************************************');
        console.log(new Date().toTimeString());
        console.log('*********************************************************');
        var childProcess = exec(cmd, function (err, stdout, stderr) {
            clearTimeout(killTimeoutId);

            if (stdout) {
                console.log(stdout);
            }
            else if (stderr) {
                console.log(stderr);
            }
            else if (err) {
                console.log(err);
            }
        });
        setTimeout(function () {
            console.log('TIMEOUT: Terminating test run after 10 seconds...');
            childProcess.kill();
        }, 10 * 1000);
    }
};