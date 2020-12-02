import { AuthCallback } from 'isomorphic-git';
import { CustomError } from 'defekt';
import { errors } from '../lib/error';
import { Secrets } from '../secrets';
import { Config, Provider } from '../config';
import { fail, Result } from '../lib/result';
import * as GenericFlow from './generic';

const makeAuthCallback = function (config: Config, secrets: Secrets): Result<AuthCallback, CustomError> {
  switch (config.provider) {
    case Provider.GitHub:
    case Provider.GitLab:
    case Provider.gitea: {
      return GenericFlow.makeAuthCallback(config, secrets);
    }
    default:
      return fail(new errors.ProviderIsUnknown());
  }
};

export {
  makeAuthCallback
};
