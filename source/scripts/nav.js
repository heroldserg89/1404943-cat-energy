const burgerMenu = document.querySelector('.burger');
const menu = document.querySelector('.main-header__nav-block');
burgerMenu.addEventListener('click', () => {
  burgerMenu.classList.toggle('burger--active');
  menu.classList.toggle('main-header__nav-block--menu-open');
});
