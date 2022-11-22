import * as assert from "assert";
import * as path from "path";

import * as vscode from "vscode";

import { SIMULATOR_DEBUG_PORT } from "../../constants";
import { waitForDebugPort } from "../../util";

import {
  cleanPDXBundles,
  getFixturePath,
  killSimulator,
  withSDK,
  waitForFileToExist,
  skipCI,
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
          "Basic Configuration.pdx"
        );
        await waitForFileToExist(pdxPath);

        const socket = await waitForDebugPort(SIMULATOR_DEBUG_PORT);
        assert.ok(socket);
        socket.destroy();

        await vscode.commands.executeCommand("workbench.action.debug.stop");

        await killSimulator();
        await cleanPDXBundles();
      })
    )
  );
});
