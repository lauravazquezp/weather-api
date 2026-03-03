import app from "./app";
import { config } from "./config";
import { closeRedis } from "./services/cacheService";

const server = app.listen(config.port, () => {
  console.log(`Weather API running on port ${config.port}`);
});

async function shutdown() {
  console.log("Shutting down...");
  server.close(async () => {
    await closeRedis();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
