import { Config } from '../config';
import { CustomError } from 'defekt';
import { errors } from '../lib/error';
import { fastForward } from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import { makeAuthCallback } from '../auth_flows';
import { Secrets } from '../secrets';
import { fail, nil, Nil, okay, Result } from '../lib/result';

const pullRepo = async function (config: Config, secrets: Secrets): Promise<Result<Nil, CustomError>> {
  try {
    await fastForward({
      fs,
      http,
      dir: config.localRepositoryPath,
      onAuth: makeAuthCallback(config, secrets).orCrash()
    });

    return okay(nil);
  } catch (ex: unknown) {
    return fail(new errors.CannotPullRepository(undefined, { cause: ex }));
  }
};

export {
  pullRepo
};
