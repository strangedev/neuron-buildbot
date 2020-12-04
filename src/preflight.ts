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
    (await cloneRepo(config, secrets)).unpack((ex: Error): Error => {
      logger.log(Level.Fatal, '🚨 Can\'t clone the repository!');

      return ex;
    });

    // Build for the first time
    (await updateAndBuild(config, secrets, logger)).unpack((ex: Error): Error => {
      logger.log(Level.Fatal, '🚨 Initial build failed!');

      return ex;
    });
  }
  logger.log(Level.Info, '🛫 Enjoy your flight!');
};

export {
  preflight
};
