import fs from 'fs';
import os from 'os';
import path from 'path';

const create = async function (): Promise<string> {
  return await fs.promises.mkdtemp(path.join(os.tmpdir(), 'test-'));
};

const remove = async function (tmpDir: string): Promise<void> {
  await fs.promises.rm(tmpDir, { recursive: true, force: true });
};

export default {
  create,
  remove
};
