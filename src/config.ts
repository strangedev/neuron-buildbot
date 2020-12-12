import { CustomError } from 'defekt';
import { errors } from './lib/error';
import fs from 'fs/promises';
import { fail, okay, Result } from '@yeldirium/result';

enum Provider {
  GitHub = 'GitHub',
  GitLab = 'GitLab',
  gitea = 'gitea'
}

enum AuthFlow {
  None = 'None',
  PasswordFlow = 'PasswordFlow',
  TokenFlow = 'TokenFlow'
}

interface Config {
  port: number;
  repositoryUrl: string;
  localRepositoryPath: string;
  provider: Provider;
  authFlow: AuthFlow;
  useDockerSecrets: boolean;
}

const configurationPath = '/etc/neuron_buildbot/config.json';
const configurationEncoding = 'utf8';

const loadConfig = async function (): Promise<Result<Config, CustomError>> {
  try {
    const rawUnmarshalledConfig = await fs.readFile(
      configurationPath,
      {
        encoding: configurationEncoding
      }
    );

    return okay(JSON.parse(rawUnmarshalledConfig));
  } catch (ex: unknown) {
    return fail(new errors.UnableToLoadConfiguration(undefined, { cause: ex }));
  }
};

export type {
  Config
};
export {
  Provider,
  AuthFlow,
  loadConfig
};
