import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import { SIMULATOR_DEBUG_PORT } from "../../constants";
import { waitForDebugPort } from "../../util";

import {
  assertTaskFixture,
  cleanPDXBundles,
  filterTasks,
  getFixturePath,
  killSimulator,
  testSDK,
  waitForFileToExist,
} from "./suiteTestUtils";

suite("Combined Test Suite", () => {
  let defaultBuildTasks: vscode.Task[];

  suiteSetup(async () => {
    const tasks = await vscode.tasks.fetchTasks();
    defaultBuildTasks = filterTasks(tasks, "Playdate: Build and Run");
    assert.strictEqual(defaultBuildTasks.length, 2);
    assertTaskFixture(defaultBuildTasks[0], "basic-configuration");
    assertTaskFixture(defaultBuildTasks[1], "override-configuration");
  });

  teardown(async () => {
    await killSimulator();
    await cleanPDXBundles();
  });

  const testCases = [
    ["basic-configuration", "Basic Configuration.pdx"],
    ["override-configuration", "Override Configuration.pdx"],
  ] as const;

  testCases.forEach(([fixture, bundleName], index) => {
    testSDK(fixture, "darwin", async () => {
      const execution = await vscode.tasks.executeTask(
        defaultBuildTasks[index]
      );
      assert.ok(execution);

      const pdxPath = path.resolve(getFixturePath(fixture), bundleName);
      await waitForFileToExist(pdxPath);

      const socket = await waitForDebugPort(SIMULATOR_DEBUG_PORT);
      assert.ok(socket);
      socket.destroy();
    });
  });
});
