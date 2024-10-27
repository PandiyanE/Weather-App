const temp = document.querySelector('#temp'),
 date = document.querySelector('#date-time'),
 currentLocation = document.querySelector('#location'),
 condition = document.querySelector('#condition'),
 rain = document.querySelector('#rain'),
 mainIcon = document.querySelector('#icon'),
 uvIndex = document.querySelector('.uv-index'),
 uvText = document.querySelector('.uv-text'),
 windSpeed = document.querySelector('.wind-speed'),
 humidity = document.querySelector('.humidity'),
 humidityStatus = document.querySelector('.humidity-status'),
 visibility = document.querySelector('.Visibility'),
 visibilityStatus = document.querySelector('.visibility-status'),
 airQuality = document.querySelector('.air-quality'),
 airQualityStatus = document.querySelector('.air-quality-status'),
 sunRise = document.querySelector('.sunrise'),
 sunSet = document.querySelector('.Sunset'),
 weatherCards = document.querySelector('#weather-cards'),
 celciusBtn = document.querySelector('.celcius'),
 fahrenheitBtn = document.querySelector('.fahrenheit'),
 hourlyBtn = document.querySelector('.hourly'),
 weekBtn = document.querySelector('.week'),
 tempUnit = document.querySelectorAll('.temp-unit'),
 searchForm = document.querySelector("#search"),
 search = document.querySelector("#query");


 let currentCity = '';
 let currentUnit = 'c';
 let hourlyorWeek = 'week'
 
//Update Date Time
function getDateTime(){
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();
 
    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    //12 hour formate
    hour = hour % 12;
    if(hour < 10){
        hour = '0' + hour;
    }
    if(minute < 10){
        minute = '0' + minute;
    }
 
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}
date.innerText = getDateTime();
//Update time every second
setInterval(()=>{
    date.innerText = getDateTime();
}, 1000);

//Function to get public ip with fetch
function getPublicIp(){
    fetch('https://geolocation-db.com/json/', 
        {
            method:'GET',
        })
    .then((response) => response.json())
    .then((data)=>{
        console.log(data);
        currentCity = data.city;        
        getWeatherData(data.city, currentUnit, hourlyorWeek);
    }).catch((err) => console.log('Error'));
}
getPublicIp();

//function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
      {
        method: "GET",
        headers: {},
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let today = data.currentConditions;
        if (unit === "c") {
          temp.innerText = today.temp;
        } else {
          temp.innerText = celciusToFahrenheit(today.temp);
        }
        currentLocation.innerText = data.resolvedAddress;
        condition.innerText = today.conditions;
        rain.innerText = 'Perc - ' + today.precip + '%';
        uvIndex.innerText = today.uvindex;
        measureUvIndex(today.uvindex);
        windSpeed.innerText = today.windspeed;
        humidity.innerText = today.humidity;
        updateHumidityStatus(today.humidity);
        visibility.innerText = today.visibility;
        updateVisibiltyStatus(today.visibility);
        airQuality.innerText = today.winddir;               
        updateAirQualityStatus(today.winddir);
        sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
        sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
        mainIcon.src = getIcon(today.icon);
        changeBackground(today.icon);
        if(hourlyorWeek === 'hourly') {
          updateForecast(data.days[0].hours, unit, 'day');
        } else{
          updateForecast(data.days, unit, 'week');
        }

      }).catch((err) => alert('City not found in our database'));      
};

//function to get uv index status
function measureUvIndex(uvIndex) {
  if(uvIndex <= 2){
      uvText.innerText = 'Low';
  } else if (uvIndex <= 5){
      uvText.innerText = 'Moderate';
  } else if (uvIndex <= 7) {
      uvText.innerText = 'High';
  } else if (uvIndex <= 10) {
      uvText.innerText = 'Very High';
  } else {
      uvText.innerText = 'Extreme';
  }
};

// function to get humidity status
function updateHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}

// function to get visibility status
function updateVisibiltyStatus(visibility) {
  if (visibility <= 0.03) {
    visibilityStatus.innerText = "Dense Fog";
  } else if (visibility <= 0.16) {
    visibilityStatus.innerText = "Moderate Fog";
  } else if (visibility <= 0.35) {
    visibilityStatus.innerText = "Light Fog";
  } else if (visibility <= 1.13) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility <= 2.16) {
    visibilityStatus.innerText = "Light Mist";
  } else if (visibility <= 5.4) {
    visibilityStatus.innerText = "Very Light Mist";
  } else if (visibility <= 10.8) {
    visibilityStatus.innerText = "Clear Air";
  } else {
    visibilityStatus.innerText = "Very Clear Air";
  }
}

// function to get air quality status
function updateAirQualityStatus(airquality) {
  if (airquality <= 50) {
    airQualityStatus.innerText = "Good👌";
  } else if (airquality <= 100) {
    airQualityStatus.innerText = "Moderate😐";
  } else if (airquality <= 150) {
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
  } else if (airquality <= 200) {
    airQualityStatus.innerText = "Unhealthy😷";
  } else if (airquality <= 250) {
    airQualityStatus.innerText = "Very Unhealthy😨";
  } else {
    airQualityStatus.innerText = "Hazardous😱";
  }
}

// convert time to 12 hour format
function convertTimeTo12HourFormat(time) {
  let hour = time.split(':')[0];
  let minute = time.split(':')[1];
  let ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour & 12;
  hour = hour ? hour : 12;    //the zero hour should be 12
  hour = hour < 10 ? '0' + hour : hour;  //add prefix zero if less than 10
  minute = minute < 10 ? '' + minute : minute;
  let strTime = hour + ':' + minute + ' ' + ampm;
  return strTime;
}

// function to change weather icons
function getIcon(condition){
    if(condition === 'Partly-cloudy-day') {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === 'Partly-cloudy-night') {
        return  "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === 'rain') {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === 'clear-day') {
        return  "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === 'clear-night') {
        return "https://i.ibb.co/1nxNGHL/10.png"
    } else {
        return "https://i.ibb.co/rb4rrJL/26.png";
    }
}

// function to get day name from date
function getDayName(date) {
  let day = new Date(date);
  let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
  ];
  return days[day.getDay()];
}

//get hours from hh:mm:ss
function getHour(time){
  let hour = time.split(':')[0];
  let min = time.split(':')[1];
  if(hour > 12) {
      hour = hour - 12;
      return `${hour}:${min} PM`;
  } else {
      return `${hour}:${min} AM`
  }
}

//function to update Forecast
function updateForecast(data, unit, type) {
  weatherCards.innerHTML = '';

  let day = 0;
  let numCards = 0;
  //24 cards if hourly weather and 7 for weekly
  if(type === 'day') {
      numCards = 24;
  } else {
      numCards = 7;
  }
  for(let i = 0; i < numCards; i++) {
      let card = document.createElement('div');
      card.classList.add('card');
      //hour if hourly time and day name if weekly
      let dayName = getHour(data[day].datetime);
      if(type === 'week') {
          dayName = getDayName(data[day].datetime);
      }
      let dayTemp = data[day].temp;
      if(unit === 'f') {
          dayTemp = celciusToFahrenheit(data[day].temp);
      }
      let iconCondition = data[day].icon;
      let iconSrc = getIcon(iconCondition);
      let tempUnit = '°C';
      if(unit === 'f') {
          tempUnit = '°F';
      }
      card.innerHTML = `
              <h2 class="day-name">${dayName}</h2>
              <div class="card-icon">
                  <img src="${iconSrc}" alt="icon">
              </div>
              <div class="day-temp">
                  <h2 class="temp">${dayTemp}</h2>
                  <span class="temp-unit">${tempUnit}</span>
              </div>
      `;
      weatherCards.appendChild(card);
      day++;
  }
}

//convert celcius to fahrenheit
function celciusToFahrenheit(temp){
  return((temp * 9) / 5 + 32).toFixed(1);
}

fahrenheitBtn.addEventListener('click', () => {
  changeUnit('f');
});
celciusBtn.addEventListener('click', () => {
  changeUnit('c'); 
});

// function to change unit
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === "c") {
      celciusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
    } else {
      celciusBtn.classList.remove("active");
      fahrenheitBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

function changeBackground(condition) {
  const body = document.querySelector('body');
  let bg = " ";
  if(condition === 'Partly-cloudy-day') {
      bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  } else if (condition === 'Partly-cloudy-night') {
      bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
  } else if (condition === 'rain') { 
      bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
  } else if (condition === 'clear-day') {
      bg = "https://i.ibb.co/WGry01m/cd.jpg";
  } else if (condition === 'clear-night') {
      bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
  } else {
      bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  }
  body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`;
}

hourlyBtn.addEventListener('click', () =>{
  changeTimeSpan('hourly');
});
weekBtn.addEventListener('click', () =>{
  changeTimeSpan('week');
});

function changeTimeSpan(unit){
  if(hourlyorWeek !== unit) {
      hourlyorWeek = unit;
      if(unit === 'hourly') {
          hourlyBtn.classList.add('active');
          weekBtn.classList.remove('active');
      } else {
          hourlyBtn.classList.remove('active');
          weekBtn.classList.add('active');
      }
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}   

// function to handle search form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(location, currentUnit, hourlyorWeek);
  }
});

// function to conver celcius to fahrenheit
function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}

var currentFocus;
search.addEventListener("input", function (e) {
  removeSuggestions();
  var a,
    b,
    i,
    val = this.value;
  if (!val) {
    return false;
  }
  currentFocus = -1;

  a = document.createElement("ul");
  a.setAttribute("id", "suggestions");

  this.parentNode.appendChild(a);

  for (i = 0; i < cities.length; i++) {
    if (
      cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
    ) {
      b = document.createElement("li");
      b.innerHTML = "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
      b.innerHTML += cities[i].name.substr(val.length);
      b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
      b.addEventListener("click", function (e) {
        search.value = this.getElementsByTagName("input")[0].value;
        removeSuggestions();
      });

      a.appendChild(b);
    }
  }
});
/*execute a function presses a key on the keyboard:*/
search.addEventListener("keydown", function (e) {
  var x = document.getElementById("suggestions");
  if (x) x = x.getElementsByTagName("li");
  if (e.keyCode == 40) {
    currentFocus++;
    addActive(x);
  } else if (e.keyCode == 38) {
    currentFocus--;
    addActive(x);
  }
  if (e.keyCode == 13) {
    e.preventDefault();
    if (currentFocus > -1) {
      if (x) x[currentFocus].click();
    }
  }
});

