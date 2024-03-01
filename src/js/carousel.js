let magazines = document.getElementById('carousel-content').children;
let next = document.getElementById('next');
let prev = document.getElementById('prev');

let position = 0;

// FONCTION SLIDER
function buttonSlider() {
  for (let i = 0; i < magazines.length; i++) {
    let scaleValue = 'scale(1)';
    let tabletView = 768;
    let magazineWidth = 240;

    //TODO scale only after 768px
    if (window.innerWidth >= tabletView) {
      scaleValue = i === position ? 'scale(1)' : 'scale(.75)';
    }
    let translateValue = position * magazineWidth;
    magazines[i].setAttribute(
      'style',
      `transform: translateX(-${translateValue}px) ${scaleValue}`,
    );
  }
}

buttonSlider();

let carouselBulletsContainer = document.getElementById('carousel-bullets');

//FONCTION CREATE BULLETS
function createBullets() {
  for (let i = 0; i < magazines.length; i++) {
    let bullet = document.createElement('button');
    bullet.classList.add('bullet', 'rounded-full', 'w-4', 'h-4', 'bg-brand/50');
    carouselBulletsContainer.appendChild(bullet);
  }
}

createBullets();

//FONCTION UPDATE BULLET
// function updateBulletState() {
//   let bullets = document.getElementById('carousel-bullets').children;
//   for (let i = 0; i < bullets.length; i++) {
//     bullets[i].classList.toggle('bg-brand/50', i !== position);
//     bullets[i].classList.toggle(
//       'bg-brand transform translate-y-5 scale-150',
//       i === position,
//     );
//   }
// }
//
// updateBulletState();

//FONCTION UPDATE POSITION FOR MOUSE AND TOUCH
// function updatePosition() {
//   if (magazines.length > 0) {
//     const magazineWidth = magazines[0].clientWidth;
//     position = Math.round(carouselContent.scrollLeft / magazineWidth);
//   }
// }

// updatePosition();

// EVENT NEXT/PREV
next.addEventListener('click', () => {
  position = position + 1 < magazines.length ? position + 1 : position;
  buttonSlider();
});

prev.addEventListener('click', () => {
  position = position - 1 >= 0 ? position - 1 : position;
  buttonSlider();
});

// EVENT MOUSE/TOUCH
let carouselContent = document.getElementById('carousel-content');
let isDown = false;
let startX = 0;
let scrollXLeft = 0;

carouselContent.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX - carouselContent.offsetLeft;
  scrollXLeft = carouselContent.scrollLeft;
});

carouselContent.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const endX = e.pageX - carouselContent.offsetLeft;
  const walk = endX - startX;
  carouselContent.scrollLeft = scrollXLeft - walk;
  // updatePosition();
  // updateBulletState();
});

document.addEventListener('mouseup', () => {
  isDown = false;
  // updatePosition();
  // updateBulletState();
});
