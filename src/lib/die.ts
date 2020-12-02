import { exit } from 'process';
import { Level, Logger } from './logger';

const die = function (logger: Logger, message: string): void {
  logger.log(Level.Fatal, message);
  exit(1);
};

export {
  die
};
