import * as path from "path";

import { OnTaskRunnerMessage, TaskRunner } from "./TaskRunner";
import { exec } from "./exec";
import { quote } from "./quote";

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
export class SimulatorMacOSTaskRunner implements TaskRunner {
  constructor(private options: SimulatorMacOSTaskRunnerOptions) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { sdkPath, openGamePath, kill } = this.options;

    if (kill === true) {
      const killCommand = 'killall "Playdate Simulator"';
      onMessage(killCommand);
      try {
        await exec(killCommand);
      } catch (err) {
        // noop
      }
    }

    const simulatorPath = path.resolve(
      sdkPath,
      "bin",
      "Playdate Simulator.app"
    );
    const args = ["-a", quote(simulatorPath)];
    if (openGamePath) {
      args.push(quote(openGamePath));
    }
    const command = `/usr/bin/open ${args.join(" ")}`;
    onMessage(command);

    await exec(command);
  }
}
