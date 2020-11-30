import express from "express";
import { Logger, Level } from "./lib/logger";
import { loadConfig } from "./config";
import { loadSecrets } from "./secrets";
import { preflight } from "./preflight";
import { registerRoutes } from "./routes";

const app = express();
const logger = new Logger();

loadConfig(logger)
    .then(async (config) => {
        const secrets = await loadSecrets(config, logger);
        await preflight(config, secrets, logger);
        registerRoutes(config, secrets, logger, app);
        app.listen(config.port, () => {
            logger.log(Level.Info, "👂 Listening for push events.");
        });
    });
