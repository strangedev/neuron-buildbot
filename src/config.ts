import * as fs from "fs/promises";
import { NamedError } from "./lib/error";
import { Result, Okay, Fail } from "./lib/result";

export enum Provider {
    GitHub = "GitHub",
    GitLab = "GitLab",
    gitea = "gitea"
};

export enum AuthFlow {
    None = "None",
    PasswordFlow = "PasswordFlow",
    PATFlow = "PATFlow"
}

export interface Config {
    port: number,
    repositoryURL: string,
    localRepositoryPath: string;
    provider: Provider;
    authFlow: AuthFlow;
    useDockerSecrets: boolean
}

const CONFIGURATION_PATH = "/etc/neuron_buildbot/config.json";
const CONFIGURATION_ENCODING = "utf8";

class CannotReadConfiguration extends NamedError("CannotReadConfiguration") {};

export async function loadConfig(): Promise<Result<Config, CannotReadConfiguration>> {
    try {
        const rawUnmarshalledConfig = await fs.readFile(
            CONFIGURATION_PATH, 
            {
                encoding: CONFIGURATION_ENCODING
            }
        );
        // TODO: this could fail spectacularly downstream
        return Okay(JSON.parse(rawUnmarshalledConfig));
    } catch (error) {
        return Fail(new CannotReadConfiguration(error));
    }
}
