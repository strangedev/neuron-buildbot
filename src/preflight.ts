import { cloneRepo } from './actions/atoms/cloneRepo';
import { Config } from './config';
import { Secrets } from './secrets';
import { updateAndBuild } from './actions/processes/updateAndBuild';
import { wasRepoCloned } from './getters/repoState';
import { Level, Logger } from './lib/logger';

const preflight = async function (config: Config, secrets: Secrets, logger: Logger): Promise<void> {
  logger.log(Level.Info, '🚧 Running preflight sequence.');
  if (!await wasRepoCloned(config)) {
    // Initial cloning of the repo
    logger.log(Level.Info, '🚧 Repo does not seem to exist locally.');
    logger.log(Level.Info, `📥 Cloning ${config.repositoryUrl}.`);

    (await cloneRepo(config, secrets)).orCrash();
  }

  // Check if the update and build facilites work so that we
  // don't have to trigger a webhook.
  (await updateAndBuild(config, secrets, logger)).orCrash();

  logger.log(Level.Info, '🛫 Enjoy your flight!');
};

export {
  preflight
};
