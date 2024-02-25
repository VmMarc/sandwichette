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
import w3cjs from 'w3cjs';

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
}

export const image = gulp.series(images.compress, images.resize);
export const faviconGen = images.favicon;

export async function clean() {
  await fs.promises.rm(paths.tmp, { recursive: true, force: true });
  await fs.promises.rm(paths.dest, { recursive: true, force: true });
}

const tests = {
  jsLint() {
    return gulp
      .src([`${paths.src}/js/*.js`])
      .pipe(cache('linting'))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  },

  async w3c() {
    await w3cjs.validate({
      file: `${paths.src}/index.html`, // file can either be a local file or a remote file
      //file: 'http://html5boilerplate.com/',
      //input: '<html>...</html>',
      //input: myBuffer,
      output: 'json', // Defaults to 'json', other option includes html
      //proxy: 'http://proxy:8080', // Default to null
      callback: function (err, res) {
        console.log(res);
        // depending on the output type, res will either be a json object or a html string
      },
    });
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

export const test = gulp.parallel(tests.accessibility, tests.w3c);

export function html() {
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
}

export function copyOther() {
  return gulp
    .src([`${paths.src}/**/*.woff2`, `${paths.tmp}/favicon/*.!(html)`])
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
    gulp.series(
      gulp.parallel(css, tests.jsLint, images.favicon),
      fileInject,
      html,
    ),
    image,
  ),
);

export const watch = function () {
  gulp.watch(
    [
      `${paths.src}/index.html`,
      `${paths.src}/css/*.css`,
      `./tailwind.config.js`,
    ],
    { delay: 1000 },
    gulp.series(
      gulp.parallel(css, tests.jsLint, images.favicon),
      fileInject,
      html,
    ),
  );
  gulp.watch(
    `${paths.src}/js/*.js`,
    gulp.series(tests.jsLint, fileInject, html),
  );
  gulp.watch([images.configFile, ...images.src], image);
  gulp.watch(
    [`${paths.src}/**/*.woff2`, `${paths.tmp}/favicon/*.!(html)`],
    copyOther,
  );
};
