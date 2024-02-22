// eslint-disable-next-line no-unused-vars
function burgerOpen() {
  document.getElementById('header').classList.add('nav-menu');
  document.getElementById('nav-menu__open').classList.add('nav-menu');
  document.getElementById('nav-menu__close').classList.add('nav-menu');
  document.getElementById('instagram-icon').classList.add('btn-secondary');
}
// eslint-disable-next-line no-unused-vars
function burgerClose() {
  document.getElementById('header').classList.remove('nav-menu');
  document.getElementById('nav-menu__open').classList.remove('nav-menu');
  document.getElementById('nav-menu__close').classList.remove('nav-menu');
  document.getElementById('instagram-icon').classList.remove('btn-secondary');
}
