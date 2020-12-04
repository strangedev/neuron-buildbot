import { Config } from '../config';
import { Secrets } from '../secrets';
import { unmarshalPushEvent } from './githubApi';
import { updateAndBuild } from '../actions/processes/updateAndBuild';
import { Application, Request, Response } from 'express';
import { Level, Logger } from '../lib/logger';

export const registerRoute = function (config: Config, secrets: Secrets, logger: Logger, app: Application): void {
  app.post('/pushed', async (request: Request, response: Response): Promise<void> => {
    logger.log(Level.Info, '❗ Received a push event.');

    const unmarshalResult = unmarshalPushEvent(request.body);

    if (unmarshalResult.failed) {
      logger.log(Level.Error, `⁉️  Cannot unmarshal request: ${unmarshalResult.error.message}`);
      response.status(400).send();

      return;
    }

    // Already send a response as not to time out
    response.status(202).send();

    await updateAndBuild(config, secrets, logger);
  });
};
