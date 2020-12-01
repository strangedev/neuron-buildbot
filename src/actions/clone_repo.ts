import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as http from "isomorphic-git/http/node";
import * as git from "isomorphic-git";
import { Config } from "../config";
import { makeAuthCallback } from "../auth_flows";
import { Secrets } from "../secrets";
import { Okay, Result, Nil, Fail, nil } from "../lib/result";
import { NamedError } from "../lib/error";

class CannotCloneRepository extends NamedError("CannotCloneRepository") {};

export async function cloneRepo(config: Config, secrets: Secrets): Promise<Result<Nil, CannotCloneRepository>> {
    try {
        await fsPromises.mkdir(config.localRepositoryPath);
    } catch (error) {
        // the directory might already exist
    }
    try {
        await git.clone({
            fs,
            http,
            dir: config.localRepositoryPath,
            url: config.repositoryURL,
            onAuth: makeAuthCallback(config, secrets).orCrash()
        })
        return Okay(nil);
    } catch (error) {
        return Fail(new CannotCloneRepository(error));
    }
}
