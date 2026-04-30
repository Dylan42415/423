import pino from "pino";
import { config } from "../config";

const isProduction = config.server.env === "production";

export const logger = pino({
  level: config.logging.level,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "*.groqApiKey",
    "*.password",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
