import { Application } from 'express';
import { Config } from '../config';
import { Logger } from '../lib/logger';
import { Secrets } from '../secrets';
import * as onPush from './onPush';

const registerRoutes = function (config: Config, secrets: Secrets, logger: Logger, app: Application): void {
  onPush.registerRoute(config, secrets, logger, app);
};

export {
  registerRoutes
};
