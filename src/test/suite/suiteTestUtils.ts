import * as assert from "assert";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";
import * as util from "util";

import * as glob from "glob";
import * as vscode from "vscode";

import { getKillSimulatorCommand } from "../../simulator";
import { exec } from "../../util";
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
  fixture: string
): vscode.WorkspaceFolder | undefined {
  const fixturePath = getFixturePath(fixture);
  const uri = vscode.Uri.file(fixturePath);
  return vscode.workspace.getWorkspaceFolder(uri);
}

export async function waitForFileToExist(
  watchFile: string,
  timeout = 2000
): Promise<void> {
  try {
    await fsPromises.access(watchFile, fs.constants.F_OK);
    return;
  } catch (err) {
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
  } catch (err) {
    throw new Error(`File at ${watchFile} did not exist after ${timeout}ms`);
  }
}

export async function cleanPDXBundles(): Promise<void> {
  const workspaceDir = getWorkspaceFixturesPath();
  const pattern = `${workspaceDir}/**/*.pdx`;
  const matches = await asyncGlob(pattern);

  const removeAll = matches.map((match) =>
    fsPromises.rm(match, { recursive: true, force: true })
  );
  await Promise.all(removeAll);
}

export function testSDK(title: string, fn: Mocha.AsyncFunc): Mocha.Test;
export function testSDK(
  title: string,
  platform: NodeJS.Platform,
  fn: Mocha.AsyncFunc
): Mocha.Test;
export function testSDK(
  title: string,
  fnOrPlatform: Mocha.AsyncFunc | NodeJS.Platform,
  fnOrUndefined?: Mocha.AsyncFunc
): Mocha.Test {
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

  return test(title, async function () {
    if (platform && process.platform !== platform) {
      this.skip();
    }

    try {
      await fsPromises.access(binPath, fs.constants.F_OK);
    } catch (err) {
      this.skip();
    }

    return fn.bind(this)();
  });
}

export function assertTaskFixture(
  task: vscode.Task,
  fixture: string
): vscode.Task {
  assert.ok(typeof task.scope === "object");
  assert.strictEqual(task.scope.name, fixture);
  return task;
}

export async function killSimulator(): Promise<void> {
  const killCommand = getKillSimulatorCommand();
  await exec(killCommand);
}
