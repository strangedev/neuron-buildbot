import { Config } from "../config";
import { Logger } from "../lib/logger";
import shell from "shelljs";

export async function buildNeuron(config: Config, logger: Logger) {
    shell.exec(`neuron -d ${config.localRepositoryPath} rib`);
}
