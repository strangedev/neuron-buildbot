import { assert } from 'assertthat';
import { Logger } from '../../src/lib/logger';
import { preflight } from '../../src/preflight';
import { Secrets } from '../../src/secrets';
import TmpDir from '../shared/tmpDir';
import { AuthFlow, Config, Provider } from '../../src/config';

suite('preflight', (): void => {
  let logger: Logger;
  let tmpDir: string;

  setup(async (): Promise<void> => {
    logger = new Logger();
    tmpDir = await TmpDir.create();
  });

  teardown(async (): Promise<void> => {
    await TmpDir.remove(tmpDir);
  });

  test(`crashes when it can't clone the repository.`, async (): Promise<void> => {
    const config: Config = {
      port: 8_080,
      repositoryUrl: 'faulty.url',
      localRepositoryPath: tmpDir,
      provider: Provider.GitHub,
      authFlow: AuthFlow.None,
      useDockerSecrets: false
    };

    await assert.that(async (): Promise<void> => {
      await preflight(config, {}, logger);
    }).is.throwingAsync();
  });

  test(`crashes when it can't updateAndBuild, in this test due to misconfiguration.`, async (): Promise<void> => {
    const config: Config = {
      port: 8_080,
      repositoryUrl: 'faulty.url',
      localRepositoryPath: tmpDir,
      provider: Provider.GitHub,
      authFlow: AuthFlow.PasswordFlow,
      useDockerSecrets: false
    };
    const secrets: Secrets = {
      passwordFlowOptions: undefined,
      tokenFlowOptions: undefined
    };

    await assert.that(async (): Promise<void> => {
      await preflight(config, secrets, logger);
    }).is.throwingAsync();
  });
});
