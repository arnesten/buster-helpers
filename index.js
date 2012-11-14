var autoTester = require('./lib/autoTester.js');
var testRunner = require('./lib/testRunner.js');

module.exports.start = function (sourceDir, testDir) {
    autoTester.start(sourceDir, testDir);
};

module.exports.runOnce = function (testDir) {
    testRunner.run(testDir);
};