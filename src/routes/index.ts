import { Application } from "express";
import { config } from "process";
import { Config } from "../config";
import { Logger } from "../lib/logger";
import { Secrets } from "../secrets";
import * as onPush from "./on_push";

export function registerRoutes(config: Config, secrets: Secrets, logger: Logger, app: Application): void {
    onPush.registerRoute(config, secrets, logger, app);
}
