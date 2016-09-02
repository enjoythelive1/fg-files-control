const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const less = require('gulp-less');
var merge2 = require("merge2");

const tsProject = ts.createProject('tsconfig.json');

gulp.task('less', function () {
    return gulp.src(['src/**/*.less'])
        .pipe(less({
            paths: ['src/', './']
        }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('compile-back', function () {
    var tsResult = gulp.src(['src/**/*.ts', '!src/public/**/*'])
        .pipe(ts(tsProject));
    return merge2([
        tsResult.js.pipe(gulp.dest('dist')),
        tsResult.dts.pipe(gulp.dest('dist'))
    ]);
});


gulp.task('build', ['compile-back', 'less']);


gulp.task('default', ['build']);

