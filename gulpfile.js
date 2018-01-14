var gulp = require('gulp');

// Include all dev dependencies of package.json
var plugins = require('gulp-load-plugins')();

// watch files for reload
gulp.task('watch', function() {
    plugins.livereload.listen();
});

// task of installation (replace config)
gulp.task('install', ['replace']);