import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import { ExtensionModule } from "../../ExtensionModule";
import { TaskType } from "../../constants";
import {
  Configuration,
  ConfigurationResolver,
  CoreModule,
  readPDXInfo,
  writePDXInfo,
} from "../../core";
import { runTask } from "../../util";

import {
  assertTaskFixture,
  cleanPDXBundles,
  getFixturePath,
  withSDK,
  waitForFileToExist,
  getFixtureWorkspaceFolder,
} from "./suiteTestUtils";

suite("PDC Test Suite", () => {
  let configResolver: ConfigurationResolver;

  setup(() => {
    const loaded = ExtensionModule.load(CoreModule);
    assert.ok(loaded);

    configResolver = loaded.container.get(ConfigurationResolver, {
      autobind: true,
    });
    assert.ok(configResolver);
  });

  async function resolveConfig(fixture: string): Promise<Configuration> {
    const folder = getFixtureWorkspaceFolder(fixture);
    assert.ok(folder);

    const config = await configResolver.resolve(folder);
    assert.ok(config);

    return config;
  }

  const testCases = [
    ["basic-configuration", "Basic Configuration.pdx"],
    ["override-configuration", "Override Configuration.pdx"],
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
      }),
    );
  });

  test(
    "pdc-configuration",
    withSDK(async () => {
      const fixture = "pdc-configuration";
      const index = 2;

      const tasks = await vscode.tasks.fetchTasks({ type: TaskType.pdc });
      assert.strictEqual(tasks.length, 3);
      assertTaskFixture(tasks[0], "basic-configuration");
      assertTaskFixture(tasks[1], "override-configuration");
      assertTaskFixture(tasks[index], fixture);

      const { sourcePath } = await resolveConfig(fixture);
      const originalPDXInfo = await readPDXInfo(sourcePath);
      assert.strictEqual(originalPDXInfo.buildNumber, "1");

      await runTask(tasks[index]);

      const pdxPath = path.resolve(
        getFixturePath(fixture),
        "PDC Configuration.pdx",
      );
      await waitForFileToExist(pdxPath);

      const pdxInfo = await readPDXInfo(sourcePath);
      assert.strictEqual(pdxInfo.buildNumber, "2");

      await cleanPDXBundles();
      await writePDXInfo(originalPDXInfo, sourcePath);
    }),
  );
});
