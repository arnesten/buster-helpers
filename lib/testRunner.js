var buster = require('buster');
var testRunner = buster.testRunner;
var fileLister = require('./fileLister.js');
var path = require('path');

buster.testCase.onCreate = null;

var path = process.argv[2];
run(path);

function run(path) {
    fileLister.getFilePathsRecursively(path, function (err, paths) {
        var runner = testRunner.create();
        var reporter = buster.reporters.dots.create({ color:true });
        reporter.listen(runner);
        var contexts = paths.map(function (p) {
            return require(p);
        });

        runner.on('suite:end', function (result) {
            process.exit();
        });
        runner.runSuite(contexts);
    });
};