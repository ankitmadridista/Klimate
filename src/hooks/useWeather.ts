import { useQuery } from "@tanstack/react-query";
import { weatherAPI } from "@/api/weather";
import type { Coordinates } from "@/api/types";

export const WEATHER_KEYS = {
  weather: (coords: Coordinates) => ["weather", coords] as const,
  forecast: (coords: Coordinates) => ["forecast", coords] as const,
  location: (coords: Coordinates) => ["location", coords] as const,
  search: (query: string) => ["location-search", query] as const,
  airPollution: (coords: Coordinates) => ["air-pollution", coords] as const,
  airPollutionForecast: (coords: Coordinates) => ["air-pollution-forecast", coords] as const,
  airPollutionHistory: (coords: Coordinates, start: number, end: number) => ["air-pollution-history", coords, start, end] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => (coordinates ? weatherAPI.getForecast(coordinates) : null),
    enabled: !!coordinates,
  });
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length >= 3,
  });
}

export function useAirPollutionQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.airPollution(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => coordinates ? weatherAPI.getCurrentAirPollution(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useAirPollutionForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.airPollutionForecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => coordinates ? weatherAPI.getForecastAirPollution(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useAirPollutionHistoryQuery(coordinates: Coordinates | null, start: number, end: number) {
  return useQuery({
    queryKey: WEATHER_KEYS.airPollutionHistory(coordinates ?? { lat: 0, lon: 0 }, start, end),
    queryFn: () => coordinates ? weatherAPI.getHistoricalAirPollution(coordinates, start, end) : null,
    enabled: !!coordinates && start > 0 && end > 0,
  });
}