// API Key

let apiKey = "8cd9be374c7c96c39a9fe73f4bf2f055";

// City detecting

function apiFindCity(city) {
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlCity).then(function (response) {
    let locationData = response.data;
    currentCity.innerHTML = locationData.name;
    tempC = locationData.main.temp;
    temperature.innerHTML = Math.round(tempC);
    weatherCondition.innerHTML = locationData.weather[0].main;
    putWeatherCondition(locationData);
    console.log(response.data.weather[0].main);
  });
}

// Search Location

let search = document.querySelector("#search_form");
let searchCity = document.querySelector("#search_city");
let currentCity = document.querySelector("#current_city");

var tempC;

function findSearchLocationData() {
  search.addEventListener("submit", function (event) {
    event.preventDefault();
    let searchLocationValue = searchCity.value;
    searchLocationValue = searchLocationValue.toString().trim();
    if (searchLocationValue) {
      searchLocationValue =
        searchLocationValue[0].toUpperCase() +
        searchLocationValue.slice(1).toLowerCase();
      apiFindCity(searchLocationValue);
    } else {
      event.preventDefault();
    }
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
    let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrlCurrent).then(function (response) {
      let currentLocationData = response.data;
      currentCity.innerHTML = currentLocationData.name;
      tempC = currentLocationData.main.temp;
      temperature.innerHTML = Math.round(tempC);
      weatherCondition.innerHTML = currentLocationData.weather[0].main;
      putWeatherCondition(currentLocationData);
    });
  });
}

let currentLocationData = findCurrentLocationData();
let fastSearchCurrentLoc = document.querySelector("#currentLoc");

fastSearchCurrentLoc.addEventListener("click", function (event) {
  event.preventDefault();
  findCurrentLocationData();
});

// Default Location

function findDefaultLocationData() {
  let defaultCity = "Odesa";
  return apiFindCity(defaultCity);
}

// Conditions of detecting location

function findLocationData() {
  if (searchLocationValue === true) {
    return searchLocationValue;
  } else if (currentLocationData === true) {
    return currentLocationData;
  } else {
    findDefaultLocationData();
  }
}

let locationData = findLocationData();

// Current time of the city

let currentTime = new Date();
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

let day = document.querySelector("#current_day");
day.innerHTML = days[currentTime.getDay()];

let month = document.querySelector("#current_month");
month.innerHTML = months[currentTime.getMonth()];

let date = document.querySelector("#current_date");
function dateType(date) {
  if (date < 10) {
    return "0" + currentTime.getDate();
  } else {
    return currentTime.getDate();
  }
}
date.innerHTML = dateType(date);

let hours = document.querySelector("#current_hours");
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

let minutes = document.querySelector("#current_minutes");
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
    hours.innerHTML >= 08 &&
    hours.innerHTML < 20
  ) {
    weatherIcon.src = weather[condition]["icon day"];
    weatherBg.style.backgroundImage = `url("${weather[condition]["background day"]}")`;
    weatherImg.style.backgroundImage = `url("${weather[condition]["background day"]}")`;
  } else if (
    weather.hasOwnProperty(condition) &&
    (hours.innerHTML >= 20 || hours.innerHTML < 08)
  ) {
    weatherIcon.src = weather[condition]["icon night"];
    weatherBg.style.backgroundImage = `url("${weather[condition]["background night"]}")`;
    weatherImg.style.backgroundImage = `url("${weather[condition]["background night"]}")`;
  } else {
    if (hours.innerHTML >= 08 && hours.innerHTML < 20) {
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
