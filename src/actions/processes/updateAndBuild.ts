import { buildNeuron } from '../atoms/buildNeuron';
import { checkoutRepoWithDetachedHead } from '../atoms/checkoutRepo';
import { Config } from '../../config';
import { CustomError } from 'defekt';
import { fetchRepo } from '../atoms/fetchRepo';
import { Secrets } from '../../secrets';
import { fail, isFailed, okay, Result } from '@yeldirium/result';
import { Level, Logger } from '../../lib/logger';

const updateAndBuild = async function (config: Config, secrets: Secrets, logger: Logger): Promise<Result<void, CustomError>> {
  const fetch = await fetchRepo(config, secrets);

  if (isFailed(fetch)) {
    logger.log(Level.Error, `💥 Cannot fetch from ${config.repositoryUrl}: ${fetch.error.message}`);

    return fail(fetch.error);
  }
  logger.log(Level.Info, `📥 Fetched the changes from ${config.repositoryUrl}.`);

  const checkout = await checkoutRepoWithDetachedHead(config, secrets);

  if (isFailed(checkout)) {
    logger.log(Level.Error, `💥 Cannot checkout remote HEAD: ${checkout.error.message}`);

    return fail(checkout.error);
  }
  logger.log(Level.Info, `📥 Checked out ${config.repositoryUrl}'s HEAD.`);

  const build = buildNeuron(config);

  if (isFailed(build)) {
    logger.log(Level.Error, `💥 Cannot build your zettelkasten: ${build.error.message}`);

    return fail(build.error);
  }
  logger.log(Level.Info, '🔨 Built zettelkasten.');

  return okay();
};

export {
  updateAndBuild
};
