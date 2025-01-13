import * as assert from "assert";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";
import * as util from "util";

import glob from "glob";
import * as vscode from "vscode";

import { SIMULATOR_DEBUG_PORT } from "../../constants";
import { getKillSimulatorCommand } from "../../simulator";
import { exec, wait, waitForDebugPort } from "../../util";
import {
  getPlaydateSDKFixturePath,
  getWorkspaceFixturesPath,
} from "../testUtils";

const asyncGlob = util.promisify(glob);

export function getFixturePath(fixture: string): string {
  const fixturesPath = getWorkspaceFixturesPath();
  return path.resolve(fixturesPath, fixture);
}

export function getFixtureWorkspaceFolder(
  fixture: string,
): vscode.WorkspaceFolder | undefined {
  const fixturePath = getFixturePath(fixture);
  const uri = vscode.Uri.file(fixturePath);
  return vscode.workspace.getWorkspaceFolder(uri);
}

async function assertRunningUnix(
  processName: string,
  expectedCount: number,
): Promise<void> {
  const command = `ps -x | grep -v grep | grep -c "${processName}"`;
  let count = 0;
  try {
    const { stdout } = await exec(command);
    count = parseInt(stdout.trim());
  } catch (_err) {
    // noop
  }
  assert.strictEqual(count, expectedCount);
}

export async function assertSimulatorRunning(expectedCount = 1): Promise<void> {
  const { platform } = process;

  if (platform === "darwin") {
    await assertRunningUnix("Playdate Simulator.app", expectedCount);
    return;
  }

  if (platform === "win32") {
    const { stdout } = await exec("tasklist");
    const matches = Array.from(stdout.matchAll(/PlaydateSimulator\.exe/));
    const count = matches.length;
    assert.strictEqual(count, expectedCount);
    return;
  }

  if (platform === "linux") {
    await assertRunningUnix("PlaydateSimulator", expectedCount);
    return;
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

export async function assertExists(filePath: string): Promise<void> {
  try {
    await fsPromises.access(filePath, fs.constants.F_OK);
  } catch (_err) {
    throw new Error(`${filePath} does not exist`);
  }
}

interface WaitForSimulatorOptions {
  maxRetries: number;
  retryTimeout: number;
}

export async function waitForSimulator(
  options: Partial<WaitForSimulatorOptions> = {},
): Promise<void> {
  const maxRetries = options.maxRetries ?? 25;
  const retryTimeout = options.retryTimeout ?? 200;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await assertSimulatorRunning();
      return;
    } catch (_err) {
      // noop
    }
    await wait(retryTimeout);
  }
  const elapsed = maxRetries * retryTimeout;
  throw new Error(`Playdate Simulator was not running after ${elapsed}ms`);
}

export async function waitForFileToExist(
  watchFile: string,
  timeout = 2000,
): Promise<void> {
  try {
    await assertExists(watchFile);
    return;
  } catch (_err) {
    // noop
  }

  const abortController = new AbortController();
  const { signal } = abortController;
  const abortTimeout = setTimeout(() => abortController.abort(), timeout);

  const filename = path.basename(watchFile);
  const watchDir = path.dirname(watchFile);
  const watcher = fsPromises.watch(watchDir, { signal });

  try {
    for await (const event of watcher) {
      if (event.eventType === "rename" && event.filename === filename) {
        clearTimeout(abortTimeout);
        return;
      }
    }
  } catch (_err) {
    throw new Error(`File at ${watchFile} did not exist after ${timeout}ms`);
  }
}

export async function cleanPDXBundles(): Promise<void> {
  const workspaceDir = getWorkspaceFixturesPath();
  const pattern = `${workspaceDir}/**/*.pdx`;
  const matches = await asyncGlob(pattern);

  const removeAll = matches.map((match) =>
    fsPromises.rm(match, { recursive: true, force: true }),
  );
  await Promise.all(removeAll);
}

export function withSDK(fn: Mocha.AsyncFunc): Mocha.AsyncFunc;
export function withSDK(
  platform: NodeJS.Platform,
  fn: Mocha.AsyncFunc,
): Mocha.AsyncFunc;
export function withSDK(
  fnOrPlatform: Mocha.AsyncFunc | NodeJS.Platform,
  fnOrUndefined?: Mocha.AsyncFunc,
): Mocha.AsyncFunc {
  let fn: Mocha.AsyncFunc;
  let platform: NodeJS.Platform | undefined;
  if (typeof fnOrPlatform === "string" && fnOrUndefined !== undefined) {
    platform = fnOrPlatform;
    fn = fnOrUndefined;
  } else if (typeof fnOrPlatform !== "string") {
    fn = fnOrPlatform;
  }
  const sdkPath = getPlaydateSDKFixturePath();
  const binPath = path.resolve(sdkPath, "bin");

  return async function () {
    if (platform && process.platform !== platform) {
      this.skip();
    }

    try {
      await fsPromises.access(binPath, fs.constants.F_OK);
    } catch (_err) {
      this.skip();
    }

    return fn.bind(this)();
  };
}

export function skipCI(fn: Mocha.AsyncFunc): Mocha.AsyncFunc {
  return function () {
    if (process.env.CI) {
      this.skip();
    }
    return fn.bind(this)();
  };
}

export function assertTaskFixture(
  task: vscode.Task,
  fixture: string,
): vscode.Task {
  assert.ok(typeof task.scope === "object");
  assert.strictEqual(task.scope.name, fixture);
  return task;
}

export async function killSimulator(): Promise<void> {
  const killCommand = getKillSimulatorCommand();
  try {
    await exec(killCommand);
  } catch (err) {
    console.error("Error killing simulator: ", err);
  }
}

export function findTask(
  tasks: vscode.Task[],
  name: string,
): vscode.Task | undefined {
  return tasks.find((task) => task.name === name);
}

export async function waitForSimulatorDebugPort(): Promise<void> {
  await waitForDebugPort(SIMULATOR_DEBUG_PORT);
}
