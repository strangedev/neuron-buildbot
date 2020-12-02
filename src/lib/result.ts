import { errors } from './error';
import { exit } from 'process';

class Result<TValue, TError extends Error> {
  private readonly internalValue?: TValue;

  private readonly internalError?: TError;

  private checked: boolean;

  public constructor (value?: TValue, error?: TError) {
    this.checked = false;
    this.internalValue = value;
    this.internalError = error;
  }

  public get failed (): boolean {
    this.checked = true;

    return this.internalValue === undefined;
  }

  public get value (): TValue {
    if (!this.checked) {
      throw new errors.ResultNotChecked();
    }
    if (this.internalValue === undefined) {
      throw new errors.ValueDoesNotExist();
    }

    return this.internalValue;
  }

  public get error (): TError {
    if (!this.checked) {
      throw new errors.ResultNotChecked();
    }
    if (this.internalError === undefined) {
      throw new errors.ErrorDoesNotExist();
    }

    return this.internalError;
  }

  public unpack (recovery: RecoveryFunction<TValue, TError>): TValue {
    if (this.failed) {
      const recoveryResult = recovery(this.error);

      if (recoveryResult instanceof Error) {
        // eslint-disable-next-line no-console
        console.log(`Unrecoverable error: ${recoveryResult.message}`);
        exit(1);
      } else {
        return recoveryResult;
      }
    } else {
      return this.value;
    }
  }

  public orCrash (): TValue {
    return this.unpack((error): TError => error);
  }
}

type RecoveryFunction<TValue, TError extends Error> = (maybe: TError) => TValue | Error;

const okay = function<TValue, TError extends Error> (value: TValue): Result<TValue, TError> {
  return new Result<TValue, TError>(value, undefined);
};

const fail = function<TValue, TError extends Error> (error: TError): Result<TValue, TError> {
  return new Result<TValue, TError>(undefined, error);
};

type Nil = symbol;
const nil = Symbol('nil');

export type {
  RecoveryFunction,
  Nil
};
export {
  Result,
  okay,
  fail,
  nil
};
