let ticking = false;
let scrollPosIsTop = true;

/** Change the header appearance if page is scrolled */
function switchBackgroundOpacity() {
  if (window.scrollY === 0) {
    if (scrollPosIsTop) return;
    document.getElementsByTagName("header")[0].classList.remove("scrolled");
    scrollPosIsTop = true;
  } else if (scrollPosIsTop) {
    document.getElementsByTagName("header")[0].classList.add("scrolled");
    scrollPosIsTop = false;
  }
}

document.addEventListener("scroll", (event) => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      switchBackgroundOpacity();
      ticking = false;
    });

    ticking = true;
  }
});
