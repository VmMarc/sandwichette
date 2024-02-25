// eslint-disable-next-line no-unused-vars
function navMenuOpen() {
  const navMenuIcon = document.getElementById('nav-menu__icon');
  const instaIcon = document.getElementById('instagram-link__icon');
  const header = document.getElementById('header');

  navMenuIcon.ariaLabel = 'close';
  navMenuIcon.onclick = navMenuClose;
  navMenuIcon.children[0].classList.add('hidden');
  navMenuIcon.children[1].classList.remove('hidden');

  instaIcon.classList.remove('link-primary');
  instaIcon.classList.add('link-secondary');
  header.classList.remove('overlay-hide');
  header.classList.add('overlay-show');
}

// eslint-disable-next-line no-unused-vars
function navMenuClose() {
  const navMenuIcon = document.getElementById('nav-menu__icon');
  const instaIcon = document.getElementById('instagram-link__icon');
  const header = document.getElementById('header');

  navMenuIcon.ariaLabel = 'Navigation menu';
  navMenuIcon.onclick = navMenuOpen;
  navMenuIcon.children[0].classList.remove('hidden');
  navMenuIcon.children[1].classList.add('hidden');

  instaIcon.classList.remove('link-secondary');
  instaIcon.classList.add('link-primary');
  header.classList.remove('overlay-show');
  header.classList.add('overlay-hide');
}

const viewport = window.visualViewport;

viewport.addEventListener('resize', () => {
  if (
    viewport.width > 1280 &&
    document.getElementById('header').classList.contains('overlay-show')
  ) {
    navMenuClose();
  }
});
