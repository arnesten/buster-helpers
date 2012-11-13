var fs = require('fs');
var exec = require('child_process').exec;
var directoryLister = require('../common/directoryLister.js');
var timeoutId;
var path = require('path');
var lastRunTestPath;

var watchers = [];

function refreshWatchers() {
    watchers.forEach(function (w) {
        w.close();
    });
    watchers = [];

    directoryLister.getAllRelative(__dirname + '/../', __dirname + '/../', function (err, paths) {
        paths = paths.filter(function (p) {
            if (p.indexOf('node_modules') >= 0) {
                return false;
            }
            return p.length > 0;
        });

        paths.forEach(function (p) {
            var w = fs.watch('../' + p, function () {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    runTests();
                }, 500);
            });
            watchers.push(w);
        });
    });
}

refreshWatchers();
runTests();

setInterval(function () {
    refreshWatchers();
    runTests();
}, 30000);

function runTests() {
    var cmd = '. ' + __dirname + '/runAll_server.sh';
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