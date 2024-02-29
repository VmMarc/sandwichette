// let magazines = document.getElementById('carousel-content').children;
// let next = document.getElementById('next');
// let prev = document.getElementById('prev');

// let position = 0;

// // FONCTION SLIDER
// function buttonSlider() {
//   for (let i = 0; i < magazines.length; i++) {
//     let scaleValue = i === position ? 'scale(1)' : 'scale(.75)';
//     let translateValue = position * 240;
//     magazines[i].setAttribute(
//       'style',
//       `transform: translateX(-${translateValue}px) ${scaleValue}`,
//     );
//   }
// }

// buttonSlider();

// // EVENT NEXT
// next.addEventListener('click', () => {
//   position = position + 1 < magazines.length ? position + 1 : position;
//   buttonSlider();
// });

// // EVENT PREV
// prev.addEventListener('click', () => {
//   position = position - 1 >= 0 ? position - 1 : position;
//   buttonSlider();
// });

////////////////////////////////////////////////

let carouselContent = document.getElementById('carousel-content');

let isDown = false;
let startX = 0;
let scrollXLeft = 0;

carouselContent.addEventListener('mousedown', (e) => {
  console.log('mousedown'); //TODO
  isDown = true;
  carouselContent.classList.add('snap-none');
  startX = e.pageX - carouselContent.offsetLeft;
  scrollXLeft = carouselContent.scrollLeft;
});

carouselContent.addEventListener('mouseleave', () => {
  console.log('mouseleave'); //TODO
  isDown = false;
  carouselContent.classList.remove('snap-none');
});

carouselContent.addEventListener('mouseup', () => {
  console.log('mouseup'); //TODO
  isDown = false;
  carouselContent.classList.remove('snap-none');
});

carouselContent.addEventListener('mousemove', (e) => {
  console.log('mousemove'); //TODO
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carouselContent.offsetLeft;
  const walk = x - startX;
  carouselContent.scrollLeft = scrollXLeft - walk;
});
