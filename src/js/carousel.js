let magazines = document.getElementById('carousel').children;
let carousel = document.getElementById('carousel');
console.log('magazines', magazines);

let position = 0;

console.log('position start : ', position);

// function slider() {  };

let next = document.getElementById('next');
let prev = document.getElementById('prev');

next.addEventListener('click', () => {
  console.log('next');
  position = position + 1 < magazines.length ? position + 1 : position;
  carousel.scrollLeft += 240;

  console.log('position after next : ', position);
  // slider();
});

prev.addEventListener('click', () => {
  console.log('prev');
  position = position - 1 >= 0 ? position - 1 : position;
  carousel.scrollLeft -= 240;

  console.log('position after prev : ', position);
  // slider();
});
