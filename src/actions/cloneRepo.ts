import { Config } from '../config';
import { CustomError } from 'defekt';
import { errors } from '../lib/error';
import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { makeAuthCallback } from '../auth_flows';
import { Secrets } from '../secrets';
import { fail, nil, Nil, okay, Result } from '../lib/result';

const cloneRepo = async function (config: Config, secrets: Secrets): Promise<Result<Nil, CustomError>> {
  try {
    await fs.promises.mkdir(config.localRepositoryPath);
  } catch {
    // The directory might already exist.
  }
  try {
    await git.clone({
      fs,
      http,
      dir: config.localRepositoryPath,
      url: config.repositoryUrl,
      onAuth: makeAuthCallback(config, secrets).orCrash()
    });

    return okay(nil);
  } catch (ex: unknown) {
    return fail(new errors.CannotCloneRepository(undefined, { cause: ex }));
  }
};

export {
  cloneRepo
};
