let position = 0;
let magazineWidth = 240;
const magazineLength = document.getElementById('carousel').children.length;
let frameTick = false;

// FONCTION SLIDER WITH IMAGE SCALING
function buttonSlider() {
  const magazines = document.getElementById('carousel').children;
  for (let i = 0; i < magazines.length; i++) {
    if (i === position) {
      magazines[i].classList.remove('scale-75');
      magazines[i].classList.add(
        'image-shadow',
        'scale-100',
        'transition-transform',
        'duration-100',
        'ease-in-out',
      );
    } else {
      magazines[i].classList.remove(
        'image-shadow',
        'scale-100',
        'transition-transform',
        'duration-100',
        'ease-in-out',
      );
      magazines[i].classList.add('scale-75');
    }
  }
}

//FONCTION CREATE BULLETS
function createBullets() {
  let carouselBulletsContainer = document.getElementById('carousel-bullets');

  for (let i = 0; i < magazineLength; i++) {
    let bullet = document.createElement('div');
    bullet.classList.add('bullets');
    carouselBulletsContainer.appendChild(bullet);
  }
}

// eslint-disable-next-line no-unused-vars
function updateBullets() {
  let bullets = document.getElementById('carousel-bullets').children;

  position = Math.round(
    document.getElementById('carousel').scrollLeft / magazineWidth,
  );
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].classList.remove('bullet-active');
  }
  bullets[position].classList.add('bullet-active');
}

// EVENT NEXT/PREV BUTTONS FOR TABLET/DESKTOP
// eslint-disable-next-line no-unused-vars
function nextButton(e) {
  e.preventDefault();
  if (position < magazineLength - 1) ++position;
  document.getElementById('carousel').scrollLeft += magazineWidth;
  buttonSlider();
}

// eslint-disable-next-line no-unused-vars
function prevButton(e) {
  e.preventDefault();
  if (position > 0) --position;
  document.getElementById('carousel').scrollLeft -= magazineWidth;
  buttonSlider();
}

if (window.matchMedia('(min-width: 768px)').matches) {
  buttonSlider();
}
createBullets();
updateBullets();

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.getElementById('carousel').scrollLeft = position * magazineWidth;
    buttonSlider();
  } else {
    const magazines = document.getElementById('carousel').children;
    for (let i = 0; i < magazines.length; i++) {
      if (i === position) {
        magazines[i].classList.remove(
          'image-shadow',
          'transition-transform',
          'duration-100',
          'ease-in-out',
        );
      } else {
        magazines[i].classList.remove(
          'image-shadow',
          'scale-75',
          'transition-transform',
          'duration-100',
          'ease-in-out',
        );
        magazines[i].classList.add('scale-100');
      }
    }
    updateBullets();
  }
});

'wheel touchend'.split(' ').forEach((event) => {
  window.addEventListener(event, () => {
    if (!frameTick) {
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          updateBullets();
          frameTick = false;
        });
        frameTick = true;
      }, 250);
    }
  });
});
