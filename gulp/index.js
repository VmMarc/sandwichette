import gulp from 'gulp';
import csso from 'gulp-csso';
import gulpEslint from 'gulp-eslint-new';
import htmlmin from 'gulp-htmlmin';
import GulpInlineSource from 'gulp-inline-source';
import newer from 'gulp-newer';
import gulpPurgeCss from 'gulp-purgecss';
import rename from 'gulp-rename';
import size from 'gulp-size';
import useref from 'gulp-useref';
import { exec } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { generateFavicon, injectFaviconMarkups } from './favicon.js';
import image from './image.js';

const eslint = gulpEslint;
const inlinesource = GulpInlineSource;
const purgecss = gulpPurgeCss;

export async function clean() {
  await rm('../build', { recursive: true, force: true });
  await rm('../dist', { recursive: true, force: true });
}

export function jsLint() {
  return gulp
    .src(['../src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
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

function copyOther() {
  return gulp
    .src(['../src/**/*.woff2', '../src/**/*.png', '../src/robots.txt'])
    .pipe(newer('../dist/fonts/'))
    .pipe(gulp.dest('../dist/'));
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

function purgeCss() {
  return gulp
    .src('../src/css/fontawesome/*.css')
    .pipe(
      purgecss({
        content: ['../src/index.html'],
      }),
    )
    .pipe(gulp.dest('../build/css/'));
}

function rejectedCss() {
  return gulp
    .src('../src/css/fontawesome/*.css')
    .pipe(
      rename({
        suffix: '.rejected',
      }),
    )
    .pipe(
      purgecss({
        content: ['../src/index.html'],
        rejected: true,
      }),
    )
    .pipe(gulp.dest('../build/css/'));
}

export const build = gulp.series(
  clean,
  gulp.parallel(
    copyOther,
    gulp.series(
      gulp.parallel(globalCssGen, jsLint),
      gulp.series(generateFavicon, injectFaviconMarkups),
      gulp.series(
        gulp.parallel(purgeCss, rejectedCss),
        htmlBuild,
        htmlCompress,
        copyCss,
      ),
    ),
    image,
  ),
);

export default function () {
  gulp.watch(
    '../src/css/*.css',
    gulp.series(
      gulp.parallel(purgeCss, rejectedCss),
      htmlBuild,
      htmlCompress,
      copyCss,
    ),
  );
  gulp.watch('../src/js/*.js', gulp.series(jsLint, htmlBuild, htmlCompress));
  gulp.watch(
    '../src/img/icon.png',
    gulp.series(generateFavicon, injectFaviconMarkups),
  );
  gulp.watch('../src/fonts/*.woff2', copyOther);
  gulp.watch(
    [
      './imageData.json',
      '../src/img/**/*.jpg',
      '../src/img/**/*.svg',
      '../src/img/**/*.gif',
    ],
    image,
  );
  gulp.watch('../src/img/*.png', copyOther);
  gulp.watch(
    ['../src/input.css', '../tailwind.config.js'],
    gulp.series(
      globalCssGen,
      gulp.parallel(purgeCss, rejectedCss),
      htmlBuild,
      htmlCompress,
      copyCss,
    ),
  );
  gulp.watch(
    ['../src/index.html'],
    gulp.series(
      globalCssGen,
      gulp.parallel(purgeCss, rejectedCss),
      htmlBuild,
      htmlCompress,
      copyCss,
    ),
  );
}
