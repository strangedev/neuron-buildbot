type StringWriter = (message: string) => void;

enum Level {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Fatal = 'Fatal'
}

interface Stringable {
  toString: () => string;
}

class Logger {
  private readonly write: StringWriter;

  public constructor (writer?: StringWriter) {
    // eslint-disable-next-line no-console
    this.write = writer ?? console.log;
  }

  public log (level: Level, message: Stringable): void {
    const currentTime = new Date();

    this.write(`[${currentTime.toISOString()}][${level}] ${message}`);
  }
}

export type {
  StringWriter,
  Stringable
};
export {
  Logger
};
