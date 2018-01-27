var gulp = require('gulp');
var sass = require('gulp-sass');
var uglifyJs = require('gulp-uglifyjs');
var imageMin = require('gulp-imagemin');
var browserSync = require("browser-sync");
var reload = browserSync.reload;

var path = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        jsvendors: 'dist/js/vendors/',
        css: 'dist/css/',
        images: 'dist/images/',
        fonts: 'dist/css/fonts/',
        json: 'dist/ajax/'
    },
    src: {
        html: 'app/html/*.html',
        js: 'app/js/main.js',
        jsvendors: 'app/js/vendors/**/*.js',
        sass: 'app/sass/main.scss',
        images: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
        json: 'app/ajax/**/*.*'
    },
    watch: {
        html: 'app/html/*.html',
        js: 'app/js/**/*.js',
        sass: 'app/sass/**/*.scss',
        images: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
        json: 'app/ajax/**/*.*'
    }
};

var config = {}

// sass
gulp.task('sass', function(){
  gulp.src(path.src.sass)
    .pipe(sass())
    .pipe(gulp.dest(path.build.css));
});

// js
gulp.task('js', function(){
  gulp.src(path.src.js)
    .pipe(uglifyJs())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));

  gulp.src(path.src.jsvendors)
    .pipe(gulp.dest(path.build.jsvendors))
    .pipe(reload({stream: true}));
});

// images
gulp.task('image', function(){
  gulp.src(path.src.images)
    .pipe(imageMin([
      imageMin.gifsicle({interlaced: true}),
      imageMin.jpegtran({progressive: true}),
      imageMin.optipng({optimizationLevel: 5}),
      imageMin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
    ]))
    .pipe(gulp.dest(path.build.images));
});

gulp.task('fonts', function(){
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

// html
gulp.task('html', function () {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

// json files for test
gulp.task('json', function () {
  gulp.src(path.src.json)
    .pipe(gulp.dest(path.build.json))
    .pipe(reload({stream: true}));
});

// Watcher
gulp.task('watch', function(){
  gulp.watch(path.watch.html, ['html']);
  gulp.watch(path.watch.js, ['js']);
  gulp.watch(path.watch.js, ['js']);
  gulp.watch(path.watch.sass, ['sass']);
  gulp.watch(path.watch.images, ['image']);
  gulp.watch(path.watch.fonts, ['fonts']);
  gulp.watch(path.watch.json, ['json']);
});

// Server
gulp.task('server', function(){
  browserSync({
    server: {
      baseDir: path.build.html
    }
  });
});

// default
gulp.task('default', ['sass', 'js', 'image', 'fonts', 'html', 'json', 'watch', 'server']);