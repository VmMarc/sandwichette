import fs from 'fs';
import sharp from 'sharp';

const srcDir = './src/assets/compressed-images';
const destDir = './src/assets/images';

const resize = async () => {
  fs.readFile('imageConfig.json', 'utf-8', function (err, data) {
    if (err) throw err;

    const obj = JSON.parse(data);

    fs.readdirSync(srcDir).forEach(async (file) => {
      for (const [key, value] of Object.entries(obj)) {
        if (file.startsWith(key)) {
          const metadata = await sharp(`${srcDir}/${file}`).metadata();
          const fileName = file.split('.')[0];
          const filePath = `${srcDir}/${file}`;

          if (!fileName || !metadata || !metadata.format) {
            console.warn(`Cannot resize ${file}`);
            continue;
          }

          const sharpStream = sharp(filePath).rotate();

          for (const [breakpoint, width] of Object.entries(value.breakpoint)) {
            sharpStream
              .clone()
              .resize({ width })
              .toFile(
                `${destDir}/${fileName}.${breakpoint}.${width}.${metadata.format}`,
              );
          }
        }
      }
    });
  });
};

await resize();
