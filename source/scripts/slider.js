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
  let x = e.pageX;
  x -= slider.getBoundingClientRect().left;
  beforeAfterSlider(x);
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
  let x;
  let i;

  for (i = 0; i < e.changedTouches.length; i++) {
    x = e.changedTouches[i].pageX;
  }
  x -= slider.getBoundingClientRect().left;
  beforeAfterSlider(x);
  pauseEvents(e);
});
