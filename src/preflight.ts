import { buildNeuron } from './actions/buildNeuron';
import { cloneRepo } from './actions/cloneRepo';
import { Config } from './config';
import { Secrets } from './secrets';
import { wasRepoCloned } from './getters/repo_state';
import { Level, Logger } from './lib/logger';

const preflight = async function (config: Config, secrets: Secrets, logger: Logger): Promise<void> {
  logger.log(Level.Info, '🚧 Running preflight sequence.');
  if (!await wasRepoCloned(config)) {
    // Initial cloning of the repo
    logger.log(Level.Info, '🚧 Repo does not seem to exist locally.');
    logger.log(Level.Info, `📥 Cloning ${config.repositoryUrl}.`);
    (await cloneRepo(config, secrets)).unpack((error): Error => {
      logger.log(Level.Fatal, '🚨 Can\'t clone the repository!');

      return error;
    });

    // Build for the first time
    buildNeuron(config).unpack((error): Error => {
      logger.log(Level.Fatal, '🚨 Neuron is not working!');

      return error;
    });
    logger.log(Level.Info, '🔨 Built zettelkasten.');
  }
  logger.log(Level.Info, '🛫 Enjoy your flight!');
};

export {
  preflight
};
