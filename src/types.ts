export interface CurrentConditions {
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  conditions: string;
  icon: string;
}

export interface ForecastDay {
  datetime: string;
  tempmax: number;
  tempmin: number;
  conditions: string;
  icon: string;
}

export interface WeatherData {
  location: string;
  timezone: string;
  current: CurrentConditions;
  forecast: ForecastDay[];
}

export interface WeatherResponse {
  source: "cache" | "api";
  data: WeatherData;
}

export interface ErrorResponse {
  error: string;
  status: number;
}
