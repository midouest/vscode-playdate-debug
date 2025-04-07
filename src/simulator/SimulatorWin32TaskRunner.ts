import * as childProcess from "child_process";
import * as path from "path";

import { OnTaskRunnerMessage, TaskRunner } from "../core";
import { exec, quote } from "../util";

import { getKillSimulatorCommand } from "./getKillSimulatorCommand";

/**
 * SimulatorWin32TaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorWin32TaskRunnerOptions {
  sdkPath: string;
  openGamePath?: string;
  kill?: boolean;
  argv?: string[];
}

/**
 * SimulatorWin32TaskRunner is responsible for launching the Playdate Simulator
 * executable on Windows if it is not already running.
 */
export class SimulatorWin32TaskRunner implements TaskRunner {
  constructor(private options: SimulatorWin32TaskRunnerOptions) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { sdkPath, openGamePath, kill, argv } = this.options;

    if (kill === true) {
      onMessage("Stopping Playdate Simulator...");
      const killCommand = getKillSimulatorCommand("win32");
      onMessage(`> ${killCommand}`);
      try {
        await exec(killCommand);
      } catch (_err) {
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
      path.resolve(sdkPath, "bin", "PlaydateSimulator.exe"),
    );
    const args = [];
    if (openGamePath) {
      args.push(quote(openGamePath));

      if (argv?.length) {
        for (const arg of argv) {
          args.push(quote(arg));
        }
      }
    }
    onMessage(`> ${simulatorPath} ${args.join(" ")}`);

    const child = childProcess.spawn(simulatorPath, args, {
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
