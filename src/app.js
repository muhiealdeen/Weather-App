//----------------------- In this part of code we fething the goecdes to get the latitude and longitude of the chosen city -----------------------------

const searchInput = document.querySelector('.search');
const submitButton = document.querySelector('.submit-button');
const cityNameAndNumberOFdays = submitButton.addEventListener(
  'click',
  async function () {
    const writtenCityName = searchInput.value.toLowerCase();

    const selectElement = document.querySelector('.select-day');
    const selectedValue = selectElement.value;
    //--------------------------grabbing the main container div and create the dives card and add them inside it
    const mainContainer = document.querySelector('.maine-container');
    mainContainer.innerHTML = '';
    for (let i = 0; i < selectedValue; i++) {
      const card = document.createElement('div');
      card.textContent = `card ${i + 1}`;
      card.id = `card${i + 1}`;
      mainContainer.appendChild(card);
    }

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
    const keys = Object.entries(data);
    const dailyWeatherInfo = keys[9][1];
    console.log(Object.entries(dailyWeatherInfo));
    // keys.forEach((key) => {
    //   console.log(key);
    // });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// const time = data.daily;
// console.log(time);
