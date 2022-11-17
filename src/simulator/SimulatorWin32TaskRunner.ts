import * as child_process from "child_process";
import * as path from "path";

import { OnTaskRunnerMessage, TaskRunner } from "ext/core";
import { exec, quote } from "ext/util";

/**
 * SimulatorWin32TaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorWin32TaskRunnerOptions {
  sdkPath: string;
  openGamePath?: string;
  kill?: boolean;
}

/**
 * SimulatorWin32TaskRunner is responsible for launching the Playdate Simulator
 * executable on Windows if it is not already running.
 */
export class SimulatorWin32TaskRunner implements TaskRunner {
  constructor(private options: SimulatorWin32TaskRunnerOptions) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { sdkPath, openGamePath, kill } = this.options;

    if (kill === true) {
      onMessage("Stopping Playdate Simulator...");
      const killCommand = "taskkill /IM PlaydateSimulator.exe";
      onMessage(`> ${killCommand}`);
      try {
        await exec(killCommand);
      } catch (err) {
        // noop
      }
    } else {
      onMessage("Checking for running Playdate Simulator...");
      const listCommand = "tasklist";
      onMessage(`> ${listCommand}`);
      const { stdout } = await exec(listCommand);
      if (stdout.match(PLAYDATE_SIMULATOR_WIN32_RE)) {
        onMessage("Playdate Simulator is already running!");
        return;
      }
    }

    onMessage("Starting Playdate Simulator...");
    const simulatorPath = quote(
      path.resolve(sdkPath, "bin", "PlaydateSimulator.exe")
    );
    const args = openGamePath ? [quote(openGamePath)] : [];
    onMessage(`> ${simulatorPath} ${args.join(" ")}`);

    const child = child_process.spawn(simulatorPath, args, {
      shell: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  }
}

/**
 * PLAYDATE_SIMULATOR_WIN32_RE is used on Windows to parse the output of the
 * tasklist command. We know the Playdate Simulator is already running when the
 * regex matches the output of the command.
 */
const PLAYDATE_SIMULATOR_WIN32_RE = /PlaydateSimulator\.exe/g;
