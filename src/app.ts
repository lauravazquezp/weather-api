import express, { Request, Response, NextFunction } from "express";
import { rateLimiter } from "./middleware/rateLimiter";
import weatherRouter from "./routes/weather";

const app = express();

app.use(express.json());
app.use(rateLimiter);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/weather", weatherRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found", status: 404 });
});

// Global error handler
app.use((err: Error & { httpStatus?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.httpStatus ?? 500;
  console.error(`[Error] ${status}:`, err.message);
  res.status(status).json({ error: err.message, status });
});

export default app;
