var testRunner = require('./testRunner.js');

var ap = require('argparser')
    .dirs(0)
    .vals('filesuffix')
    .parse();

var path = ap.arg(0);
var fileSuffix = ap.opt('filesuffix')

testRunner.runCompact(path, {
    fileSuffix: fileSuffix
});