import * as path from "path";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { TaskRunner } from "./TaskRunner";
import { exec } from "./exec";
import { quote } from "./quote";

/**
 * SimulatorMacOSTaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorMacOSTaskRunnerOptions {
  openGame?: boolean;
  kill?: boolean;
}

/**
 * SimulatorMacOSTaskRunner is responsible for launching the Playdate Simulator
 * executable on MacOS if it is not already running.
 */
export class SimulatorMacOSTaskRunner implements TaskRunner {
  constructor(
    private config: ConfigurationResolver,
    private options: SimulatorMacOSTaskRunnerOptions
  ) {}

  async run(): Promise<void> {
    const { openGame, kill } = this.options;
    const { sdkPath, gamePath } = await this.config.resolve();
    const openGamePath = openGame !== false ? gamePath : undefined;

    if (kill === true) {
      try {
        await exec('killall "Playdate Simulator"');
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

    await exec(command);
  }
}
