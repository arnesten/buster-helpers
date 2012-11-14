var buster = require('buster');
var testRunner = buster.testRunner;
var fileLister = require('./fileLister.js');

buster.testCase.onCreate = null;

module.exports.run = function (path) {
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