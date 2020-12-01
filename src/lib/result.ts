import { exit } from "process";
import { NamedError } from "./error";

export class MaybeNotChecked extends NamedError("MaybeNotChecked") {};
export class ErrorDoesNotExist extends NamedError("ErrorDoesNotExist") {};
export class ValueDoesNotExist extends NamedError("ValueDoesNotExist") {};

export class Result<V, E extends Error> {
    private _value?: V;
    private _error?: E;
    private checked: boolean;

    constructor(value?: V, error?: E) {
        this.checked = false;
        this._value = value;
        this._error = error;
    }

    get failed(): boolean {
        this.checked = true;
        return this._value === undefined;
    }

    get value(): V {
        if (!this.checked) {
            throw new MaybeNotChecked;
        }
        if (this._value === undefined) {
            throw new ValueDoesNotExist;
        }
        return this._value;
    }

    get error(): E {
        if (!this.checked) {
            throw new MaybeNotChecked;
        }
        if (this._error === undefined) {
            throw new ErrorDoesNotExist;
        }
        return this._error;
    }

    unpack(recovery: RecoveryFunction<V, E>): V {
        if (this.failed) {
            const recoveryResult = recovery(this.error);
            if (recoveryResult instanceof Error) {
                console.log(`Unrecoverable error: ${recoveryResult}`);
                exit(1);
            } else {
                return recoveryResult;
            }
        } else {
            return this.value;
        }
    }

    orCrash(): V {
        return this.unpack(error => error);
    }
}

export interface RecoveryFunction<V, E extends Error> {
    (maybe: E): V | Error;
}

export function Okay<V, E extends Error>(value: V): Result<V, E> {
    return new Result<V, E>(value, undefined);
}

export function Fail<V, E extends Error>(error: E): Result<V, E> {
    return new Result<V, E>(undefined, error);
}

export type Nil = null;
export const nil = null;