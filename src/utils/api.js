import axios from 'axios';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const GEO_URL = 'https://nominatim.openstreetmap.org/reverse';

// NEW: Function to get City Name from Coordinates
export const getCityName = async (lat, lon) => {
  try {
    const res = await axios.get(`${GEO_URL}?lat=${lat}&lon=${lon}&format=json`);
    // Fallback chain: City -> Town -> Village -> Default
    return res.data.address.city || res.data.address.town || res.data.address.village || "Unknown Location";
  } catch (error) {
    console.error("Geocoding failed", error);
    return "Location Detected";
  }
};

export const fetchWeatherData = async (lat, lon, unit = 'celsius', date) => {
  const dateParam = `&start_date=${date}&end_date=${date}`;
  const weather = await axios.get(`${FORECAST_URL}?latitude=${lat}&longitude=${lon}${dateParam}&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto&temperature_unit=${unit}`);
  const aqi = await axios.get(`${AQI_URL}?latitude=${lat}&longitude=${lon}${dateParam}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,us_aqi&timezone=auto`);
  return { weather: weather.data, aqi: aqi.data };
};

export const fetchHistoricalWeather = async (lat, lon, start, end) => {
  const weather = await axios.get(`${ARCHIVE_URL}?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`);
  const aqi = await axios.get(`${AQI_URL}?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=pm10,pm2_5&timezone=auto`);
  return { weather: weather.data, aqi: aqi.data };
};