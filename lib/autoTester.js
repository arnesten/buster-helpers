var step = require('step');
var fs = require('fs');
var exec = require('child_process').exec;
var directoryLister = require('./directoryLister.js');
var path = require('path');

module.exports.start = function (sourceDir, testDir) {

    var lastRunTestPath;
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
            directoryLister.getAllRelative(sourceDir, __dirname, this.parallel());
            directoryLister.getAllRelative(testDir, __dirname, this.parallel());
        }, function (err, paths1, paths2) {
            if (err) return callback(err);

            var paths = paths1.concat(paths2);

            var absPaths = paths.map(function (p) {
                return path.join(__dirname, p);
            }).filter(function (p) {
                if (p.indexOf('node_modules') >= 0) {
                    return false;
                }
                return p.length > 0;
            });

            callback(null, absPaths);
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
        var cmd = 'node ' + path.join(__dirname, 'testRunner.js') + ' "' + testDir + '"';
        exec(cmd, function (err, stdout, stderr) {
            console.log('\n*********************************************************');
            console.log(new Date().toTimeString());
            console.log('*********************************************************');

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
    }
};