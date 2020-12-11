import { assert } from 'assertthat';
import { cloneRepo } from 'src/actions/atoms/cloneRepo';
import { fail } from 'assert';
import fs from 'fs';
import path from 'path';
import TmpDir from '../shared/tmpDir';
import { AuthFlow, Provider } from 'src/config';
import { isGitRepository } from 'test/shared/git';

/* eslint-disable prefer-arrow-callback */
suite('cloneRepo', function (): void {
  setup(async function (): Promise<void> {
    this.tmpDir = await TmpDir.create();
    this.configs = {
      nonexistentRepo: {
        config: {
          port: 8_080,
          repositoryUrl: 'faulty.url',
          localRepositoryPath: this.tmpDir,
          provider: Provider.GitHub,
          authFlow: AuthFlow.None,
          useDockerSecrets: false
        },
        secrets: {}
      },
      publicRepo: {
        config: {
          port: 8_080,
          repositoryUrl: 'http://localhost:8174/public-repo.git',
          localRepositoryPath: this.tmpDir,
          provider: Provider.gitea,
          authFlow: AuthFlow.None,
          useDockerSecrets: false
        },
        secrets: {}
      },
      passwordProtectedRepo: {
        config: {
          port: 8_080,
          repositoryUrl: 'http://localhost:8174/password-protected-repo.git',
          localRepositoryPath: this.tmpDir,
          provider: Provider.gitea,
          authFlow: AuthFlow.PasswordFlow,
          useDockerSecrets: false
        },
        secrets: {
          passwordFlowOptions: {
            username: 'user',
            password: 'password'
          }
        }
      },
      tokenProtectedRepo: {
        config: {
          port: 8_080,
          repositoryUrl: 'http://localhost:8174/token-protected-repo.git',
          localRepositoryPath: this.tmpDir,
          provider: Provider.gitea,
          authFlow: AuthFlow.TokenFlow,
          useDockerSecrets: false
        },
        secrets: {
          tokenFlowOptions: {
            username: 'user',
            token: 'token'
          }
        }
      }
    };
  });

  teardown(async function (): Promise<void> {
    await TmpDir.remove(this.tmpDir);
  });

  test('fails with a nonexistent repository.', async function (): Promise<void> {
    assert.that(await isGitRepository(this.configs.nonexistentRepo.config.localRepositoryPath)).is.not.true();
    const result = await cloneRepo(this.configs.nonexistentRepo.config, this.configs.nonexistentRepo.secrets);

    assert.that(result.failed).is.true();
    assert.that(await isGitRepository(this.configs.nonexistentRepo.config.localRepositoryPath)).is.not.true();
  });

  test('clones a public repository.', async function (): Promise<void> {
    assert.that(await isGitRepository(this.configs.publicRepo.config.localRepositoryPath)).is.not.true();
    const result = await cloneRepo(this.configs.publicRepo.config, this.configs.publicRepo.secrets);

    assert.that(result.failed).is.false();
    assert.that(await isGitRepository(this.configs.publicRepo.config.localRepositoryPath)).is.true();
  });

  test('clones a password-protected repository.', async function (): Promise<void> {
    assert.that(await isGitRepository(this.configs.passwordProtectedRepo.config.localRepositoryPath)).is.not.true();

    const result = await cloneRepo(this.configs.passwordProtectedRepo.config, this.configs.passwordProtectedRepo.secrets);

    assert.that(result.failed).is.false();
    assert.that(await isGitRepository(this.configs.passwordProtectedRepo.config.localRepositoryPath)).is.true();
  });

  test('fails cloning a password-protected repository with incorrect credentials.', async function (): Promise<void> {
    assert.that(await isGitRepository(this.configs.passwordProtectedRepo.config.localRepositoryPath)).is.not.true();

    const result = await cloneRepo(this.configs.passwordProtectedRepo.config, { passwordFlowOptions: { username: 'klaus', password: 'kappa' }});

    assert.that(result.failed).is.true();
    assert.that(await isGitRepository(this.configs.passwordProtectedRepo.config.localRepositoryPath)).is.not.true();
  });

  test('clones a token-protected repository.', async function (): Promise<void> {
    fail('Not implemented.');
  });

  test('fails cloning a token-protected repository with incorrect credentials.', async function (): Promise<void> {
    fail('Not implemented.');
  });
});
