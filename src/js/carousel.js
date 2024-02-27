let magazines = document.getElementById('carousel').children;
console.log('magazines', magazines); //TODO

let carousel = document.getElementById('carousel');
console.log('carousel', carousel); //TODO
console.log('magazines[0].classList[2] : ', magazines[0].classList[2]); //TODO

let next = document.getElementById('next');
let prev = document.getElementById('prev');

let position = 0;
console.log('position start : ', position); //TODO

// FONCTION
function Slider() {
  for (let i = 0; i < magazines.length; i++) {
    magazines[i].classList.remove(magazines[i].classList[3]); //Todo change logic
    console.log('magazines[i] : ', magazines[i]); //TODO

    let translateX = position * 100;
    magazines[i].classList.add(`translate-x-[-${translateX}%]`);
  }
}

// NEXT
next.addEventListener('click', () => {
  console.log('next'); //TODO

  position = position + 1 < magazines.length ? position + 1 : position;
  Slider();

  console.log('position after next : ', position); //TODO
});

// PREV
prev.addEventListener('click', () => {
  console.log('prev'); //TODO

  position = position - 1 >= 0 ? position - 1 : position;
  Slider();

  console.log('position after prev : ', position); //TODO
});
