import * as child_process from "child_process";
import * as path from "path";
import * as process from "process";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { TaskRunner } from "./TaskRunner";
import { exec, isExecError } from "./exec";
import { quote } from "./quote";

/**
 * SimulatorTaskRunnerOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorTaskRunnerOptions {
  openGame?: boolean;
  kill?: boolean;
}

/**
 * SimulatorTaskRunner is responsible for launching the Playdate Simulator
 * executable if it is not already running.
 */
export class SimulatorTaskRunner implements TaskRunner {
  constructor(
    private config: ConfigurationResolver,
    private options: SimulatorTaskRunnerOptions
  ) {}

  async run(): Promise<string | undefined> {
    const { openGame, kill } = this.options;
    const { sdkPath, gamePath } = await this.config.resolve();
    const openGamePath = openGame !== false ? gamePath : undefined;

    switch (process.platform) {
      case "darwin":
        return await this.openMacOS(sdkPath, openGamePath, kill);

      case "win32":
        return await this.openWin32(sdkPath, openGamePath, kill);

      case "linux":
        return await this.openLinux(sdkPath, openGamePath, kill);

      default:
        return `error: platform '${process.platform}' is not supported`;
    }
  }

  private async openMacOS(
    sdkPath: string,
    gamePath?: string,
    kill?: boolean
  ): Promise<string | undefined> {
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
    if (gamePath) {
      args.push(quote(gamePath));
    }
    const command = `/usr/bin/open ${args.join(" ")}`;

    try {
      await exec(command);
    } catch (err) {
      if (isExecError(err)) {
        return err.stderr;
      }
    }
  }

  private async openWin32(
    sdkPath: string,
    gamePath?: string,
    kill?: boolean
  ): Promise<string | undefined> {
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
    const args = gamePath ? [quote(gamePath)] : [];

    const child = child_process.spawn(quote(simulatorPath), args, {
      shell: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  }

  private async openLinux(
    sdkPath: string,
    gamePath?: string,
    kill?: boolean
  ): Promise<string | undefined> {
    try {
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
    } catch (err) {
      if (isExecError(err)) {
        return err.stderr;
      }
      return;
    }

    const simulatorPath = path.resolve(sdkPath, "bin", "PlaydateSimulator");
    const args = gamePath ? [quote(gamePath)] : [];

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

/**
 * PLAYDATE_SIMULATOR_LINUX_RE is used on Linux to parse the output of the ps
 * command. We know the Playdate Simulator is already running when the
 * regex matches the output of the command.
 */
const PLAYDATE_SIMULATOR_LINUX_RE = /\s*(\d+).*PlaydateSimulator/g;
