import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import type { AirPollutionData } from "@/api/types";
import { getAQILabel, getAQIColor } from "@/lib/aqi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AirQualityHistoryProps {
  data: AirPollutionData;
}

export function AirQualityHistory({ data }: AirQualityHistoryProps) {
  const chartData = data.list.map((item) => ({
    time: format(new Date(item.dt * 1000), "MMM dd"),
    aqi: item.main.aqi,
    pm25: item.components.pm2_5,
    pm10: item.components.pm10,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { time: string; aqi: number; pm25: number; pm10: number } }> }) => {
    if (active && payload && payload.length) {
      const aqi = payload[0].payload.aqi;
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="text-sm font-medium">{payload[0].payload.time}</p>
          <p className={`text-sm font-semibold ${getAQIColor(aqi)}`}>
            AQI: {aqi} - {getAQILabel(aqi)}
          </p>
          <p className="text-xs text-muted-foreground">PM2.5: {payload[0].payload.pm25.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">PM10: {payload[0].payload.pm10.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Quality History (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              domain={[1, 5]} 
              ticks={[1, 2, 3, 4, 5]}
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="aqi" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
