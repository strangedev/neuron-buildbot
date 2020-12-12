import { Config } from '../../config';
import { CustomError } from 'defekt';
import { errors } from '../../lib/error';
import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { makeAuthCallback } from '../../authFlows';
import { RemoteName } from '../../defaults';
import { Secrets } from '../../secrets';
import { fail, okay, Result, unpackOrCrash } from '@yeldirium/result';

const cloneRepo = async function (config: Config, secrets: Secrets): Promise<Result<undefined, CustomError>> {
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
      onAuth: unpackOrCrash(makeAuthCallback(config, secrets)),
      remote: RemoteName
    });

    return okay();
  } catch (ex: unknown) {
    return fail(new errors.CloningRepositoryFailed(undefined, { cause: ex }));
  }
};

export {
  cloneRepo
};
