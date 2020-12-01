import { AuthCallback } from "isomorphic-git";
import { Config, Provider } from "../config";
import { Secrets } from "../secrets";
import * as GitHubFlow from "./github";
import * as GenericFlow from "./generic";
import { Result } from "../lib/result";
import { AuthenticationMisconfigured } from "./flow";

export function makeAuthCallback(config: Config, secrets: Secrets): Result<AuthCallback, AuthenticationMisconfigured> {
    switch (config.provider) {
        case Provider.GitHub:
            return GitHubFlow.makeAuthCallback(config, secrets);
        default:
            return GenericFlow.makeAuthCallback(config, secrets);
    }
}
