import gulp from 'gulp';
import imagemin from 'imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import fsync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = '../src/img';
const destDir = '../dist/img';
const buildDir = '../build/img';

function copyWebpImages() {
  return gulp.src('../src/img/*.webp').pipe(gulp.dest('../build/img/'));
}

async function compress() {
  await imagemin([`${srcDir}/**/*.gif`], {
    destination: buildDir,
    plugins: [imageminGifsicle({ interlaced: true, optimizationLevel: 3 })],
  });

  await imagemin([`${srcDir}/**/*.svg`], {
    destination: buildDir,
    plugins: [imageminSvgo()],
  });

  await imagemin([`${srcDir}/**/*.@(jpeg|jpg)`], {
    destination: buildDir,
    plugins: [imageminMozjpeg({ quality: 50, progressive: true })],
  });
}

async function resize() {
  const data = await fs.readFile('imageData.json', 'utf-8');
  const files = await fs.readdir(buildDir);

  if (!fsync.existsSync(destDir)) {
    fsync.mkdirSync(destDir);
  }

  const imageData = JSON.parse(data);
  files.forEach(async (file) => {
    const fileProp = path.parse(file);
    const src = `${buildDir}/${file}`;

    if (imageData[fileProp.name] !== undefined) {
      if (imageData[fileProp.name].breakpoints) {
        for (const dimensions of Object.values(
          imageData[fileProp.name].breakpoints,
        )) {
          await sharp(src, { pages: -1 })
            .resize({ ...dimensions })
            .webp({ effort: 6, preset: 'photo', quality: 50 })
            .toFile(
              `${destDir}/${fileProp.name}-${dimensions.width}${fileProp.ext}`,
            );
        }
      }
    } else {
      await fs.copyFile(src, `${destDir}/${file}`);
    }
  });
}

const image = gulp.series(gulp.parallel(compress, copyWebpImages), resize);

export default image;
