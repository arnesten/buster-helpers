var fs = require('fs');
var path = require('path');
var dirLister = require('./directoryLister.js');

module.exports.getFilePathsRecursively = function (absoluteRootDir, callback) {
    dirLister.getAll(absoluteRootDir, function (err, paths) {
        if (err) return callback(err);

        var result = [];
        paths.forEach(function (p) {
            var filesAndDirs = fs.readdirSync(p);
            filesAndDirs.forEach(function (fd) {
                var candidate = path.join(p, fd);
                if (fs.statSync(candidate).isFile()) {
                    result.push(candidate);
                }
            });
        });
        callback(null, result);
    });
};