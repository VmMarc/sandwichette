import fs from 'fs';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import sharp from 'sharp';

const srcDir = './images';
const tmpDir = './compressed-img';
const destDir = './src/assets/images';

async function compress() {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  await imagemin([`${srcDir}/*.svg`], {
    destination: tmpDir,
    plugins: [imageminSvgo({ quality: 100 })],
  });

  await imagemin([`${srcDir}/*.@(jpeg|jpg)`], {
    destination: tmpDir,
    plugins: [imageminMozjpeg({ quality: 50 })],
  });

  await imagemin([`${srcDir}/*.jpg`, `${srcDir}/*.jpeg`], {
    destination: tmpDir,
    plugins: [imageminWebp({ quality: 30 })],
  });
}

function resize() {
  const data = fs.readFileSync('imageConfig.json', 'utf-8');
  const obj = JSON.parse(data);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }

  fs.readdirSync(tmpDir).forEach(async (file) => {
    for (const image of Object.values(obj.images)) {
      if (file.startsWith(image.name)) {
        const fileName = file.split('.')[0];
        const filePath = `${tmpDir}/${file}`;
        const metadata = await sharp(filePath).metadata();

        if (!metadata) {
          console.warn(`${filePath}: No metadata found`);
          continue;
        }
        if (!metadata.format) {
          console.warn(`${filePath}: No image format in metadata`);
          continue;
        }

        for (const [breakpoint, width] of Object.entries(image.breakpoint)) {
          sharp(filePath)
            .clone()
            .resize({ width })
            .toFile(`${destDir}/${fileName}-${breakpoint}.${metadata.format}`);
        }
      }
    }
  });
}

try {
  await compress();
  resize();
  fs.rm(tmpDir, { recursive: true }, (err) => {
    if (err) throw err;
  });
} catch (err) {
  console.error(err);
}
