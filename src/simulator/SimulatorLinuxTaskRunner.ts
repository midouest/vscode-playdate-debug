import * as child_process from "child_process";
import * as path from "path";

import { OnTaskRunnerMessage, TaskRunner } from "../core";
import { exec, quote } from "../util";

import { getKillSimulatorCommand } from "./getKillSimulatorCommand";

/**
 * SimulatorLinuxTaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorLinuxTaskRunnerOptions {
  sdkPath: string;
  openGamePath?: string;
  kill?: boolean;
}

/**
 * SimulatorLinuxTaskRunner is responsible for launching the Playdate Simulator
 * executable on Linux if it is not already running.
 */
export class SimulatorLinuxTaskRunner implements TaskRunner {
  constructor(private options: SimulatorLinuxTaskRunnerOptions) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { sdkPath, openGamePath, kill } = this.options;

    if (kill === true) {
      onMessage("Stopping Playdate Simulator...");
      const killCommand = getKillSimulatorCommand("linux");
      onMessage(`> ${killCommand}`);
      try {
        await exec(killCommand);
      } catch (err) {
        // noop
      }
    }

    try {
      const result = await exec("pidof PlaydateSimulator");
      if (result.stdout.length > 0) {
        return;
      }
    } catch (err) {
      // noop
    }

    const simulatorPath = quote(
      path.resolve(sdkPath, "bin", "PlaydateSimulator")
    );
    const args = openGamePath ? [openGamePath] : [];

    const command = `${simulatorPath} ${args.join(" ")}`;

    onMessage("Starting Playdate Simulator...");
    onMessage(`> ${command}`);

    const child = child_process.spawn(simulatorPath, args, {
      shell: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  }
}
