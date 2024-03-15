let idleTime = 0;

function flotingImages() {
  document.getElementById('floating-dish').style.display = 'block';

  setTimeout(() => {
    document.getElementById('floating-plate').style.display = 'block';
  }, 12 * 1000);

  setTimeout(() => {
    document.getElementById('floating-sandwich').style.display = 'block';
  }, 17 * 1000);
}

function movingArm() {
  document.getElementById('moving-arm').style.display = 'block';
}

function createChouquette() {
  const img = document.createElement('img');
  img.src = '/img/chouquette.png';
  img.alt = 'une chouquette';
  img.classList.add('chouquette');
  img.style.position = 'fixed';
  img.style.zIndex = '20';

  let randomX = Math.floor(Math.random() * window.innerWidth);
  let randomY = Math.floor(Math.random() * window.innerHeight);

  if (document.querySelectorAll('img').length === 0) {
    randomX = window.innerWidth / 2;
    randomY = window.innerHeight / 2;
  }

  img.style.left = `${randomX}px`;
  img.style.top = `${randomY}px`;

  document.body.appendChild(img);
}

function incrementChouquette() {
  let count = 0;
  const intervalId = setInterval(() => {
    createChouquette();
    count++;
    if (count >= 30) {
      clearInterval(intervalId);
    }
  }, 1000);
}

function randomIdleImages() {
  const randomNumber = Math.floor(Math.random() * 3);
  switch (randomNumber) {
    case 0:
      flotingImages();
      break;

    case 1:
      movingArm();
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
    if (idleTime == 5) {
      randomIdleImages();
    }
  }, 1000);
}

function hideIdleImages() {
  idleTime = 0;
  document.getElementById('floating-dish').style.display = 'none';
  document.getElementById('floating-plate').style.display = 'none';
  document.getElementById('floating-sandwich').style.display = 'none';
  document.getElementById('moving-arm').style.display = 'none';
  const chouquettes = document.querySelectorAll('.chouquette');
  chouquettes.forEach((img) => {
    img.remove();
  });
}

hideIdleImages();
idleImages();

document.addEventListener('mousemove', () => {
  hideIdleImages();
});

document.addEventListener('scroll', () => {
  hideIdleImages();
});
