const isProduction = import.meta.env.PROD;

export const API_CONFIG = {
  BASE_URL: isProduction ? "/api/weather" : "https://api.openweathermap.org/data/2.5",
  GEO: isProduction ? "/api/weather" : "http://api.openweathermap.org/geo/1.0",
  API_KEY: isProduction ? "" : import.meta.env.VITE_OPEN_WEATHER_API_KEY,
  DEFAULT_PARAMS: {
    units: "metric",
    ...(isProduction ? {} : { appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY }),
  },
  USE_PROXY: isProduction,
};