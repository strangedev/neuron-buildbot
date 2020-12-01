import { AuthCallback } from "isomorphic-git";
import { Config } from "../config";
import { NamedError } from "../lib/error";
import { Result } from "../lib/result";
import { Secrets } from "../secrets";

export class AuthenticationMisconfigured extends NamedError("AuthenticationMisconfigured") {};

export interface AuthCallbackFactory {
    (config: Config, secrets: Secrets): Result<AuthCallback, AuthenticationMisconfigured>;
}
