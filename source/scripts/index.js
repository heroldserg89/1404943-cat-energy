/* в этот файл добавляет скрипты*/
import './nav.js';
import {slider} from './slider.js';
import {ymaps, init} from './map.js';

document.querySelector('html').classList.remove('no-js');
slider('.slider');
ymaps.ready(init);
