const searchInput = document.querySelector('.search');
const submitButton = document.querySelector('.submit-button');
const mainContainer = document.querySelector('.main-container');
// ---------------------- click addEventListener----------------------------------
const cityNameAndNumberOFdays = submitButton.addEventListener(
  'click',
  async function () {
    const writtenCityName = searchInput.value.toLowerCase();

    const selectElement = document.querySelector('.select-day');
    const selectedValue = selectElement.value;
    // createCards(selectedValue);

    // console.log(selectedValue);
    getError(writtenCityName, selectedValue);
  },
);

// ---------------------- keydown addEventListener with ----------------------------------

searchInput.addEventListener('keydown', async function (event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission

    const writtenCityName = searchInput.value.toLowerCase();
    const selectElement = document.querySelector('.select-day');
    const selectedValue = selectElement.value;
    getError(writtenCityName, selectedValue);
  }
});

//------------------ In this functiom we get the errror and display it to the user-------------------------
async function getError(writtenCityName, selectedValue) {
  if (writtenCityName.trim() === '') {
    searchInput.value = '';
    printErrorMessage('Please enter a city name.');
  } else {
    try {
      await handleCityName(writtenCityName, selectedValue);

      searchInput.value = '';
    } catch (error) {
      printErrorMessage(
        'Error retrieving weather data. Please try again later.',
      );
      console.error(error);
    }
  }
}

function printErrorMessage(message) {
  mainContainer.innerHTML = `<div class="error">${message}</div>`;
}

//----------------------- In this part of code we are fething the goecdes to get the latitude and longitude of the chosen city -----------------------------

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

  //-------------------------- In this part of code we are extacting the latitude, longitude and fething the weather data for the chosen city --------------------------
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

//-------------------------- Here is the function that fetch the weather data --------------------------

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

//------------- In this function I am creating the card dives  and add them inside the mainContainer div then handled the returned data and organize it to inseart them insid the cards -----------------
function handleDailyWeatherData(data) {
  mainContainer.innerHTML = '';

  for (let i = 0; i < data.daily.time.length; i++) {
    const time = data.daily.time[i];
    // const weathercode = data.daily.weathercode[i];
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
