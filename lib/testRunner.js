var buster = require('buster');
var testRunner = buster.testRunner;
var fileLister = require('./fileLister.js');

buster.testCase.onCreate = null;

module.exports = {
    runDots: function (path) {
        var reporter = buster.reporters.dots.create({ color:true });
        run(path, reporter);
    },
    runTeamcity: function (path) {
        var reporter = buster.reporters.teamcity.create();
        run(path, reporter);
    }
};

function run(path, reporter) {
    fileLister.getFilePathsRecursively(path, function (err, paths) {
        var runner = testRunner.create();

        reporter.listen(runner);
        var contexts = paths.map(function (p) {
            return require(p);
        });

        runner.on('suite:end', function (result) {
            process.exit();
        });
        runner.runSuite(contexts);
    });
}