import { API_CONFIG } from "./config";
import type {
  WeatherData,
  ForecastData,
  GeocodingResponse,
  Coordinates,
} from "./types";

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    if (API_CONFIG.USE_PROXY) {
      const searchParams = new URLSearchParams({
        endpoint,
        ...Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ),
      });
      return `${API_CONFIG.PROXY_URL}?${searchParams.toString()}`;
    }
    
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ),
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const endpoint = `${API_CONFIG.BASE_URL}/weather`;
    const url = this.createUrl(endpoint, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: "metric",
    });
    return this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const endpoint = `${API_CONFIG.BASE_URL}/forecast`;
    const url = this.createUrl(endpoint, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: "metric",
    });
    return this.fetchData<ForecastData>(url);
  }

  async reverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const endpoint = `${API_CONFIG.GEO}/reverse`;
    const url = this.createUrl(endpoint, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: "1",
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const endpoint = `${API_CONFIG.GEO}/direct`;
    const url = this.createUrl(endpoint, {
      q: query,
      limit: "5",
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();