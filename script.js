'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app'),
          extraInfo = app.querySelector('.info'),
          popup = app.querySelector('.popup'),
          apiLink = 'http://api.weatherapi.com/v1/current.json?key=a01ccd96aca24f04b3b114424231310&q=',
          weatherParams = {};

    async function getData(city) {
        const res = await fetch(`${apiLink}${city}&lang=ru`);

        const result = await res.json();

        const {current:{condition, temp_c: temp, feelslike_c: feelsLike, humidity, precip_mm: precip, wind_kph: wind, cloud, last_updated: time}, location:{name}} = result;
        
        return {
            name,
            condition,
            temp,
            time,
            info: {feelsLike, humidity, precip, wind, cloud}
        }
    };

    function checkParam(param) {
        switch (param) {
            case 'feelsLike': return ['Ощущается', '°'];
            case 'precip': return ['Осадки', 'mm'];
            case 'humidity': return ['Влажность', '%'];
            case 'wind': return ['Ветер', 'км/ч'];
            case 'cloud': return ['Облачность', '%'];
            default: return ['Показатель', 'метрика'];
        }
    };

    function showWeather({
        name,
        condition:{text, icon},
        temp,
        info,
        time}) {

        const elem = `
        <div class="top">
        <div class="city-info">
           Погода в
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
        </div>
    </div>`;

    app.insertAdjacentHTML('afterbegin', elem);

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
        .then(() => showWeather(weatherParams))
    };
    
    updateWeather();

});