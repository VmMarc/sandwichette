let magazines = document.getElementById('carousel-content').children;
let carousel = document.getElementById('carousel');
let nextButton = document.getElementById('next-button');
let previousButton = document.getElementById('previous-button');

let position = 0;
let magazineWidth = 240;

// FONCTION SLIDER
function buttonSlider() {
  for (let i = 0; i < magazines.length; i++) {
    let scaleValue = 'scale(1)';

    // TODO responsive scaling
    scaleValue = i === position ? 'scale(1)' : 'scale(.75)';
    let translateValue = position * magazineWidth;
    magazines[i].setAttribute(
      'style',
      `transform: translateX(-${translateValue}px) ${scaleValue}`,
    );
  }
}

buttonSlider();

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
    let scollPosition = Math.round(
      document.getElementById('carousel').scrollLeft / magazineWidth,
    );
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].classList.remove('bullet-active');
    }
    bullets[scollPosition].classList.add('bullet-active');
    console.log('update bullets'); //TODO
  }, 200);
}

updateBullets();

// EVENT NEXT/PREV
nextButton.addEventListener('click', () => {
  position = position + 1 < magazines.length ? position + 1 : position;
  buttonSlider();
});

previousButton.addEventListener('click', () => {
  position = position - 1 >= 0 ? position - 1 : position;
  buttonSlider();
});

// EVENT SCROLL
carousel.addEventListener('touchend', () => {
  updateBullets();
});
