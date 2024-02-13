let accordion = document.getElementById('accordion');

accordion.addEventListener('click', function () {
  let panel = document.getElementById('panel');
  let contentMask = document.getElementById('content-mask');
  accordion.classList.toggle('active');
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
    contentMask.style.display = 'block';
  } else {
    panel.style.maxHeight = panel.scrollHeight + 'px';
    contentMask.style.display = 'none';
  }
});
