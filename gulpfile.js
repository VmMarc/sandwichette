import { stream as critical } from 'critical';
import fs from 'fs';
import gulp from 'gulp';
import cache from 'gulp-cached';
import concat from 'gulp-concat';
import csso from 'gulp-csso';
import eslint from 'gulp-eslint-new';
import favicons from 'gulp-favicons';
import htmlmin from 'gulp-htmlmin';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import inject from 'gulp-inject';
import size from 'gulp-size';
import uglify from 'gulp-uglify';
import webp from 'imagemin-webp';
import fsync from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const paths = {
  src: './src',
  dest: './dist',
  tmp: './.tmp',
};

const images = {
  src: [
    `${paths.src}/img/**/*.{jpg,jpeg,png,svg,gif,webp}`,
    `!${paths.src}/img/favicon.png`,
  ],
  tmp: `${paths.tmp}/img`,
  dest: `${paths.dest}/img`,
  configFile: 'image.json',

  compress() {
    return gulp
      .src(images.src, { since: gulp.lastRun(images.compress) })
      .pipe(
        imagemin([
          gifsicle({ interlaced: true, optimizationLevel: 3 }),
          mozjpeg({ quality: 50, progressive: true }),
          optipng(),
          svgo(),
          webp({ method: 6, preset: 'photo', quality: 60 }),
        ]),
      )
      .pipe(gulp.dest(`${images.tmp}/`));
  },

  async resize() {
    const config = await fs.promises.readFile(images.configFile, 'utf-8');
    const dirEnt = await fs.promises.readdir(images.tmp, {
      withFileTypes: true,
    });
    const files = dirEnt.filter((d) => d.isFile()).map((d) => d.name);

    if (!fsync.existsSync(images.dest)) {
      fsync.mkdirSync(images.dest);
    }

    const imageConf = JSON.parse(config);
    files.forEach(async (file) => {
      const fileProp = path.parse(file);
      const src = `${images.tmp}/${file}`;

      if (imageConf[fileProp.name] !== undefined) {
        if (imageConf[fileProp.name].breakpoints) {
          for (const dimensions of Object.values(
            imageConf[fileProp.name].breakpoints,
          )) {
            await sharp(src)
              .resize({ ...dimensions })
              .toFile(
                `${images.dest}/${fileProp.name}-${dimensions.width}${fileProp.ext}`,
              );
          }
        }
      } else {
        await fs.promises.copyFile(src, `${images.dest}/${file}`);
      }
    });
  },

  favicon() {
    return gulp
      .src(`${paths.src}/img/favicon.png`, {
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
      .pipe(gulp.dest(`${paths.tmp}/`));
  },
};

function fileInject() {
  const headScripts = gulp
    .src(`${paths.src}/js/{header,menu}.js`)
    .pipe(concat('headerScripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.tmp}/js/`));

  const footScripts = gulp
    .src(`${paths.src}/js/{accordion,carousel,disclaimer}.js`)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.dest}/js/`));

  return gulp
    .src(`${paths.src}/index.html`)
    .pipe(
      inject(gulp.src(`${paths.tmp}/head-*.html`), {
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
    .pipe(gulp.dest(`${paths.tmp}/`));
}

export const image = gulp.series(images.compress, images.resize);

export async function clean() {
  await fs.promises.rm(paths.tmp, { recursive: true, force: true });
  await fs.promises.rm(paths.dest, { recursive: true, force: true });
}

export function jsLint() {
  return gulp
    .src([`${paths.src}/js/*.js`])
    .pipe(cache('linting'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

export function html() {
  return gulp
    .src(`${paths.tmp}/index.html`)
    .pipe(
      critical({
        inline: true,
        base: `${paths.dest}/`,
        css: `${paths.dest}/css/main.css`,
      }),
    )
    .pipe(
      htmlmin({
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
      }),
    )
    .pipe(gulp.dest(paths.dest))
    .pipe(size());
}

function copyOther() {
  return gulp
    .src(`${paths.src}/**/*.woff2`, { since: gulp.lastRun(copyOther) })
    .pipe(gulp.dest(`${paths.dest}/`));
}

export function css() {
  return gulp
    .src(`${paths.tmp}/css/main.css`)
    .pipe(csso())
    .pipe(gulp.dest(`${paths.dest}/css/`))
    .pipe(size());
}

export const build = gulp.series(
  gulp.parallel(
    copyOther,
    gulp.series(gulp.parallel(css, jsLint, images.favicon), fileInject, html),
    image,
  ),
);

export const watch = function () {
  gulp.watch(
    `${paths.src}/index.html`,
    { delay: 1000 },
    gulp.series(gulp.parallel(css, jsLint, images.favicon), fileInject, html),
  );
  gulp.watch(
    [
      `${paths.src}/css/main.css`,
      `${paths.src}/css/input.css`,
      `./tailwind.config.js`,
    ],
    { delay: 1000 },
    gulp.series(gulp.parallel(css, jsLint, images.favicon), fileInject, html),
  );
  gulp.watch(`${paths.src}/js/*.js`, gulp.series(jsLint, fileInject, html));
  gulp.watch(`${paths.src}/img/favicon.png`, images.favicon);
  gulp.watch([images.configFile, ...images.src], image);
  gulp.watch([`${paths.src}/fonts/*.woff2`], copyOther);
};
