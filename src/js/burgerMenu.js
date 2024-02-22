// eslint-disable-next-line no-unused-vars
function burgerOpen() {
  document.getElementById('header').style.backgroundPosition = 'right';
  document.getElementById('burger-open').style.display = 'none';
  document.getElementById('burger-close').style.display = 'block';
  document.getElementById('instagram-icon').classList.add('btn-secondary');
}
// eslint-disable-next-line no-unused-vars
function burgerClose() {
  document.getElementById('header').style.backgroundPosition = 'left';
  document.getElementById('burger-open').style.display = 'block';
  document.getElementById('burger-close').style.display = 'none';
  document.getElementById('instagram-icon').classList.remove('btn-secondary');
}
