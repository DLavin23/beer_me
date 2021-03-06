var gulp = require('gulp'),
plugins  = require('gulp-load-plugins')();

var autoprefixer = require('autoprefixer-core');

// start server via express
gulp.task('server', function() {
  var app = require('./app/app');
  app;
});

// optimize images
gulp.task('images', function() {
  return gulp.src('./public/images/*')
    .pipe(plugins.plumber())
    .pipe(plugins.cache(plugins.imagemin({
      interlaced: true,
      optimizationLevel: 5,
      progressive: true
    })))
    .pipe(gulp.dest('./assets/images'))
});

// concatenate and uglify scripts
gulp.task('scripts', function() {
  return gulp.src('./public/scripts/author/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.concat('all.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/scripts/'))
});

// compile and minify sass
gulp.task('styles', function() {
  var processors = [
    autoprefixer(['last 6 version'])
  ];
  return plugins.rubySass(
  './public/styles/', {
    require: ['breakpoint', 'susy'],
    sourcemap: true,
    style: 'compressed'
  })
  .on("error", plugins.notify.onError({
    message: "Error: <%= error.message %>",
    title: "Error running something"
  }))
    .pipe(plugins.postcss(processors))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/styles/'))
});

gulp.task('watch', function(){
  gulp.watch('./public/images/**/*', ['images']);
  gulp.watch('./public/styles/**/*.scss', ['styles']);
  gulp.watch('./public/scripts/author/**/*.js', ['scripts']);
  plugins.livereload.listen();
  gulp.watch(['./app/**', './public/**']).on('change', plugins.livereload.changed);
});

// default task: handle assets, start server, watch & reload
gulp.task('default', ['images', 'scripts', 'styles', 'server', 'watch']);
