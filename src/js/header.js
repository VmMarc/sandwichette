let ticking = false;
let scrollPosIsTop = true;

function switchBackgroundOpacity() {
  if (window.scrollY === 0) {
    if (scrollPosIsTop) return;
    document.getElementById('header').classList.remove('after-scroll');
    scrollPosIsTop = true;
  } else if (scrollPosIsTop) {
    document.getElementById('header').classList.add('after-scroll');
    scrollPosIsTop = false;
  }
}

document.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      switchBackgroundOpacity();
      ticking = false;
    });
    ticking = true;
  }
});
