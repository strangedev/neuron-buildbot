import { Config } from '../../config';
import { CustomError } from 'defekt';
import { errors } from '../../lib/error';
import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { makeAuthCallback } from '../../authFlows';
import { Secrets } from '../../secrets';
import { fail, nil, Nil, okay, Result } from '../../lib/result';

const fetchRepo = async function (config: Config, secrets: Secrets): Promise<Result<Nil, CustomError>> {
  try {
    await git.fetch({
      fs,
      http,
      onAuth: makeAuthCallback(config, secrets).orCrash(),
      dir: config.localRepositoryPath
    });

    return okay(nil);
  } catch (ex: unknown) {
    return fail(new errors.FetchingRepositoryFailed(undefined, { cause: ex }));
  }
};

export {
  fetchRepo
};
