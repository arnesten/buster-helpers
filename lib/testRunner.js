var buster = require('buster');
var testRunner = buster.testRunner;
var fileLister = require('./fileLister.js');

buster.testCase.onCreate = null;

module.exports = {
    runCompact: function (path, options) {
        var reporter = buster.reporters.brief.create({ color: true });
        run({
            path: path,
            reporter: reporter,
            fileSuffix: options.fileSuffix
        });
    },
    runTeamcity: function (path, options) {
        var reporter = buster.reporters.teamcity.create();
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
        if (err) throw err;

        var contexts = paths
            .filter(function (p) {
                return !fileRegex || fileRegex.test(p);
            })
            .map(function (p) {
                return require(p);
            }).filter(function (c) {
                return c.testCase;
            });

        var runner = testRunner.create({ runtime: 'Node.js 0.10' });
        reporter.listen(runner);
        runner.on('suite:end', function () {
            process.exit();
        });

        runner.runSuite(contexts);
    });
}