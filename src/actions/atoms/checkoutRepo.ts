import { Config } from '../../config';
import { CustomError } from 'defekt';
import { errors } from '../../lib/error';
import fs from 'fs';
import { getRemoteHeadBranch } from '../../getters/remoteState';
import git from 'isomorphic-git';
import { RemoteName } from '../../defaults';
import { Secrets } from '../../secrets';
import { fail, nil, Nil, okay, Result } from '../../lib/result';

const checkoutRepoWithDetachedHead = async function (config: Config, secrets: Secrets): Promise<Result<Nil, CustomError>> {
  try {
    const defaultBranchResult = await getRemoteHeadBranch(config, secrets);

    if (defaultBranchResult.failed) {
      return fail(defaultBranchResult.error);
    }

    await git.checkout({
      fs,
      dir: config.localRepositoryPath,
      remote: RemoteName,
      ref: `${RemoteName}/${defaultBranchResult.value}`
    });

    return okay(nil);
  } catch (ex: unknown) {
    return fail(new errors.CheckingOutBranchFailed(undefined, { cause: ex }));
  }
};

export {
  checkoutRepoWithDetachedHead
};
