import gulp from 'gulp';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import fsync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = '../src/img';
const destDir = '../dist/img';
const buildDir = '../build/img';

async function compress() {
  await imagemin([`${srcDir}/**/*.svg`], {
    destination: buildDir,
    plugins: [imageminSvgo()],
  });

  await imagemin([`${srcDir}/**/*.@(jpeg|jpg)`], {
    destination: buildDir,
    plugins: [imageminMozjpeg({ quality: 50 })],
  });

  await imagemin([`${srcDir}/**/*.jpg`, `${srcDir}/*.jpeg`], {
    destination: buildDir,
    plugins: [imageminWebp({ quality: 30 })],
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
          await sharp(src)
            .resize({ ...dimensions })
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

const image = gulp.series(compress, resize);

export default image;
