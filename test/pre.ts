/* eslint-disable @typescript-eslint/no-floating-promises */
import mockGitServer from './shared/mockGitServer';

(async (): Promise<void> => await mockGitServer.start({}))();
