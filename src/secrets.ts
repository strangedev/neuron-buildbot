import { Config } from './config';
import { CustomError } from 'defekt';
import { errors } from './lib/error';
import fs from 'fs/promises';
import { homedir } from 'os';
import path from 'path';
import { fail, okay, Result } from './lib/result';

export interface PasswordFlowOptions {
  username: string;
  password: string;
}

export interface TokenFlowOptions {
  username: string;
  token: string;
}

export interface Secrets {
  passwordFlowOptions?: PasswordFlowOptions;
  patFlowOptions?: TokenFlowOptions;
}

const DockerSecretsPath = '/run/secrets/neuron_buildbot';
const UserSecretsFile = '.neuron_buildbot/secrets.json';
const SecretsEncoding = 'utf8';

export const loadSecrets = async function (config: Config): Promise<Result<Secrets, CustomError>> {
  const secretsPath = config.useDockerSecrets ? DockerSecretsPath : path.join(homedir(), UserSecretsFile);

  try {
    const rawUnmarshalledSecrets = await fs.readFile(
      secretsPath,
      {
        encoding: SecretsEncoding
      }
    );

    return okay(JSON.parse(rawUnmarshalledSecrets));
  } catch (ex: unknown) {
    return fail(new errors.UnableToLoadSecrets(undefined, { cause: ex }));
  }
};
