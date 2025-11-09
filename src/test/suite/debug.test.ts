import * as path from "path";

import * as vscode from "vscode";

import {
  cleanPDXBundles,
  getFixturePath,
  killSimulator,
  withSDK,
  waitForFileToExist,
  skipCI,
  waitForSimulatorDebugPort,
} from "./suiteTestUtils";

suite("Debug Test Suite", () => {
  test(
    "basic-configuration",
    withSDK(
      "darwin",
      skipCI(async () => {
        await vscode.commands.executeCommand("workbench.action.debug.start");

        const pdxPath = path.resolve(
          getFixturePath("basic-configuration"),
          "Basic Configuration.pdx",
        );
        await waitForFileToExist(pdxPath);

        await waitForSimulatorDebugPort();
        await vscode.commands.executeCommand("workbench.action.debug.stop");

        await killSimulator();
        await cleanPDXBundles();
      }),
    ),
  );
});
