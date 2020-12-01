export interface StringWriter {
    (message: string): void
}

export enum Level {
    Info = "Info",
    Warning = "Warning",
    Error = "Error",
    Fatal = "Fatal"
}

export interface Stringable {
    toString(): string;
}

export class Logger {
    private write: StringWriter

    constructor(writer?: StringWriter) {
        this.write = writer ?? console.log;
    }

    log(level: Level, message: Stringable): void {
        const currentTime = new Date();
        this.write(`[${currentTime.toISOString()}][${level}] ${message}`);
    }
}
