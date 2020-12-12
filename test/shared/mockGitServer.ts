import path from 'path';
import shell from 'shelljs';

interface GitHttpServerOptions {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GIT_HTTP_MOCK_SERVER_PORT?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GIT_HTTP_MOCK_SERVER_ROUTE?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GIT_HTTP_MOCK_SERVER_ROOT?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GIT_HTTP_MOCK_SERVER_ALLOW_ORIGIN?: string;
}

const fixturesPath = path.join(__dirname, 'fixtures');

const setOptions = (options: GitHttpServerOptions): void => {
  shell.env.GIT_HTTP_MOCK_SERVER_PORT = options.GIT_HTTP_MOCK_SERVER_PORT ?? '8174';
  shell.env.GIT_HTTP_MOCK_SERVER_ROUTE = options.GIT_HTTP_MOCK_SERVER_ROUTE ?? '/';
  shell.env.GIT_HTTP_MOCK_SERVER_ROOT = options.GIT_HTTP_MOCK_SERVER_ROOT ?? fixturesPath;
  shell.env.GIT_HTTP_MOCK_SERVER_ALLOW_ORIGIN = options.GIT_HTTP_MOCK_SERVER_ALLOW_ORIGIN ?? '*';
};

const start = async (options: GitHttpServerOptions): Promise<void> => new Promise((resolve, reject): void => {
  shell.cd(fixturesPath);
  setOptions(options);
  shell.exec('npx git-http-mock-server start', (code): void => {
    if (code === 0) {
      resolve();
    } else {
      reject(code);
    }
  });
});

const stop = async (options: GitHttpServerOptions): Promise<void> => new Promise((resolve, reject): void => {
  shell.cd(fixturesPath);
  setOptions(options);
  shell.exec('npx git-http-mock-server stop', (code): void => {
    if (code === 0) {
      resolve();
    } else {
      reject(code);
    }
  });
});

export type {
  GitHttpServerOptions
};

export default {
  fixturesPath,
  start,
  stop
};
