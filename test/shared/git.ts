import fs from 'fs';
import path from 'path';

const isGitRepository = async function (localPath: string): Promise<boolean> {
  try {
    const dirStat = await fs.promises.stat(localPath);
    const gitDirStat = await fs.promises.stat(path.join(localPath, '.git'));

    return dirStat.isDirectory() && gitDirStat.isDirectory();
  } catch {
    return false;
  }
};

export {
  isGitRepository
};
