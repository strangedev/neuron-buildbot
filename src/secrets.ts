import fs from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { Config } from "./config";
import { Result, Okay, Fail } from "./lib/result";

export interface PasswordFlowOptions {
    username: string;
    password: string;
}

export interface PATFlowOptions {
    username: string;
    token: string;
}

export interface Secrets {
    passwordFlowOptions?: PasswordFlowOptions;
    patFlowOptions?: PATFlowOptions;
}

const DOCKER_SECRETS_PATH = "/run/secrets/neuron_buildbot";
const USER_SECRETS_FILE = ".neuron_buildbot/secrets.json"
const SECRETS_ENCODING = "utf8";

export class UnableToLoadSecrets extends Error {};

export async function loadSecrets(config: Config): Promise<Result<Secrets, UnableToLoadSecrets>> {
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
        return Okay(JSON.parse(rawUnmarshalledSecrets));
    } catch (error) {
        return Fail(new UnableToLoadSecrets(error));
    }
}