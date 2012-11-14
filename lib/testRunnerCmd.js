var testRunner = require('./testRunner.js');

var ap = require('argparser')
    .dirs(0)
    .vals('filepattern')
    .parse();

var path = ap.arg(0);
var filePattern = ap.opt('filepattern');

testRunner.runDots(path, {
    filePattern: filePattern ? new RegExp(filePattern) : null
});