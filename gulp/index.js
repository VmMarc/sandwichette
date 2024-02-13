// import { stream as critical } from 'critical';
import gulp from 'gulp';
import csso from 'gulp-csso';
import htmlmin from 'gulp-htmlmin';
import GulpInlineSource from 'gulp-inline-source';
import jshintPlugin from 'gulp-jshint';
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
const jshint = jshintPlugin;
const inlinesource = GulpInlineSource;

export async function clean() {
  await rm('../build', { recursive: true, force: true });
  await rm('../dist', { recursive: true, force: true });
}

export function jsLint() {
  return gulp
    .src(['../src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
}

export function htmlBuild() {
  return gulp
    .src('../src/index.html')
    .pipe(useref())
    .pipe(inlinesource())
    .pipe(gulp.dest('../build/'));
}

export function htmlCompress() {
  return gulp
    .src('../build/index.html')
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

function globalCssGen() {
  return exec(
    'npx tailwindcss -c ../tailwind.config.js -i ../src/input.css -o ../src/css/global.css',
  );
}

function cssCompress() {
  return gulp
    .src('../build/css/main.css')
    .pipe(csso())
    .pipe(gulp.dest('../dist/css/'))
    .pipe(size());
}

export { checkFaviconUpdate, generateFavicon, injectFaviconMarkups };

export default gulp.series(
  clean,
  gulp.parallel(
    copyFonts,
    copyImages,
    gulp.series(
      gulp.parallel(globalCssGen, jsLint),
      gulp.series(htmlBuild, htmlCompress),
      cssCompress,
    ),
    image,
  ),
);
