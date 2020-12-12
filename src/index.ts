import { die } from './lib/die';
import express from 'express';
import { loadConfig } from './config';
import { loadSecrets } from './secrets';
import { preflight } from './preflight';
import { registerRoutes } from './routes';
import { isFailed, unpackOrDefault } from '@yeldirium/result';
import { Level, Logger } from './lib/logger';

const logger = new Logger();

(async (): Promise<void> => {
  const configResult = await loadConfig();

  if (isFailed(configResult)) {
    logger.log(Level.Fatal, '🚨 Can\'t read config!');

    return die(logger, configResult.error.message);
  }
  const config = configResult.value;

  const secretsResult = await loadSecrets(config);

  if (isFailed(secretsResult)) {
    logger.log(Level.Warning, '🔒 No secrets were provided. This will not work for private repositories.');
  }
  const secrets = unpackOrDefault({}, secretsResult);

  await preflight(config, secrets, logger);

  const app = express();

  app.use(express.json());
  registerRoutes(config, secrets, logger, app);
  app.listen(config.port, (): void => {
    logger.log(Level.Info, '👂 Listening for push events.');
  });
})().catch((ex: Error): void => die(logger, ex.message));
