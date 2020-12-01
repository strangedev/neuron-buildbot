import { Config } from "../config";
import shell from "shelljs";
import { Result, Okay, Fail } from "../lib/result";
import { NamedError } from "../lib/error";

class NeuronBuildError extends NamedError("NeuronBuildError") {};

export function buildNeuron(config: Config): Result<string, NeuronBuildError> {
    try {
        const stdout = shell.exec(
            `neuron -d ${config.localRepositoryPath} rib`,
            {
                silent: true
            }
        );  
        return Okay(stdout.replace(/\n/g, "\\n") ?? "Nothing was written to stdout while building.");
    } catch (error) {
        return Fail(new NeuronBuildError(error));
    }
}
