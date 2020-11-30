import express from "express";
import { Logger, Level } from "./lib/logger";
import { loadConfig } from "./config";
import { loadSecrets } from "./secrets";
import { preflight } from "./preflight";
import { registerRoutes } from "./routes";

const app = express();
const port = 8080;

const logger = new Logger();
loadConfig(logger)
    .then(async (config) => ({
        config,
        secrets: await loadSecrets(config, logger)
    }))
    .then(async ({config, secrets}) => {
        await preflight(config, secrets, logger);
        registerRoutes(config, secrets, logger, app);
        app.listen(port, () => {
            logger.log(Level.Info, "Server started.");
        });
    })
