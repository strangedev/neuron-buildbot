import { Config } from "../config";
import { PushEvent, unmarshalPushEvent } from "./github_api";
import { pullRepo } from "../actions/pull_repo";
import { Application, Request, Response } from "express";
import { Level, Logger } from "../lib/logger";
import { Secrets } from "../secrets";
import { buildNeuron } from "../actions/build_neuron";

export function registerRoute(config: Config, secrets: Secrets, logger: Logger, app: Application): void {
    app.post("/pushed", async (request: Request, response: Response) => {
        let pushEvent: PushEvent;
        try {
            pushEvent = unmarshalPushEvent(request.body);
        } catch (error) {
            logger.log(Level.Error, error);
            return response.status(400).send();
        }
        try {
            await receivePushEvent(config, secrets, logger, pushEvent);    
        } catch (error) {
            logger.log(Level.Error, error);
            return response.status(500).send();
        }
        
    });
}

async function receivePushEvent(config: Config, secrets: Secrets, logger: Logger, event: PushEvent) {
    await pullRepo(config, secrets, logger);
    await buildNeuron(config, logger);
}
