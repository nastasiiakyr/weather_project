// API Keys

let apiKeyWeather = "8cd9be374c7c96c39a9fe73f4bf2f055";
let apiKeyTime = "ESJVB6GUV4NN";

// Getting city weather data from the API

function getApiCityWeather(city) {
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`;
  axios.get(apiUrlCity).then(function (response) {
    // Getting access to city data in API
    let locationData = response.data;
    let lat = locationData.coord.lat;
    let lon = locationData.coord.lon;
    // Getting city name and current temperature
    currentCity.innerHTML = locationData.name;
    tempC = locationData.main.temp;
    temperature.innerHTML = Math.round(tempC);
    // Getting current weather conditions
    weatherCondition.innerHTML = locationData.weather[0].main;
    weatherIcon.alt = locationData.weather[0].main;
    windSpeed.innerHTML = Math.round(locationData.wind.speed);
    // Getting city current time (for Kiev is special conditions because of issues in the time API)
    if (city.toLowerCase().trim() === "kyiv") {
      cityCurrentTime(50, 30, locationData);
    } else {
      cityCurrentTime(lat, lon, locationData);
    }
    // Getting city 5 days forecast data
    apiCityForecast(lat, lon);
  });
}

// Search engine

// Reseting Serch after submiting data
function resetSearch() {
  searchCity.value = "";
  searchCity.blur();
}

let search = document.querySelector("#search_form");
let searchCity = document.querySelector("#search_city");
let currentCity = document.querySelector("#current_city");

search.addEventListener("submit", function (event) {
  event.preventDefault();
  let searchLocationValue = searchCity.value;
  searchLocationValue = searchLocationValue.toString().trim();
  if (searchLocationValue) {
    getApiCityWeather(searchLocationValue);
  } else {
    event.preventDefault();
  }
  resetSearch();
});

// Getting weather from Fast search buttons

// Current location

let curLocFastSearch = document.querySelector("#currentLoc");

curLocFastSearch.addEventListener("click", function (event) {
  event.preventDefault();
  getApiCurrLocWeather();
});

// Cities

let citiesFastSearch = {
  kyiv: {
    "city name": "Kyiv",
    "getting from HTML": document.querySelector("#kyiv"),
  },
  odesa: {
    "city name": "Odesa",
    "getting from HTML": document.querySelector("#odesa"),
  },
  kharkiv: {
    "city name": "Kharkiv",
    "getting from HTML": document.querySelector("#kharkiv"),
  },
  lviv: {
    "city name": "Lviv",
    "getting from HTML": document.querySelector("#lviv"),
  },
  dnipro: {
    "city name": "Dnipro",
    "getting from HTML": document.querySelector("#dnipro"),
  },
};

for (var city in citiesFastSearch) {
  let cityHtml = citiesFastSearch[city];
  cityHtml["getting from HTML"].addEventListener("click", function (event) {
    event.preventDefault();
    getApiCityWeather(cityHtml["city name"]);
  });
}

// Getiing current location weather data from the API

function getApiCurrLocWeather() {
  // Detecting current geolocation
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    // Getting access to the current location data in API
    let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric`;
    axios.get(apiUrlCurrent).then(function (response) {
      let currentLocationData = response.data;
      // Getting city name and current temperature
      currentCity.innerHTML = currentLocationData.name;
      tempC = currentLocationData.main.temp;
      temperature.innerHTML = Math.round(tempC);
      // Getting current weather conditions
      weatherCondition.innerHTML = currentLocationData.weather[0].main;
      weatherIcon.alt = currentLocationData.weather[0].main;
      windSpeed.innerHTML = Math.round(currentLocationData.wind.speed);
      // Getting current time
      cityCurrentTime(lat, lon, currentLocationData);
      // Getting 5 days forecast data
      apiCityForecast(lat, lon);
    });
  });
}

let currLocWeather = getApiCurrLocWeather();

// Conditions to detect what location data should be used (current or default)

if (currLocWeather === true) {
  currLocWeather;
} else {
  getApiCityWeather("Odesa");
}

// !!!Detecting all parts of data

// Current time of the city

let day = document.querySelector("#current_day");
let month = document.querySelector("#current_month");
let date = document.querySelector("#current_date");
let hours = document.querySelector("#current_hours");
let minutes = document.querySelector("#current_minutes");

function cityCurrentTime(lat, lon, location) {
  let apiUrlTime = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKeyTime}&format=json&by=position&lat=${lat}&lng=${lon}`;
  axios.get(apiUrlTime).then(function (response) {
    let currentTimeUnix = new Date(response.data.timestamp * 1000);
    let currentTime = new Date(
      currentTimeUnix.toLocaleString("en-US", { timeZone: "UTC" })
    );
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    day.innerHTML = days[currentTime.getDay()];
    month.innerHTML = months[currentTime.getMonth()];

    function dateType(date) {
      if (date < 10) {
        return "0" + currentTime.getDate();
      } else {
        return currentTime.getDate();
      }
    }
    date.innerHTML = dateType(date);

    function hoursType(hours) {
      hours = currentTime.getHours();
      if (hours === 0) {
        return "0" + hours;
      } else if (hours < 10) {
        return "0" + hours;
      } else {
        return hours;
      }
    }
    hours.innerHTML = hoursType(hours);

    function minType(min) {
      min = currentTime.getMinutes();
      if (min === 0) {
        return "0" + min;
      } else if (min < 10) {
        return "0" + min;
      } else {
        return min;
      }
    }
    minutes.innerHTML = minType(minutes);
    putWeatherCondition(location);
  });
}

// Celsius & Fahrenheit switchng

let temperature = document.querySelector("#cur_temp_number");

let degreeC = document.querySelector("#celsius");
let degreeF = document.querySelector("#fahrenheit");

let tempForecastMax;
let tempC;
let tempForecastMaxC;
let tempForecastMinC;

function toFahrenheit(C) {
  return 1.8 * C + 32;
}

degreeF.addEventListener("click", function (event) {
  event.preventDefault();
  temperature.innerHTML = Math.round(toFahrenheit(tempC));
  degreeC.classList.replace("focused", "active");
  degreeF.classList.replace("active", "focused");
});

degreeC.addEventListener("click", function (event) {
  event.preventDefault();
  temperature.innerHTML = Math.round(tempC);
  degreeF.classList.replace("focused", "active");
  degreeC.classList.replace("active", "focused");
});

// Detecting Weather condition

let weatherCondition = document.querySelector("#weather_condition");
let weatherIcon = document.querySelector(".weather_icon_js");
let weatherBg = document.querySelector("body");
let weatherImg = document.querySelector(".current_weather");
let windSpeed = document.querySelector("#wind_speed");

let weather = {
  clear: {
    "icon day": "img/icon=sunny-day.png",
    "icon night": "img/icon=clear-night.png",
    "background day": "img/bg-sunny.jpg",
    "background night": "img/bg-clear-night.jpg",
  },
  rain: {
    "icon day": "img/icon=rain.png",
    "icon night": "img/icon=rain.png",
    "background day": "img/bg-rain.jpg",
    "background night": "img/bg-rain-night.jpg",
  },
  clouds: {
    "icon day": "img/icon=cloud-day.png",
    "icon night": "img/icon=cloud-night.png",
    "background day": "img/bg_clouds.jpg",
    "background night": "img/bg_cloud_night.jpg",
  },
  snow: {
    "icon day": "img/icon=snow.png",
    "icon night": "img/icon=snow.png",
    "background day": "img/bg-snow-day.jpg",
    "background night": "img/bg-snow-night.jpg",
  },
  thunderstorm: {
    "icon day": "img/icon=thunderstorm.png",
    "icon night": "img/icon=thunderstorm.png",
    "background day": "img/bg_thunderstorm_day.jpg",
    "background night": "img/bg_thunderstorm_night.jpg",
  },
  haze: {
    "icon day": "img/icon=haze.png",
    "icon night": "img/icon=haze.png",
    "background day": "img/bg-haze-day.jpg",
    "background night": "img/bg-haze-night.jpg",
  },
  sample: {
    "icon day": "img/icon=sample.png",
    "icon night": "img/icon=sample.png",
    "background day": "img/bg_sample.jpg",
    "background night": "img/bg_sample_night.jpg",
  },
};

function putWeatherCondition(location) {
  let condition = location.weather[0].main;
  condition = condition.toLowerCase().trim();
  if (
    weather.hasOwnProperty(condition) &&
    hours.innerHTML >= "08" &&
    hours.innerHTML < "20"
  ) {
    weatherIcon.src = weather[condition]["icon day"];
    weatherBg.style.backgroundImage = `url("${weather[condition]["background day"]}")`;
    weatherImg.style.backgroundImage = `url("${weather[condition]["background day"]}")`;
  } else if (
    weather.hasOwnProperty(condition) &&
    (hours.innerHTML >= "20" || hours.innerHTML < "08")
  ) {
    weatherIcon.src = weather[condition]["icon night"];
    weatherBg.style.backgroundImage = `url("${weather[condition]["background night"]}")`;
    weatherImg.style.backgroundImage = `url("${weather[condition]["background night"]}")`;
  } else {
    if (hours.innerHTML >= "08" && hours.innerHTML < "20") {
      weatherIcon.src = weather.sample["icon day"];
      weatherBg.style.backgroundImage = `url("${weather.sample["background day"]}")`;
      weatherImg.style.backgroundImage = `url("${weather.sample["background day"]}")`;
    } else {
      weatherIcon.src = weather.sample["icon night"];
      weatherBg.style.backgroundImage = `url("${weather.sample["background night"]}")`;
      weatherImg.style.backgroundImage = `url("${weather.sample["background night"]}")`;
    }
  }
}

// Weather 5 days forecast

function formatForecastDay(timestamp) {
  let forecastTime = new Date(timestamp * 1000);
  let day = forecastTime.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function pushHtmlForecast(response) {
  let forecastData = response.data.daily;
  let forecastSection = document.querySelector("#forecast");
  let forecastHTML = `<div class = "forecast">`;

  forecastData.forEach(function (forecastDay, dayIndex) {
    if (dayIndex < 5) {
      tempForecastMaxC = forecastDay.temp.max;
      tempForecastMax = Math.round(tempForecastMaxC);
      tempForecastMinC = forecastDay.temp.min;
      tempForecastMin = Math.round(tempForecastMinC);
      forecastHTML =
        forecastHTML +
        `<div class="day">
          <img src="${
            weather[forecastDay.weather[0].main.toLowerCase().trim()][
              "icon day"
            ]
          }" alt="${forecastDay.weather[0].main}" width="48px" />
          <div class="temperature">
            <span class="max" id="temp_forecast_max">${tempForecastMax} °</span>
            <span class="min" id="tempForecastMin">/ ${tempForecastMin} °</span>
          </div>
          <hr />
          <h3 class="day_name">${formatForecastDay(forecastDay.dt)}</h3>
        </div>`;
    }
  });
  forecastSection.innerHTML = forecastHTML + `</div>`;
}

function apiCityForecast(lat, lon) {
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric`;
  axios.get(apiUrlForecast).then(pushHtmlForecast);
}
