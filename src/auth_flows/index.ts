import { AuthCallback } from "isomorphic-git";
import { Config, Provider } from "../config";
import { Secrets } from "../secrets";
import * as GitHubFlow from "./github";
import * as GenericFlow from "./generic";

export function makeAuthCallback(config: Config, secrets: Secrets): AuthCallback {
    switch (config.provider) {
        case Provider.GitHub:
            return GitHubFlow.makeAuthCallback(config, secrets);
        default:
            return GenericFlow.makeAuthCallback(config, secrets);
    }
}
