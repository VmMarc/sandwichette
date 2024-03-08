const carousel = document.getElementById('carousel');
const carouselBulletsContainer = document.getElementById('carousel-bullets');
const magazines = document.getElementById('carousel').children;
const magazineLength = magazines.length;
const magazineWidth = 240;
let position = 0;
let frameTick = false;
let magazineLoaded = 0;

for (let i = 0; i < magazines.length; i++) {
  magazines[i].addEventListener('load', () => {
    magazineLoaded++;
    carousel.scrollLeft = 0;
  });
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function scroll(
  scrollRight = true,
  duration = 1000,
  baseValue = carousel.scrollLeft,
  easingFn = easeInOutCubic,
) {
  let start, prevTime;
  let done = false;
  const scrollDir = scrollRight ? 1 : -1;

  function* generator(x, f) {
    yield f(x);
  }

  function scrollLeftTransition(timeStamp) {
    if (start === undefined) {
      start = timeStamp;
    }
    const elapsed = timeStamp - start;

    if (prevTime !== timeStamp) {
      const compteur = Math.min(0.1 * elapsed, 100);
      carousel.scrollLeft =
        baseValue +
        scrollDir *
          Math.min(
            magazineWidth *
              generator(elapsed / duration, easingFn).next().value,
            240,
          );
      if (compteur === 100) done = true;
    }

    if (elapsed < duration) {
      prevTime = timeStamp;
      if (!done) {
        window.requestAnimationFrame(scrollLeftTransition);
      }
    }
  }
  window.requestAnimationFrame(scrollLeftTransition);
}

function cancelWheelEvent(e) {
  if (window.matchMedia('(min-width: 768px)').matches) {
    e.preventDefault();
    e.stopPropagation();
  }
}

const checkLoaded = setInterval(() => {
  if (magazineLoaded === magazineLength) {
    createBullets();
    updateBullets();
    carousel.addEventListener('scroll', () => {
      if (!frameTick) {
        window.requestAnimationFrame(() => {
          position = Math.round(carousel.scrollLeft / magazineWidth);
          if (window.matchMedia('(min-width: 768px)').matches) {
            buttonSlider();
          } else {
            updateBullets();
          }
          frameTick = false;
        });
        frameTick = true;
      }
    });
    carousel.addEventListener('mousewheel', cancelWheelEvent, false);
    carousel.addEventListener('DOMMouseScroll', cancelWheelEvent, false);
  }
}, 200);

function buttonSlider() {
  for (let i = 0; i < magazines.length; i++) {
    if (i === position) {
      magazines[i].classList.remove('scale-75');
      magazines[i].classList.add('image-shadow', 'scale-100');
    } else {
      magazines[i].classList.remove('image-shadow', 'scale-100');
      magazines[i].classList.add('scale-75');
    }
  }
}

function createBullets() {
  for (let i = 0; i < magazineLength; i++) {
    let bullet = document.createElement('div');
    bullet.classList.add('bullets');
    carouselBulletsContainer.appendChild(bullet);
  }
}

function updateBullets() {
  const bullets = carouselBulletsContainer.children;

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].classList.remove('bullet-active');
  }
  bullets[position].classList.add('bullet-active');
  clearInterval(checkLoaded);
}

// eslint-disable-next-line no-unused-vars
function nextButton() {
  scroll(true, 1000);
  if (position < magazineLength - 1) ++position;
  buttonSlider();
}

// eslint-disable-next-line no-unused-vars
function prevButton() {
  scroll(false, 1000);
  if (position > 0) --position;
  buttonSlider();
}

if (window.matchMedia('(min-width: 768px)').matches) {
  buttonSlider();
}

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 768px)').matches) {
    carousel.scrollLeft = position * magazineWidth;
    buttonSlider();
  } else {
    for (let i = 0; i < magazines.length; i++) {
      if (i === position) {
        magazines[i].classList.remove('image-shadow');
      } else {
        magazines[i].classList.remove('image-shadow', 'scale-75');
        magazines[i].classList.add('scale-100');
      }
    }
    updateBullets();
  }
});
