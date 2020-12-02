import { Application } from 'express';
import { Config } from '../config';
import { Logger } from '../lib/logger';
import { Secrets } from '../secrets';
import * as onPush from './on_push';

const registerRoutes = async function (config: Config, secrets: Secrets, logger: Logger, app: Application): Promise<void> {
  onPush.registerRoute(config, secrets, logger, app);
};

export {
  registerRoutes
};
