import { Config } from '../config';
import fs from 'fs';

/**
 * Rudimentary check to see if the repository configured in config was cloned before.
 * This does not guarantee the local repository is sane to work with.
 * @param config The application config
 */
const wasRepoCloned = async function (config: Config): Promise<boolean> {
  try {
    return await fs.promises.stat(`${config.localRepositoryPath}/.git`).
      then((stats): boolean => stats.isDirectory());
  } catch {
    return false;
  }
};

export {
  wasRepoCloned
};
