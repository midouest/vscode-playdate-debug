import * as assert from "assert";

import * as vscode from "vscode";

import { SIMULATOR_DEBUG_PORT, SIMULATOR_TASK_TYPE } from "../../constants";
import { waitForDebugPort } from "../../util";

import { assertTaskFixture, killSimulator, testSDK } from "./suiteTestUtils";

suite("Playdate Simulator Test Suite", () => {
  let playdateSimulatorTask: vscode.Task;

  suiteSetup(async () => {
    const tasks = await vscode.tasks.fetchTasks({ type: SIMULATOR_TASK_TYPE });
    assert.strictEqual(tasks.length, 3);
    assertTaskFixture(tasks[0], "basic-configuration");
    assertTaskFixture(tasks[1], "override-configuration");

    playdateSimulatorTask = assertTaskFixture(
      tasks[2],
      "playdate-simulator-configuration"
    );
  });

  testSDK.skip("playdate-simulator-configuration", "darwin", async () => {
    const execution = await vscode.tasks.executeTask(playdateSimulatorTask);
    assert.ok(execution);

    const socket = await waitForDebugPort(SIMULATOR_DEBUG_PORT);
    assert.ok(socket);
    socket.destroy();

    await killSimulator();
  });
});
