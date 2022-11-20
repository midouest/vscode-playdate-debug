import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

// import { ExtensionModule } from "../../ExtensionModule";
import { PDC_TASK_TYPE } from "../../constants";
// import { CoreModule } from "../../core";
// import { PDCModule } from "../../pdc";
// import { PDCTaskProvider } from "../../pdc/PDCTaskProvider";

import {
  cleanPDXBundles,
  getFixturePath,
  testSDK,
  waitForFileToExist,
} from "./suiteTestUtils";

suite("PDC Test Suite", () => {
  let tasks: vscode.Task[];
  // let provider: PDCTaskProvider;
  // let tokenSource: vscode.CancellationTokenSource;
  // let token: vscode.CancellationToken;

  function assertTaskFixture(task: vscode.Task, fixture: string): void {
    assert.ok(typeof task.scope === "object");
    assert.strictEqual(task.scope.name, fixture);
  }

  suiteSetup(async () => {
    tasks = await vscode.tasks.fetchTasks({ type: PDC_TASK_TYPE });
    assert.strictEqual(tasks.length, 3);
    assertTaskFixture(tasks[0], "basic-configuration");
    assertTaskFixture(tasks[1], "override-configuration");
    assertTaskFixture(tasks[2], "pdc-configuration");
  });

  suiteTeardown(async () => {
    await cleanPDXBundles();
  });

  setup(() => {
    // const loaded = ExtensionModule.load(CoreModule, PDCModule);
    // assert.ok(loaded);
    // provider = loaded.container.resolve(PDCTaskProvider);
    // tokenSource = new vscode.CancellationTokenSource();
    // token = tokenSource.token;
  });

  teardown(() => {
    // tokenSource.dispose();
  });

  const testCases = [
    ["basic-configuration", "Basic Configuration.pdx"],
    ["override-configuration", "Override Configuration.pdx"],
    ["pdc-configuration", "PDC Configuration.pdx"],
  ] as const;

  testCases.forEach(([fixture, bundleName], index) => {
    testSDK(fixture, async () => {
      // const task = await provider.resolveTask(tasks[index], token);
      // assert.ok(task);

      const execution = await vscode.tasks.executeTask(tasks[index]);
      assert.ok(execution);

      const pdxPath = path.resolve(getFixturePath(fixture), bundleName);
      await waitForFileToExist(pdxPath);
    });
  });
});
