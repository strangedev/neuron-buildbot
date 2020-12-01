import { exit } from "process";
import { Level, Logger } from "./logger";

export function fail(logger: Logger, message: string) {
    logger.log(Level.Fatal, message);
    exit(1);
}
