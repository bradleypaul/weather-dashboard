const key = '73fe2827b9f6a20adf8a5966784c333a';
//q={city name}&appid={your api key}
const baseUrl = 'api.openweathermap.org/data/2.5/weather?';


function createCityList() {
    // get array of cities as string from localstorage or default to empty array if null
    const cities = JSON.parse(localStorage.getItem("cities")) || [];
    const cityElements = cities.map(createCityElement).join('');
    $('#city-list').append(cityElements);
}

function createCityElement(cityName) {
    return `<li>${cityName}</li>\n`;
}

function saveCity(cityName, cities) {
    
    // if cities name alredy exists, remove it from its current index
    // to not have redundancies in the city history
    if(cities.includes(cityName)) {
        cities = cities.filter(city => city == cityName);
    }

    // prepend the cityname to the list of cities so that the history 
    //shows a top to bottom view of past cities
    cities = [cityName, ...cities];
    localStorage.setItem('cities', JSON.stringify(cities));
}




// wait for DOM to load, then populate the city list
document.addEventListener("DOMContentLoaded", createCityList);

// add an event for the city list that can change behavior 
// using the event targets
document.querySelector('#city-list').addEventListener('click', (e) => {
    console.log(e.target.innerText)
})
