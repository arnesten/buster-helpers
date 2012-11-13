var buster = require('buster');
var testRunner = buster.testRunner;
var fileLister = require('../common/fileLister.js');
var path = require('path');

buster.testCase.onCreate = null;

fileLister.getFilePathsRecursively(__dirname + '/server', function (err, paths) {
    var runner = testRunner.create();
    var reporter = buster.reporters.dots.create({ color: true });
    reporter.listen(runner);
    var contexts = paths.map(function (p) { return require(p); });

    runner.on('suite:end', function (result) {
        process.exit(result.ok ? 0 : 1);
    });
    runner.runSuite(contexts);
});