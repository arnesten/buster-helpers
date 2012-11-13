var walk = require('walk');
var path = require('path');

function getAll(absoluteRootDir, callback) {
    var paths = [absoluteRootDir];
    var walker = walk.walk(absoluteRootDir, { followLinks: false });
    walker.on('directories', function(root, stat, next) {
        stat.forEach(function(s) {
            paths.push(root + '/' + s.name);
        });
        next();
    });
    walker.on('end', function() {
        callback(null, paths);
    });
}

module.exports.getAll = getAll;

module.exports.getAllRelative = function(absoluteRootDir, relativeTo, callback) {
    getAll(absoluteRootDir, function(err, paths) {
        if (err) return callback(err);

        var relativePaths = paths.map(function(p) {
            return path.relative(relativeTo, p);
        });
        callback(null, relativePaths);
    })
};