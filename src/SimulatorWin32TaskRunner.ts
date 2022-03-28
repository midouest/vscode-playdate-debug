import * as child_process from "child_process";
import * as path from "path";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { TaskRunner } from "./TaskRunner";
import { exec, isExecError } from "./exec";
import { quote } from "./quote";

/**
 * SimulatorWin32TaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorWin32TaskRunnerOptions {
  openGame?: boolean;
  kill?: boolean;
}

/**
 * SimulatorWin32TaskRunner is responsible for launching the Playdate Simulator
 * executable on Windows if it is not already running.
 */
export class SimulatorWin32TaskRunner implements TaskRunner {
  constructor(
    private config: ConfigurationResolver,
    private options: SimulatorWin32TaskRunnerOptions
  ) {}

  async run(): Promise<string | undefined> {
    const { openGame, kill } = this.options;
    const { sdkPath, gamePath } = await this.config.resolve();
    const openGamePath = openGame !== false ? gamePath : undefined;

    if (kill === true) {
      try {
        await exec("taskkill /IM PlaydateSimulator.exe");
      } catch (err) {
        // noop
      }
    } else {
      try {
        const { stdout } = await exec("tasklist");
        if (stdout.match(PLAYDATE_SIMULATOR_WIN32_RE)) {
          return;
        }
      } catch (err) {
        if (isExecError(err)) {
          return err.stderr;
        }
        return;
      }
    }

    const simulatorPath = path.resolve(sdkPath, "bin", "PlaydateSimulator.exe");
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
 * PLAYDATE_SIMULATOR_WIN32_RE is used on Windows to parse the output of the
 * tasklist command. We know the Playdate Simulator is already running when the
 * regex matches the output of the command.
 */
const PLAYDATE_SIMULATOR_WIN32_RE = /^PlaydateSimulator\.exe/g;
