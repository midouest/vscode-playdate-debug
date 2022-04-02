import * as child_process from "child_process";
import * as path from "path";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { TaskRunner } from "./TaskRunner";
import { exec } from "./exec";
import { quote } from "./quote";

/**
 * SimulatorTaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorLinuxTaskRunnerOptions {
  openGame?: boolean;
  kill?: boolean;
}

/**
 * SimulatorLinuxTaskRunner is responsible for launching the Playdate Simulator
 * executable if it is not already running.
 */
export class SimulatorLinuxTaskRunner implements TaskRunner {
  constructor(
    private config: ConfigurationResolver,
    private options: SimulatorLinuxTaskRunnerOptions
  ) {}

  async run(): Promise<void> {
    const { openGame, kill } = this.options;
    const { sdkPath, gamePath } = await this.config.resolve();
    const openGamePath = openGame !== false ? gamePath : undefined;

    const { stdout } = await exec("ps ax");
    for (const match of stdout.matchAll(PLAYDATE_SIMULATOR_LINUX_RE)) {
      if (kill === true) {
        const pid = match[1];
        try {
          await exec(`kill -9 ${pid}`);
        } catch (err) {
          // noop
        }
      } else {
        return;
      }
    }

    const simulatorPath = path.resolve(sdkPath, "bin", "PlaydateSimulator");
    const args = openGamePath ? [quote(openGamePath)] : [];

    const child = child_process.spawn(quote(simulatorPath), args, {
      shell: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  }
}

/**
 * PLAYDATE_SIMULATOR_LINUX_RE is used on Linux to parse the output of the ps
 * command. We know the Playdate Simulator is already running when the
 * regex matches the output of the command.
 */
const PLAYDATE_SIMULATOR_LINUX_RE = /\s*(\d+).*PlaydateSimulator/g;
