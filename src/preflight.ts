import { buildNeuron } from "./actions/build_neuron";
import { cloneRepo } from "./actions/clone_repo";
import { Config } from "./config";
import { wasRepoCloned } from "./getters/repo_state";
import { Level, Logger } from "./lib/logger";
import { Secrets } from "./secrets";

export async function preflight(config: Config, secrets: Secrets, logger: Logger): Promise<void> {
    logger.log(Level.Info, "🚧 Running preflight sequence.");
    if (! await wasRepoCloned(config)) {
        // initial cloning of the repo
        logger.log(Level.Info, "🚧 Repo does not seem to exist locally.");
        logger.log(Level.Info, `📥 Cloning ${config.repositoryURL}.`);
        (await cloneRepo(config, secrets)).unpack(error => {
            logger.log(Level.Fatal, "🚨 Can't clone the repository!");
            return error;
        });
        // build for the first time
        const buildLog = buildNeuron(config).unpack(error => {
            logger.log(Level.Fatal, "🚨 Neuron is not working!");
            return error;
        });
        logger.log(Level.Info, buildLog);
    }
    logger.log(Level.Info, "🛫 Enjoy your flight!");
}
