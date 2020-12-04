import { buildNeuron } from '../atoms/buildNeuron';
import { checkoutRepoWithDetachedHead } from '../atoms/checkoutRepo';
import { Config } from '../../config';
import { CustomError } from 'defekt';
import { fetchRepo } from '../atoms/fetchRepo';
import { Secrets } from '../../secrets';
import { fail, Nil, nil, okay, Result } from '../../lib/result';
import { Level, Logger } from '../../lib/logger';

const updateAndBuild = async function (config: Config, secrets: Secrets, logger: Logger): Promise<Result<Nil, CustomError>> {
  const fetch = await fetchRepo(config, secrets);

  if (fetch.failed) {
    logger.log(Level.Error, `💥 Cannot fetch from ${config.repositoryUrl}: ${fetch.error.message}`);

    return fail(fetch.error);
  }
  logger.log(Level.Info, `📥 Fetched the changes from ${config.repositoryUrl}.`);

  const checkout = await checkoutRepoWithDetachedHead(config, secrets);

  if (checkout.failed) {
    logger.log(Level.Error, `💥 Cannot checkout remote HEAD: ${checkout.error.message}`);

    return fail(checkout.error);
  }
  logger.log(Level.Info, `📥 Checked out ${config.repositoryUrl}'s HEAD.`);

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
