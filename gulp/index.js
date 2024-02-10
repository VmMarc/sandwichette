// import { stream as critical } from 'critical';
import gulp from 'gulp';
import csso from 'gulp-csso';
import filter from 'gulp-filter';
import htmlmin from 'gulp-htmlmin';
import size from 'gulp-size';
import GulpUglify from 'gulp-uglify';
import useref from 'gulp-useref';
import { exec } from 'node:child_process';
import { rm } from 'node:fs/promises';
import {
  checkFaviconUpdate,
  generateFavicon,
  injectFaviconMarkups,
} from './favicon.js';
import image from './image.js';

const uglify = GulpUglify;

export async function clean() {
  await rm('../build', { recursive: true, force: true });
  await rm('../dist', { recursive: true, force: true });
}

export function html() {
  var jsFilter = filter('**/*.js', { restore: true });
  var cssFilter = filter('**/*.css', { restore: true });
  var assets = useref({ searchPath: ['../src'] });

  return gulp
    .src('../src/*.html')
    .pipe(assets)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(csso())
    .pipe(cssFilter.restore)
    .pipe(useref())
    .pipe(
      htmlmin({
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
      }),
    )
    .pipe(gulp.dest('../dist/'))
    .pipe(size());
}

function copyFonts() {
  return gulp.src(['../src/fonts/*.woff2']).pipe(gulp.dest('../dist/fonts/'));
}

function copyImages() {
  return gulp.src(['../src/img/*.png']).pipe(gulp.dest('../dist/img/'));
}

function globalCss() {
  return exec(
    'npx tailwindcss -c ../tailwind.config.js -i ../src/input.css -o ../src/css/global.css',
  );
}

// export function criticalCss() {
//   return gulp
//     .src('../dist/*.html')
//     .pipe(
//       critical({
//         base: '../dist/',
//         inline: true,
//       }),
//     )
//     .pipe(gulp.dest('../dist/'));
// }

export const copy = gulp.parallel(copyFonts, copyImages);

export { checkFaviconUpdate, generateFavicon, injectFaviconMarkups };

export default gulp.series(
  clean,
  gulp.parallel(copy, gulp.series(globalCss, html), image),
);
