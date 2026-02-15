import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_KEY = process.env.VITE_OPEN_WEATHER_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { endpoint, ...params } = req.query;
  
  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Endpoint is required' });
  }

  try {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    queryParams.append('appid', API_KEY);

    const url = `${endpoint}?${queryParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: 'OpenWeather API error', 
        details: errorData 
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
