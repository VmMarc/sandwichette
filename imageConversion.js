import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';

(async () => {
  const files = await imagemin(['img/*.svg'], {
    destination: 'src/assets/compressed-images/',
    plugins: [imageminSvgo({ quality: 100 })],
  });
  console.log(files);
})();

(async () => {
  const files = await imagemin(['img/*.jpeg', 'img/*.jpg'], {
    destination: 'src/assets/compressed-images/',
    plugins: [imageminMozjpeg({ quality: 50 })],
  });
  console.log(files);
})();

(async () => {
  const files = await imagemin(['img/*.jpg', 'img/*.jpeg'], {
    destination: 'src/assets/compressed-images/',
    plugins: [imageminWebp({ quality: 30 })],
  });
  console.log(files);
})();
