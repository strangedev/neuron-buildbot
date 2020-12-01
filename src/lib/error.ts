export class ErrorClass extends Error {}

export function NamedError(name: string): typeof ErrorClass {
    const foo = class extends Error {
        stackTraceLimit: number = 10;
        constructor(message?: string | undefined) {
            super(message)
            this.name = name;
        }
    };
    return foo;
}
