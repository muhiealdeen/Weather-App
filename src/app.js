const searchInput = document.querySelector('.search');
const submitButton = document.querySelector('.submit-button');

const cityNameAndNumberOFdays = submitButton.addEventListener('click', () => {
  const writtenCityName = searchInput.value.toLowerCase();

  const selectElement = document.querySelector('.select-day');
  const selectedValue = selectElement.value;

  console.log(selectedValue);
  handleCityName(writtenCityName, selectedValue);
});

async function handleCityName(cityName, numberOfDays) {
  console.log(cityName);
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
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    const mainUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum&current_weather=true&forecast_days=${numberOfDays}&timezone=auto`;

    await getData(mainUrl);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network error:${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
