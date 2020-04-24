const key = '73fe2827b9f6a20adf8a5966784c333a';
//q={city name}&appid={your api key}
const baseUrl = 'api.openweathermap.org/data/2.5/weather?';

function createCityList() {
    const cityElements = getCityList().map(cityName => `<li>${cityName}</li>`).join('');
    $('#city-list').append(cityElements);
}

function createCityElement(cityName) {
    return `<li>${cityName}</li>\n`;
}

function createCards(cardData) {
    const cardElements = cardData.map(createCard).join('');
    $('.card-deck').append(cardElements);
}

function createCardElement(cardData) {
    return `<div class="card">
    <ul>
        <li>
            ${cardData.date}
        </li>
        <li>
            (sun)
        </li>
        <li>
            Temp: ${cardData.temp}°F
        </li>
        <li>
            Humitity: ${cardData.humidity}%
        </li>
    </ul>
</div>`;
}

function updateCities(cityName, cities) {
    // if cities name alredy exists, filter it from its current index
    // to not have redundancies in the city history
    // and return new list with the city put in front
    return [cityName, ...cities.filter(city => city == cityName)];
}

function getCityList() {
    // get array of cities as string from localstorage or default to empty array if null
    return JSON.parse(localStorage.getItem('cities')) || [];
}

function setCityList(cities) {
    // set localstorage cities as a JSON string
    localStorage.setItem('cities', JSON.stringify(cities));
}

// wait for DOM to load, then populate the city list
document.addEventListener("DOMContentLoaded", createCityList);

// add an event for the city list that can change behavior 
// using the event targets
document.querySelector('#city-list').addEventListener('click', (e) => {
    console.log(e.target.innerText)
});

