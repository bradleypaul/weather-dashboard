const key = '73fe2827b9f6a20adf8a5966784c333a';

function getWeatherData(cityName) {
    // update stored city list with the new name
    updateCities(cityName);
    
    // redraw the list of cities
    createCityList();

    // query api for the current day data needed
    const currentDayURL = createCurrentDayRequestUrl(cityName);
    getCurrentDay(currentDayURL);
    const fiveDayForecastUrl = create5DayForecastUrl(cityName);
    get5DayForecast(fiveDayForecastUrl);
}

function get5DayForecast(requestURL) {
    fetch(requestURL)
      .then(response => response.json())
      .then(obj => {
        // filter out indexes which line up with noon. 4 index offset so looking for mod 4
        // at zero. 8 because 24 hours in a day / 3 hour reports = 8
        const cardData = obj.list
          .filter((_, index) => index % 8 == 4)
          .map(item => bundle5DayData(item, obj.city.name));
        createCardDeck(cardData)
    }); 
}

function create5DayForecastUrl(cityName) {
    return `https://api.openweathermap.org/data/2.5/forecast?appid=${key}&q=${cityName}&units=imperial`;
}

function getCurrentDay(requestURL) {
    fetch(requestURL)
      .then(response => response.json())
      .then(obj => {
        //query for the uv index
        const uvURL = createUvRequestUrl(obj.coord);
        fetch(uvURL).then(response => response.json())
          .then(res => {
            const currentWeatherData = bundleCurrentWeatherData(obj, res.value);
            // add current day's weather data to the site
            addCurrentWeatherElement(currentWeatherData);
        });
    });
}

function bundleCurrentWeatherData(obj, uv) {
    return {
        temp: obj.main.temp,
        humidity: obj.main.temp,
        wind: obj.wind.speed,
        name: obj.name,
        icon: obj.weather[0].icon,
        description: obj.weather[0].description,
        uv: uv,
        date: (new Date()).toLocaleDateString()
    };
}

function bundle5DayData(obj) {
    return {
        date: (new Date(obj.dt_txt)).toLocaleDateString(),
        temp: obj.main.temp,
        humidity: obj.main.humidity,
        description: obj.weather[0].description,
        icon: obj.weather[0].icon
    }
}

function createCurrentDayRequestUrl(cityName) {
    return `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${key}&q=${cityName}`;
}

function createUvRequestUrl(location) {
    return `https://api.openweathermap.org/data/2.5/uvi?appid=${key}&lat=${location.lat}&lon=${location.lon}`;
}

function createCityList() {
    const cityElements = getCityList().map(cityName => `<li>${cityName}</li>`).join('');
    $('#city-list').empty().append(cityElements);
}

function createCardDeck(cardData) {
    const cards = cardData.map(createCardElement).join('');
    const cardDeck = $('<div class="card-deck"></div>').append(cards);
    $('#five-day-forecast').empty().append('<h2>5-Day Forecast:</h2>').append(cardDeck);
}

function createCardElement(data) {
    return `
    <div class="card">
        <ul>
            <li>
                ${data.date}
            </li>
            <li>
            <img src="http://openweathermap.org/img/wn/${data.icon}.png" alt="${data.description}"/>
            </li>
            <li>
                Temp: ${data.temp}&#xb0;F
            </li>
            <li>
                Humidity: ${data.humidity}%
            </li>
        </ul>
    </div>`;
}

function addCurrentWeatherElement(weatherData) {
    $('.current-weather').empty().append(createCurrentWeatherElement(weatherData));
}

function createCurrentWeatherElement(data) {
    return `
    <h2>
        ${data.name} (${data.date}) <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png" alt="${data.description}"/></i>
    </h2>
    <ul>
        <li>
            Temperature: ${data.temp}&#xb0;F
        </li>
        <li>
            Humidity: ${data.humidity}%
        </li>
        <li>
            Wind Speed: ${data.wind} MPH
        </li>
        <li>
            UV index: <span class="uv">${data.uv}</span>
        </li>
    </ul>`;
}

function updateCities(cityName) {
    const cities = updateCitiesArray(cityName, getCityList());
    setCityList(cities);
}

function updateCitiesArray(cityName, cities) {
    // if cities name alredy exists, filter it from its current index
    // to not have redundancies in the city history
    // and return new list with the city put in front
    return [cityName, ...cities.filter(city => city !== cityName)];
}

function getCityList() {
    // get array of cities as string from localstorage or default to empty array if null
    return JSON.parse(localStorage.getItem('cities')) || [];
}

function setCityList(cities) {
    // set localstorage cities as a JSON string
    localStorage.setItem('cities', JSON.stringify(cities));
}

function buttonDown() {
    const city = document.querySelector('input').value;
    getWeatherData(city);
}

// wait for DOM to load, then populate the city list
document.addEventListener("DOMContentLoaded", createCityList);

// add an event for the city list that can change behavior 
// using the event targets
document.querySelector('#city-list').addEventListener('click', (e) => {
    getWeatherData(e.target.innerText);
});

// event handler for search button
document.querySelector('button').addEventListener('click', buttonDown);

// Add event listener for user pressing enter key
document.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      buttonDown();
    }
  });