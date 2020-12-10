import { fail } from 'assert';
import TmpDir from '../shared/tmpDir';
import { AuthFlow, Provider } from 'src/config';

/* eslint-disable prefer-arrow-callback */
suite('cloneRepo', function (): void {
  setup(async function (): Promise<void> {
    this.tmpDir = await TmpDir.create();
    this.configs = {
      nonexistentRepo: {
        port: 8_080,
        repositoryUrl: 'faulty.url',
        localRepositoryPath: this.tmpDir,
        provider: Provider.GitHub,
        authFlow: AuthFlow.None,
        useDockerSecrets: false
      },
      publicRepo: {
        port: 8_080,
        repositoryUrl: 'http://localhost:8147/public-repo.git',
        localRepositoryPath: this.tmpDir,
        provider: Provider.gitea,
        authFlow: AuthFlow.None,
        useDockerSecrets: false
      },
      passwordProtectedRepo: {
        port: 8_080,
        repositoryUrl: 'http://localhost:8147/password-protected-repo.git',
        localRepositoryPath: this.tmpDir,
        provider: Provider.gitea,
        authFlow: AuthFlow.PasswordFlow,
        useDockerSecrets: false
      },
      tokenProtectedRepo: {
        port: 8_080,
        repositoryUrl: 'http://localhost:8147/token-protected-repo.git',
        localRepositoryPath: this.tmpDir,
        provider: Provider.gitea,
        authFlow: AuthFlow.TokenFlow,
        useDockerSecrets: false
      }
    };
  });

  teardown(async function (): Promise<void> {
    await TmpDir.remove(this.tmpDir);
  });

  test('fails with a nonexistent repository.', async function (): Promise<void> {
    fail('Not implemented.');
  });

  test('clones a public repository.', async function (): Promise<void> {
    fail('Not implemented.');
  });

  test('clones a password-protected repository.', async function (): Promise<void> {
    fail('Not implemented.');
  });

  test('fails cloning a password-protected repository with incorrect credentials.', async function (): Promise<void> {
    fail('Not implemented.');
  });

  test('clones a token-protected repository.', async function (): Promise<void> {
    fail('Not implemented.');
  });

  test('fails cloning a token-protected repository with incorrect credentials.', async function (): Promise<void> {
    fail('Not implemented.');
  });
});
