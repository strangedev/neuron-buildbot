import { fail } from 'assert';

/* eslint-disable prefer-arrow-callback */
suite('cloneRepo', function (): void {
  suiteSetup(async function (): Promise<void> {
    this.configs = {
      nonexistentRepo: {
        //
      },
      publicRepo: {
        //
      },
      passwordProtectedRepo: {
        //
      },
      tokenProtectedRepo: {
        //
      }
    };
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
