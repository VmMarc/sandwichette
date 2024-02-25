// eslint-disable-next-line no-unused-vars
function navMenuOpen() {
  const instaIcon = document.getElementById('instagram-btn__icon');
  const header = document.getElementById('header');

  document.getElementById('nav-menu__btn').onclick = navMenuClose;
  document.getElementById('nav-menu__btn-toggle').classList.add('hidden');
  document.getElementById('nav-menu__btn-collapse').classList.remove('hidden');

  instaIcon.classList.remove('link-primary');
  instaIcon.classList.add('link-secondary');
  header.classList.remove('overlay-collapse');
  header.classList.add('overlay-toggle');
}

// eslint-disable-next-line no-unused-vars
function navMenuClose() {
  const instaIcon = document.getElementById('instagram-btn__icon');
  const header = document.getElementById('header');

  document.getElementById('nav-menu__btn').onclick = navMenuOpen;
  document.getElementById('nav-menu__btn-toggle').classList.remove('hidden');
  document.getElementById('nav-menu__btn-collapse').classList.add('hidden');

  instaIcon.classList.remove('link-secondary');
  instaIcon.classList.add('link-primary');
  header.classList.remove('overlay-toggle');
  header.classList.add('overlay-collapse');
}

window.addEventListener('resize', () => {
  const header = document.getElementById('header');
  if (
    window.matchMedia('not all and (min-width: 1280px)') &&
    header.classList.contains('overlay-toggle')
  ) {
    navMenuClose();
  }
});
