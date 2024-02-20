// let magazines = document.getElementById('carousel').children;
// console.log(magazines);

// let position = 0;

// function slider() {
//   magazines[position].classList.add('z-0');
//   console.log('magazine[position : ', magazines[position]);

//   let zIndex = 0;

//   for (let i = position + 1; i < magazines.length; i++) {
//     console.log('position : ', position);

//     zIndex = zIndex + 10;
//     console.log('zIndex : ', zIndex);

//     magazines[i].classList.add(`-z-${zIndex}`);
//     console.log('magazines[i] : ', magazines[i]);
//   }

//   zIndex = zIndex = 10;

//   for (let i = position - 1; i >= 0; i--) {
//     console.log('position : ', position);

//     zIndex = zIndex + 10;
//     console.log('zIndex : ', zIndex);

//     magazines[i].classList.add(`-z-${zIndex}`);
//     console.log('magazines[i] : ', magazines[i]);
//   }
// }

// slider();

// let nextButton = document.getElementById('next');
// let prevButton = document.getElementById('prev');

// nextButton.addEventListener('click', function () {
//   console.log('next');
//   position = position - 1 < magazines.length ? position + 1 : position;
//   slider();
// });

// prevButton.addEventListener('click', function () {
//   console.log('prev');
//   position = position - 1 >= 0 ? position - 1 : position;
//   slider();
// });
