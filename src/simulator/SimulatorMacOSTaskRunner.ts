import { Chainable, OnTaskRunnerMessage, TaskRunner } from "../core";
import { exec } from "../util";

import { createMacOSSimulatorCommand } from "./createMacOSSimulatorCommand";
import { getKillSimulatorCommand } from "./getKillSimulatorCommand";

/**
 * SimulatorMacOSTaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorMacOSTaskRunnerOptions {
  sdkPath: string;
  openGamePath?: string;
  kill?: boolean;
}

/**
 * SimulatorMacOSTaskRunner is responsible for launching the Playdate Simulator
 * executable on MacOS if it is not already running.
 */
export class SimulatorMacOSTaskRunner extends Chainable implements TaskRunner {
  constructor(private options: SimulatorMacOSTaskRunnerOptions) {
    super();
  }

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { sdkPath, openGamePath, kill } = this.options;

    if (kill === true) {
      onMessage("Stopping Playdate Simulator...");
      const killCommand = getKillSimulatorCommand("darwin");
      onMessage(`> ${killCommand}`);
      try {
        await exec(killCommand);
      } catch (err) {
        // noop
      }
    }

    onMessage("Starting Playdate Simulator...");
    const command = createMacOSSimulatorCommand({
      sdkPath,
      openGamePath,
    });
    onMessage(`> ${command}`);

    await exec(command);
  }
}
