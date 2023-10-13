'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app'),
          top = app.querySelector('.top'),
          extraInfo = app.querySelector('.info'),
          popup = app.querySelector('.popup'),
          form = popup.querySelector('.popup__form'),
          input = popup.querySelector('.popup__input'),
          errorMessage = popup.querySelector('.error-message'),
          apiLink = 'http://api.weatherapi.com/v1/current.json?key=a01ccd96aca24f04b3b114424231310&q=',
          weatherParams = {};

    async function getData(city) {
        const res = await fetch(`${apiLink}${city}&lang=ru`);

        if (!res.ok) throw new Error();

        const result = await res.json();
        console.log(result)

        const {current:{condition, temp_c: temp, feelslike_c: feelsLike, humidity, precip_mm: precip, wind_kph: wind, cloud, last_updated: time, uv}, location:{name}} = result;
        
        return {
            name,
            condition,
            temp,
            time,
            info: {feelsLike, humidity, precip, wind, cloud, uv}
        }
    };

    function checkParam(param) {
        switch (param) {
            case 'feelsLike': return ['Ощущается', '°'];
            case 'precip': return ['Осадки', 'mm'];
            case 'humidity': return ['Влажность', '%'];
            case 'wind': return ['Ветер', 'км/ч'];
            case 'cloud': return ['Облачность', '%'];
            case 'uv': return ['УФ индекс', ''];
            default: return ['Показатель', 'метрика'];
        }
    };

    function showWeather({
        name,
        condition:{text, icon},
        temp,
        info,
        time}) {

        top.innerHTML = '';
        extraInfo.innerHTML = '';

        const elem = `
        <div class="city-info">
           Погода в городе
        </div>
        <div class="city-name">${name}</div>

        <div class="weather-info">
            <div class="sun-state">
                <img class="sun-state__img" src="${icon}" alt="condition img">
                <div class="sun-state__descr">
                    ${text}
                </div>
            </div>

            <div class="about-info">
                <div class="time">${time}</div>
                <div class="temperature">${temp}°</div>
            </div>
        </div>`;

    top.insertAdjacentHTML('afterbegin', elem);

        for (let [key, value] of Object.entries(info)) {
            
            const [ruName, metric] = checkParam(key);
            const e = `
            <div class="info__item">
            <img src="img/${key}.svg" alt="info icon" class="info__item-img">
            <div class="info__item-descr">
                <div class="info__item-value">${value}${metric}</div>
                <div class="info__item-name">${ruName}</div>
            </div>
        </div>`;

        extraInfo.insertAdjacentHTML('beforeend', e);
        };
    };

    function updateWeather(city='Москва') {
        getData(city).then(res => {
            for (let [key, value] of Object.entries(res)) {
                weatherParams[key] = value;
            };
        })
        .then(() => {
            showWeather(weatherParams);
            errorMessage.style.display = 'none';
            popupClassToggle();
        })
        .catch(() => {
            errorMessage.style.display = 'block';
        })
        .finally(() => input.value = '');
    };
    
    updateWeather();

    function popupClassToggle() {
        popup.classList.toggle('active');
    };

    function popupClassToggleHandler(e) {
        const target = e.target;

        if (target && (target.classList.contains('city-name') || target.classList.contains('popup__close'))) {
            popupClassToggle();
        };
    };

    function formSubmitHandler(e) {
        e.preventDefault();

        const newCity = input.value;

        updateWeather(newCity);

    };


    app.addEventListener('click', (e) => popupClassToggleHandler(e));

    form.addEventListener('submit', (e) => formSubmitHandler(e));

});