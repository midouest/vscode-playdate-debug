import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import { ExtensionModule } from "../../ExtensionModule";
import { PDC_TASK_TYPE } from "../../constants";
import { CoreModule } from "../../core";
import { PDCModule } from "../../pdc";
import { PDCTaskProvider } from "../../pdc/PDCTaskProvider";

import {
  cleanPDXBundles,
  getFixturePath,
  testSDK,
  waitForFileToExist,
} from "./suiteTestUtils";

suite("PDC Test Suite", () => {
  let tasks: vscode.Task[];
  let provider: PDCTaskProvider;
  let tokenSource: vscode.CancellationTokenSource;
  let token: vscode.CancellationToken;

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

  setup(() => {
    const loaded = ExtensionModule.load(CoreModule, PDCModule);
    assert.ok(loaded);
    provider = loaded.container.resolve(PDCTaskProvider);

    tokenSource = new vscode.CancellationTokenSource();
    token = tokenSource.token;
  });

  teardown(() => {
    tokenSource.dispose();
  });

  testSDK("basic-configuration", async () => {
    const task = await provider.resolveTask(tasks[0], token);
    assert.ok(task);

    const execution = await vscode.tasks.executeTask(task);
    assert.ok(execution);

    const pdxBundle = path.resolve(
      getFixturePath("basic-configuration"),
      "Basic Configuration.pdx"
    );
    await waitForFileToExist(pdxBundle);
  });

  testSDK("override-configuration", async () => {
    const task = await provider.resolveTask(tasks[1], token);
    assert.ok(task);

    const execution = await vscode.tasks.executeTask(task);
    assert.ok(execution);

    const pdxBundle = path.resolve(
      getFixturePath("override-configuration"),
      "Override Configuration.pdx"
    );
    await waitForFileToExist(pdxBundle);
  });
});
