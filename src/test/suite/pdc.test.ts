import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import { PDC_TASK_TYPE } from "../../constants";

import {
  cleanPDXBundles,
  getFixturePath,
  testSDK,
  waitForFileToExist,
} from "./suiteTestUtils";

suite("PDC Test Suite", () => {
  let tasks: vscode.Task[];

  suiteSetup(async () => {
    tasks = await vscode.tasks.fetchTasks({ type: PDC_TASK_TYPE });
    assert.strictEqual(tasks.length, 2);
    assert.ok(typeof tasks[0].scope === "object");
    assert.strictEqual(tasks[0].scope.name, "basic-configuration");
    assert.ok(typeof tasks[1].scope === "object");
    assert.strictEqual(tasks[1].scope.name, "override-configuration");
  });

  suiteTeardown(async () => {
    await cleanPDXBundles();
  });

  testSDK("basic-configuration", async () => {
    const execution = await vscode.tasks.executeTask(tasks[0]);
    assert.ok(execution);

    const pdxBundle = path.resolve(
      getFixturePath("basic-configuration"),
      "Basic Configuration.pdx"
    );
    await waitForFileToExist(pdxBundle);
  });

  testSDK("override-configuration", async () => {
    const execution = await vscode.tasks.executeTask(tasks[1]);
    assert.ok(execution);

    const pdxBundle = path.resolve(
      getFixturePath("override-configuration"),
      "Override Configuration.pdx"
    );
    await waitForFileToExist(pdxBundle);
  });
});
