const slider = document.querySelector('.slider');
const before = slider.querySelector('.slider__block--before');
const after = slider.querySelector('.slider__block--after');
const change = slider.querySelector('.slider__button');
let isActive = false;

const beforeAfterSlider = (x) => {
  const shift = Math.max(0, Math.min(x, slider.offsetWidth));
  before.style.clipPath = `inset(0 ${slider.offsetWidth - shift}px 0 0 )`;
  after.style.clipPath = `inset(0 0 0 ${shift}px)`;
  change.style.left = `${shift}px`;
};
const pauseEvents = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};
slider.addEventListener('mouseup', () => {
  isActive = false;
});
slider.addEventListener('mouseleave', () => {
  isActive = false;
});
slider.addEventListener('mousedown', () => {
  isActive = true;
});

slider.addEventListener('mousemove', (e) => {
  if (!isActive) {
    return;
  }
  let cursorPosition = e.pageX;
  cursorPosition -= slider.getBoundingClientRect().left;
  beforeAfterSlider(cursorPosition);
  pauseEvents(e);
});
change.addEventListener('touchstart', () => {
  isActive = true;
});
slider.addEventListener('touchend', () => {
  isActive = false;
});
slider.addEventListener('touchcancel', () => {
  isActive = false;
});
slider.addEventListener('touchmove', (e) => {
  if (!isActive) {
    return;
  }
  for (let i = 0; i < e.changedTouches.length; i++) {
    let touchPosition = e.changedTouches[i].pageX;
    touchPosition -= slider.getBoundingClientRect().left;
    beforeAfterSlider(touchPosition);
    pauseEvents(e);
  }
});
