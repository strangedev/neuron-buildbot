import * as fs from "fs/promises";
import { buildNeuron } from "./actions/build_neuron";
import { cloneRepo } from "./actions/clone_repo";
import { Config } from "./config";
import { wasRepoCloned } from "./getters/repo_state";
import { Level, Logger } from "./lib/logger";
import { Secrets } from "./secrets";

export async function preflight(config: Config, secrets: Secrets, logger: Logger): Promise<void> {
    
    if (! await wasRepoCloned(config, logger)) {
        logger.log(Level.Info, "Repo does not seem to exist locally, cloning for the first time.")
        await cloneRepo(config, secrets, logger);
        logger.log(Level.Info, "Running a fresh build.");
        buildNeuron(config, logger);
    }
}
