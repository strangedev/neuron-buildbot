import { buildNeuron } from '../actions/buildNeuron';
import { Config } from '../config';
import { pullRepo } from '../actions/pullRepo';
import { Secrets } from '../secrets';
import { unmarshalPushEvent } from './githubApi';
import { Application, Request, Response } from 'express';
import { fail, Nil, nil, okay, Result } from '../lib/result';
import { Level, Logger } from '../lib/logger';

const pullAndBuild = async function (config: Config, secrets: Secrets, logger: Logger): Promise<Result<Nil, Error>> {
  const pull = await pullRepo(config, secrets);

  if (pull.failed) {
    logger.log(Level.Error, `💥 Cannot pull from ${config.repositoryUrl}: ${pull.error.message}`);

    return fail(pull.error);
  }
  logger.log(Level.Info, `📥 Pulled the newest version of ${config.repositoryUrl}.`);

  const build = buildNeuron(config);

  if (build.failed) {
    logger.log(Level.Error, `💥 Cannot build your zettelkasten: ${build.error.message}`);

    return fail(build.error);
  }
  logger.log(Level.Info, '🔨 Built zettelkasten.');

  return okay(nil);
};

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

    await pullAndBuild(config, secrets, logger);
  });
};
