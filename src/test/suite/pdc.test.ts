import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import { TaskType } from "../../constants";
import { runTask } from "../../util";

import {
  assertTaskFixture,
  cleanPDXBundles,
  getFixturePath,
  withSDK,
  waitForFileToExist,
} from "./suiteTestUtils";

suite("PDC Test Suite", () => {
  const testCases = [
    ["basic-configuration", "Basic Configuration.pdx"],
    ["override-configuration", "Override Configuration.pdx"],
    ["pdc-configuration", "PDC Configuration.pdx"],
  ] as const;

  testCases.forEach(([fixture, bundleName], index) => {
    test(
      fixture,
      withSDK(async () => {
        const tasks = await vscode.tasks.fetchTasks({ type: TaskType.pdc });
        assert.strictEqual(tasks.length, 3);
        assertTaskFixture(tasks[0], "basic-configuration");
        assertTaskFixture(tasks[1], "override-configuration");
        assertTaskFixture(tasks[2], "pdc-configuration");

        await runTask(tasks[index]);

        const pdxPath = path.resolve(getFixturePath(fixture), bundleName);
        await waitForFileToExist(pdxPath);

        await cleanPDXBundles();
      })
    );
  });
});
