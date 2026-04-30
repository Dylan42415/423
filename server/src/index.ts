import app from "./app";
import { logger } from "./lib/logger";
import { config, logActiveConfig } from "./config";

// Log configuration on startup
logActiveConfig(logger);

app.listen(config.server.port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port: config.server.port, env: config.server.env }, "Server listening");
});
