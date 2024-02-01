import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';

(async () => {
  const files = await imagemin(['src/assets/images/*.svg'], {
    destination: 'src/assets/compressed-images/',
    plugins: [imageminSvgo({ quality: 100 })],
  });
  console.log(files);
})();

(async () => {
  const files = await imagemin(
    ['src/assets/images/*.jpeg', 'src/assets/images/*.jpg'],
    {
      destination: 'src/assets/compressed-images/',
      plugins: [imageminMozjpeg({ quality: 50 })],
    },
  );
  console.log(files);
})();

(async () => {
  const files = await imagemin(
    ['src/assets/images/*.jpg', 'src/assets/images/*.jpeg'],
    {
      destination: 'src/assets/compressed-images/',
      plugins: [imageminWebp({ quality: 30 })],
    },
  );
  console.log(files);
})();
