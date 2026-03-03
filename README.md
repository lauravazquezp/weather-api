# Weather API

A REST API that fetches and caches weather data from a 3rd party provider, built as part of the [roadmap.sh Weather API Wrapper Service](https://roadmap.sh/projects/weather-api-wrapper-service) project.

## Stack

- **Node.js + Express + TypeScript**
- **Visual Crossing API** — free weather data provider
- **Redis** — in-memory cache (12-hour TTL per city)
- **Docker Compose** — runs Redis locally
- **express-rate-limit** — 100 requests / 15 min per IP

## Getting Started

### 1. Start Redis

```bash
docker compose up -d
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your `VISUAL_CROSSING_API_KEY`. Get a free key at [visualcrossing.com](https://www.visualcrossing.com/weather-api).

### 3. Install dependencies

```bash
npm install
```

### 4. Run the server

```bash
# development (watch mode)
npm run dev

# production
npm run build && npm start
```

The server starts on port `3000` by default.

## API

### `GET /weather/:city`

Returns current conditions and a 7-day forecast for the given city.

**Example:**
```bash
curl http://localhost:3000/weather/london
```

**Response:**
```json
{
  "source": "api",
  "data": {
    "location": "London, England, United Kingdom",
    "timezone": "Europe/London",
    "current": {
      "temp": 12.3,
      "feelslike": 10.1,
      "humidity": 78,
      "windspeed": 20.5,
      "conditions": "Partially cloudy",
      "icon": "partly-cloudy-day"
    },
    "forecast": [...]
  }
}
```

The `source` field is `"cache"` on subsequent requests within the 12-hour window.

### `GET /health`

Returns `{ "status": "ok" }`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `VISUAL_CROSSING_API_KEY` | — | **Required.** Visual Crossing API key |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window in ms (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window per IP |

## Error Responses

| Status | Meaning |
|---|---|
| `400` | City parameter missing |
| `404` | City not found |
| `429` | Rate limit exceeded |
| `502` | Upstream weather service error |
| `500` | Internal server error |

> Coded with [Claude Code](https://claude.ai/code) assistance.
