const pauseEvents = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

export const slider = (sliderElement) => {
  const sliderBlock = document.querySelector(sliderElement);
  if (!sliderBlock) {
    return;
  }
  const before = sliderBlock.querySelector('.slider__block--before');
  const after = sliderBlock.querySelector('.slider__block--after');
  const change = sliderBlock.querySelector('.slider__button');
  let isActive = false;
  const beforeAfterSlider = (x) => {
    const shift = Math.max(0, Math.min(x, sliderBlock.offsetWidth));
    before.style.clipPath = `inset(0 ${sliderBlock.offsetWidth - shift}px 0 0 )`;
    after.style.clipPath = `inset(0 0 0 ${shift}px)`;
    change.style.left = `${shift}px`;
  };
  sliderBlock.addEventListener('mouseup', () => {
    isActive = false;
  });
  sliderBlock.addEventListener('mouseleave', () => {
    isActive = false;
  });
  sliderBlock.addEventListener('mousedown', () => {
    isActive = true;
  });

  sliderBlock.addEventListener('mousemove', (e) => {
    if (!isActive) {
      return;
    }
    let cursorPosition = e.pageX;
    cursorPosition -= sliderBlock.getBoundingClientRect().left;
    beforeAfterSlider(cursorPosition);
    pauseEvents(e);
  });
  change.addEventListener('touchstart', () => {
    isActive = true;
  });
  sliderBlock.addEventListener('touchend', () => {
    isActive = false;
  });
  sliderBlock.addEventListener('touchcancel', () => {
    isActive = false;
  });
  sliderBlock.addEventListener('touchmove', (e) => {
    if (!isActive) {
      return;
    }
    for (let i = 0; i < e.changedTouches.length; i++) {
      let touchPosition = e.changedTouches[i].pageX;
      touchPosition -= sliderBlock.getBoundingClientRect().left;
      beforeAfterSlider(touchPosition);
      pauseEvents(e);
    }
  });
};
