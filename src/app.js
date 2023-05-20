const mainUrl =
  'https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=4.89&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum&current_weather=true&forecast_days=16&timezone=auto';

async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network error:${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
getData(mainUrl)
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
