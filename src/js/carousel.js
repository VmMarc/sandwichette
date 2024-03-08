const carousel = document.getElementById('carousel');
const carouselBulletsContainer = document.getElementById('carousel-bullets');
const magazines = carousel.children;
const magazineLength = magazines.length;
const magazineWidth = 240;
let position = 0;
let frameTick = false;
let magazineLoaded = 0;

if (magazines) {
  for (let i = 0; i < magazines.length; i++) {
    magazines[i].addEventListener('load', () => {
      magazineLoaded++;
      carousel.scrollLeft = 0;
    });
  }
}

/**
 * @param {number} x
 */
function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/**
 * scrollLeft change animation
 * @date 3/8/2024 - 12:02:09 PM
 * @author morizur
 *
 * @param {boolean} [scrollRight=true] scroll direction
 * @param {number} [duration=1000] animation duration
 * @param {number} [baseValue=carousel.scrollLeft] scrollLeft initial value
 * @param {(x: number) => number} [easingFn=easeInOutQuad] easing function
 * @returns {void}
 */
function scroll(
  scrollRight = true,
  duration = 1000,
  baseValue = carousel.scrollLeft,
  easingFn = easeInOutQuad,
) {
  let start, prevTime;
  let done = false;
  const scrollDir = scrollRight ? 1 : -1;

  /**
   * Scroll coefficient generator
   * @date 3/8/2024 - 12:22:16 PM
   * @author morizur
   *
   * @generator
   * @param {number} x
   * @param {(x: number) => number} [f] easing function
   * @return {Generator}
   * @yields {number}
   */
  function* generator(x, f) {
    yield f(x);
  }

  /**
   * Scrolling function
   * @date 3/8/2024 - 12:18:27 PM
   * @author morizur
   *
   * @param {DOMHighResTimeStamp} timeStamp
   */
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
            magazineWidth,
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
  }
}, 200);

function buttonSlider() {
  for (let i = 0; i < magazines.length; i++) {
    if (i === position) {
      magazines[i].classList.remove('scale-75');
      magazines[i].classList.add('image-shadow');
    } else {
      magazines[i].classList.remove('image-shadow');
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

function throttle(mainFunction, delay) {
  let timerFlag = null;

  return (...args) => {
    if (timerFlag === null) {
      mainFunction(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
}

// eslint-disable-next-line no-unused-vars
const nextButton = throttle(() => {
  buttonSlider();
  scroll(true, 300);
  if (position < magazineLength - 1) ++position;
}, 300);

// eslint-disable-next-line no-unused-vars
const prevButton = throttle(() => {
  buttonSlider();
  scroll(false, 300);
  if (position > 0) --position;
}, 300);

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
