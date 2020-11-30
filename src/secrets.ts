import fs from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { Level, Logger } from "./lib/logger";
import { Config } from "./config";


export interface PasswordFlowOptions {
    username: string;
    password: string;
}

export interface PATFlowOptions {
    username?: string;
    token: string;
}

export interface Secrets {
    passwordFlowOptions?: PasswordFlowOptions;
    patFlowOptions?: PATFlowOptions;
}

const DOCKER_SECRETS_PATH = "/run/secrets/neuron_buildbot";
const USER_SECRETS_FILE = ".neuron_buildbot/secrets.json"
const SECRETS_ENCODING = "utf8";

export async function loadSecrets(config: Config, logger: Logger): Promise<Secrets> {
    let secretsPath: string;
    if (config.useDockerSecrets) {
        secretsPath = DOCKER_SECRETS_PATH;
    } else {
        secretsPath = join(homedir(), USER_SECRETS_FILE);
    }
    try {
        const rawUnmarshalledSecrets = await fs.readFile(
            secretsPath,
            {
                encoding: SECRETS_ENCODING
            }
        )
        // TODO: this could fail spectacularly downstream
        return JSON.parse(rawUnmarshalledSecrets);
    } catch (error) {
        // we don't actually need any secrets in case the repo is public
        logger.log(Level.Error, error);
        logger.log(Level.Warning, "🔒 No secrets were provided. This will not work for private repositories.");
        return {};
    }
}