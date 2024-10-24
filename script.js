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
 sunSet = document.querySelector('.Sunset');


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
        currentCity = data.currentCity;        
        getWeatherData(data.city, currentUnit, hourlyorWeek);
    }).catch((err) => console.log('Error'));
}
getPublicIp();

//function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    fetch(
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json',
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

      })//.catch((err) => alert('Error'));      
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