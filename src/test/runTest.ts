import * as path from "path";
import * as process from "process";

import { runTests } from "@vscode/test-electron";

import {
  getCodeWorkspaceFixturePath,
  getPlaydateSDKFixturePath,
} from "./testUtils";

async function main() {
  const args = process.argv.slice(2);
  const ci = args.length > 0 && args[0] === "--ci";

  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    const fixturesCodeWorkspacePath = getCodeWorkspaceFixturePath();
    const playdateSDKPath = getPlaydateSDKFixturePath();

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [fixturesCodeWorkspacePath, "--disable-extensions"],
      extensionTestsEnv: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PLAYDATE_SDK_PATH: playdateSDKPath,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CI: ci ? "true" : undefined,
      },
    });
  } catch (err) {
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
