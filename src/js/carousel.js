// let magazines = document.getElementById('carousel').children;
// console.log('magazines : ', magazines);

// let position = 0;

// function slider() {
//   magazines[position].classList.add('z-0');
//   console.log('magazine[position] : ', magazines[position]);

//   let zIndex = 0;

//   for (let i = position + 1; i < magazines.length; i++) {
//     console.log('loop 1 position : ', position);

//     zIndex = zIndex + 10;
//     console.log('loop 1 zIndex : ', zIndex);

//     magazines[i].classList.add(`z-[-${zIndex}]`);
//     console.log('loop 1 magazines[i] : ', magazines[i]);
//   }

//   zIndex = zIndex = 10;

//   for (let j = position - 1; j >= 0; j--) {
//     console.log('loop 2 position : ', position);

//     zIndex = zIndex + 10;
//     console.log('loop 2 zIndex : ', zIndex);

//     magazines[j].classList.add(`z-[-${zIndex}]`);
//     console.log('loop 2 magazines[i] : ', magazines[j]);
//   }
// }

// slider();

// let nextButton = document.getElementById('next');
// let prevButton = document.getElementById('prev');

// nextButton.addEventListener('click', function () {
//   console.log('next');
//   position = position - 1 < magazines.length ? position + 1 : position;
//   console.log('position next : ', position);
//   slider();
//   console.log('position after slider() next : ', position);
// });

// prevButton.addEventListener('click', function () {
//   console.log('prev');
//   position = position - 1 >= 0 ? position - 1 : position;
//   console.log('position prev : ', position);
//   slider();
//   console.log('position after prev : ', position);
// });
