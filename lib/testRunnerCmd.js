var testRunner = require('./testRunner.js');

var ap = require('argparser')
    .dirs(0)
    .vals('filesuffix')
    .parse();

var path = ap.arg(0);
var fileSuffix = ap.opt('filesuffix')


console.log(fileSuffix);

testRunner.runDots(path, {
    fileSuffix: fileSuffix ? new RegExp(fileSuffix) : null
});