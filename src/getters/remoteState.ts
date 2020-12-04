import { Config } from '../config';
import { CustomError } from 'defekt';
import { errors } from '../lib/error';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { makeAuthCallback } from '../auth_flows';
import { Secrets } from '../secrets';
import { fail, okay, Result } from '../lib/result';

const getRemoteHeadRef = async function (config: Config, secrets: Secrets): Promise<Result<string, CustomError>> {
  try {
    const remoteInfo: any = await git.getRemoteInfo({
      http,
      onAuth: makeAuthCallback(config, secrets).orCrash(),
      url: config.repositoryUrl
    });

    return okay(remoteInfo.HEAD);
  } catch (ex: unknown) {
    return fail(new errors.GettingRemoteInfoFailed(undefined, { cause: ex }));
  }
};

export {
  getRemoteHeadRef
};
