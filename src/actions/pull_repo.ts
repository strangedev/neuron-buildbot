import * as fs from "fs";
import * as http from "isomorphic-git/http/node";
import { pull } from "isomorphic-git";
import { Config } from "../config";
import { Logger, Level } from "../lib/logger";
import { Secrets } from "../secrets";
import { makeAuthCallback } from "../auth_flows";


export async function pullRepo(config: Config, secrets: Secrets, logger: Logger) {
    logger.log(Level.Info, `📥 Pulling the newest version of ${config.repositoryURL}.`);
    await pull({
        fs,
        http,
        dir: config.localRepositoryPath,
        onAuth: makeAuthCallback(config, secrets)
    });
}
