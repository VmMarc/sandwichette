let ticking = false;
let scrollPosIsTop = true;

function switchBackgroundOpacity() {
  if (window.scrollY === 0) {
    if (scrollPosIsTop) return;
    document.getElementById('header').classList.remove('scrolled');
    scrollPosIsTop = true;
  } else if (scrollPosIsTop) {
    document.getElementById('header').classList.add('scrolled');
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
