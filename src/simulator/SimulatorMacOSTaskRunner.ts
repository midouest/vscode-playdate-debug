import { OnTaskRunnerMessage, TaskRunner } from "../core";
import { exec } from "../util";

import { getKillSimulatorCommand } from "./getKillSimulatorCommand";
import { getMacOSSimulatorCommand } from "./getMacOSSimulatorCommand";

/**
 * SimulatorMacOSTaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorMacOSTaskRunnerOptions {
  sdkPath: string;
  openGamePath?: string;
  kill?: boolean;
  argv?: string[];
}

/**
 * SimulatorMacOSTaskRunner is responsible for launching the Playdate Simulator
 * executable on MacOS if it is not already running.
 */
export class SimulatorMacOSTaskRunner implements TaskRunner {
  constructor(private options: SimulatorMacOSTaskRunnerOptions) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { sdkPath, openGamePath, kill, argv } = this.options;

    if (kill === true) {
      onMessage("Stopping Playdate Simulator...");
      const killCommand = getKillSimulatorCommand("darwin");
      onMessage(`> ${killCommand}`);
      try {
        await exec(killCommand);
      } catch (_err) {
        // noop
      }
    }

    onMessage("Starting Playdate Simulator...");
    const command = getMacOSSimulatorCommand({
      sdkPath,
      openGamePath,
      argv,
    });
    onMessage(`> ${command}`);

    await exec(command);
  }
}
