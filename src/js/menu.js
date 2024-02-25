// eslint-disable-next-line no-unused-vars
function navMenuOpen() {
  const navMenuIcon = document.getElementById('nav-menu__btn');
  const instaIcon = document.getElementById('instagram-btn__icon');
  const header = document.getElementById('header');

  navMenuIcon.ariaLabel = 'Close navigation menu';
  navMenuIcon.onclick = navMenuClose;
  navMenuIcon.children[0].classList.add('hidden');
  navMenuIcon.children[1].classList.remove('hidden');

  instaIcon.classList.remove('link-primary');
  instaIcon.classList.add('link-secondary');
  header.classList.remove('overlay-collapse');
  header.classList.add('overlay-toggle');
}

// eslint-disable-next-line no-unused-vars
function navMenuClose() {
  const navMenuIcon = document.getElementById('nav-menu__btn');
  const instaIcon = document.getElementById('instagram-btn__icon');
  const header = document.getElementById('header');

  navMenuIcon.ariaLabel = 'Open navigation menu';
  navMenuIcon.onclick = navMenuOpen;
  navMenuIcon.children[0].classList.remove('hidden');
  navMenuIcon.children[1].classList.add('hidden');

  instaIcon.classList.remove('link-secondary');
  instaIcon.classList.add('link-primary');
  header.classList.remove('overlay-toggle');
  header.classList.add('overlay-collapse');
}

const viewport = window.visualViewport;

viewport.addEventListener('resize', () => {
  if (
    viewport.width > 1280 &&
    document.getElementById('header').classList.contains('overlay-toggle')
  ) {
    navMenuClose();
  }
});
