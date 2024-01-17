let ticking = false;
let scrollPosIsTop = true;

function switchBackgroundOpacity() {
  if (window.scrollY === 0) {
    if (scrollPosIsTop) return;
    let header = document.getElementsByTagName("header")[0];
    header.style.boxShadow = "none";
    header.style.background =
      "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.00) 100%)";
    header.style.backdropFilter = "blur(1px)";
    document.getElementById("instagram-icon").src =
      "/src/img/instagram-color-icon.svg";
    scrollPosIsTop = true;
  } else if (scrollPosIsTop) {
    let header = document.getElementsByTagName("header")[0];
    header.style.backgroundColor = "#ffe4f6";
    header.style.boxShadow = "0px 4px 4px 0px rgba(0, 0, 0, 0.25)";
    document.getElementById("instagram-icon").src =
      "/src/img/instagram-black-icon.svg";
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
