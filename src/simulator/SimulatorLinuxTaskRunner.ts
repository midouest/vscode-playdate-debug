import * as childProcess from "child_process";
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
  argv?: string[];
}

/**
 * SimulatorLinuxTaskRunner is responsible for launching the Playdate Simulator
 * executable on Linux if it is not already running.
 */
export class SimulatorLinuxTaskRunner implements TaskRunner {
  constructor(private options: SimulatorLinuxTaskRunnerOptions) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { sdkPath, openGamePath, kill, argv } = this.options;

    if (kill === true) {
      onMessage("Stopping Playdate Simulator...");
      const killCommand = getKillSimulatorCommand("linux");
      onMessage(`> ${killCommand}`);
      try {
        await exec(killCommand);
      } catch (_err) {
        // noop
      }
    }

    try {
      const result = await exec("pidof PlaydateSimulator");
      if (result.stdout.length > 0) {
        return;
      }
    } catch (_err) {
      // noop
    }

    const simulatorPath = quote(
      path.resolve(sdkPath, "bin", "PlaydateSimulator"),
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

    const command = `${simulatorPath} ${args.join(" ")}`;

    onMessage("Starting Playdate Simulator...");
    onMessage(`> ${command}`);

    const child = childProcess.spawn(simulatorPath, args, {
      shell: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  }
}
