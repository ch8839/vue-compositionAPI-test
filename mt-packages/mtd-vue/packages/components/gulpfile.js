const gulp = require('gulp')
const sass = require('gulp-dart-sass')
const postcss = require('gulp-postcss')
const cssmin = require('gulp-cssmin')
const { themes } = require('./config')
const output = './lib/'


gulp.task('compile:theme-chalk', function () {
  return gulp
    .src('./src/theme-chalk/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss())
    .pipe(cssmin())
    .pipe(gulp.dest(`${output}/theme-chalk`))
})

gulp.task('copyfont:theme-chalk', function () {
  return gulp
    .src('./src/theme-chalk/fonts/**')
    .pipe(cssmin())
    .pipe(gulp.dest(`${output}/theme-chalk/fonts`))
})

gulp.task('preview:theme-chalk', function () {
  return gulp
    .src('./src/theme-chalk/index.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(`${output}/theme-chalk`))
})

gulp.task('compile:theme-yellow', function () {
  return gulp.src('./src/theme-yellow/*.scss')
    .pipe(sass.sync())
    .pipe(postcss())
    .pipe(cssmin())
    .pipe(gulp.dest(`${output}/theme-yellow`))
})

gulp.task('copyfont:theme-yellow', function () {
  return gulp.src('./src/theme-yellow/fonts/**')
    .pipe(cssmin())
    .pipe(gulp.dest(`${output}/theme-yellow/fonts`))
})

gulp.task('preview:theme-yellow', function () {
  return gulp.src('./src/theme-yellow/index.scss')
    .pipe(sass.sync())
    .pipe(gulp.dest(`${output}/theme-yellow`))
})


gulp.task('build:theme-chalk', gulp.series('compile:theme-chalk', 'copyfont:theme-chalk'))
gulp.task('build:theme-yellow', gulp.series('compile:theme-yellow', 'copyfont:theme-yellow'))
gulp.task('build', gulp.series('build:theme-chalk', 'build:theme-yellow'))
