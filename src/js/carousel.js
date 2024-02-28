let magazines = document.getElementById('carousel-content').children;

let next = document.getElementById('next');
let prev = document.getElementById('prev');

let position = 0;

// FONCTION SLIDER
function Slider() {
  for (let i = 0; i < magazines.length; i++) {
    let scaleValue = i === position ? 'scale(1)' : 'scale(.75)';
    let translateValue = position * 240;
    magazines[i].setAttribute(
      'style',
      `transform: translateX(-${translateValue}px) ${scaleValue}`,
    );
  }
}

Slider();

// EVENT NEXT
next.addEventListener('click', () => {
  position = position + 1 < magazines.length ? position + 1 : position;
  Slider();
});

// EVENT PREV
prev.addEventListener('click', () => {
  position = position - 1 >= 0 ? position - 1 : position;
  Slider();
});
