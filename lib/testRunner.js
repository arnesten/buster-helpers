var buster = require('buster');
var testRunner = buster.testRunner;
var fileLister = require('./fileLister.js');

buster.testCase.onCreate = null;

module.exports = {
    runDots: function (path, options) {
        var reporter = buster.reporters.dots.create({ color: true });
        run({
            path: path,
            reporter: reporter,
            filePattern: options.filePattern
        });
    },
    runTeamcity: function (path, options) {
        var reporter = buster.reporters.teamcity.create();
        run({
            path: path,
            reporter: reporter,
            filePattern: options.filePattern
        });
    }
};

function run(options) {
    var path = options.path;
    var reporter = options.reporter;
    var filePattern = options.filePattern;
    fileLister.getFilePathsRecursively(path, function (err, paths) {
        var runner = testRunner.create();

        reporter.listen(runner);
        var contexts = paths
            .filter(function (p) {
                return !filePattern || filePattern.test(p);
            })
            .map(function (p) {
                return require(p);
            }).filter(function (c) {
                return c.testCase;
            });
        runner.on('suite:end', function (result) {
            process.exit();
        });
        runner.runSuite(contexts);
    });
}