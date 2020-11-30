import { Config } from "../config";
import { Level, Logger } from "../lib/logger";
import shell from "shelljs";

export function buildNeuron(config: Config, logger: Logger) {
    logger.log(Level.Info, "🛠️ Building your zettelkasten.")
    try {
        const stdout = shell.exec(
            `neuron -d ${config.localRepositoryPath} rib`,
            {
                silent: true
            }
        );
        logger.log(Level.Info, stdout.replace(/\n/g, "\\n") ?? "Nothing was written to stdout while building.");   
    } catch (error) {
        logger.log(Level.Error, error);
    }
}
