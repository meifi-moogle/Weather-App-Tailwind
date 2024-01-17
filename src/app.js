// Get Main DOM Elements

const currentDate = document.querySelector('[data-current-day]')
const currentTemp = document.querySelector('[data-current-temp]');
const feelsLike = document.querySelector('[data-feels-like]');
const currentWind = document.querySelector('[data-current-wind]');
const currentHumidity = document.querySelector('[data-current-humidity]');
const currentPrecipitation = document.querySelector('[data-current-precipitation]');
const errorMsg = document.querySelector('.error-msg')

//Get DOM Elements For Hourly + Hourly Temperature Data

const hourOne = document.querySelector('[data-hour-one]')
const hourTwo = document.querySelector('[data-hour-two]')
const hourThree = document.querySelector('[data-hour-three]')
const hourFour = document.querySelector('[data-hour-four]')
const hourFive = document.querySelector('[data-hour-five]')
const hourSix = document.querySelector('[data-hour-six]')
const hourSeven = document.querySelector('[data-hour-seven]')
const hourEight = document.querySelector('[data-hour-eight]')

const tempHourOne = document.querySelector('[data-temp-hour1]')
const tempHourTwo = document.querySelector('[data-temp-hour2]')
const tempHourThree = document.querySelector('[data-temp-hour3]')
const tempHourFour = document.querySelector('[data-temp-hour4]')
const tempHourFive = document.querySelector('[data-temp-hour5]')
const tempHourSix = document.querySelector('[data-temp-hour6]')
const tempHourSeven = document.querySelector('[data-temp-hour7]')
const tempHourEight = document.querySelector('[data-temp-hour8]')


//Get Current Date

const displayDate = document.querySelector('[data-current-day]');
const displayHours = document.querySelector('.time');

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();

let weekDay = weekDays[date.getDay()];
let yearMonth = months[date.getMonth()];
let day = date.getDate();
let month = date.getMonth() + 1;

const cityInput = document.querySelector('#city');
const searchCity = document.querySelector('#search-button');

searchCity.addEventListener('click', () => {
    const city = document.querySelector('#city').value;

    getWeather(`https://api.weatherapi.com/v1/forecast.json?key=d372798783f849a08f4212727230804&q=${city}&days=7&aqi=yes&alerts=no`
        , { mode: 'cors' });

        document.querySelector('#city').value = '';
})

cityInput.addEventListener('keyup', () => {
    if (event.key === 'Enter') {
        searchCity.click()
    }
})

// API Call to Fetch And Display The Data

async function getWeather(apiUrl) {
    try {
        const response = await fetch(apiUrl)
        const weatherData = await response.json();
        // console.log(weatherData);
        errorMsg.style.display = "none"

        // Save Last Location In Local Storage

        let lastLocation = weatherData.location.name;
        localStorage.setItem('location', lastLocation)

        // Display Location Name

        const currentLocation = document.querySelector('[data-location-title]');
        currentLocation.textContent = weatherData.location.name;


        // Display Local Time 

        let fullLocalTime = weatherData.location.localtime;
        let shortLocalTime = fullLocalTime.substring(11, 16);

        let [hours, minutes] = shortLocalTime.split(':');
        hours = hours.padStart(2, '0');

        //Display Main Weather Data

        currentTemp.textContent = weatherData.current.temp_c;
        feelsLike.textContent = weatherData.current.feelslike_c;
        currentWind.textContent = weatherData.current.wind_mph;
        currentHumidity.textContent = weatherData.current.humidity;
        currentPrecipitation.textContent = weatherData.current.precip_mm;

        //Display Sky Condition

        const conditionDescription = document.querySelector('[data-condition-description]')
        conditionDescription.textContent = weatherData.current.condition.text;
        if (weatherData.current.condition.text === 'Clear') { conditionDescription.textContent = 'Clear Sky' }
        if (weatherData.current.condition.text === 'Overcast') { conditionDescription.textContent = 'Cloudy' }

        //Get And Display Hourly Forecast

        let [addZero, minute] = fullLocalTime.split(':');
        addZero = addZero.padStart(2, '0')
        let timeComparator = `${addZero}:${minute}`;

        let hourlyArray = []
        let hourlyArrayDisplay = [];
        hourlyArrayDisplay.push(hourOne, hourTwo, hourThree, hourFour, hourFive, hourSix, hourSeven, hourEight);

        const hourlyForecastArray = []
        const hourlyForecastArrayDisplay = []
        hourlyForecastArrayDisplay.push(tempHourOne, tempHourTwo, tempHourThree, tempHourFour, tempHourFive, tempHourSix, tempHourSeven, tempHourEight);

        for (let i = 0; i < 24; i++) {
            let arrayTime = weatherData.forecast.forecastday[0].hour[i].time
            if (arrayTime > timeComparator) {
                hourlyArray.push(weatherData.forecast.forecastday[0].hour[i].time)
                hourlyForecastArray.push(weatherData.forecast.forecastday[0].hour[i].temp_c)
            }
        }
        for (let i = 0; i < 24; i++) {
            hourlyArray.push(weatherData.forecast.forecastday[1].hour[i].time)
            hourlyForecastArray.push(weatherData.forecast.forecastday[1].hour[i].temp_c)
        }

        for (let i = 0; i < 8; i++) {
            // console.log(hourlyArray[i].substring(11))
            let displayHour = hourlyArray[i].substring(11);
            hourlyArrayDisplay[i].textContent = displayHour;
            // console.log(hourlyForecastArray[i])
            hourlyForecastArrayDisplay[i].textContent = hourlyForecastArray[i]  
        }

    } catch (err) {
        const response = await fetch(apiUrl)
        console.log('An error occurred', err)

        //Tells User To Enter Valid Location
        if (response.status === 400) { errorMsg.style.display = "block" } 
        else { alert('Something broke, please try again later :(') }
    }
}


    // Use Locally Stored Location If Possible
    // Else Use Default Location

 let savedLocation = localStorage.getItem('location')

 function defaultCall() {
    if (savedLocation) {
        getWeather(`https://api.weatherapi.com/v1/forecast.json?key=d372798783f849a08f4212727230804&q=${savedLocation}&days=7&aqi=yes&alerts=no`
    , { mode: 'cors' })
    } else {
        getWeather(`https://api.weatherapi.com/v1/forecast.json?key=d372798783f849a08f4212727230804&q=Fife&days=7&aqi=yes&alerts=no`
    , { mode: 'cors' })
    }
 }
 defaultCall()





