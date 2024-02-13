// import { stream as critical } from 'critical';
import gulp from 'gulp';
import cached from 'gulp-cached';
import htmlmin from 'gulp-htmlmin';
import GulpInlineSource from 'gulp-inline-source';
import jshintPlugin from 'gulp-jshint';
import size from 'gulp-size';
import useref from 'gulp-useref';
import { exec } from 'node:child_process';
import { rm } from 'node:fs/promises';
import {
  checkFaviconUpdate,
  generateFavicon,
  injectFaviconMarkups,
} from './favicon.js';
import image from './image.js';
import csso from 'gulp-csso';

const jshint = jshintPlugin;
const inlinesource = GulpInlineSource;
const cache = cached;

export async function clean() {
  await rm('../build', { recursive: true, force: true });
  await rm('../dist', { recursive: true, force: true });
}

export function jsLint() {
  return gulp
    .src(['../src/js/*.js'])
    .pipe(cache('jslint'))
    .pipe(jshint())
    .pipe(jshint.reporter());
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
  return gulp.src('../src/fonts/*.woff2').pipe(gulp.dest('../dist/fonts/'));
}

function copyImages() {
  return gulp.src('../src/img/*.png').pipe(gulp.dest('../dist/img/'));
}

function globalCssGen() {
  return exec(
    'npx tailwindcss -c ../tailwind.config.js -i ../src/input.css -o ../src/css/global.css',
  );
}

function copyCss() {
  return gulp
    .src('../build/css/main.css')
    .pipe(csso())
    .pipe(gulp.dest('../dist/css/'))
    .pipe(size());
}

export { checkFaviconUpdate, generateFavicon, injectFaviconMarkups };

export const build = gulp.series(
  clean,
  gulp.parallel(
    copyFonts,
    copyImages,
    gulp.series(
      gulp.parallel(globalCssGen, jsLint),
      gulp.series(generateFavicon, injectFaviconMarkups),
      gulp.series(htmlBuild, htmlCompress),
      copyCss,
    ),
    image,
  ),
);

export default function () {
  gulp.watch(
    ['../src/input.css', '../tailwind.config.js'],
    gulp.series(globalCssGen, gulp.series(htmlBuild, htmlCompress), copyCss),
  );
  gulp.watch('../src/css/*.css', gulp.series(htmlBuild, htmlCompress, copyCss));
  gulp.watch('../src/js/*.js', gulp.series(jsLint, htmlBuild, htmlCompress));
  gulp.watch('../src/index.html', gulp.series(htmlBuild, htmlCompress));
  gulp.watch(
    '../src/img/icon.png',
    gulp.series(generateFavicon, injectFaviconMarkups),
  );
  gulp.watch('../src/fonts/*.woff2', copyFonts);
  gulp.watch(
    ['./imageData.json', '../src/img/**/*.jpg', '../src/img/logo.svg'],
    image,
  );
  gulp.watch('../src/img/*.png', copyImages);
}
