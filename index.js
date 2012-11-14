var autoTester = require('./lib/autoTester.js');

module.exports.start = function (sourceDir, testDir) {
    autoTester.start(sourceDir, testDir);
};