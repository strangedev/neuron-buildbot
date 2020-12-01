import { Config } from "../config";
import { PushEvent, unmarshalPushEvent } from "./github_api";
import { pullRepo } from "../actions/pull_repo";
import { Application, NextFunction, Request, Response } from "express";
import { Level, Logger } from "../lib/logger";
import { Secrets } from "../secrets";
import { buildNeuron } from "../actions/build_neuron";
import { Okay, Result, nil, Nil, Fail } from "../lib/result";

export function registerRoute(config: Config, secrets: Secrets, logger: Logger, app: Application): void {
    app.post("/pushed", async (request: Request, response: Response, next: NextFunction) => {
        logger.log(Level.Info, "❗ Received a push event.");
        
        const unmarshalResult = unmarshalPushEvent(request.body)
        let pushEvent: PushEvent;
        if (unmarshalResult.failed) {
            logger.log(Level.Error, `⁉️ Cannot unmarshal request: ${unmarshalResult.error}`);
            response.status(400).send();
            return;
        }
        pushEvent = unmarshalResult.value;
        
        const routeHandlerResult = (await pullAndBuild(config, secrets, logger, pushEvent))
        if (routeHandlerResult.failed) {
            response.status(500).send();
            return;
        }  
        
    });
}

async function pullAndBuild(config: Config, secrets: Secrets, logger: Logger, event: PushEvent): Promise<Result<Nil, Error>> {
    logger.log(Level.Info, `📥 Pulling the newest version of ${config.repositoryURL}.`);
    const pull = await pullRepo(config, secrets);
    if (pull.failed) {
        logger.log(Level.Error, `💥 Cannot pull from ${config.repositoryURL}: ${pull.error}`);
        return Fail(pull.error);
    }
    
    const build = await buildNeuron(config);
    if (build.failed) {
        logger.log(Level.Error, `💥 Cannot build your zettelkasten: ${build.error}`);
        return Fail(build.error);
    }

    return Okay(nil);
}
