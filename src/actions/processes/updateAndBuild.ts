import { buildNeuron } from '../atoms/buildNeuron';
import { Config } from '../../config';
import { CustomError } from 'defekt';
import { pullRepo } from '../atoms/pullRepo';
import { Secrets } from '../../secrets';
import { fail, Nil, nil, okay, Result } from '../../lib/result';
import { Level, Logger } from '../../lib/logger';

const updateAndBuild = async function (config: Config, secrets: Secrets, logger: Logger): Promise<Result<Nil, CustomError>> {
  const pull = await pullRepo(config, secrets);

  if (pull.failed) {
    logger.log(Level.Error, `💥 Cannot pull from ${config.repositoryUrl}: ${pull.error.message}`);

    return fail(pull.error);
  }
  logger.log(Level.Info, `📥 Pulled changes from ${config.repositoryUrl}.`);

  const build = buildNeuron(config);

  if (build.failed) {
    logger.log(Level.Error, `💥 Cannot build your zettelkasten: ${build.error.message}`);

    return fail(build.error);
  }
  logger.log(Level.Info, '🔨 Built zettelkasten.');

  return okay(nil);
};

export {
  updateAndBuild
};
