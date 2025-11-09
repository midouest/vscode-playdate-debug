import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import {
  assertTaskFixture,
  cleanPDXBundles,
  findTask,
  getFixturePath,
  killSimulator,
  withSDK,
  waitForFileToExist,
  skipCI,
  waitForSimulator,
} from "./suiteTestUtils";

suite("Combined Test Suite", () => {
  test(
    "basic-configuration",
    withSDK(
      skipCI(async () => {
        const tasks = await vscode.tasks.fetchTasks();
        const defaultBuildTask = findTask(tasks, "Playdate: Build and Run");
        assert.ok(defaultBuildTask);
        assertTaskFixture(defaultBuildTask, "basic-configuration");

        const execution = await vscode.tasks.executeTask(defaultBuildTask);
        assert.ok(execution);

        const pdxPath = path.resolve(
          getFixturePath("basic-configuration"),
          "Basic Configuration.pdx",
        );
        await waitForFileToExist(pdxPath);

        await waitForSimulator();
        await killSimulator();
        await cleanPDXBundles();
      }),
    ),
  );
});
