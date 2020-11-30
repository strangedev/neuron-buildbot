import { Config } from "../config";
import { PushEvent } from "./github_api";
import { pullRepo } from "../actions/pull_repo";

export function receivePushEvent(config: Config, event: PushEvent) {
    pullRepo(config);
}
