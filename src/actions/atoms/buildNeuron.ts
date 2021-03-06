import { Config } from '../../config';
import { CustomError } from 'defekt';
import { errors } from '../../lib/error';
import shell from 'shelljs';
import { fail, okay, Result } from '@yeldirium/result';

const buildNeuron = function (config: Config): Result<string, CustomError> {
  try {
    const stdout = shell.exec(
      `neuron -d ${config.localRepositoryPath} gen`,
      {
        silent: true
      }
    );

    return okay(stdout.replace(/\n/ug, '\\n') || 'Nothing was written to stdout while building.');
  } catch (ex: unknown) {
    return fail(new errors.NeuronBuildError(undefined, { cause: ex }));
  }
};

export {
  buildNeuron
};
