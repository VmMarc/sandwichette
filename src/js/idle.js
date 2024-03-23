const floatingDish = document.getElementById('floating-dish');
const floatingPlate = document.getElementById('floating-plate');
const floatingSandwich = document.getElementById('floating-sandwich');
const movingArm = document.getElementById('moving-arm');
const imageWidth = 120;
const imageHeight = 120;
let timeout1 = null;
let timeout2 = null;
let interval = null;
let idleTime = 0;

function displayFloatingImages() {
  floatingDish.style.display = 'block';

  timeout1 = setTimeout(() => {
    floatingPlate.style.display = 'block';
  }, 12 * 1000);

  timeout2 = setTimeout(() => {
    floatingSandwich.style.display = 'block';
  }, 20 * 1000);
}

function displayMovingArm() {
  movingArm.style.display = 'block';
}

function createAndDisplayChouquette() {
  const img = document.createElement('img');
  img.src = '/img/chouquette.png';
  img.alt = 'une chouquette';
  img.classList.add('chouquette');
  img.style.position = 'fixed';
  img.style.zIndex = '20';
  img.style.transform = 'translateX(-25%) translateY(-25%)';

  let randomX = Math.floor(Math.random() * (window.innerWidth - imageWidth));
  let randomY = Math.floor(Math.random() * (window.innerHeight - imageHeight));

  img.style.left = `${randomX}px`;
  img.style.top = `${randomY}px`;

  document.body.appendChild(img);
}

function incrementChouquette() {
  let count = 0;
  interval = setInterval(() => {
    createAndDisplayChouquette();
    count++;
    if (count >= 80) {
      clearInterval(interval);
    }
  }, 1000);
}

function randomIdleImages() {
  const randomNumber = Math.floor(Math.random() * 3);
  switch (randomNumber) {
    case 0:
      displayFloatingImages();
      break;

    case 1:
      displayMovingArm();
      break;

    case 2:
      incrementChouquette();
      break;

    default:
      break;
  }
}

function idleImages() {
  setInterval(() => {
    idleTime += 1;
    if (idleTime == 4) {
      randomIdleImages();
    }
  }, 1000);
}

function hideIdleImages() {
  const chouquettes = document.querySelectorAll('.chouquette');
  idleTime = 0;

  floatingDish.style.display = 'none';
  floatingPlate.style.display = 'none';
  floatingSandwich.style.display = 'none';
  movingArm.style.display = 'none';

  chouquettes.forEach((chouquetteIndex) => {
    chouquetteIndex.remove();
  });
}

function clearIntervalAndTimeOut() {
  clearTimeout(timeout1);
  clearTimeout(timeout2);
  clearInterval(interval);
}

hideIdleImages();
idleImages();

function resetTimer() {
  clearIntervalAndTimeOut();
  hideIdleImages();
}

window.addEventListener('load', resetTimer, true);
window.addEventListener('mousemove', resetTimer, true);
window.addEventListener('mousedown', resetTimer, true);
window.addEventListener('touchstart', resetTimer, true);
window.addEventListener('touchmove', resetTimer, true);
window.addEventListener('click', resetTimer, true);
window.addEventListener('keydown', resetTimer, true);
window.addEventListener('scroll', resetTimer, true);
