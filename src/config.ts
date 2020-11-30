import * as fs from "fs/promises";
import { Level, Logger } from "./lib/logger";

export enum Provider {
    GitHub = "GitHub",
    GitLab = "GitLab",
    gitea = "gitea"
};

export enum AuthFlow {
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

export async function loadConfig(logger: Logger): Promise<Config> {
    try {
        const rawUnmarshalledConfig = await fs.readFile(
            CONFIGURATION_PATH, 
            {
                encoding: CONFIGURATION_ENCODING
            }
        );
        // TODO: this could fail spectacularly downstream
        return JSON.parse(rawUnmarshalledConfig);
    } catch (error) {
        logger.log(Level.Fatal, error);
        throw "🚨 Can't read config!";
    }
}
