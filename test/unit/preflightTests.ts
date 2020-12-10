/* eslint-disable prefer-arrow-callback */
import { ChildProcess } from 'child_process';
import fs from 'fs';
import { Logger } from '../../src/lib/logger';
import os from 'os';
import path from 'path';
import { preflight } from '../../src/preflight';
import shell from 'shelljs';
import { assert, stub } from 'sinon';
import { AuthFlow, Provider } from '../../src/config';

suite('preflight', function (): void {
  this.timeout(8_000);

  setup(async function (): Promise<void> {
    this.logger = new Logger();
    this.tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'test-'));
    this.configs = {
      broken: {
        port: 8_080,
        repositoryUrl: 'faulty.url',
        localRepositoryPath: this.tmpDir,
        provider: Provider.GitHub,
        authFlow: AuthFlow.None,
        useDockerSecrets: false
      },
      working: {
        port: 8_080,
        repositoryUrl: 'https://github.com/strangedev/test-zettels.git',
        localRepositoryPath: this.tmpDir,
        provider: Provider.GitHub,
        authFlow: AuthFlow.None,
        useDockerSecrets: false
      }
    };
  });

  teardown(async function (): Promise<void> {
    await fs.promises.rm(this.tmpDir, { recursive: true, force: true });
  });

  test('crashes when it can\'t clone the repository.', async function (): Promise<void> {
    const fakeExit = stub(process, 'exit');

    await preflight(this.configs.broken, {}, this.logger);
    assert.called(fakeExit);

    fakeExit.restore();
  });

  test('crashes when it can\'t updateAndBuild.', async function (): Promise<void> {
    const fakeExit = stub(process, 'exit');
    const fakeShellExec = stub(shell, 'exec');

    fakeShellExec.callsFake((): ChildProcess => {
      throw new Error('Fake error');
    });

    await preflight(this.configs.working, {}, this.logger);
    assert.called(fakeShellExec);
    assert.called(fakeExit);

    fakeExit.restore();
    fakeShellExec.restore();
  });
});
