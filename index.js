var autoTester = require('./lib/autoTester.js');
var testRunner = require('./lib/testRunner.js');

module.exports.startAutoTest = function (sourceDir, testDir) {
    autoTester.start(sourceDir, testDir);
};

module.exports.runOnce = function (testDir) {
    testRunner.runDots(testDir);
};

module.exports.runOnceTeamcity = function (testDir) {
    testRunner.runTeamcity(testDir);
};