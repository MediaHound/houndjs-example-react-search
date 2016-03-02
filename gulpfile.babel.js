import gulp       from 'gulp';
import babelify   from 'babelify';
import browserify from 'browserify';
import buffer     from 'vinyl-buffer';
import source     from 'vinyl-source-stream';
import transform  from 'vinyl-transform';

gulp.task('build', () => {
  return browserify('src/client.jsx')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('src'));
});

gulp.task('default', ['build']);
