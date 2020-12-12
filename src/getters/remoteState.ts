import { Config } from '../config';
import { CustomError } from 'defekt';
import { errors } from '../lib/error';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { makeAuthCallback } from '../authFlows';
import { Secrets } from '../secrets';
import { fail, okay, Result, unpackOrCrash } from '@yeldirium/result';

const getRemoteHeadBranch = async function (config: Config, secrets: Secrets): Promise<Result<string, CustomError>> {
  try {
    const remoteInfo: any = await git.getRemoteInfo({
      http,
      onAuth: unpackOrCrash(makeAuthCallback(config, secrets)),
      url: config.repositoryUrl
    });

    return okay(remoteInfo.HEAD.replace('refs/heads/', ''));
  } catch (ex: unknown) {
    return fail(new errors.GettingRemoteInfoFailed(undefined, { cause: ex }));
  }
};

export {
  getRemoteHeadBranch
};
