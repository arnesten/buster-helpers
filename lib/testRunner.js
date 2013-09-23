var buster = require('buster');
var testRunner = buster.testRunner;
var teamcityReporter = buster.reporters.teamcity;
var fileLister = require('./fileLister.js');
var compactReporter = require('compact-buster-reporter');

buster.testCase.onCreate = null;

module.exports = {
    runCompact: function (path, options) {
        var reporter = compactReporter.create({ color: true });
        run({
            path: path,
            reporter: reporter,
            fileSuffix: options.fileSuffix
        });
    },
    runTeamcity: function (path, options) {
        var reporter = teamcityReporter.create();
        run({
            path: path,
            reporter: reporter,
            fileSuffix: options.fileSuffix
        });
    }
};

function run(options) {
    var path = options.path;
    var reporter = options.reporter;
    var fileRegex = null;
    if (options.fileSuffix) {
        var regexString = options.fileSuffix.replace(/\./g, '\\.') + '$';
        fileRegex = new RegExp(regexString);
    }

    fileLister.getFilePathsRecursively(path, function (err, paths) {
        var runner = testRunner.create();

        reporter.listen(runner);
        var contexts = paths
            .filter(function (p) {
                return !fileRegex || fileRegex.test(p);
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