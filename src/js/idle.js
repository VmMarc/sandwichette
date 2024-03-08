let idleTime = 0;
console.log('idleTime start', idleTime);

function idleTimeCounter() {
  setInterval(() => {
    idleTime += 1;
    console.log('idleTime after increment', idleTime);

    if (idleTime > 5) {
      document.getElementById('floating-image').style.display = 'block';
    }
  }, 1000);
}

idleTimeCounter();

document.addEventListener('mousemove', () => {
  idleTime = 0;
  document.getElementById('floating-image').style.display = 'none';
});
