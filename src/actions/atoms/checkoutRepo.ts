import { Config } from '../../config';
import { CustomError } from 'defekt';
import { errors } from '../../lib/error';
import fs from 'fs';
import { getRemoteHeadBranch } from '../../getters/remoteState';
import git from 'isomorphic-git';
import { RemoteName } from '../../defaults';
import { Secrets } from '../../secrets';
import { fail, isFailed, okay, Result } from '@yeldirium/result';

const checkoutRepoWithDetachedHead = async function (config: Config, secrets: Secrets): Promise<Result<void, CustomError>> {
  try {
    const defaultBranchResult = await getRemoteHeadBranch(config, secrets);

    if (isFailed(defaultBranchResult)) {
      return fail(defaultBranchResult.error);
    }

    await git.checkout({
      fs,
      dir: config.localRepositoryPath,
      remote: RemoteName,
      ref: `${RemoteName}/${defaultBranchResult.value}`
    });

    return okay();
  } catch (ex: unknown) {
    return fail(new errors.CheckingOutBranchFailed(undefined, { cause: ex }));
  }
};

export {
  checkoutRepoWithDetachedHead
};
