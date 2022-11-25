import * as assert from "assert";

import * as vscode from "vscode";

import { TaskType } from "../../constants";

import {
  assertTaskFixture,
  killSimulator,
  skipCI,
  waitForSimulator,
  withSDK,
} from "./suiteTestUtils";

suite("Playdate Simulator Test Suite", () => {
  let playdateSimulatorTask: vscode.Task;

  suiteSetup(async () => {
    const tasks = await vscode.tasks.fetchTasks({ type: TaskType.simulator });
    assert.strictEqual(tasks.length, 3);
    assertTaskFixture(tasks[0], "basic-configuration");
    assertTaskFixture(tasks[1], "override-configuration");

    playdateSimulatorTask = assertTaskFixture(
      tasks[2],
      "playdate-simulator-configuration"
    );
  });

  test(
    "playdate-simulator-configuration",
    withSDK(
      skipCI(async () => {
        const execution = await vscode.tasks.executeTask(playdateSimulatorTask);
        assert.ok(execution);

        await waitForSimulator();
        await killSimulator();
      })
    )
  );
});
