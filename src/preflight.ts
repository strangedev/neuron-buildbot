import { buildNeuron } from "./actions/build_neuron";
import { cloneRepo } from "./actions/clone_repo";
import { Config } from "./config";
import { wasRepoCloned } from "./getters/repo_state";
import { Level, Logger } from "./lib/logger";
import { Secrets } from "./secrets";

export async function preflight(config: Config, secrets: Secrets, logger: Logger): Promise<void> {
    logger.log(Level.Info, "🚧 Running preflight checks.");
    if (! await wasRepoCloned(config, logger)) {
        logger.log(Level.Info, "🚧 Repo does not seem to exist locally.");
        await cloneRepo(config, secrets, logger);
        buildNeuron(config, logger);
    }
    logger.log(Level.Info, "🛫 Enjoy your flight!");
}
