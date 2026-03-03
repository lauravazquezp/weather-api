import { Router, Request, Response, NextFunction } from "express";
import { getCached, setCached } from "../services/cacheService";
import { fetchWeather } from "../services/weatherService";

const router = Router();

router.get("/:city", async (req: Request, res: Response, next: NextFunction) => {
  const city = String(req.params["city"] ?? "").trim();

  if (!city) {
    res.status(400).json({ error: "City parameter is required", status: 400 });
    return;
  }

  const cacheKey = city.toLowerCase();

  try {
    const cached = await getCached(cacheKey);
    if (cached) {
      res.json({ source: "cache", data: cached });
      return;
    }

    const data = await fetchWeather(city);
    await setCached(cacheKey, data);

    res.json({ source: "api", data });
  } catch (err) {
    next(err);
  }
});

export default router;
