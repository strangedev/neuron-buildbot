import { CustomError } from 'defekt';
import { errors } from '../lib/error';
import { Secrets } from '../secrets';
import { AuthCallback, GitAuth } from 'isomorphic-git';
import { AuthFlow, Config } from '../config';
import { fail, okay, Result } from '../lib/result';

const makeAuthCallback = function (config: Config, secrets: Secrets): Result<AuthCallback, CustomError> {
  switch (config.authFlow) {
    case AuthFlow.PasswordFlow:
      if (secrets.passwordFlowOptions === undefined) {
        return fail(new errors.AuthenticationMisconfigured('passwordFlowOptions need to be set in order to use the password flow.'));
      }

      return okay((): GitAuth => ({
        username: secrets.passwordFlowOptions?.username,
        password: secrets.passwordFlowOptions?.password
      }));
    case AuthFlow.TokenFlow:
      if (secrets.patFlowOptions === undefined) {
        return fail(new errors.AuthenticationMisconfigured('patFlowOptions need to be set in order to use the PAT flow.'));
      }

      return okay((): GitAuth => ({
        username: secrets.patFlowOptions?.username,
        password: secrets.patFlowOptions?.token
      }));
    case AuthFlow.None:
      return okay((): GitAuth => ({}));
    default:
      return fail(new errors.AuthenticationMisconfigured('No such auth flow', { data: { authFlow: config.authFlow }}));
  }
};

export {
  makeAuthCallback
};
