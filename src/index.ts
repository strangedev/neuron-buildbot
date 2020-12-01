import express from "express";
import { Logger, Level } from "./lib/logger";
import { fail } from "./lib/fail";
import { loadConfig } from "./config";
import { loadSecrets } from "./secrets";
import { preflight } from "./preflight";
import { registerRoutes } from "./routes";

const app = express();
const logger = new Logger();

loadConfig()
    .then(async (maybeConfig) => {
        const config = maybeConfig.unpack(error => {
            logger.log(Level.Fatal, "🚨 Can't read config!");
            return error;
        });

        const secrets = (await loadSecrets(config)).unpack(error => {
            logger.log(Level.Warning, "🔒 No secrets were provided. This will not work for private repositories.");
            return {};
        });

        await preflight(config, secrets, logger);
        registerRoutes(config, secrets, logger, app);
        app.listen(config.port, () => {
            logger.log(Level.Info, "👂 Listening for push events.");
        });
    }).catch(error => fail(logger, error));
