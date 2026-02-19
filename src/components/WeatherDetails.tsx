import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset, Compass, Gauge } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData, AirPollutionData } from "@/api/types";
import { getAQILabel, getAQIColor, getAQIBgColor } from "@/lib/aqi";

interface WeatherDetailsProps {
  data: WeatherData;
  airQuality?: AirPollutionData;
}

export function WeatherDetails({ data, airQuality }: WeatherDetailsProps) {
  const { wind, main, sys } = data;

  // Format time using date-fns
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };

  // Convert wind degree to direction
  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  const currentAQI = airQuality?.list[0];

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Wind Direction",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
    },
  ];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid gap-6 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.title}
              className="flex items-center gap-3 rounded-lg border p-4"
            >
              <detail.icon className={`h-5 w-5 ${detail.color}`} />
              <div>
                <p className="text-sm font-medium leading-none">
                  {detail.title}
                </p>
                <p className="text-sm text-muted-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>

        {currentAQI && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Air Quality</h3>
            <div className="grid gap-3">
              <div className={`flex items-center justify-between rounded-lg border p-4 ${getAQIBgColor(currentAQI.main.aqi)}`}>
                <div>
                  <p className="text-sm font-medium">AQI</p>
                  <p className={`text-lg font-bold ${getAQIColor(currentAQI.main.aqi)}`}>
                    {getAQILabel(currentAQI.main.aqi)}
                  </p>
                </div>
                <div className={`text-2xl font-bold ${getAQIColor(currentAQI.main.aqi)}`}>
                  {currentAQI.main.aqi}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between rounded border p-2">
                  <span className="text-muted-foreground">PM2.5</span>
                  <span className="font-medium">{currentAQI.components.pm2_5.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <span className="text-muted-foreground">PM10</span>
                  <span className="font-medium">{currentAQI.components.pm10.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}