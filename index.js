var autoTester = require('./lib/autoTester.js');
var testRunner = require('./lib/testRunner.js');

module.exports.startAutoTest = function (options) {
    autoTester.start(options);
};

module.exports.runOnce = function (testDir, options) {
    testRunner.runDots(testDir, options || {});
};

module.exports.runOnceTeamcity = function (testDir, options) {
    testRunner.runTeamcity(testDir, options || {});
};