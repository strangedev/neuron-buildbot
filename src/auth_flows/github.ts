import { AuthCallback } from "isomorphic-git";
import { AuthFlow, Config } from "../config";
import { Result, Okay, Fail } from "../lib/result";
import { Secrets } from "../secrets";
import { AuthenticationMisconfigured } from "./flow";

export function makeAuthCallback(config: Config, secrets: Secrets): Result<AuthCallback, AuthenticationMisconfigured> {
    switch (config.authFlow) {
        case AuthFlow.PasswordFlow:
            if (secrets.passwordFlowOptions === undefined) {
                return Fail(new AuthenticationMisconfigured("passwordFlowOptions need to be set in order to use the password flow."));
            }
            return Okay(() => {
                return {
                    username: secrets.passwordFlowOptions?.username,
                    password: secrets.passwordFlowOptions?.password
                };
            });
        case AuthFlow.PATFlow:
            if (secrets.patFlowOptions === undefined) {
                return Fail(new AuthenticationMisconfigured("patFlowOptions need to be set in order to use the PAT flow."));
            }
            return Okay(() => {
                return {
                    username: secrets.patFlowOptions?.token
                };
            });
        case AuthFlow.None:
            return Okay(() => ({}));
        default:
            return Fail(new AuthenticationMisconfigured("No such auth flow."));
    }
}