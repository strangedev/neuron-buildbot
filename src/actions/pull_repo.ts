import * as fs from "fs";
import * as http from "isomorphic-git/http/node";
import { fastForward, pull } from "isomorphic-git";
import { Config } from "../config";
import { Secrets } from "../secrets";
import { makeAuthCallback } from "../auth_flows";
import { Okay, Result, Nil, nil, Fail } from "../lib/result";
import { NamedError } from "../lib/error";

class CannotPullRepository extends NamedError("CannotPullRepository") {};

export async function pullRepo(config: Config, secrets: Secrets): Promise<Result<Nil, CannotPullRepository>>{
    try {
        await fastForward({
            fs,
            http,
            dir: config.localRepositoryPath,
            onAuth: makeAuthCallback(config, secrets).orCrash()
        });
        return Okay(nil);
    } catch (error) {
        return Fail(new CannotPullRepository(error));   
    }
}
