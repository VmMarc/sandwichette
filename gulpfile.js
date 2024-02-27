import { exec } from 'child_process';
import { stream as critical } from 'critical';
import 'dotenv/config';
import fs from 'fs';
import gulp from 'gulp';
import access from 'gulp-accessibility';
import cache from 'gulp-cached';
import concat from 'gulp-concat';
import csso from 'gulp-csso';
import eslint from 'gulp-eslint-new';
import favicons from 'gulp-favicons';
import flatten from 'gulp-flatten';
import htmlmin from 'gulp-htmlmin';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import inject from 'gulp-inject';
import rename from 'gulp-rename';
import save from 'gulp-save';
import sitemap from 'gulp-sitemap';
import size from 'gulp-size';
import uglify from 'gulp-uglify';
import webp from 'imagemin-webp';
import fsync from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = process.env.SRC_DIR;
const TMP = process.env.BUILD_DIR;
const DEST = process.env.DEST_DIR;

const tests = {
  jsLint() {
    return gulp
      .src([`${SRC}/js/*.js`])
      .pipe(cache('linting'))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  },

  accessibility() {
    return gulp
      .src(`${SRC}/index.html`)
      .pipe(
        access({
          force: true,
          verbose: false,
          reportLevels: {
            notice: true,
            warning: true,
            error: true,
          },
        }),
      )
      .pipe(access.report({ reportType: 'json' }))
      .pipe(
        rename({
          extname: '.json',
        }),
      )
      .pipe(gulp.dest('./reports/'));
  },
};

const images = {
  src: `${SRC}/img/**/*.{jpg,jpeg,png,svg,gif,webp}`,

  compress() {
    return gulp
      .src(`${images.src}`, {
        since: gulp.lastRun(images.compress),
      })
      .pipe(
        imagemin([
          gifsicle({ interlaced: true, optimizationLevel: 3 }),
          mozjpeg({ quality: 50, progressive: true }),
          optipng(),
          svgo(),
          webp({ method: 6, preset: 'photo', quality: 60 }),
        ]),
      )
      .pipe(flatten())
      .pipe(gulp.dest(`${TMP}/img`));
  },

  async resize() {
    const config = await fs.promises.readFile('./image.json', 'utf-8');
    const dirEnt = await fs.promises.readdir(`${TMP}/img`, {
      withFileTypes: true,
    });
    const files = dirEnt.filter((d) => d.isFile()).map((d) => d.name);

    if (!fsync.existsSync(`${DEST}/img`)) {
      fsync.mkdirSync(`${DEST}/img`);
    }

    const imageConf = JSON.parse(config);
    files.forEach(async (file) => {
      const filePath = path.parse(file);

      if (imageConf[filePath.name] !== undefined) {
        if (imageConf[filePath.name].breakpoints) {
          for (const dimensions of Object.values(
            imageConf[filePath.name].breakpoints,
          )) {
            await sharp(`${TMP}/img/${file}`, { pages: -1 })
              .resize({ ...dimensions })
              .toFile(
                `${DEST}/img/${filePath.name}-${dimensions.width}${filePath.ext}`,
              );
          }
        }
      } else {
        await fs.promises.copyFile(`${TMP}/img/${file}`, `${DEST}/img/${file}`);
      }
    });
  },

  favicon() {
    return gulp
      .src(`${SRC}/img/favicon.png`, {
        since: gulp.lastRun(images.favicon),
      })
      .pipe(
        favicons({
          appName: 'Sandwichette – Fine cuisine in a dwich',
          appShortName: 'Sandwichette',
          appDescription:
            'Des sandwichs, des chouquettes, des choses à boire et des magazines food 🥪🍰🍷',
          developerName: 'morizur',
          lang: 'fr_FR',
          developerURL: '',
          background: '#fff4f9',
          theme_color: '#df3a8e',
          path: '/',
          url: 'https://morizur.freeboxos.fr/',
          display: 'browser',
          orientation: 'any',
          scope: '/',
          start_url: 'https://morizur.freeboxos.fr/index.html',
          version: 1.0,
          html: 'head-favicons.html',
          pipeHTML: true,
          icons: {
            android: true,
            appleIcon: true,
            appleStartup: true,
            favicons: true,
            windows: true,
            yandex: true,
          },
        }),
      )
      .pipe(gulp.dest(`${TMP}/favicon/`));
  },
};
export const image = gulp.series(images.compress, images.resize);

const css = {
  build() {
    return exec(
      `npx tailwindcss -c tailwind.config.js -i ${SRC}/css/input.css -o ${TMP}/css/main.css`,
    );
  },

  minify() {
    return gulp
      .src(`${TMP}/css/main.css`)
      .pipe(csso())
      .pipe(gulp.dest(`${DEST}/css/`))
      .pipe(size());
  },

  critical() {
    return (
      gulp
        .src(`${TMP}/index.html`)
        .pipe(
          // @ts-ignore
          critical({
            inline: true,
            base: `${DEST}/`,
            css: `${DEST}/css/main.css`,
          }),
        )
        // @ts-ignore
        .pipe(gulp.dest(DEST))
        .pipe(size())
    );
  },
};

const html = {
  inject() {
    const headScripts = gulp
      .src(`${SRC}/js/{header,menu}.js`)
      .pipe(concat('headerScripts.js'))
      .pipe(uglify())
      .pipe(gulp.dest(`${TMP}/js/`));

    const footScripts = gulp
      .src(`${SRC}/js/{accordion,carousel,disclaimer}.js`)
      .pipe(concat('app.js'))
      .pipe(uglify({ compress: true, mangle: true }))
      .pipe(gulp.dest(`${DEST}/js/`));

    return gulp
      .src(`${SRC}/index.html`)
      .pipe(
        inject(gulp.src(`${TMP}/favicon/head-favicons.html`), {
          starttag: '<!-- inject:head:{{ext}} -->',
          transform: function (filePath, file) {
            return file.contents.toString('utf8');
          },
        }),
      )
      .pipe(
        inject(headScripts, {
          starttag: '<!-- inject:head:{{ext}} -->',
          transform: function (filePath, file) {
            return (
              '<script defer>' + file.contents.toString('utf8') + '</script>'
            );
          },
        }),
      )
      .pipe(inject(footScripts, { ignorePath: '/dist' }))
      .pipe(gulp.dest(`${TMP}/`));
  },

  minify() {
    return (
      gulp
        .src(`${TMP}/index.html`)
        .pipe(save('before-sitemap'))
        .pipe(
          sitemap({
            siteUrl: process.env.SITE_URL,
          }),
        )
        .pipe(gulp.dest(DEST))
        .pipe(save.restore('before-sitemap'))
        .pipe(
          // @ts-ignore
          critical({
            inline: true,
            base: `${DEST}/`,
            css: `${DEST}/css/main.css`,
          }),
        )
        // @ts-ignore
        .pipe(
          htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            minifyURLs: true,
            removeComments: true,
            removeEmptyAttributes: true,
          }),
        )
        .pipe(gulp.dest(DEST))
        .pipe(size())
    );
  },
};

export function copyFiles() {
  return gulp
    .src(
      [`${SRC}/**/*.woff2`, `${TMP}/favicon/*.!(html)`, `${SRC}/robots.txt`],
      { since: gulp.lastRun(copyFiles) },
    )
    .pipe(gulp.dest(`${DEST}/`));
}

export const test = tests.accessibility;

export async function clean() {
  await fs.promises.rm(`${TMP}`, { recursive: true, force: true });
  await fs.promises.rm(`${DEST}`, { recursive: true, force: true });
}

export const build = gulp.series(
  clean,
  gulp.parallel(
    image,
    gulp.series(
      gulp.parallel(
        gulp.series(css.build, css.minify),
        tests.jsLint,
        images.favicon,
      ),
      copyFiles,
      html.inject,
      css.critical,
      html.minify,
    ),
  ),
);

export const watch = function () {
  gulp.watch(
    [
      `${SRC}/js/*.js`,
      `${SRC}/index.html`,
      `${SRC}/css/main.css`,
      './tailwind.config.js',
    ],
    { ignoreInitial: false },
    gulp.series(
      gulp.parallel(gulp.series(css.build, css.minify), tests.jsLint),
      html.inject,
      css.critical,
      html.minify,
    ),
  );
  gulp.watch(
    `${SRC}/img/favicon.png`,
    { ignoreInitial: false },
    images.favicon,
  );
  gulp.watch(
    ['./image.json', images.src],
    { ignoreInitial: false, ignored: `${SRC}/img/favicon.png` },
    image,
  );
  gulp.watch(
    [`${SRC}/**/*.woff2`, `${TMP}/favicon/*.!(html)`, `${SRC}/robots.txt`],
    { ignoreInitial: false },
    copyFiles,
  );
};
