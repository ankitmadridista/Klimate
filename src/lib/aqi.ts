export const getAQILabel = (aqi: number): string => {
  const labels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  return labels[aqi - 1] || "Unknown";
};

export const getAQIColor = (aqi: number): string => {
  const colors = [
    "text-green-500",
    "text-yellow-500", 
    "text-orange-500",
    "text-red-500",
    "text-purple-500"
  ];
  return colors[aqi - 1] || "text-gray-500";
};

export const getAQIBgColor = (aqi: number): string => {
  const colors = [
    "bg-green-500/10",
    "bg-yellow-500/10",
    "bg-orange-500/10",
    "bg-red-500/10",
    "bg-purple-500/10"
  ];
  return colors[aqi - 1] || "bg-gray-500/10";
};
