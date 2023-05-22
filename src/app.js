//----------------------- In this part of code we fething the goecdes to get the latitude and longitude of the chosen city -----------------------------

const searchInput = document.querySelector('.search');
const submitButton = document.querySelector('.submit-button');
const mainContainer = document.querySelector('.maine-container');

const cityNameAndNumberOFdays = submitButton.addEventListener(
  'click',
  async function () {
    const writtenCityName = searchInput.value.toLowerCase();

    const selectElement = document.querySelector('.select-day');
    const selectedValue = selectElement.value;
    createCards(selectedValue);

    // console.log(selectedValue);
    await handleCityName(writtenCityName, selectedValue);
  },
);

async function handleCityName(cityName, numberOfDays) {
  // console.log(cityName);
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;

  async function getCityLocationData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network error:${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  try {
    const data = await getCityLocationData(geoUrl);
    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;
    // console.log('Latitude:', latitude);
    // console.log('Longitude:', longitude);
    const mainUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum&current_weather=true&forecast_days=${numberOfDays}&timezone=auto`;

    const requiredWeatherData = await getData(mainUrl);
    return requiredWeatherData;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

//-------------------------- In this part of code we fething the weather data for the chosen city --------------------------

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network error:${response.status}`);
    }
    const data = await response.json();

    console.log(data);
    await handleDailyWeatherData(data);
    // return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//------------- in this function I will deal with returned data ad organize it to inseart them insid the cards -----------------
function handleDailyWeatherData(data) {
  mainContainer.innerHTML = '';

  for (let i = 0; i < data.daily.time.length; i++) {
    const time = data.daily.time[i];
    const weathercode = data.daily.weathercode[i];
    const temperatureMax = data.daily.temperature_2m_max[i];
    const temperatureMin = data.daily.temperature_2m_min[i];
    const sunrise = data.daily.sunrise[i];
    const sunset = data.daily.sunset[i];
    const precipitationSum = data.daily.precipitation_sum[i];
    const rainSum = data.daily.rain_sum[i];
    const showersSum = data.daily.showers_sum[i];
    const snowfallSum = data.daily.snowfall_sum[i];
    const card = document.createElement('div');

    card.innerHTML = `
      <h3>Day ${i + 1}</h3>
      <p>Date: ${time}</p>
      <p>Weather Code: ${weathercode}</p>
      <p>Max Temperature: ${temperatureMax}</p>
      <p>Min Temperature: ${temperatureMin}</p>
      <p>Sunrise: ${sunrise}</p>
      <p>Sunset: ${sunset}</p>
      <p>Precipitation Sum: ${precipitationSum}</p>
      <p>Rain Sum: ${rainSum}</p>
      <p>Showers Sum: ${showersSum}</p>
      <p>Snowfall Sum: ${snowfallSum}</p>
    `;

    card.className = `card`;
    mainContainer.appendChild(card);
  }
}

//--------------------------Here I am creating the card dives  and add them inside the mainContainer div------------------------
function createCards(numberOfDays) {
  mainContainer.innerHTML = '';
  for (let i = 0; i < numberOfDays; i++) {
    const card = document.createElement('div');

    card.textContent = `Card ${i + 1}`;
    card.className = `card`;
    mainContainer.appendChild(card);
  }
}
