const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const KarmaServer = require('karma').Server;

const apiFiles = ['./*.js', './lib/*.js', './models/*.js', './routes/*.js'];
const appFiles = ['./app/**/*.js'];
const serverTestFiles = ['./test/server/*test.js'];
const clientTestFiles = ['./test/client/*test.js'];

gulp.task('webpack:dev', ['html:dev', 'css:dev', 'img:dev'], () => {
  return gulp.src('app/js/entry.js')
    .pipe(webpackStream({
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      },
      plugins: [
        new webpack.EnvironmentPlugin(['PORT'])
      ],
      module: {
        loaders: [
          {
            test: /\.js?/,
            include: __dirname + '/app/js/',
            loader: 'babel'
          }
        ]
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('html:dev', () => {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('sass:dev', () => {
  gulp.src('./app/**/*.scss')
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('./build'));
});

gulp.task('css:dev', ['sass:dev'], () => {
  return gulp.src('app/**/*.css')
    .pipe(gulp.dest('./build'));
});

gulp.task('img:dev', () => {
  return gulp.src('app/img/*')
    .pipe(gulp.dest('./build/img'));
});

gulp.task('webpack:test', () => {
  return gulp.src('test/client/test_entry.js')
    .pipe(webpackStream({
      devtool: 'source-map',
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.html$/,
            loader: 'html'
          }
        ]
      }
    }))
    .pipe(gulp.dest('./test'));
});

gulp.task('test:pretest', () => {
  return gulp.src(apiFiles)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test:mocha', ['test:pretest'], () => {
  return gulp.src(serverTestFiles)
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 60 } }));
});

gulp.task('test:karma', ['webpack:test'], (done) => {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('lint:api', () => {
  return gulp.src(apiFiles)
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('lint:app', () => {
  return gulp.src(appFiles)
    .pipe(eslint('./app/.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('lint:servertest', () => {
  return gulp.src(serverTestFiles)
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('lint:clienttest', () => {
  return gulp.src(clientTestFiles)
    .pipe(eslint('./test/client/.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('build:dev', ['webpack:dev']);
gulp.task('test', ['test:mocha', 'test:karma']);
gulp.task('lint', ['lint:api', 'lint:app', 'lint:servertest', 'lint:clienttest']);
gulp.task('default', ['lint', 'test']);
