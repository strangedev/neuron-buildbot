import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as http from "isomorphic-git/http/node";
import * as git from "isomorphic-git";
import { Config } from "../config";
import { makeAuthCallback } from "../auth_flows";
import { Secrets } from "../secrets";
import { Level, Logger } from "../lib/logger";

export async function cloneRepo(config: Config, secrets: Secrets, logger: Logger) {
    logger.log(Level.Info, `📥 Cloning ${config.repositoryURL}.`);
    try {
        await fsPromises.mkdir(config.localRepositoryPath);
        await git.clone({
            fs,
            http,
            dir: config.localRepositoryPath,
            url: config.repositoryURL,
            onAuth: makeAuthCallback(config, secrets)
        })
    } catch (error) {
        logger.log(Level.Error, error);
        throw "Can't clone the repository.";
    }
}
