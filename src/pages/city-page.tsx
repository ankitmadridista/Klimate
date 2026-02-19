import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { CurrentWeather } from "../components/CurrentWeather";
import { useForecastQuery, useWeatherQuery, useAirPollutionQuery, useAirPollutionForecastQuery, useAirPollutionHistoryQuery } from "@/hooks/useWeather";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { HourlyTemperature } from "@/components/HourlyTemperature";
import { WeatherDetails } from "@/components/WeatherDetails";
import { WeatherForecast } from "@/components/WeatherForecast";
import { AirQualityHistory } from "@/components/AirQualityHistory";

export function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const airPollutionQuery = useAirPollutionQuery(coordinates);
  const airPollutionForecastQuery = useAirPollutionForecastQuery(coordinates);
  
  // Get last 7 days of historical data
  const now = Math.floor(Date.now() / 1000);
  const sevenDaysAgo = now - (7 * 24 * 60 * 60);
  const airPollutionHistoryQuery = useAirPollutionHistoryQuery(coordinates, sevenDaysAgo, now);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div className="flex gap-2">
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} />
        <HourlyTemperature data={forecastQuery.data} />
        <div className="grid gap-6 md:grid-cols-2">
          <WeatherDetails 
            data={weatherQuery.data} 
            airQuality={airPollutionQuery.data ?? undefined}
          />
          <WeatherForecast 
            data={forecastQuery.data} 
            airQualityForecast={airPollutionForecastQuery.data ?? undefined}
          />
        </div>
        
        {airPollutionHistoryQuery.data && (
          <AirQualityHistory data={airPollutionHistoryQuery.data} />
        )}
      </div>
    </div>
  );
}