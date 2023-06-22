// API Key

let apiKeyWeather = "8cd9be374c7c96c39a9fe73f4bf2f055";
let apiKeyTime = "ESJVB6GUV4NN";

// City detecting

function apiFindCity(city) {
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`;
  axios.get(apiUrlCity).then(function (response) {
    let locationData = response.data;
    let lat = locationData.coord.lat;
    let lon = locationData.coord.lon;
    currentCity.innerHTML = locationData.name;
    tempC = locationData.main.temp;
    temperature.innerHTML = Math.round(tempC);
    weatherCondition.innerHTML = locationData.weather[0].main;
    weatherIcon.alt = locationData.weather[0].main;
    windSpeed.innerHTML = Math.round(locationData.wind.speed);
    if (city.toLowerCase().trim() === "kyiv") {
      cityCurrentTime(50, 30, locationData);
    } else {
      cityCurrentTime(lat, lon, locationData);
    }
    apiCityForecast(lat, lon);
  });
}

// Search Location

let search = document.querySelector("#search_form");
let searchCity = document.querySelector("#search_city");
let currentCity = document.querySelector("#current_city");

var tempC;

function resetSearch() {
  searchCity.value = "";
  searchCity.blur();
}

function findSearchLocationData() {
  search.addEventListener("submit", function (event) {
    event.preventDefault();
    let searchLocationValue = searchCity.value;
    searchLocationValue = searchLocationValue.toString().trim();
    if (searchLocationValue) {
      apiFindCity(searchLocationValue);
    } else {
      event.preventDefault();
    }
    resetSearch();
  });
}

let searchLocationValue = findSearchLocationData();

// Fast search buttons

let fastSearchKyiv = document.querySelector("#kyiv");
let fastSearchOdesa = document.querySelector("#odesa");
let fastSearchKharkiv = document.querySelector("#kharkiv");
let fastSearchLviv = document.querySelector("#lviv");
let fastSearchDnipro = document.querySelector("#dnipro");
let cities = ["Kyiv", "Odesa", "Kharkiv", "Lviv", "Dnipro"];

fastSearchKyiv.addEventListener("click", function (event) {
  event.preventDefault();
  apiFindCity(cities[0]);
});

fastSearchOdesa.addEventListener("click", function (event) {
  event.preventDefault();
  apiFindCity(cities[1]);
});

fastSearchKharkiv.addEventListener("click", function (event) {
  event.preventDefault();
  apiFindCity(cities[2]);
});

fastSearchLviv.addEventListener("click", function (event) {
  event.preventDefault();
  apiFindCity(cities[3]);
});

fastSearchDnipro.addEventListener("click", function (event) {
  event.preventDefault();
  apiFindCity(cities[4]);
});

// Current Location

function findCurrentLocationData() {
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric`;
    axios.get(apiUrlCurrent).then(function (response) {
      let currentLocationData = response.data;
      currentCity.innerHTML = currentLocationData.name;
      tempC = currentLocationData.main.temp;
      temperature.innerHTML = Math.round(tempC);
      weatherCondition.innerHTML = currentLocationData.weather[0].main;
      weatherIcon.alt = currentLocationData.weather[0].main;
      windSpeed.innerHTML = Math.round(currentLocationData.wind.speed);
      cityCurrentTime(lat, lon, currentLocationData);
      apiCityForecast(lat, lon);
    });
  });
}

let currentLocationData = findCurrentLocationData();
let fastSearchCurrentLoc = document.querySelector("#currentLoc");

fastSearchCurrentLoc.addEventListener("click", function (event) {
  event.preventDefault();
  findCurrentLocationData();
});

// Conditions of detecting location

function findLocationData() {
  if (searchLocationValue === true) {
    return searchLocationValue;
  } else if (currentLocationData === true) {
    return currentLocationData;
  } else {
    apiFindCity("Odesa");
  }
}

let locationData = findLocationData();

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

let temperature = document.querySelector("#curTempNumber");

let degreeC = document.querySelector("#celsius");
let degreeF = document.querySelector("#fahrenheit");

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
  // Math.round(currentTempC());
  degreeF.classList.replace("focused", "active");
  degreeC.classList.replace("active", "focused");
});

// Detecting Weather condition

let weatherCondition = document.querySelector("#weatherCondition");
let weatherIcon = document.querySelector(".weather_icon_js");
let weatherBg = document.querySelector("body");
let weatherImg = document.querySelector(".current_weather");
let windSpeed = document.querySelector("#windSpeed");

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
  sample: {
    "icon day": "☘️",
    "icon night": "☘️",
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

function apiCityForecast(lat, lon) {
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=metric`;
  axios.get(apiUrlForecast).then(function (response) {
    let forecastData = response.data.daily;
    let forecastSection = document.querySelector("#forecast");

    let forecastHTML = `<div class = "forecast">`;

    forecastData.forEach(function (forecastDay, dayIndex) {
      if (dayIndex < 5) {
        forecastHTML =
          forecastHTML +
          `
  <div class="day">
          <img src="${
            weather[forecastDay.weather[0].main.toLowerCase().trim()][
              "icon day"
            ]
          }" alt="${forecastDay.weather[0].main}" width="48px" />
          <div class="temperature">
            <span class="max">${Math.round(forecastDay.temp.max)} °</span>
            <span class="min">/ ${Math.round(forecastDay.temp.min)} °</span>
          </div>
          <hr />
          <h3 class="day_name">${formatForecastDay(forecastDay.dt)}</h3>
        </div>`;
      }
    });
    forecastSection.innerHTML = forecastHTML + `</div>`;
  });
}
