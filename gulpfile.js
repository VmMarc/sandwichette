import { exec } from 'child_process';
import { stream as critical } from 'critical';
import fs from 'fs';
import gulp from 'gulp';
import access from 'gulp-accessibility';
import cache from 'gulp-cached';
import concat from 'gulp-concat';
import csso from 'gulp-csso';
import eslint from 'gulp-eslint-new';
import favicons from 'gulp-favicons';
import htmlmin from 'gulp-htmlmin';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import inject from 'gulp-inject';
import rename from 'gulp-rename';
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

const tests = {
  jsLint() {
    return gulp
      .src([`${paths.src}/js/*.js`])
      .pipe(cache('linting'))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  },

  accessibility() {
    return gulp
      .src(`${paths.src}/index.html`)
      .pipe(
        access({
          force: true,
        }),
      )
      .on('error', console.log)
      .pipe(access.report({ reportType: 'txt' }))
      .pipe(
        rename({
          extname: '.txt',
        }),
      )
      .pipe(gulp.dest('./reports/'));
  },
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
            await sharp(src, { pages: -1 })
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
      .pipe(gulp.dest(`${paths.tmp}/favicon/`));
  },
};
export const image = gulp.series(images.compress, images.resize);
const css = {
  build() {
    return exec(
      'npx tailwindcss -c tailwind.config.js -i src/css/input.css -o .tmp/css/main.css',
    );
  },
  minify() {
    return gulp
      .src(`${paths.tmp}/css/main.css`)
      .pipe(csso())
      .pipe(gulp.dest(`${paths.dest}/css/`))
      .pipe(size());
  },

  critical() {
    return (
      gulp
        .src(`${paths.tmp}/index.html`)
        .pipe(
          // @ts-ignore
          critical({
            inline: true,
            base: `${paths.dest}/`,
            css: `${paths.dest}/css/main.css`,
          }),
        )
        // @ts-ignore
        .pipe(gulp.dest(paths.dest))
        .pipe(size())
    );
  },
};

const html = {
  inject() {
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
        inject(gulp.src(`${paths.tmp}/favicon/head-favicons.html`), {
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
  },

  minify() {
    return (
      gulp
        .src(`${paths.tmp}/index.html`)
        .pipe(
          // @ts-ignore
          critical({
            inline: true,
            base: `${paths.dest}/`,
            css: `${paths.dest}/css/main.css`,
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
        .pipe(gulp.dest(paths.dest))
        .pipe(size())
    );
  },
};

export function copyFiles() {
  return gulp
    .src([
      `${paths.src}/**/*.woff2`,
      `${paths.tmp}/favicon/*.!(html)`,
      `${paths.src}/robots.txt`,
    ])
    .pipe(gulp.dest(`${paths.dest}/`));
}

export const test = tests.accessibility;

export async function clean() {
  await fs.promises.rm(paths.tmp, { recursive: true, force: true });
  await fs.promises.rm(paths.dest, { recursive: true, force: true });
}

export const build = gulp.series(
  gulp.parallel(
    copyFiles,
    gulp.series(
      gulp.parallel(
        gulp.series(css.build, css.minify),
        tests.jsLint,
        images.favicon,
      ),
      html.inject,
      css.critical,
      html.minify,
    ),
    image,
  ),
);

export const watch = function () {
  gulp.watch(
    [
      `${paths.src}/js/*.js`,
      `${paths.src}/index.html`,
      `${paths.src}/css/main.css`,
      `./tailwind.config.js`,
    ],
    gulp.series(
      gulp.parallel(gulp.series(css.build, css.minify), tests.jsLint),
      html.inject,
      css.critical,
      html.minify,
    ),
  );
  gulp.watch([images.configFile, ...images.src], image);
  gulp.watch(
    [
      `${paths.src}/**/*.woff2`,
      `${paths.tmp}/favicon/*.!(html)`,
      `${paths.src}/robots.txt`,
    ],
    copyFiles,
  );
};
