// Определяем центр карты в зависимости от ширины экрана
const getCenterByScreenSize = () => {
  if (window.innerWidth < 1280) {
    return [59.938631, 30.323037];
  } else {
    return [59.938565, 30.320227];
  }
};

const placemarkImageSet = (placemark) => {
  if (window.innerWidth < 768) {
    placemark.options.set({
      iconImageHref: 'images/map-pin@1x.png',
      iconImageSize: [56, 52],
      iconImageOffset: [-23, -26]
    });
  } else {
    placemark.options.set({
      iconImageHref: 'images/map-pin@2x.png',
      iconImageSize: [113, 106],
      iconImageOffset: [-54, -53]
    });
  }
};
// Инициализация карты
const ymaps = window.ymaps;
ymaps.ready(init);

function init() {
  const center = getCenterByScreenSize();

  const map = new ymaps.Map('map', {
    center: center,
    zoom: 16,
    controls: ['zoomControl']
  });
  // Отключаем все жесты zoom
  map.behaviors.disable([
    'scrollZoom', // колесо мыши
    'dblClickZoom', // двойной клик
    'multiTouchZoom' // мультитач (на мобильных устройствах)
  ]);
  // Добавляем метку в центр
  const placemark = new ymaps.Placemark([59.938631, 30.323037], {}, {
    // Опции.
    // Необходимо указать данный тип макета.
    iconLayout: 'default#image',
    // Своё изображение иконки метки.
    iconImageHref: 'images/map-pin@1x.png',
    // Смещение левого верхнего угла иконки относительно
    // её "ножки" (точки привязки).
  });
  placemarkImageSet(placemark);
  map.geoObjects.add(placemark);
  // Обработчик изменения размера окна
  window.addEventListener('resize', () => {
    const newCenter = getCenterByScreenSize();
    map.setCenter(newCenter);

    // Обновляем позицию метки
    placemark.geometry.setCoordinates([59.938631, 30.323037]);
    placemarkImageSet(placemark);
  });
}
