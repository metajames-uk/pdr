var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
var nunjucksRender = require('gulp-nunjucks-render');

var uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var connect = require('gulp-connect');

var livereload = require('gulp-livereload');

var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('files', function() {
  gulp.src('./src/assets/files/*')
  .pipe(gulp.dest('./dist/assets/files'))
});

gulp.task('log', function() {
  gutil.log('Hello')
});

gulp.task('sass', function() {
  gulp.src('./src/assets/scss/main.scss')
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('./dist/assets/css'))
  .pipe(connect.reload());
});

gulp.task('sass-prod', function() {
  gulp.src('./src/assets/scss/main.scss')
  .pipe(sass({outputStyle: 'compressed'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('./dist/assets/css'))
  .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('./src/assets/js/**/*.js', ['js']);
    gulp.watch('./src/assets/scss/**/*.scss', ['sass']);
    gulp.watch('./src/templates/**/*.html', ['nunjucks']);
});

gulp.task('connect', function() {
  connect.server({
    root: './dist',
    livereload: true
  })
});

gulp.task('html', function() {
  gulp.src('./src/templates/**/*.html')
  .pipe(gulp.dest('./dist'))
  .pipe(connect.reload());
});

gulp.task('images', () =>
    gulp.src('src/assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/img'))
);

gulp.task('copy-images', function() {
  gulp.src('./src/assets/img/*')
  .pipe(gulp.dest('./dist/assets/img'))
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/templates/root/**/*.html')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('dist'))
});

gulp.task('default', ['nunjucks', 'copy-images', 'files', 'sass', 'connect', 'watch']);

gulp.task('prod', ['nunjucks', 'copy-images', 'files', 'sass-prod']);
