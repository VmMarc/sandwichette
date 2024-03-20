const carousel = document.getElementById('carousel');
const carouselBulletsContainer = document.getElementById('carousel-bullets');
const prevButtonElement = document.getElementById('previous-button');
const nextButtonElement = document.getElementById('next-button');
const magazines = carousel.children;
const magazineLength = magazines.length;
const magazineWidth = 240 + 2;
let position = 0;
let magazineLoaded = 0;
let frameTick = false;
let buttonDisabled = false;

if (magazines) {
  for (let i = 0; i < magazines.length; i++) {
    magazines[i].addEventListener('load', () => {
      magazineLoaded++;
      carousel.scrollLeft = 0;
    });
  }
}

// function easeInOutQuad(x) {
//   return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
// }

// async function scroll(
//   scrollRight = true,
//   duration = 1000,
//   baseValue = carousel.scrollLeft,
//   easingFn = easeInOutQuad,
// ) {
//   let start, prevTime;
//   let done = false;
//   const scrollDir = scrollRight ? 1 : -1;
//   const startTime = performance.now();

//   function* generator(x, f) {
//     yield f(x);
//   }

//   function scrollLeftTransition(timeStamp) {
//     if (start === undefined) {
//       start = timeStamp;
//     }
//     const elapsed = timeStamp - start;

//     if (prevTime !== timeStamp) {
//       const count = Math.min(
//         magazineWidth * generator(elapsed / duration, easingFn).next().value,
//         magazineWidth,
//       );
//       carousel.scrollLeft = baseValue + count * scrollDir;
//       if (count === magazineWidth) done = true;
//     }

//     if (elapsed < duration) {
//       prevTime = timeStamp;
//       if (!done) {
//         window.requestAnimationFrame(scrollLeftTransition);
//       }
//     } else {
//       buttonSlider();
//       const endTime = performance.now();
//       console.log(`Call to scroll took ${endTime - startTime} ms`);
//     }
//   }

//   window.requestAnimationFrame(scrollLeftTransition);
// }

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

// function throttle(mainFunction, delay) {
//   let timerFlag = null;

//   return (...args) => {
//     if (timerFlag === null) {
//       mainFunction(...args);
//       timerFlag = setTimeout(() => {
//         timerFlag = null;
//       }, delay);
//     }
//   };
// }

// const nextButton = throttle(() => {
//   if (position < magazineLength - 1) ++position;
//   scroll(true, 150);
// }, 200);

// const prevButton = throttle(() => {
//   if (position > 0) --position;
//   scroll(false, 150);
// }, 200);

function disableButtons() {
  buttonDisabled = true;
  prevButtonElement.setAttribute('disabled', 'true');
  nextButtonElement.setAttribute('disabled', 'true');

  setTimeout(() => {
    buttonDisabled = false;
    prevButtonElement.removeAttribute('disabled');
    nextButtonElement.removeAttribute('disabled');
  }, 350);
}

// eslint-disable-next-line no-unused-vars
const nextButton = () => {
  if (buttonDisabled) return;
  if (position < magazineLength - 1) ++position;
  carousel.scrollLeft += magazineWidth;
  buttonSlider();
  disableButtons();
};

// eslint-disable-next-line no-unused-vars
const prevButton = () => {
  if (buttonDisabled) return;
  if (position > 0) --position;
  carousel.scrollLeft -= magazineWidth;
  buttonSlider();
  disableButtons();
};

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
