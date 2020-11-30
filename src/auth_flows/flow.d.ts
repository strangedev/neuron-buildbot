import { AuthCallback } from "isomorphic-git";
import { Config } from "../config";
import { Secrets } from "../secrets";

export interface AuthCallbackFactory {
    (config: Config, secrets: Secrets): AuthCallback;
}
