import fs from "fs/promises";
import fsCallbacks from "fs";

import { Config } from "../config";
import { Level, Logger } from "../lib/logger";

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
    try {
        return await fs.stat(config.localRepositoryPath + "/.git").then(stats => stats.isDirectory())
    } catch (error) {
        return false;
    }
}
