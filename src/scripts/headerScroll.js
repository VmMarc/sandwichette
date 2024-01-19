let ticking = false;
let scrollPosIsTop = true;

/** Change the header appearance if page is scrolled */
function switchBackgroundOpacity() {
  if (window.scrollY === 0) {
    if (scrollPosIsTop) return;
    let header = document
      .getElementsByTagName("header")[0]
      .classList.remove("after-top");
    scrollPosIsTop = true;
  } else if (scrollPosIsTop) {
    let header = document
      .getElementsByTagName("header")[0]
      .classList.add("after-top");
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
