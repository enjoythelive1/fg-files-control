const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const less = require('gulp-less');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('less', function () {
    return gulp.src(['src/**/*.less'])
        .pipe(less({
            paths: ['src/', './']
        }))
        .pipe(gulp.dest('dist/'))
});

gulp.task('compile-back', function () {
    return gulp.src(['src/**/*.ts', '!src/public/**/*'])
        .pipe(ts(tsProject))
        .pipe(gulp.dest('dist'))
});


gulp.task('build', ['compile-back', 'less']);


gulp.task('default', ['build']);

