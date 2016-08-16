'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var bower = require('gulp-bower');
var del = require('del');
var fs = require('fs-extra');
var msg = require('gulp-msg');
var cleanCss = require('gulp-clean-css');
var rename = require("gulp-rename");
var useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css');
var argv = require('yargs').argv;
var webserver = require('gulp-webserver');
var runSequence = require('run-sequence');

var path = {
  dist:'./dist',css:'app/css',
  js:['app/*.js','app/donation/*.js','app/thankyou/*.js'],
  clean:['./dist/*','app/css'],
    assests:['!app/*/*.js','app/*/*.html']
}

var config = {
    bootstrapDir: 'bower_components/bootstrap-sass'
};

var buildType =  argv.type||'release';
var deploy = argv.deploy||false;

console.log(buildType,deploy)
gulp.task('bower', function() {
    msg.Info('Info: Downloading dependencies...');
    return bower().on('end', function() {
        msg.Success('--', 'Downloading dependencies completed.', '--');
    });
});


gulp.task('sass', function () {
    msg.Info('Info: Generating the CSS Files');
  return gulp.src('app/sass/**/*.scss')
    .pipe(sass({
        includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }).on('error', sass.logError))
    .pipe(gulp.dest('app/css')).on('end',
          function() {
              msg.Success('--', 'CSS File Generation Completed Successfully', '--');
          });
});


gulp.task('folderCheck',function(done){
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    if (!fs.existsSync('app/css')) {
        fs.mkdirSync('app/css');
    }
    done();
})


gulp.task('clean',function (done) {
  console.log("Info: Cleaning the Dist & the CSS folder");
  del.sync((path.clean));
    msg.Success('--', 'Folders Cleaned Successfully', '--');
  done();
})


gulp.task('sass:watch', function () {
  gulp.watch('app/sass/**/*.scss', ['sass']);
});

gulp.task('copyAssets',function () {
    msg.Info('Info: Copying required files');
    gulp.src(path.assests).pipe(gulp.dest('./dist/')).on('end',
        function() {
            msg.Success('--', 'Files copied Successfully', '--');
        });
});


/* Minifying the CSS Files */
gulp.task('minify-css', function() {
  msg.Info('Info: Minifying the CSS Files');
  return gulp.src(['./dist/css/*.css'])
      .pipe(cleanCss())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('./dist/css/')).on('end',
          function() {
            msg.Success('--', 'CSS Minification Completed Successfully', '--');
          });
});


gulp.task('build', function () {
    msg.Info('Info: Generating the Build files');
    var isRelease = (buildType==='release');
    console.log(isRelease)
    if(isRelease=== true){
        msg.Info('Info : Build Type - Release');
    }else{
        msg.Info('Info : Build Type - Develop/Debug');
    }
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif(isRelease && '*.js', uglify()))
        .pipe(gulpif(isRelease && '*.css', minifyCss()))
        .pipe(gulp.dest('dist')).on('end',
            function() {
                msg.Success('--', 'App files generated in the dist folder', '--');
            });
});



gulp.task('deploy', function() {
    msg.Info('Info: Starting local server');
    gulp.src('./dist/')
        .pipe(webserver({
            livereload: true,
            directoryListing: {
                enable:false,
                path: 'dist'
            },
            open: true,
            port:8000

        }));
});


gulp.task('default',function (done) {
  if(deploy === false)
    runSequence('folderCheck', 'clean', 'sass', 'copyAssets', 'build',  done);
  else
      runSequence('folderCheck', 'clean', 'sass', 'copyAssets', 'build', 'deploy', done);

})