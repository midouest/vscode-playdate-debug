import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import { TaskType } from "../../constants";

import {
  assertTaskFixture,
  cleanPDXBundles,
  getFixturePath,
  testSDK,
  waitForFileToExist,
} from "./suiteTestUtils";

suite("PDC Test Suite", () => {
  let tasks: vscode.Task[];

  suiteSetup(async () => {
    tasks = await vscode.tasks.fetchTasks({ type: TaskType.pdc });
    assert.strictEqual(tasks.length, 3);
    assertTaskFixture(tasks[0], "basic-configuration");
    assertTaskFixture(tasks[1], "override-configuration");
    assertTaskFixture(tasks[2], "pdc-configuration");
  });

  suiteTeardown(async () => {
    await cleanPDXBundles();
  });

  const testCases = [
    ["basic-configuration", "Basic Configuration.pdx"],
    ["override-configuration", "Override Configuration.pdx"],
    ["pdc-configuration", "PDC Configuration.pdx"],
  ] as const;

  testCases.forEach(([fixture, bundleName], index) => {
    testSDK(fixture, async () => {
      const execution = await vscode.tasks.executeTask(tasks[index]);
      assert.ok(execution);

      const pdxPath = path.resolve(getFixturePath(fixture), bundleName);
      await waitForFileToExist(pdxPath);
    });
  });
});
