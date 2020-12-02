import { die } from './lib/fail';
import express from 'express';
import { loadConfig } from './config';
import { preflight } from './preflight';
import { registerRoutes } from './routes';
import { Level, Logger } from './lib/logger';
import { loadSecrets, Secrets } from './secrets';

const logger = new Logger();

loadConfig().
  then(async (configResult): Promise<void> => {
    const config = configResult.unpack((error): Error => {
      logger.log(Level.Fatal, '🚨 Can\'t read config!');

      return error;
    });

    const secrets = (await loadSecrets(config)).unpack((): Secrets => {
      logger.log(Level.Warning, '🔒 No secrets were provided. This will not work for private repositories.');

      return {};
    });

    await preflight(config, secrets, logger);

    const app = express();

    app.use(express.json());
    registerRoutes(config, secrets, logger, app);
    app.listen(config.port, (): void => {
      logger.log(Level.Info, '👂 Listening for push events.');
    });
  }).catch((ex): void => die(logger, ex));
