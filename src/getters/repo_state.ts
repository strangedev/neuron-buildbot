import fs from "fs/promises";

import { Config } from "../config";

/**
 * For an array of booleans, checks that all of them are true.
 * @param values An array of booleans
 */
function allTrue(values: boolean[]): boolean {
    return values.reduce((next, acc) => next && acc, true);
} 

/**
 * Rudimentary check to see if the repository configured in config was cloned before.
 * This does not guarantee the local repository is sane to work with.
 * @param config The application config
 */
export async function wasRepoCloned(config: Config): Promise<boolean> {
    const localRepositoryDirExists = fs.stat(config.localRepositoryPath)
        .then(stats => stats.isDirectory());
    const localRepositoryDirHasGitSubdir = fs.stat(config.localRepositoryPath + "/.git")
        .then(stats => stats.isDirectory());
    
    return Promise.all([localRepositoryDirExists, localRepositoryDirHasGitSubdir])
        .then(allTrue);
}
