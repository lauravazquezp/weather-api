import axios, { AxiosError } from "axios";
import { config } from "../config";
import type { WeatherData } from "../types";

const VISUAL_CROSSING_BASE =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    const response = await axios.get(`${VISUAL_CROSSING_BASE}/${encodeURIComponent(city)}`, {
      params: {
        unitGroup: "metric",
        key: config.visualCrossingApiKey,
        contentType: "json",
        include: "current,days",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = response.data as any;

    const current = raw.currentConditions;
    const weather: WeatherData = {
      location: raw.resolvedAddress ?? city,
      timezone: raw.timezone ?? "UTC",
      current: {
        temp: current.temp,
        feelslike: current.feelslike,
        humidity: current.humidity,
        windspeed: current.windspeed,
        conditions: current.conditions,
        icon: current.icon,
      },
      forecast: (raw.days ?? []).slice(0, 7).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (day: any) => ({
          datetime: day.datetime,
          tempmax: day.tempmax,
          tempmin: day.tempmin,
          conditions: day.conditions,
          icon: day.icon,
        })
      ),
    };

    return weather;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      const status = err.response.status;
      if (status === 400 || status === 404) {
        const error = new Error(`City not found: ${city}`);
        (error as NodeJS.ErrnoException).code = "CITY_NOT_FOUND";
        throw Object.assign(error, { httpStatus: 404 });
      }
      const upstreamError = new Error("Weather service unavailable");
      throw Object.assign(upstreamError, { httpStatus: 502 });
    }
    const serverError = new Error("Failed to fetch weather data");
    throw Object.assign(serverError, { httpStatus: 500 });
  }
}
