let magazines = document.getElementById('carousel-content').children;
let carousel = document.getElementById('carousel');
let nextButton = document.getElementById('next-button');
let previousButton = document.getElementById('previous-button');

let position = 0;
let magazineWidth = 240;

// FONCTION SLIDER WITH IMAGE SCALING
function buttonSlider() {
  for (let i = 0; i < magazines.length; i++) {
    let scaleValue = i === position ? 'scale(1)' : 'scale(.75)';
    let translateValue = position * magazineWidth;
    magazines[i].setAttribute(
      'style',
      `transform: translateX(-${translateValue}px) ${scaleValue}`,
    );
  }
}

if (window.matchMedia('(min-width: 768px)').matches) {
  buttonSlider();
}

//FONCTION CREATE BULLETS
function createBullets() {
  let carouselBulletsContainer = document.getElementById('carousel-bullets');

  for (let i = 0; i < magazines.length; i++) {
    let bullet = document.createElement('button');
    bullet.classList.add('bullets');
    carouselBulletsContainer.appendChild(bullet);
  }
}

createBullets();

//FONCTION UPDATE BULLETS
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
  }, 250);
}

updateBullets();

// EVENT NEXT/PREV BUTTONS FOR TABLET/DESKTOP
nextButton.addEventListener('click', () => {
  position = position + 1 < magazines.length ? position + 1 : position;
  buttonSlider();
});

previousButton.addEventListener('click', () => {
  position = position - 1 >= 0 ? position - 1 : position;
  buttonSlider();
});

// EVENT SCROLL FOR MOBILE
carousel.addEventListener('touchend', () => {
  updateBullets();
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(max-width: 767px)').matches) {
    updateBullets();
    for (let i = 0; i < magazines.length; i++) {
      let scaleValue = 'scale(1)';
      magazines[i].setAttribute('style', `transform: ${scaleValue}`);
    }
  } else {
    buttonSlider();
  }
});
