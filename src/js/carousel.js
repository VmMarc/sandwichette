let position = 0;
let magazineWidth = 240;
const magazineLength = document.getElementById('carousel').children.length;

// FONCTION SLIDER WITH IMAGE SCALING
function buttonSlider() {
  const magazines = document.getElementById('carousel').children;
  for (let i = 0; i < magazines.length; i++) {
    let scaleValue = i === position ? 'scale(1)' : 'scale(.75)';
    magazines[i].setAttribute('style', `transform: ${scaleValue}`);
  }
}

if (window.matchMedia('(min-width: 768px)').matches) {
  buttonSlider();
}

//FONCTION CREATE BULLETS
function createBullets() {
  let carouselBulletsContainer = document.getElementById('carousel-bullets');

  for (let i = 0; i < magazineLength; i++) {
    let bullet = document.createElement('button');
    bullet.classList.add('bullets');
    carouselBulletsContainer.appendChild(bullet);
  }
}

createBullets();

// eslint-disable-next-line no-unused-vars
function updateBullets() {
  let bullets = document.getElementById('carousel-bullets').children;

  setTimeout(() => {
    position = Math.round(
      document.getElementById('carousel').scrollLeft / magazineWidth,
    );
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].classList.remove('bullet-active');
    }
    bullets[position].classList.add('bullet-active');
  }, 50);
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

window.addEventListener('resize', () => {
  if (window.matchMedia('(max-width: 767px)').matches) {
    const magazines = document.getElementById('carousel').children;
    for (let i = 0; i < magazineLength; i++) {
      magazines[i].setAttribute('style', `transform: scale(1)`);
    }
  } else {
    position = Math.round(
      document.getElementById('carousel').scrollLeft / magazineWidth,
    );
    buttonSlider();
  }
});
