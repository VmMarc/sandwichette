// eslint-disable-next-line no-unused-vars
function accordionOpen() {
  const panel = document.getElementById('panel');
  const contentMask = document.getElementById('content-mask');
  const accordionBtn = document.getElementById('accordion-btn');

  panel.style.maxHeight = panel.scrollHeight + 'px';
  contentMask.style.display = 'none';
  accordionBtn.style.display = 'none';
}
